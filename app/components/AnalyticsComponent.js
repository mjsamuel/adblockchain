import React from 'react'
import { Bar, Doughnut, Line } from 'react-chartjs-2'
import '../css/AnalyticsComponent.css'

class AnalyticsComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      topSitesData: null,
      dailySpendingData: null,
      totalMonthlySpending: null
    }

    this.parseTopSiteData = this.parseTopSiteData.bind(this);
    this.parseDailySpending = this.parseDailySpending.bind(this);

    this.renderTopSites = this.renderTopSites.bind(this);
    this.renderDailySpending = this.renderDailySpending.bind(this);
    this.renderMonthlySpending = this.renderMonthlySpending.bind(this);
  }

  componentDidMount() {
    chrome.storage.local.get({'paidDomains': []}, result => {
      let data = result.paidDomains;
      this.parseTopSiteData(data);
      this.parseDailySpending(data);
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
    });
  }

  parseDailySpending(data) {
    let startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);
    let endDate = new Date();

    // Calculating the amount spent per day in a 30 day period
    var totalMonthlySpending = 0
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
        // Also calculating the total spent per month while we're here
        totalMonthlySpending += transaction.cost
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
      totalMonthlySpending: totalMonthlySpending,
      dailySpendingData: {
        labels: dates,
        datasets: [{
          data: costs,
          backgroundColor: '#99b898bf'
        }]
      }
    });
  }

  renderTopSites() {
    return (
      <Doughnut
        data={ this.state.topSitesData }
        height={ 370 }
        options={{
          legend: {
            align: 'start',
            position: 'bottom',
            labels: { boxWidth: 25 }
          }
        }}
      />
    );
  }

  renderDailySpending() {
    return (
      <Line 
        data={ this.state.dailySpendingData }
        height={ 175 }
        options={{
          legend: { display: false },
          tooltips: {
            callbacks: {
              label: (item) => `${item.yLabel} ETH`,
            },
          }
        }}
      />
    );
  }

  renderMonthlySpending() {
    return (
      <h1 className="monthly-spending">
        {this.state.totalMonthlySpending.toFixed(4)}<br />ETH
      </h1>
    );
  }

  render() {
    return (
      <div className="window">
        <h2>Analytics</h2>
        <div className="tile">
          <h2>Daily spending:</h2>
          {this.state.dailySpendingData && this.renderDailySpending()}
        </div>
        <div className="split-tile-container">
          <div className="tile split-tile">
            <h2>Top 5 Sites:</h2>
            {this.state.topSitesData && this.renderTopSites()}
          </div>
          <div className="tile split-tile">
            <h2>Total monthly spending:</h2>
            {this.state.totalMonthlySpending && this.renderMonthlySpending()}
          </div>
        </div>
      </div>
    );
  }
}

export default AnalyticsComponent
