import React, { Component } from 'react'
import { Route as PublicRoute, Switch } from 'react-router-dom'
import Route from '../authenticate/route'

import Announcements from '../announcements'
import Crypto from '../cryptos/crypto'
import Cryptos from '../cryptos'
import Header from './header'
import Login from '../authenticate/login'
import Logout from '../authenticate/logout'
import Node from '../nodes/node'
import Nodes from '../nodes'
import Orders from '../orders'
import Users from '../users'
import Withdrawals from '../withdrawals'
import Transactions from '../transactions'
import Contacts from '../contacts'

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
            <Route exact path="/cryptos/:slug" component={Crypto}/>
            <Route exact path="/cryptos" component={Cryptos}/>
            <Route exact path="/nodes/:slug" component={Node}/>
            <Route exact path="/nodes" component={Nodes}/>
            <Route exact path="/users" component={Users}/>
            <Route exact path="/withdrawals" component={Withdrawals}/>
            <Route exact path="/transactions" component={Transactions}/>
            <Route exact path="/contacts" component={Contacts}/>
            <Route exact path="/orders" component={Orders}/>
            <Route exact path="/announcements" component={Announcements}/>
          </Switch>
        </main>
      </Container>
    )
  }
}
