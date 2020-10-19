import { Ethereum } from './services/ethereum.js';
import { IPFS } from './services/ipfs.js';
var eth = new Ethereum();
var ipfs = new IPFS();
var adblockFilters = [
  "*://*.doubleclick.net/*",
  "*://partner.googleadservices.com/*",
  "*://*.googleadservices.com/*",
  "*://*.googlesyndication.com/*",
  "*://*.google-analytics.com/*",
  "*://creative.ak.fbcdn.net/*",
  "*://*.adbrite.com/*",
  "*://*.exponential.com/*",
  "*://*.quantserve.com/*",
  "*://*.scorecardresearch.com/*",
  "*://*.zedo.com/*",
  "*://mrjb7hvcks.com/*",
  "*://mr2cnjuh34jb.com/*",
  "*://track.wg-aff.com/*",
  "*://meowpushnot.com/*"
]

/**
 * Initializes the paid domains array in local storage on install
 */
chrome.runtime.onInstalled.addListener(function () {
  chrome.storage.local.set({ 'paidDomains': [] });
});

/**
 * Listens for whenever a tab changes
 */
chrome.tabs.onUpdated.addListener(async function (tabId, changeInfo) {
  const url = changeInfo["url"];
  const filteredUrl = filterUrl(url);
  // Checking if a valid URL 
  if (filteredUrl !== undefined) {
    transferFunds(filteredUrl);
  }
});

/** 
 * Listener (when active) serves as an adblocker.
 * Uses the webRequest API to intercept and filter out requests before they occur.
 * Uses a list ('adblockFilters') of URL patterns (of known advertisements) to match requests to block.
 */
chrome.webRequest.onBeforeRequest.addListener(
  adblock_callback,
  { urls: adblockFilters },
  ["blocking"]
);

/**
 * Named callback function for adblocker that returns a blocking response (used to determine the lifecycle of the request)
 * Returns true meaning that the request is cancelled
 * @param {*} details: an object that contains info for the current callback request
 */
async function adblock_callback(details) {
  console.log("Blocking: " + details.url);
  return { cancel: true };
}

/**
 * If the adblocker is currently active then this script is used to determine whether adblock listener should be disabled
 */
if (chrome.webRequest.onBeforeRequest.hasListener(adblock_callback)) {
  // Access local storage to check if the user is logged in
  chrome.storage.sync.get(['publicKey', 'privateKey'], result => {
    // If the user is currently logged in
    if (userIsLoggedIn(result)) {
      // Retrieves the users current eth balance
      const currUserBalance = eth.web3.eth.getBalance(result['publicKey']);
      // const currUserBalance = 0;

      // If the user currently has an empty balance
      if (currUserBalance <= 0) {
        // Remove the adblocker listener
        chrome.webRequest.onBeforeRequest.removeListener(adblock_callback);
      }
    }
  })
}

/**
 * Function that determines the current user login state based on the local storage data 
 * Public/private key variables are set once a user logs in.
 * @param {*} storage: local storage data array
 */
function userIsLoggedIn(storage) {
  return (storage['publicKey'] !== undefined &&
    storage['publicKey'] !== '' &&
    storage['privateKey'] !== undefined &&
    storage['privateKey'] !== '')
}

/**
 * Retrieves the wallet address for a particular domain and sends funds to that
 * address if it is in that database. If not, a public and private key are
 * generated, added to the database and then funds are transferred  
 * @param {String} url - the domain that you want to send money to
 */
async function transferFunds(url) {
  var domainData = await ipfs.getDomainData(url);

  if (domainData === undefined) {
    // Domain is not in database so generating a new public and private key
    const ethAccount = eth.createAccount();
    domainData = await ipfs.addDomain(url, ethAccount.address, ethAccount.privateKey);

    console.log(`${url} not in database\n` +
      `Generated Public key: ${ethAccount.address}\n` +
      `Generated Private key: ${ethAccount.privateKey}`);
  }

  // Retrieving the user's public and private key from Chrome storage
  chrome.storage.sync.get(['publicKey', 'privateKey'], result => {
    const publicKey = result['publicKey']
    const privateKey = result['privateKey']
    if (publicKey !== undefined &&
        publicKey !== '' &&
        privateKey !== undefined &&
        privateKey !== '') {
      eth.transferFunds(publicKey, domainData.publicKey, domainData.cpv);
      logDomain(url, domainData.publicKey, domainData.cpv)
      console.log(`Transferred funds to ${url}\n` +
        `Ethereum address: ${domainData.publicKey}\n` +
        `Ammount transferred: ${domainData.cpv} ETH \n`);
    }
  });
}

/**
 * Checks whether a string is a valid URL and trims extra information
 * @param {String} url - the URL you want to filter
 * @return {String} - the filtered URL if valid, else undefined
 */
function filterUrl(url) {
  var filteredUrl;
  // Regular expression used to filter URLs
  const urlRegExp =
    /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b/;

  if (url !== undefined) {
    var temp = (url.match(urlRegExp) || []).join('');
    if (temp !== '') filteredUrl = temp;
  }

  return filteredUrl;
}

/**
 * Logs each site that a user transfers funds to in Chrome's local storage
 * along with the amount and a timestamp
 * @param {String} domainName - the URL of that funds were deposited into
 * @param {String} address - the address that funds were deposited into
 * @param {Number} cost - the amount of money that was transferred in ETH
 */
function logDomain(domainName, address, cost) {
  const HISTORY_LENGTH = 250
  chrome.storage.local.get({ 'paidDomains': [] }, result => {
    var data = result.paidDomains;

    // Adding new domain to the array
    const currentTime = new Date();
    data.push({
      'domainName': domainName,
      'address': address,
      'cost': cost,
      'time': currentTime.toISOString()
    });

    // Removing an element if the length is to large
    if (data.length > HISTORY_LENGTH) data.shift();

    chrome.storage.local.set({ 'paidDomains': data });
  });
}

// Exporting modules to be accessible from the Chrome console
window.eth = eth;
window.ipfs = ipfs;
