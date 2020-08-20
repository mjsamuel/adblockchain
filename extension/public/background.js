chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  let url = changeInfo["url"]
  if(url != undefined) {
    console.log(url)
  }
});
