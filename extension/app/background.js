import { Ethereum } from './services/ethereum.js'
import { IPFS } from './services/ipfs.js'
var eth = new Ethereum()
var ipfs = new IPFS()

/**
 * Listens for whenever a tab changes
 */
chrome.tabs.onUpdated.addListener(async function(tabId, changeInfo, tab) {
  const url = changeInfo["url"]
  const filteredUrl = filterUrl(url)
  // Checking if a valid URL 
  if (filteredUrl !== undefined) {
    transferFunds(filteredUrl)
  }
});

/**
 * Retrieves the wallet address for a particular domain and sends funds to that
 * address if it is in that database. If not, a public and private key are
 * generated, added to the database and then funds are transferred  
 * @param {String} url - the domain that you want to send money to
 */
async function transferFunds(url) {
  var domainData = await ipfs.getDomainData(url)

  if (domainData === undefined) {
    // Domain is not in database so generating a new public and private key
    const ethAccount = eth.createAccount()
    domainData = await ipfs.addDomain(url, ethAccount.address, ethAccount.privateKey)

    console.log(`${url} not in database\n` +
      `Generated Public key: ${ethAccount.address}\n` +
      `Generated Private key: ${ethAccount.privateKey}`)
  } 

  // Sending funds to the corresponding address for this domain
  eth.transferFunds(url, domainData.publicKey, domainData.cpv)
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
    var temp = (url.match(urlRegExp) || []).join('')
    if (temp !== '') filteredUrl = temp;
  }

  return filteredUrl;
}

// Exporting modules to be accessible from the Chrome console
window.eth = eth
window.ipfs = ipfs
