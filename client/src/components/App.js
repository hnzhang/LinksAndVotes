import React, { Component } from 'react';

import {Switch, Route} from 'react-router-dom';

import Header from './Header';
import LinkList from './LinkList';
import CreateLink from './CreateLink';
import Login from './Login';

class App extends Component {
  render() {
    return (
      <div>
        <Header/>
        <div>
          <Switch>
            <Route exact path="/" component={LinkList} />
            <Route exact path='/create' component={CreateLink} />
            <Route exact path='/login' component={Login} />
          </Switch>
        </div>
      </div>
    );
  }
}

export default App;
