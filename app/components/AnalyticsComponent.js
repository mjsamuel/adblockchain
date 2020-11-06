import React from 'react'
import { Bar, Doughnut } from 'react-chartjs-2'
import '../css/AnalyticsComponent.css'

class AnalyticsComponent extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      topSitesData: null,
      monthtlySpendingData: null
    }

    this.updateTopSites = this.updateTopSites.bind(this);
    this.parseTopSiteData = this.parseTopSiteData.bind(this);

    this.updateMonthlySpending = this.updateMonthlySpending.bind(this);
    this.parseMonthlySpending = this.parseMonthlySpending.bind(this);
  }

  componentDidMount() {
    this.updateTopSites();
    this.updateMonthlySpending();
  }

  updateTopSites() {
    chrome.storage.local.get({'paidDomains': []}, result => {
      let data = result.paidDomains;
      let topSitesData = this.parseTopSiteData(data);
      let monthlySpendingData = this.parseMonthlySpending(data);

      this.setState({
        topSitesData: {
          labels: topSitesData.domains,
          datasets: [{
            data: topSitesData.costs,
            backgroundColor: ['#99B898', '#FECEA8', '#FF847C','#E84A5F']
          }]
        }
      }, () => {
        console.log("Top sites updated")
      })
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
    })

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

    return {
      domains: domains,
      costs: costs
    }
  }

  updateMonthlySpending() {
    
  }

  parseMonthlySpending() {
    
  }

  render() {
    return (
      <div className="window">
        <h2>Analytics</h2>

        <div className="tile">
          <h2>Monthly spending:</h2>
          {this.state.monthtlySpendingData && 
            (<br />)
          }
        </div>

        <div>
          <div className="tile split-tile">
            <h2>Whatever man:</h2>
          </div>

          <div className="tile split-tile">
            <h2>Top 5 Sites:</h2>
            {this.state.topSitesData && 
              (<Doughnut
                data={this.state.topSitesData}
                width={400}
                height={200}
                options={{
                  maintainAspectRatio: false,
                  legend: {
                    align: 'start',
                    position: 'bottom',
                    labels: { boxWidth: 25 }
                  }
                }}
              />)
            }
          </div>
        </div>
      </div>
    );
  }
}

export default AnalyticsComponent
