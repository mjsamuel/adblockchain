import React from 'react'
import { Router, Route } from 'react-router-dom'
import { createMemoryHistory } from 'history'
import LoginComponent from './components/LoginComponent.js'
import './css/App.css'

class App extends React.Component {

  render() {
    const history = createMemoryHistory()

    return (
      <div className="App">
        <Router history={history}>
           <Route exact path='/' component={LoginComponent} />
        </Router>
      </div>
    );
  }
}

export default App;
