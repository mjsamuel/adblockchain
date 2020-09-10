import React from 'react'
import { Router, Route, Switch } from 'react-router-dom'
import { createMemoryHistory } from 'history'

import AuthenticatedRoute from './components/AuthenticatedRoute.js'
import LoginComponent from './components/LoginComponent.js'
import DashboardComponent from './components/DashboardComponent.js'

import './css/App.css'

class App extends React.Component {

  render() {
    const history = createMemoryHistory()

    return (
      <div className="App">
        <Router history={history}>
           <Switch>
             <AuthenticatedRoute exact path='/' component={DashboardComponent} />
             <Route path='/login' component={LoginComponent} />
           </Switch>
        </Router>
      </div>
    );
  }
}

export default App;
