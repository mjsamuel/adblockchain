import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { withRouter } from "react-router";

class AuthenticatedRoute extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
        isLoggedIn: null
    }
  }

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
    });
  }

  render() {
    const { component: Component, ...rest } = this.props;
    if(this.state.isLoggedIn === null) return <div>Loading ...</div>
    return <Route {...this.props} />
  }
}

export default withRouter(AuthenticatedRoute)
