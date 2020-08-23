const Web3 = require('web3');

// Creating connection to our Ganache personal blockchain
var web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:7545'));

// Listens for whenever a tab changes
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  let url = changeInfo["url"]
  if(url != undefined) {
    console.log(url);
    listAccounts()
  }
});

// Prints the public address of all accounts in the blockchain
function listAccounts() {
  web3.eth.getAccounts()
    .then(fetchedAccounts=> {
      console.log(fetchedAccounts);
    });
}
