const Web3 = require('web3');

// Creating connection to our Ganache personal blockchain
var web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:7545'));

/**
 * Generates an Ethereum account  
 * @return {Object} - the account object containing their public and private key
 */
export function createAccount() {
  let account = web3.eth.accounts.create();
  return account
}

/**
 * Transfers funds from one user account to another
 * @param {String} userAddress - The address that funds will be withdrawn from
 * @param {String} creatorAddress - The address that funds will be deposited into
 * @param {Number} amount - the amount of money to be transferred in ETH
 */
export function transferFunds(userAddress, creatorAddress, amount) {
  // Converting from wei to ETH
  amount = getEth(amount)

  // Sending the funds
  web3.eth.sendTransaction({
    to: userAddress,
    from: creatorAddress,
    value: amount
  }).then(transactionDetails => {
    console.log(transactionDetails)
  })
}

/**
 * Converts ETH to wei
 * @param {Int} amount - The amount of ETH to be returned
 * @return {Int} - An ammount of ETH in wei
 */
function getEth(amount) {
  let eth = amount * Math.pow(10, 18)
  return eth
}

/**
 * Debug function that prints the public address of all accounts in the 
 * Ganache blockchain
 */
export function listAccounts() {
  web3.eth.getAccounts()
    .then(fetchedAccounts=> {
      console.log(fetchedAccounts);
    });
}

