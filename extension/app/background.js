const Web3 = require('web3');

// Listens for whenever a tab changes
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  let url = changeInfo["url"]
  if(url != undefined) {
    console.log(url)
  }
});
