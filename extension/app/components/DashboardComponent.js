import React from 'react'
import moment from 'moment';
import '../css/DashboardComponent.css'
import { Ethereum } from '../services/ethereum.js'

class DashboardComponent extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      balance: null,
      paidDomains: [],
      currentPageData: [],
      pageNo: 0
    }

    this.eth = new Ethereum()

    this.logoutClicked = this.logoutClicked.bind(this);
    this.updateBalance = this.updateBalance.bind(this);
    this.updateTransactions = this.updateTransactions.bind(this);
    this.changePage = this.changePage.bind(this)
  }

  componentDidMount() {
    this.updateBalance()
    this.updateTransactions()
  }

   updateBalance() {
    chrome.storage.sync.get(['publicKey', 'privateKey'], async result => {
      const publicKey = result['publicKey']
      if (publicKey !== undefined && publicKey !== '') {
        var balance = await this.eth.web3.eth.getBalance(publicKey)
        balance = this.eth.getEth(balance);
        this.setState({ balance: balance })
      }
    });
  }

   updateTransactions() {
    chrome.storage.local.get({'paidDomains': []}, result => {
      const data = result.paidDomains.reverse();
      const pageIndex = this.state.pageNo * 10;
      const pageData = data.slice(pageIndex, pageIndex + 10);
      this.setState({ 
        paidDomains: data,
        currentPageData: pageData
      });
    });
  }

  changePage(index) {
    const pageNo = this.state.pageNo + index;
    const pageIndex = pageNo * 10;

    if (pageNo >= 0 && pageIndex <= this.state.paidDomains.length) {
      const pageData = this.state.paidDomains.slice(pageIndex, pageIndex + 10);
      this.setState({ 
        currentPageData: pageData,
        pageNo: pageNo
      });
      console.log(`page no: ${pageNo}\n` + 
        `start index ${pageIndex}\n`+
        `end index ${pageIndex + 10}`)
    };
  }

  logoutClicked() {
    const data = {
      'publicKey': '',
      'privateKey': ''
    }
    chrome.storage.sync.set(data);
    this.props.history.push(`/login`)
  }

  render() {
    return (
      <>
        <h2>Dashboard</h2>
        <b>Balance:</b>
        {this.state.balance && (<div>{this.state.balance.toFixed(4)} ETH</div>)}
        <b>Transaction History:</b>
        {this.state.currentPageData.length !== 0 && (
          <>
            <nav aria-label="...">
              <ul className="pagination">
                <li className="page-item" onClick={() => this.changePage(-1)}>
                  <a className="page-link">Previous</a>
                </li>
                <li className="page-item" onClick={() => this.changePage(1)}>
                  <a className="page-link">Next</a>
                </li>
              </ul>
            </nav>
            <table className="table">
              <tbody>
                {this.state.currentPageData.map((transaction, index) => (
                  <tr key={index}>
                    <td>
                      <a href={transaction.domainName}>{transaction.domainName}</a>,<br/>
                      {transaction.cost} ETH, {moment(transaction.time).fromNow()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>)}
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
