import React from 'react'
import '../css/LoginComponent.css'
import { Ethereum } from '../services/ethereum.js'


class LoginComponent extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      publicKey: '',
      privateKey: '',
      errors: []
    }

    this.eth = new Ethereum()

    this.handleChange = this.handleChange.bind(this)
    this.submitClicked = this.submitClicked.bind(this)
    this.registerClicked = this.registerClicked.bind(this)
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  async submitClicked() {
    const publicKey = this.state.publicKey.trim()
    const privateKey = this.state.privateKey.trim()

    const errors = await this.validateCredentials(publicKey, privateKey)
    if (errors.length === 0)  {
      // Valid login credentials so data is saved in Chrome local storage
      const data = {
        'publicKey': this.state.publicKey,
        'privateKey': this.state.privateKey
      }
      chrome.storage.sync.set(data);
      this.props.history.push(`/`);
    } else {
      this.setState({ errors: errors });
    } 
  }

  async validateCredentials(publicKey, privateKey) {
    var errors = []

    // Checking if public key is valid
    if (publicKey === '') {
      errors.push('Public key field is empty');
    } else if (!eth.web3.utils.isAddress(publicKey)) {
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
          this.eth.web3.eth.accounts.privateKeyToAccount(privateKey).address
        if (extractedKey !== publicKey) {
          errors.push('Private key does not correspond to public key')
        }
      } catch (error) {
        errors.push('Private key is invalid');
      }
    }

    return errors
  }

  registerClicked() {
  }

  render() {
    return (
      <>
        <h2>Login</h2>
        {this.state.errors.length !== 0 && (
          <div className="alert alert-danger" role="alert">
            <b>Error/s</b>:
            <ul>
              {this.state.errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>)}
        <form>
          <div className="form-group">
            <input 
              type="text" 
              className="form-control" 
              placeholder="Ethereum Public Key" 
              name="publicKey" 
              value={this.state.publicKey} 
              onChange={this.handleChange} />
          </div>
          <div className="form-group">
            <input 
              type="password" 
              className="form-control" 
              placeholder="Ethereum Private Key" 
              name="privateKey" 
              value={this.state.privateKey} 
              onChange={this.handleChange} />
          </div>
          <div className="btn-group fill">
            <button 
              type="button" 
              className="btn btn-primary"
              onClick={this.submitClicked}>
                Submit
            </button>
            <button 
              type="button" 
              className="btn btn-success"
              onClick={this.registerClicked}>
                Register
            </button>
          </div>
        </form>
      </>
    );
  }
}

export default LoginComponent
