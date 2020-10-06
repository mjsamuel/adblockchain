import React from 'react'
import { Route } from 'react-router-dom'
import { withRouter } from "react-router";

class AuthenticatedRoute extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
        isLoggedIn: null
    }
  }

  /**
   * Checks Chrome local storage if the public and private key are set, if not
   * the user is redirected to the login page
   */
  componentDidMount() {
    chrome.storage.sync.get(['publicKey', 'privateKey'], result => {
      if (result['publicKey'] !== undefined &&
          result['publicKey'] !== '' &&
          result['privateKey'] !== undefined &&
          result['privateKey'] !== '') {
        this.setState({ isLoggedIn: true })
      } else {
        this.props.history.push(`/login`)
      }

      if (window.innerWidth > 350) {
         this.props.history.push(`/analytics`)
      }
    });
  }

  /**
   * Renders a loading page while waiting for a response from `componentDidMount`.
   * If logged in the user is directed to the correct page
   */
  render() {
    const { component: Component, ...rest } = this.props;
    if(this.state.isLoggedIn === null) return <div>Loading...</div>
    return <Route {...this.props} />
  }
}

export default withRouter(AuthenticatedRoute)
