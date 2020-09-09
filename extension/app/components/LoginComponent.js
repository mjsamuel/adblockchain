import React from 'react'
import '../css/LoginComponent.css'

class LoginComponent extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      publicKey: '',
      privateKey: '',
      loginFailed: false,
      errorText: ''
    }

    this.handleChange = this.handleChange.bind(this)
    this.submitClicked = this.submitClicked.bind(this)
    this.registerClicked = this.registerClicked.bind(this)
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  async submitClicked() {
    const data = {
      'publicKey': this.state.publicKey,
      'privateKey': this.state.privateKey
    }

    await chrome.storage.sync.set(data);

    // chrome.storage.sync.get(['publicKey', 'privateKey'], function(result) {
    //   console.log(`Public key: ${result['publicKey']}\n` +
    //     `Private key: ${result['privateKey']}`);
    // });
  }

  registerClicked() {
  }

  render() {
    return (
      <>
        <h2>Login</h2>
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
              onClick={this.submitClicked}>Submit</button>
            <button 
              type="button" 
              className="btn btn-success"
              onClick={this.registerClicked}>Register</button>
          </div>
        </form>
      </>
    );
  }
}

export default LoginComponent
