import React from 'react'
import { Router, Route, Switch } from 'react-router-dom'
import { createMemoryHistory } from 'history'

import AuthenticatedRoute from './components/AuthenticatedRoute.js'
import LoginComponent from './components/LoginComponent.js'
import DashboardComponent from './components/DashboardComponent.js'

import './css/App.css'
import { IPFS } from './services/ipfs.js'
const ipfs = new IPFS();

class App extends React.Component {

  async componentDidMount(){
    await ipfs.clearDatabase();
    const data = await ipfs.getDatabse();
    console.log(data);
    console.log(Object.keys(data).length)
  }

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
