import { Ethereum } from './services/ethereum.js';
import { IPFS } from './services/ipfs.js';
import * as adblock from './services/adblock.js';
import * as util from './services/utilities.js';

var eth = new Ethereum();
var ipfs = new IPFS();

/**
 * Initializes values on installation
 */
chrome.runtime.onInstalled.addListener(function () {
  chrome.storage.local.set({ 'paidDomains': [] });
  localStorage.setItem(ipfs.LOCAL_DATABASE_KEY, "{}");
});

/**
 * Listens for when a tab happens to changes
 */
chrome.tabs.onUpdated.addListener(async function (tabId, changeInfo) {
  const url = changeInfo["url"];
  const filteredUrl = util.filterUrl(url);
  // Checking if a valid URL 
  if (filteredUrl !== null) {
    transferFunds(filteredUrl);
  }
});

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
  chrome.storage.sync.get(['publicKey', 'privateKey'], async result => {
    if (util.userIsLoggedIn(result)) {
      const publicKey = result['publicKey']
      const privateKey = result['privateKey']

      const currUserBalance = await eth.web3.eth.getBalance(publicKey);
      if (currUserBalance > 0) {
        // Transferring funds via the Ethereum blockchain
        eth.transferFunds(publicKey, domainData.publicKey, domainData.cpv);

        // Logging transaction in local storage
        logDomain(url, domainData.publicKey, domainData.cpv)

        // Enabling adblock if not already active
        setAdblock(true)

        console.log(`Transferred funds to ${url}\n` +
          `Ethereum address: ${domainData.publicKey}\n` +
          `Ammount transferred: ${domainData.cpv} ETH \n`);
      } else {
        // User doesn't have any Ether left and thus the ad blocker should be 
        // turned off if not already
        setAdblock(false)
      }
    } else {
      // User is not logged in and thus the ad blocker should be turned off
      // if not already
      setAdblock(false)
    }
  });
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

    // Removing the oldest element if the length is too large
    if (data.length > HISTORY_LENGTH) data.shift();

    chrome.storage.local.set({ 'paidDomains': data });
  });
}

/**
 * If the adblocker listener is currently active then disable it.
 */
function setAdblock(enable) {
  let adblockerActive = chrome.webRequest.onBeforeRequest.hasListener(adblock.adblock_callback)

  if (enable && !adblockerActive) {
    chrome.webRequest.onBeforeRequest.addListener(
      adblock.adblock_callback, { urls: adblock.FILTERS }, ["blocking"]);
  } 

  if (!enable && adblockerActive) {
    chrome.webRequest.onBeforeRequest.removeListener(adblock.adblock_callback);
  }
}

// Exporting modules to be accessible from the Chrome console
window.eth = eth;
window.ipfs = ipfs;
