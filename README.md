
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
- [Truffle](https://www.trufflesuite.com/truffle/)
- [Ganache](https://www.trufflesuite.com/ganache)

## Usage / Development Setup

### Ethereum Smart Contract
[Truffle](https://www.trufflesuite.com/docs/truffle/overview) is the development tool used to compile, debug and test our smart contracts. Install it by typing:
```
$ sudo npm install -g truffle
```

#### Linking the Truffle Project to Ganache
When opening Ganache for the first time you should be greeted with an option to create a new workspace.

Select '*New Workspace (Ethereum)*',  then '*Add Project*' and select `/contract_backend/truffle-config.js` to link our project.

#### Deploying the Smart Contracts
Navigate to the `/contract_backend` folder and deploy the smart contracts to your local Ethereum blockchain with the following command: 
```
$ truffle migrate --reset
```

#### Running Unit Tests
Navigate to the `/contract_backend` folder and run the unit tests by typing: 
```
$ truffle test
```

### Browser Extension
To install the necessary node dependencies navigate to `/extension` and type:
```
$ npm install
```

#### Building the Extension (Live Reload)
Navigate to `/extension` and run the following to build the source files as well as recompile whenever a file is changed :
```
$ npm run start
```

#### Building the Extension
Navigate to `/extension` and run the following to build the source files:
```
$ npm run build
```

#### Adding the Extension to Chrome
Go to the address `chrome://extensions/` and enable '*Developer mode*' in the toolbar.

Click on '*Load unpacked*' and select `/extension/build`.

The `build` folder should now be linked such that every time you run the build command the extension should be updated automatically.
