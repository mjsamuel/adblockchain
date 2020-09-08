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

## Usage / Development Setup
In order to set the correct values from our personal blockchain and offline IPFS node, a `config.js` file must be created and placed in the `/extension` directory.

The template file `config.js.example` details what the `config.js` should look like:
```js
export const IPNS_ADDRESS = '/ipns/QmWrQMTnkK4PdmYJgbwwoafRp7VKTiRkruTrG9BjqzEeYD';
export const IPNS_KEY = 'QmWrQMTnkK4PdmYJgbwwoafRp7VKTiRkruTrG9BjqzEeYD';
export const DEFAULT_ETH_ACCOUNT = '0x561D1D62083eBE58FFdcCBD283791f98d19a0AF0';
```
### Setting up Ganache
When opening Ganache for the first time you should be greeted with an option to create a new workspace.

Click on '*New Workspace*' and then '*Save Workspace*' to create a private blockchain

This newly created workspace should now be accessible at `http://localhost:7545`

### Running the IPFS Daemon
Before running your daemon for the first time, enable cross-origin resource sharing for our node with the following command:
```
$ ipfs config --json API.HTTPHeaders '{"Access-Control-Allow-Origin": ["*"]}'
```

Then run the IPFS daemon with the following command:
```
$ ipfs daemon --offline
```

Your IPFS node should now be accessible at `http://localhost:5001` 

### Browser Extension
To install the necessary node.js dependencies navigate to `/extension` and type:
```
$ npm install
```

#### Building the Extension
Navigate to `/extension` and run the following to compile the source files:
```
$ npm run build
```

#### Building the Extension (Live Reload)
Navigate to `/extension` and run the following to build the source files as well as recompile whenever a file is changed :
```
$ npm run start
```

#### Running Unit Tests
Navigate to `/extension` and run the following to run all unit tests using Jest:
```
$ npm run test
```

#### Adding the Extension to Chrome
Go to the address `chrome://extensions/` and enable '*Developer mode*' in the toolbar.

Click on '*Load unpacked*' and select `/extension/build`.

The `build` folder should now be linked such that every time you run the build command the extension should be updated automatically.

**NOTE**: Both Ganache and the IPFS daemon should be running in the background for the extension to function properly.
