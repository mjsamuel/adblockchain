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

  componentDidMount() {
    this.ipfs.addDomain("test", "123", "456");
    this.ipfs.getAddress("asdf")
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
