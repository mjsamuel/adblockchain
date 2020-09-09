import React from 'react'
import { Router, Route, Switch } from 'react-router-dom'
import { createMemoryHistory } from 'history'

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
             <Route exact path='/' component={LoginComponent} />
             <Route path='/login' component={LoginComponent} />
             <Route path='/dashboard' component={DashboardComponent} />
           </Switch>
        </Router>
      </div>
    );
  }
}

export default App;
