import React from 'react'
import { Bar, Doughnut, Line } from 'react-chartjs-2'
import '../css/AnalyticsComponent.css'

class AnalyticsComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      topSitesData: null,
      monthtlySpendingData: null
    }

    this.parseTopSiteData = this.parseTopSiteData.bind(this);
    this.parseMonthlySpending = this.parseMonthlySpending.bind(this);

    this.renderTopSites = this.renderTopSites.bind(this);
    this.renderMonthlySpending = this.renderMonthlySpending.bind(this);
  }

  componentDidMount() {
    chrome.storage.local.get({'paidDomains': []}, result => {
      let data = result.paidDomains;
      let topSitesData = this.parseTopSiteData(data);
      let monthlySpendingData = this.parseMonthlySpending(data);
    });
  }

  parseTopSiteData(data) {
    // Calculating the total cost for each domain
    var totalCosts = {}
    data.forEach(function(entry) {
      if (totalCosts[entry.domainName]) {
        totalCosts[entry.domainName] += entry.cost
      } else {
        totalCosts[entry.domainName] = entry.cost
      }
    });

    // Sorting the dictionary from largest cost to smallest
    var items = Object.keys(totalCosts).map(function(key) {
      return [key, totalCosts[key]];
    });
    items.sort(function(first, second) {
      return second[1] - first[1];
    });
    items = items.slice(0, 5)

    // Splitting domain names and costs into separate arrays
    let domains = items.map(function(value,index) { 
      return value[0]; 
    });
    let costs = items.map(function(value,index) { 
      return value[1].toFixed(2);
    });

    this.setState({
      topSitesData: {
        labels: domains,
        datasets: [{
          data: costs,
          backgroundColor: ['#99B898', '#FECEA8', '#FF847C','#E84A5F']
        }]
      }
    }, () => {
      console.log("Top sites updated")
    });
  }

  parseMonthlySpending(data) {
    let startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);
    let endDate = new Date();

    // Calculating the amount spent per day in a 30 day period
    var spending = {}
    data.forEach(function(transaction) {
      let date = new Date(transaction.time);
      if (date <= endDate && date >= startDate) {
        let label = date.getDate() + "/" + (date.getMonth() + 1)
        if (spending[label]) {
          spending[label] += transaction.cost
        } else {
          spending[label] = transaction.cost
        }
      }
    });

    // Sorting the dictionary by date
    var items = Object.keys(spending).map(function(key) {
      return [key, spending[key]];
    });
    items.sort(function(first, second) {
      return second[0] - first[0];
    });
    items = items.slice(0, 5)

    // Splitting dates and costs into separate arrays
    let dates = items.map(function(value,index) { 
      return value[0]; 
    });
    let costs = items.map(function(value,index) { 
      return value[1].toFixed(2);
    });

    this.setState({
      monthtlySpendingData: {
        labels: dates,
        datasets: [{
          data: costs,
          backgroundColor: '#99b898bf'
        }]
      }
    }, () => {
      console.log("Monthly spending updated");
    });
  }

  renderTopSites() {
    return (
      <Doughnut
        data={ this.state.topSitesData }
        height={ 200 }
        options={{
          maintainAspectRatio: false,
          legend: {
            align: 'start',
            position: 'bottom',
            labels: { boxWidth: 25 }
          }
        }}
      />
    );
  }

  renderMonthlySpending() {
    return (
      <Line 
        data={ this.state.monthtlySpendingData }
        options={{
          maintainAspectRatio: false,
          legend: {
            display: false
          },
          tooltips: {
            callbacks: {
              label: (item) => `${item.yLabel} ETH`,
            },
          }
        }}
      />
    );
  }

  render() {
    return (
      <div className="window">
        <h2>Analytics</h2>
        <div className="tile">
          <h2>Your past month:</h2>
          {this.state.monthtlySpendingData && this.renderMonthlySpending()}
        </div>
        <div>
          <div className="tile split-tile">
            <h2>Whatever man:</h2>
          </div>
          <div className="tile split-tile">
            <h2>Top 5 Sites:</h2>
            {this.state.topSitesData && this.renderTopSites()}
          </div>
        </div>
      </div>
    );
  }
}

export default AnalyticsComponent
