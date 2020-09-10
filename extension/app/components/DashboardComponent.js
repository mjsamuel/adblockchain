import React from 'react'

class DashboardComponent extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}

    this.logoutClicked = this.logoutClicked.bind(this);
  }

  componentDidMount() {
    
  }

  async logoutClicked() {
    const data = {
      'publicKey': '',
      'privateKey': ''
    }
    await chrome.storage.sync.set(data);
    this.props.history.push(`/login`)
  }

  render() {
    return (
      <>
        <h2>Dashboard</h2>
        <div className="btn-group fill">
          <button 
            type="button" 
            className="btn btn-danger"
            onClick={this.logoutClicked}>
              Logout
          </button>
        </div>
      </>
    );
  }
}

export default DashboardComponent
