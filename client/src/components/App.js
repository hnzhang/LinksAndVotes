import React, { Component } from 'react';

import {Switch, Route} from 'react-router-dom';

import Header from './Header';
import LinkList from './LinkList';
import CreateLink from './CreateLink';

class App extends Component {
  render() {
    return (
      <div>
        <Header/>
        <div>
          <Switch>
            <Route exact path="/" component={LinkList} />
            <Route exact path='/create' component={CreateLink} />
          </Switch>
        </div>
      </div>
    );
  }
}

export default App;
