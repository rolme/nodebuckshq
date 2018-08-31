import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { NavHashLink as NavLink } from 'react-router-hash-link'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { Collapse, NavbarToggler } from 'reactstrap'

import { fetchCryptos } from '../../reducers/cryptos'
import { fetchNodes } from '../../reducers/nodes'
import { fetchUsers } from '../../reducers/users'
import { fetchWithdrawals } from '../../reducers/withdrawals'
import { fetchTransactions } from '../../reducers/transactions'
import { fetchContacts } from '../../reducers/contacts'
import { fetchOrders } from '../../reducers/orders'

class Header extends Component {
  constructor(props) {
    super(props)
    this.state = {
      collapsed: true
    };
    this.toggle = this.toggle.bind(this)
    this.toggleNavbar = this.toggleNavbar.bind(this)
  }

  componentWillMount() {
    let { cryptos, nodes, user, users, transactions, contacts, orders } = this.props

    if ( cryptos.length === 0 && user !== null ) {
      this.props.fetchCryptos()
    }

    if ( nodes.length === 0 && user !== null ) {
      this.props.fetchNodes()
    }

    if ( users.length === 0 && user !== null ) {
      this.props.fetchUsers()
    }

    if ( transactions.length === 0 && user !== null ) {
      this.props.fetchTransactions()
    }

    if ( contacts.length === 0 && user !== null ) {
      this.props.fetchContacts()
    }

    if ( orders.length === 0 && user !== null ) {
      this.props.fetchOrders()
    }
  }

  toggle(name) {
    let dropdownItems = this.state.dropdownItems
    dropdownItems[ name ] = !dropdownItems[ name ]
    this.setState({ dropdownItems })
  }

  toggleNavbar(value) {
    value = (value && typeof(value) === 'boolean') || !this.state.collapsed
    this.setState({
      collapsed: value
    })
  }

  render() {
    return (
      <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top pb-70">
        <NavLink to="/" className="navbar-brand">
          Nodebucks HQ
        </NavLink>
        <NavbarToggler onClick={this.toggleNavbar} className="mr-2"/>
        <Collapse isOpen={!this.state.collapsed} navbar>
          <div className="navbar-nav mr-auto">
            {this.displayLoginLink()}
          </div>
        </Collapse>
      </nav>
    )
  }

  displayLoginLink() {
    const { cryptos, nodes, user, users, withdrawals, transactions, contacts, orders announcements } = this.props
    const pendingTransactions = transactions.filter(transaction => transaction.status === 'pending')
    let navigation = []
    if ( !!user ) {
      navigation.push(<NavLink key="cryptos" onClick={() => this.toggleNavbar(true)} to="/cryptos" exact={true} className="headerMenuItem nav-item nav-link">Cryptos ({cryptos.length})</NavLink>)
      navigation.push(<NavLink key="nodes" onClick={() => this.toggleNavbar(true)} to="/nodes" exact={true} className="headerMenuItem nav-item nav-link">Nodes ({nodes.length})</NavLink>)
      navigation.push(<NavLink key="withdrawals" onClick={() => this.toggleNavbar(true)} to="/withdrawals" exact={true} className="headerMenuItem nav-item nav-link">Withdrawals ({withdrawals.filter(i => i.status === 'pending').length})</NavLink>)
      navigation.push(<NavLink key="users" onClick={() => this.toggleNavbar(true)} to="/users" exact={true} className="headerMenuItem nav-item nav-link">Users ({users.length})</NavLink>)
      navigation.push(<NavLink key="transactions" onClick={() => this.toggleNavbar(true)} to="/transactions" exact={true} className="headerMenuItem nav-item nav-link">Transactions ({pendingTransactions.length})</NavLink>)
      navigation.push(<NavLink key="announcements" onClick={() => this.toggleNavbar(true)} to="/announcements" exact={true} className="headerMenuItem nav-item nav-link">Announcements</NavLink>)
      navigation.push(<NavLink key="contacts" onClick={() => this.toggleNavbar(true)} to="/contacts" exact={true} className="headerMenuItem nav-item nav-link">Contacts ({contacts.length})</NavLink>)
      navigation.push(<NavLink key="orders" onClick={() => this.toggleNavbar(true)} to="/orders" exact={true} className="headerMenuItem nav-item nav-link">Orders ({orders.length})</NavLink>)
      navigation.push(<NavLink key="logout" onClick={() => this.toggleNavbar(true)} to="/logout" className="nav-link nav-item" activeClassName="active">Logout</NavLink>)
      return (navigation)
    }
    return (<div></div>)
  }
}

const mapStateToProps = state => ({
  cryptos: state.cryptos.list,
  nodes: state.nodes.list,
  user: state.user.data,
  transactions: state.transactions.list,
  users: state.users.list,
  withdrawals: state.withdrawals.list,
  contacts: state.contacts.list,
  orders: state.orders.list
})

const mapDispatchToProps = dispatch => bindActionCreators({
  fetchCryptos,
  fetchNodes,
  fetchUsers,
  fetchWithdrawals,
  fetchTransactions,
  fetchContacts,
  fetchOrders
}, dispatch)

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(Header))
