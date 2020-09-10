const Web3 = require('web3');

export class Ethereum {
  constructor() {
    // Creating connection to our Ganache personal blockchain
    this.web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:7545'));
  }

  /**
   * Generates an Ethereum account  
   * @return {Object} - the account object containing their public and private key
   */
  createAccount() {
    let account = this.web3.eth.accounts.create();
    return account;
  }

  /**
   * Transfers funds from one user account to another
   * @param {String} url - the corresponding domain to the creatorAddress
   * @param {String} creatorAddress - the address that funds will be deposited into
   * @param {Number} amount - the amount of money to be transferred in ETH
   */
  async transferFunds(url, creatorAddress, amount) {
    // Converting from ETH to wei
    const weiAmount = this.getEth(amount);

    // Retrieving the user's public and private key from Chrome storage
    chrome.storage.sync.get(['publicKey', 'privateKey'], result => {
      const publicKey = result['publicKey']
      const privateKey = result['privateKey']

      if (publicKey !== undefined &&
          publicKey !== '' &&
          privateKey !== undefined &&
          privateKey !== '') {
        // Transferring the funds
        this.web3.eth.sendTransaction({
          from: publicKey,
          to: creatorAddress,
          value: weiAmount
        }); 
        console.log(`Transferred funds to ${url}\n` +
          `Ethereum address: ${creatorAddress}\n` + 
          `Ammount transferred: ${amount} ETH \n`)
      }
    });
  }

  /**
   * Gets an amount of ETH in wei
   * @param {Int} amount - The amount of ETH to be returned
   * @return {Int} - An amount of ETH in wei
   */
  getEth(amount) {
    let eth = amount * Math.pow(10, 18);
    return eth;
  }

  /**
   * Debug function that prints the public address of all accounts in the 
   * Ganache blockchain
   */
  async listAccounts() {
    const fetchedAccounts = await this.web3.eth.getAccounts();
  }

  /**
   * Debug function to print the balance of a particular account 
   * @param {String} walletAddress - the wallet that you want to get the balance of
   */
  async getBalance(walletAddress) {
    const balance = await this.web3.eth.getBalance(walletAddress);
  }
}
