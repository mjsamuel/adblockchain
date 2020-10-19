<div align="center">
  <h1>
    <img src="https://i.imgur.com/cNb34AJ.png" alt="Ethereum Logo" height="125"><br>
    BlockChain Based Novel Online<br> Revenue Paradigm<br>
    <img src="https://travis-ci.com/mjsamuel/blockchain.svg?token=8bnx6syKrM5BbM1FTCfx&branch=develop"/><br>
  </h1>
  <strong>RMIT Capstone Project<br></strong>
  <sub>Brendan Rossi, Liam Jeynes and Matthew Samuel</sub>
</div>

## Dependencies
- [Node.js](https://nodejs.org/en/)
- [Ganache](https://www.trufflesuite.com/ganache)
- [IPFS](https://ipfs.io)

# Usage / Development Setup
In order to set the correct values from our personal blockchain and offline IPFS node, a `config.js` file must be created and placed in the `/extension` directory.

The template file `config.js.example` details what the `config.js` should look like:
```js
export const IPNS_ADDRESS = '/ipns/QmWrQMTnkK4PdmYJgbwwoafRp7VKTiRkruTrG9BjqzEeYD';
export const IPNS_KEY = 'QmWrQMTnkK4PdmYJgbwwoafRp7VKTiRkruTrG9BjqzEeYD';
```

Getting these values will be explained when setting up [IPFS](#IPFS).

### Browser Extension
To install the necessary node.js dependencies navigate to `/extension` and type:
```bash
$ npm install
```

#### Building the Extension
Navigate to `/extension` and run the following to compile the source files:
```bash
$ npm run build
```

#### Building the Extension (Live Reload)
Navigate to `/extension` and run the following to build the source files as well as recompile whenever a file is changed :
```bash
$ npm run start
```

#### Running Unit Tests
Navigate to `/extension` and run the following to run all unit tests using Jest:
```bash
$ npm run test
```

#### Adding the Extension to Chrome
Go to the address `chrome://extensions/` and enable '*Developer mode*' in the toolbar.

Click on '*Load unpacked*' and select `/extension/build`.

The `build` folder should now be linked such that every time you run the build command the extension should be updated automatically.

**NOTE**: Both Ganache and the IPFS daemon should be running in the background for the extension to function properly.

### Ganache
#### Starting Ganache
To run the Ganche CLI navigate to `/extension` and run the following command:
```bash
$ npx ganache-cli
``` 

After some setup, you should now have a personal Ethereum blockchain that you can access at `http://localhost:8545`.

#### Accounts
To login and use the application you will need an Ethereum account with some Ether.

When running Ganache CLI there will be an output similar to the following:
```
Available Accounts
==================
(0) 0x523C0bB9Ad4Ef59D3A1E473cBA5A896B89459D49 (100 ETH)
...

Private Keys
==================
(0) 0xf013cec05bba903906183f6e42286318e6833df608fb01c00d9728f5c0f2e182
...
```

These are the login credentials for ten auto generated accounts with 100 ETH each. 
You can us any of following public keys from '*Available Accounts*' and the corresponding private key from '*Private Keys*' to login.

### IPFS
#### Running the IPFS Daemon
After [installing](https://docs.ipfs.io/install/) the IPFS CLI, you'll  need to enable cross-origin resource sharing for your node with the following command:
```bash
$ ipfs config --json API.HTTPHeaders '{"Access-Control-Allow-Origin": ["*"]}'
```

Then run the IPFS daemon with the following command:
```bash
$ ipfs daemon --offline
```

Your IPFS node should now be accessible at `http://localhost:5001` 

#### Generating an IPNS Key and Address 
To generate an IPNS key, use the following command:
```bash
$ ipfs key gen --type=rsa --size=2048 capstone
```

Which should should output a key similar to `QmTBUGfsq5S3o3hj4NQhVPdEpC7ZsKRYnx1DwHSRrP2q3d`.

And to get the IPNS address associated with your key, input the following commands:
```bash
$ HASH=$(echo "{}" | ipfs add | awk {'print $2'})
$ ipfs name publish --key={your_ipns_key} $HASH --allow-offline | awk '{print substr($3, 1, length($3)-1)}'
```
The output, when prefixed with `/ipns/` is your IPNS address.

You can now replace both the `IPNS_KEY` and `IPNS_ADDRESS` in your `config.js` file with your own values
