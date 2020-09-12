import React from 'react'
import moment from 'moment';
import '../css/DashboardComponent.css'

class DashboardComponent extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      paidDomains: []
    }

    this.logoutClicked = this.logoutClicked.bind(this);
  }

  componentDidMount() {
    chrome.storage.local.get({'paidDomains': []},  result => {
      const data = result.paidDomains.reverse();
      this.setState({ paidDomains: data });
    });
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
        <b>Transaction History</b>
        {this.state.paidDomains.length !== 0 && (
          <table className="table">
            <tbody>
              {this.state.paidDomains.map((transaction, index) => (
                <tr key={index}>
                  <td>
                    <a href={transaction.domainName}>{transaction.domainName}</a>,<br/>
                    {transaction.cost} ETH,<br/>
                    {moment(transaction.time).fromNow()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>)}
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
