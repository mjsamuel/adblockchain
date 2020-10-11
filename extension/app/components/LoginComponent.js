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

  /**
   * Updates the state of the component when an 'onChange' event occurs
   * @param {Object} event - the event object generated
   */
  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  /**
   * Stores the Ethereum credentials within Chrome storage is they are found to
   * be valid and redirects the user
   */
  async submitClicked() {
    const publicKey = this.state.publicKey.trim()
    const privateKey = this.state.privateKey.trim()

    const errors = await this.eth.validateCredentials(publicKey, privateKey)
    if (errors.length === 0)  {
      // Valid login credentials so data is saved in Chrome local storage
      const data = {
        'publicKey': this.state.publicKey,
        'privateKey': this.state.privateKey
      }
      chrome.storage.sync.set(data);
      // Sending user to their dashboard
      this.props.history.push(`/`);
    } else {
      this.setState({ errors: errors });
    } 
  }

  async registerClicked() {
    const account = await this.eth.createAccount();
    const data = {
        'publicKey': account.address,
        'privateKey': account.privateKey
    }

    alert(`Here are your account details.\n`
      + `Please note these down as they will not be presented to you again.\n\n`
      + `Public key: ${account.address}\n`
      + `Private key: ${account.privateKey}`)

    chrome.storage.sync.set(data, () => {
      this.props.history.push(`/`);
    });
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

export default LoginComponent;
