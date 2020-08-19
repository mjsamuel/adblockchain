import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';
const IPFS = require('ipfs-mini');

class App extends Component  {
  constructor(props){
    super(props)

    this.state = {
      domain: null,
      domainHash: null,
      domainData: null,
      ipfs: null
    }
  }

  componentWillMount(){
    this.configureIPFS();
  }

  configureIPFS(){
    const ipfs = new IPFS({host: 'ipfs.infura.io', port: 5001, protocol: 'https'});
    this.setState({ipfs: ipfs});
  }

  readData(hashID){
      this.props.ipfs.cat(hashID, (err, data) => {
          if(err){
              console.log(err);
          } else {
              this.setState(domainData, data);
              console.log("Data: " + data);
          }
      });
  }

  render(){
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
