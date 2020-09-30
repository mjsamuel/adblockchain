import { Ethereum } from './services/ethereum.js';
import { browser } from 'webextension-polyfill-ts';
import { IPFS } from './services/ipfs.js';
import { WebExtensionBlocker } from '@cliqz/adblocker-webextension';
var eth = new Ethereum();
var ipfs = new IPFS();
var blockerEngine = null;

/**
 * Initializes the paid domains array in local storage on install
 */
chrome.runtime.onInstalled.addListener(function () {
  chrome.storage.local.set({ 'paidDomains': [] });
});

/**
 * Listens for whenever a tab changes
 */
chrome.tabs.onUpdated.addListener(async function (tabId, changeInfo, tab) {
  const url = changeInfo["url"];
  const filteredUrl = filterUrl(url);
  // Checking if a valid URL 
  if (filteredUrl !== undefined) {
    transferFunds(filteredUrl);
  }
});

/**
 * Listens that enable/disables an adblocker on tab change (based on the user login state and their eth balance)
 * Authenticated users that have sufficient funds will be granted ad free browsing.
 */
chrome.tabs.onUpdated.addListener(async function (tabId, changeInfo, tab) {
  chrome.storage.sync.get(['publicKey', 'privateKey'], result => {
    if (userIsLoggedIn(result)) {
      // Retrieves the users current eth balance
      const currUserBalance = eth.web3.eth.getBalance(result['publicKey'])

      // If the current user balance is zero and the blocker engine is currently active
      // Then disable it.
      if (currUserBalance <= 0 && blockerEngine) {
        console.log("Disabling adblocker.");
        disableAdblocker();
      }
      // Otherwise enable the block engine if it isn't already enabled.
      else {
        if (!blockerEngine) {
          console.log("Enabling adblocker.");
          enableAdblocker();
        }
      }
    }
  });
})

// Boolean function that determines the current login state
function userIsLoggedIn(userData) {
  return (userData['publicKey'] !== undefined &&
    userData['publicKey'] !== '' &&
    userData['privateKey'] !== undefined &&
    userData['privateKey'] !== '')
}

/**
 *  Function starts a background script to block ads from the extension
 * 
 */
async function enableAdblocker() {
  blockerEngine = await WebExtensionBlocker.fromPrebuiltAdsOnly().then((blocker) => {
    blocker.enableBlockingInBrowser(browser);
    return blocker;
  });
}

/**
 * Function used to disable the blocker in extension
 */
function disableAdblocker() {
  blockerEngine.disableBlockingInBrowser();

  // might be redundant .. need to verify
  blockerEngine = null;
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
