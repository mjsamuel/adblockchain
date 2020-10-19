import React from 'react'
import { Router, Route, Switch } from 'react-router-dom'
import { createMemoryHistory } from 'history'

import AuthenticatedRoute from './components/AuthenticatedRoute.js'
import LoginComponent from './components/LoginComponent.js'
import DashboardComponent from './components/DashboardComponent.js'
import AnalyticsComponent from './components/AnalyticsComponent.js'

import './css/App.css'
import { IPFS } from './services/ipfs.js'
const ipfs = new IPFS();

class App extends React.Component {
  render() {
    const history = createMemoryHistory()
    return (
      <>
        <Router history={history}>
           <Switch>
             <AuthenticatedRoute exact path='/' component={DashboardComponent} />
             <Route path='/login' component={LoginComponent} />
             <AuthenticatedRoute exact path='/analytics' component={AnalyticsComponent} />
           </Switch>
        </Router>
      </>
    );
  }
}

export default App;
