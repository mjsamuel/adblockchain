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
   * @param {String} userAddress - the address that funds will be taken from
   * @param {String} creatorAddress - the address that funds will be deposited into
   * @param {Number} amount - the amount of money to be transferred in ETH
   */
  async transferFunds(userAddress, creatorAddress, amount) {
    // Converting from ETH to wei
    const weiAmount = this.getEth(amount);

    // Transferring the funds
    this.web3.eth.sendTransaction({
      from: userAddress,
      to: creatorAddress,
      value: weiAmount
    }); 
  }

  /**
   * Checks the validity of both a public and private key and whether they 
   * correspond to one another
   * @param {String} publicKey - the public key to be validated 
   * @param {String} privateKey - the private key to be validated 
   */
  async validateCredentials(publicKey, privateKey) {
    var errors = []

    // Checking if public key is valid
    if (publicKey === '') {
      errors.push('Public key is empty');
    } else if (!this.web3.utils.isAddress(publicKey)) {
      errors.push('Public key is invalid');
    }

    // Checking if private key is valid
    if (privateKey === '') {
      errors.push('Private key is empty');
    } else {
      try {
        // Retrieving a public key from the passed in private key and checking
        // if that matches the passed in public key
        const extractedKey = 
          this.web3.eth.accounts.privateKeyToAccount(privateKey).address
        if (extractedKey !== publicKey) {
          errors.push('Private key does not correspond to public key')
        }
      } catch (error) {
        errors.push('Private key is invalid');
      }
    }

    return errors
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
    return fetchedAccounts;
  }

  /**
   * Debug function to print the balance of a particular account 
   * @param {String} walletAddress - the wallet that you want to get the balance of
   */
  async getBalance(walletAddress) {
    const balance = await this.web3.eth.getBalance(walletAddress);
    return balance /  Math.pow(10, 18);
  }
}
