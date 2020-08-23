const Web3 = require('web3');

// Creating connection to our Ganache personal blockchain
var web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:7545'));

/**
 * Listens for whenever a tab changes
 */
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  let url = changeInfo["url"]
  if(url != undefined) {
    console.log(url);
  }
});

/**
 * Prints the public address of all accounts in the blockchain
 * @return {Object} - the account object containing their public and private key
 */
function createAccount() {
  let account = web3.eth.accounts.create();
  return account
}

/**
 * Transfers funds from one user account to another
 * @param {String} userAddress - The address that funds will be withdrawn from
 * @param {String} creatorAddress - The address that funds will be deposited into
 * @param {Number} amount - the amount of money to be transferred in ETH
 */
function transferFunds(userAddress, creatorAddress, amount) {
  // Converting from wei to ETH
  amount = amount * Math.pow(10, 18)

  // Sending the funds
  web3.eth.sendTransaction({
    to: userAddress,
    from: creatorAddress,
    value: amount
  })
}

/**
 * Prints the public address of all accounts in the blockchain
 */
function listAccounts() {
  web3.eth.getAccounts()
    .then(fetchedAccounts=> {
      console.log(fetchedAccounts);
    });
}
