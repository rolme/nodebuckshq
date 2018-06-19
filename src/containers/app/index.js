import React, { Component } from 'react'
import { Route as PublicRoute, Switch } from 'react-router-dom'
import Route from '../authenticate/route'

import Cryptos from '../cryptos'
import Header from './header'
import Login from '../authenticate/login'
import Logout from '../authenticate/logout'
import Users from '../users'
import Crypto from '../cryptos/crypto'

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
            <Route exact path="/" component={Users}/>
            <Route exact path="/cryptos" component={Cryptos}/>
            <Route exact path="/users" component={Users}/>
            <Route exact path="/cryptos/:slug" component={Crypto}/>
          </Switch>
        </main>
      </Container>
    )
  }
}
