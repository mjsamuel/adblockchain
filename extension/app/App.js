import React from 'react'
import { Router, Route } from 'react-router-dom'
import { createMemoryHistory } from 'history'
import LoginComponent from './components/LoginComponent.js'

class App extends React.Component {

  render() {
    const history = createMemoryHistory()

    return (
      <div>
        <Router history={history}>
           <Route exact path='/' component={LoginComponent} />
        </Router>
      </div>
    );
  }
}

export default App;
