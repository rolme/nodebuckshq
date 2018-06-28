import React, { Component } from 'react'
import { Route as PublicRoute, Switch } from 'react-router-dom'
import Route from '../authenticate/route'

import Crypto from '../cryptos/crypto'
import Cryptos from '../cryptos'
import Nodes from '../nodes'
import Header from './header'
import Login from '../authenticate/login'
import Logout from '../authenticate/logout'
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
            <Route exact path="/" component={Users}/>
            <Route exact path="/cryptos" component={Cryptos}/>
            <Route exact path="/nodes" component={Nodes}/>
            <Route exact path="/users" component={Users}/>
            <Route exact path="/cryptos/:slug" component={Crypto}/>
          </Switch>
        </main>
      </Container>
    )
  }
}
