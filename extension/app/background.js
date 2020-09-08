const eth = require('./ethereum.js');
const ipfs = require('./ipfs.js')

/**
 * Listens for whenever a tab changes
 */
chrome.tabs.onUpdated.addListener(async function(tabId, changeInfo, tab) {
  const url = changeInfo["url"]
  const filteredUrl = filterUrl(url)
  if (filteredUrl != undefined) {
    var domainData = await ipfs.getPublicKey(filteredUrl)
    if (domainData == undefined) {
      const ethAccount = eth.createAccount()
      // console.log(ethAccount)
      await ipfs.addDomain(filteredUrl, ethAccount.address, ethAccount.privateKey)
      domainData = {
        "publicKey": ethAccount.address,
        "cpv": 0.25
      }
    } 

    eth.transferFunds(
      "0x561D1D62083eBE58FFdcCBD283791f98d19a0AF0",
      domainData.publicKey,
      domainData.cpv)
  }
});

function filterUrl(url) {
  var filteredUrl;

  // Regular expression used to filter URLs
  const urlRegExp = 
    /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b/;

  if (url != undefined) {
    temp = (url.match(urlRegExp) || []).join('')
    if (temp != '') filteredUrl = temp;
  }

  return filteredUrl;
}

// Exporting modules to be accessible from the chrome console
window.eth = eth
window.ipfs = ipfs


