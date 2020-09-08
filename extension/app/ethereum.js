const Web3 = require('web3');

// Creating connection to our Ganache personal blockchain
var web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:7545'));

/**
 * Generates an Ethereum account  
 * @return {Object} - the account object containing their public and private key
 */
export function createAccount() {
  let account = web3.eth.accounts.create();
  return account;
}

/**
 * Transfers funds from one user account to another
 * @param {String} userAddress - The address that funds will be withdrawn from
 * @param {String} creatorAddress - The address that funds will be deposited into
 * @param {Number} amount - the amount of money to be transferred in ETH
 */
export function transferFunds(userAddress, creatorAddress, amount) {
  // Converting from ETH to wei
  amount = getEth(amount);

  // Sending the funds
  web3.eth.sendTransaction({
      to: creatorAddress,
      from: userAddress,
      value: amount
    })
}

/**
 * Gets an amount of ETH in wei
 * @param {Int} amount - The amount of ETH to be returned
 * @return {Int} - An amount of ETH in wei
 */
export function getEth(amount) {
  let eth = amount * Math.pow(10, 18);
  return eth;
}

/**
 * Debug function that prints the public address of all accounts in the 
 * Ganache blockchain
 */
export async function listAccounts() {
  const fetchedAccounts = await web3.eth.getAccounts()
  console.log(fetchedAccounts)
}

/**
 * Debug function to print the balance of a particular account 
 * @param {String} walletAddress - the wallet that you want to get the balance of
 */
export async function getBalance(walletAddress) {
  const balance = await web3.eth.getBalance(walletAddress);
  console.log(balance)
}
