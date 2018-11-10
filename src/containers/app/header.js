import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { NavHashLink as NavLink } from 'react-router-hash-link'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { fetchNodes } from '../../reducers/nodes'
import { fetchUsers } from '../../reducers/users'
import { fetchWithdrawals } from '../../reducers/withdrawals'
import { fetchTransactions } from '../../reducers/transactions'
import { fetchContacts } from '../../reducers/contacts'
import { fetchOrders } from '../../reducers/orders'
import { fetchCounts } from '../../reducers/counts'

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
    let { nodes, user, users, transactions, contacts, orders, verifications } = this.props

    this.props.fetchCounts();

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

    if ( verifications.length === 0 && user !== null ) {
      this.props.fetchUsers(true)
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
      <aside className="p-0 bg-light">
        <nav className="navbar navbar-expand navbar-light bg-light flex-column align-items-start py-2 px-0">
          <NavLink to="/" className="navbar-brand px-4">
            Nodebucks HQ
          </NavLink>
          <div className="collapse navbar-collapse">
            <ul className="flex-column navbar-nav w-100 justify-content-between">
              {this.displayLoginLink()}
            </ul>
          </div>
        </nav>
      </aside>
    )
  }

  displayLoginLink() {
    const { counts, user } = this.props
    const { pathname } = this.props.location
    let navigation = []

    if ( !!user ) {
      navigation.push(<li key="cryptos"><NavLink onClick={() => this.toggleNavbar(true)} to="/cryptos" exact={true} className={`sideBarItem nav-item nav-link ${pathname.includes('cryptos') ? 'active' : ''}`}>Cryptos ({counts.cryptos})</NavLink></li>)
      navigation.push(<li key="nodes"><NavLink onClick={() => this.toggleNavbar(true)} to="/nodes" exact={true} className={`sideBarItem nav-item nav-link ${pathname.includes('nodes') ? 'active' : ''}`}>Nodes ({counts.nodes})</NavLink></li>)
      navigation.push(<li key="withdrawals"><NavLink onClick={() => this.toggleNavbar(true)} to="/withdrawals" exact={true} className={`sideBarItem nav-item nav-link ${pathname.includes('withdrawals') ? 'active' : ''}`}>Withdrawals ({counts.pendingWithdrawals} pending)</NavLink></li>)
      navigation.push(<li key="users"><NavLink onClick={() => this.toggleNavbar(true)} to="/users" exact={true} className={`sideBarItem nav-item nav-link ${pathname.includes('users') ? 'active' : ''}`}>Users ({counts.users})</NavLink></li>)
      navigation.push(<li key="verifications"><NavLink onClick={() => this.toggleNavbar(true)} to="/verifications" className={`sideBarItem nav-item nav-link ${pathname.includes('verifications') ? 'active' : ''}`} activeClassName="active">Verifications ({counts.verifications})</NavLink></li>)
      navigation.push(<li key="transactions"><NavLink onClick={() => this.toggleNavbar(true)} to="/transactions" exact={true} className={`sideBarItem nav-item nav-link ${pathname.includes('transactions') ? 'active' : ''}`}>Transactions ({counts.pendingTransactions} pending)</NavLink></li>)
      navigation.push(<li key="contacts"><NavLink onClick={() => this.toggleNavbar(true)} to="/contacts" exact={true} className={`sideBarItem nav-item nav-link ${pathname.includes('contacts') ? 'active' : ''}`}>Contacts ({counts.contacts})</NavLink></li>)
      navigation.push(<li key="orders"><NavLink onClick={() => this.toggleNavbar(true)} to="/orders" exact={true} className={`sideBarItem nav-item nav-link ${pathname.includes('orders') ? 'active' : ''}`}>Orders ({counts.unpaidOrders} unpaid)</NavLink></li>)
      navigation.push(<li key="announcements"><NavLink onClick={() => this.toggleNavbar(true)} to="/announcements" exact={true} className={`sideBarItem nav-item nav-link ${pathname.includes('announcements') ? 'active' : ''}`}>Announcements</NavLink></li>)
      navigation.push(<li key="system"><NavLink onClick={() => this.toggleNavbar(true)} to="/system" exact={true} className={`sideBarItem nav-item nav-link ${pathname.includes('system') ? 'active' : ''}`}>System Info</NavLink></li>)
      navigation.push(<li key="logout"><NavLink onClick={() => this.toggleNavbar(true)} to="/logout" className={`sideBarItem nav-item nav-link ${pathname.includes('logout') ? 'active' : ''}`} activeClassName="active">Logout</NavLink></li>)
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
  orders: state.orders.list,
  verifications: state.users.verifications,
  counts: state.counts.data,
})

const mapDispatchToProps = dispatch => bindActionCreators({
  fetchNodes,
  fetchUsers,
  fetchWithdrawals,
  fetchTransactions,
  fetchContacts,
  fetchOrders,
  fetchCounts,
}, dispatch)

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(Header))
