import React, { Component } from 'react';

import {Switch, Route, Redirect} from 'react-router-dom';

import Header from './Header';
import LinkList from './LinkList';
import CreateLink from './CreateLink';
import Login from './Login';
import Search from './Search';
import Footer from './Footer';

class App extends Component {
  render() {
    return (
      <div>
        <Header/>
        <div className='ph3 pv1 background-gray'>
          <Switch>
            <Route exact path='/' render={()=> <Redirect to='/new/1' />} />
            <Route exact path='/top' component={LinkList} />
            <Route exact path="/new/:page" component={LinkList} />
            <Route exact path='/create' component={CreateLink} />
            <Route exact path='/login' component={Login} />
            <Route exact path='/search' component={Search} />
          </Switch>
        </div>
        <Footer />
      </div>
    );
  }
}

export default App;
