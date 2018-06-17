import React, { Component } from 'react'
import { Route as PublicRoute, Switch } from 'react-router-dom'
import Route from '../authenticate/route'

import Crypto from '../crypto'
import Reports from '../reports'
import Feedback from '../feedback'
import Header from './header'
import Listing from '../listing'
import Login from '../authenticate/login'
import Logout from '../authenticate/logout'
import Metrics from '../metrics'
import Profile from '../profile'
import Report from '../report/index'
import EditReport from '../report/edit'
import Subscribers from '../subscribers'
import Users from '../users'

import { Container } from 'reactstrap'

export default class App extends Component {
  render() {
    return (
      <Container fluid={true}>
        <Header/>
        <main>
          <PublicRoute exact path="/login" component={Login}/>
          <PublicRoute exact path="/logout" component={Logout}/>

          <Switch>
            <Route exact path="/" component={Reports}/>
            <Route exact path="/cryptos/:slug" component={Crypto}/>
            <Route exact path="/feedback" component={Feedback}/>
            <Route exact path="/listing" component={Listing}/>
            <Route exact path="/metrics" component={Metrics}/>
            <Route exact path="/profile" component={Profile}/>
            <Route exact path="/reports/:slug" component={Report}/>
            <Route exact path="/reports/:slug/edit" component={EditReport}/>
            <Route exact path="/reports" component={Reports}/>
            <Route exact path="/subscribers" component={Subscribers}/>
            <Route exact path="/users" component={Users}/>
          </Switch>
        </main>
      </Container>
    )
  }
}
