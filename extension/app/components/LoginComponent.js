import React from 'react'
import '../css/LoginComponent.css'

class LoginComponent extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      publicKey: '',
      privateKey: '',
      loginFailed: false,
      errors: []
    }

    this.handleChange = this.handleChange.bind(this)
    this.submitClicked = this.submitClicked.bind(this)
    this.registerClicked = this.registerClicked.bind(this)
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  submitClicked() {
    const pubKeyRegEx = /0x[a-fA-F0-9]{40}\b/
    const publicKey = this.state.publicKey.trim()
    const privateKey = this.state.privateKey.trim()
    var errors = []

    if (publicKey === '') {
      errors.push('Public key field is empty');
    } else if (!pubKeyRegEx.test(publicKey)) {
      errors.push('Public key is not valid');
    } 

    if (privateKey === '') {
      errors.push('Private key is empty');
    } 

    if (errors.length === 0)  {
      const data = {
        'publicKey': this.state.publicKey,
        'privateKey': this.state.privateKey
      }
      chrome.storage.sync.set(data);
      this.props.history.push(`/`);
    } else {
      this.setState({ errors: errors });
      console.log(errors)
    }
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
