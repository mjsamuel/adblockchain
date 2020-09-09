import React from 'react'

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

  }

  render() {
    return (
      <div>
        <h1>Login</h1>
      </div>
    );
  }
}

export default LoginComponent
