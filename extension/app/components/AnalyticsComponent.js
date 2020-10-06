import React from 'react'
import { Bar, Doughnut } from 'react-chartjs-2'
import '../css/AnalyticsComponent.css'

class AnalyticsComponent extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      data: null
    }

    this.updateStats = this.updateStats.bind(this)
    this.parseData = this.parseData.bind(this)
  }

  componentDidMount() {
    this.updateStats()
  }

  updateStats() {
    chrome.storage.local.get({'paidDomains': []}, result => {
      let data = result.paidDomains
      let parsedData = this.parseData(data) 

      this.setState({
        data: {
          labels: parsedData.domains,
          datasets: [{
            data: parsedData.costs,
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
            hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
          }]
        }
      }, () => {
        console.log("UPDATED GRAPH")
      })
    });
  }

  parseData(data) {
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
    var domains = items.map(function(value,index) { 
      return value[0]; 
    });
    var costs = items.map(function(value,index) { 
      return value[1].toFixed(2);
    });

    return {
      domains: domains,
      costs: costs
    }
  }

  render() {
    return (
      <>
        <h2>Analytics Coponents</h2>
        {this.state.data && 
          (<Doughnut
            data={this.state.data}
            width={400}
            height={200}
            options={{ maintainAspectRatio: false }}
          />)}
      </>
    );
  }
}

export default AnalyticsComponent
