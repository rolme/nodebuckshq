import React, { Component } from 'react'
import { Route as PublicRoute, Switch } from 'react-router-dom'
import Route from '../authenticate/route'

import Loadable from 'react-loadable'
import Loading from "../../components/loadingComponent"

import { withCookies } from 'react-cookie'

import { Container } from 'reactstrap'

import { setReferer } from '../../lib/helpers'

const Announcements = Loadable({ loader: () => import('../announcements'), loading: Loading })
const Crypto = Loadable({ loader: () => import('../cryptos/crypto'), loading: Loading })
const Cryptos = Loadable({ loader: () => import('../cryptos'), loading: Loading })
const CryptoEdit = Loadable({ loader: () => import('../cryptos/edit'), loading: Loading })
const Header = Loadable({ loader: () => import('./header'), loading: Loading })
const Login = Loadable({ loader: () => import('../authenticate/login'), loading: Loading })
const Logout = Loadable({ loader: () => import('../authenticate/logout'), loading: Loading })
const Node = Loadable({ loader: () => import('../nodes/node'), loading: Loading })
const Nodes = Loadable({ loader: () => import('../nodes'), loading: Loading })
const Orders = Loadable({ loader: () => import('../orders'), loading: Loading })
const Order = Loadable({ loader: () => import('../orders/order'), loading: Loading })
const Users = Loadable({ loader: () => import('../users'), loading: Loading })
const Withdrawals = Loadable({ loader: () => import('../withdrawals'), loading: Loading })
const Withdrawal = Loadable({ loader: () => import('../withdrawals/withdrawal'), loading: Loading })
const Transactions = Loadable({ loader: () => import('../transactions'), loading: Loading })
const Contacts = Loadable({ loader: () => import('../contacts'), loading: Loading })
const Verifications = Loadable({ loader: () => import('../verifications'), loading: Loading })

class App extends Component {
  componentDidMount() {
    const { cookies } = this.props
    setReferer(cookies)
  }

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
            <Route exact path="/cryptos/:slug/edit" component={CryptoEdit}/>
            <Route exact path="/cryptos" component={Cryptos}/>
            <Route exact path="/nodes/:slug" component={Node}/>
            <Route exact path="/nodes" component={Nodes}/>
            <Route exact path="/users" component={Users}/>
            <Route exact path="/withdrawals" component={Withdrawals}/>
            <Route exact path="/withdrawals/:slug" component={Withdrawal}/>
            <Route exact path="/transactions" component={Transactions}/>
            <Route exact path="/contacts" component={Contacts}/>
            <Route exact path="/orders" component={Orders}/>
            <Route exact path="/orders/:slug" component={Order}/>
            <Route exact path="/announcements" component={Announcements}/>
            <Route exact path="/verifications" component={Verifications}/>
          </Switch>
        </main>
      </Container>
    )
  }
}

export default withCookies(App)
