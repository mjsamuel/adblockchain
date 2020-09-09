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
    this.loginClicked = this.loginClicked.bind(this)
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  loginClicked() {
    console.log(this.state.publicKey)
    console.log(this.state.privateKey)
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
          <div class="btn-group fill">
            <button 
              type="button" 
              class="btn btn-primary" 
              >Submit</button>
            <button 
              type="button" 
              class="btn btn-success" 
              >Register</button>
          </div>
        </form>
      </>
    );
  }
}

export default LoginComponent
