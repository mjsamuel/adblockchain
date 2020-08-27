const eth = require('./ethereum.js');

/**
 * Listens for whenever a tab changes
 */
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  let url = changeInfo["url"]
  if(url != undefined) {
    console.log(url);
  }
});
