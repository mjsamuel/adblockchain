import React, { Component } from 'react';
import logo from './images/logo.svg';
import './css/App.css';
import Ipfs from '../data/Ipfs.js';

class App extends Component {

  constructor(props) {
    super(props)
    this.ipfs = new Ipfs();
    this.state = {}
  }

  async componentDidMount() {

    // // Example adding domain, publicKey, privateKey
    // this.ipfs.addDomain("adfdsafasdfa", "pubkey", "privkey");
    // this.ipfs.addDomain("otherDomain", "pubkey", "privkey");
    this.ipfs.retrieveLatestHashData();



    // this.ipfs.storeHash("QmW11ntemu567QrdYaqARgYoy5yJt2Gg9iGsrYMYK9CLjj")

    // // Example retrieving address
    // const publickey = await this.ipfs.getAddress("youtube");
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <p> </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
    );
  }

}

export default App;
