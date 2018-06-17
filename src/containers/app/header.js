import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { NavHashLink as NavLink } from 'react-router-hash-link'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { Collapse, NavbarToggler } from 'reactstrap'

import { fetchFeedback } from '../../reducers/feedback'
import { fetchListings } from '../../reducers/listing'
import { fetchSubscribers } from '../../reducers/subscribers'
import { fetchUsers } from '../../reducers/users'

class Header extends Component {
  constructor(props) {
    super(props)
    this.state = {
      collapsed: true
    };
    this.toggle = this.toggle.bind(this)
    this.toggleNavbar = this.toggleNavbar.bind(this)
  }

  componentWillMount(nextProps) {
    let { feedback, listings, users, subscribers, user } = this.props

    if (feedback.length === 0 && user !== null) {
      this.props.fetchFeedback()
    }

    if (listings.length === 0 && user !== null) {
      this.props.fetchListings()
    }

    if (subscribers.length === 0 && user !== null) {
      this.props.fetchSubscribers()
    }

    if (users.length === 0 && user !== null) {
      this.props.fetchUsers()
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
          <img src="/assets/images/logo.svg" alt="logo" width="142px" height="40px"/> HQ
        </NavLink>
        <NavbarToggler onClick={this.toggleNavbar} className="mr-2" />
        <Collapse isOpen={!this.state.collapsed} navbar>
          <div className="navbar-nav mr-auto">
            {this.displayLoginLink()}
          </div>
        </Collapse>
      </nav>
    )
  }

  displayLoginLink() {
    const { feedback, listings, user, users, subscribers } = this.props

    let navigation = []
    if ( !!user ) {
      navigation.push(<NavLink key="reports" onClick={() => this.toggleNavbar(true)} to="/reports" exact={true} className="headerMenuItem nav-item nav-link">Reports</NavLink>)
      navigation.push(<NavLink key="metrics" onClick={() => this.toggleNavbar(true)} to="/metrics" exact={true} className="headerMenuItem nav-item nav-link">Metrics</NavLink>)
      navigation.push(<NavLink key="feedback" onClick={() => this.toggleNavbar(true)} to="/feedback" exact={true} className="headerMenuItem nav-item nav-link">Feedback ({feedback.length})</NavLink>)
      navigation.push(<NavLink key="listing" onClick={() => this.toggleNavbar(true)} to="/listing" exact={true} className="headerMenuItem nav-item nav-link">Listing ({listings.length})</NavLink>)
      navigation.push(<NavLink key="subscribers" onClick={() => this.toggleNavbar(true)} to="/subscribers" exact={true} className="headerMenuItem nav-item nav-link">Subscribers ({subscribers.length})</NavLink>)
      navigation.push(<NavLink key="users" onClick={() => this.toggleNavbar(true)} to="/users" exact={true} className="headerMenuItem nav-item nav-link">Users ({users.length})</NavLink>)
      navigation.push(<NavLink key="profile" onClick={() => this.toggleNavbar(true)} to="/profile" exact={true} className="headerMenuItem nav-item nav-link">{user.first} Profile</NavLink>)
      navigation.push(<NavLink key="logout" onClick={() => this.toggleNavbar(true)} to="/logout" className="nav-link nav-item" activeClassName="active">Logout</NavLink>)
      return (navigation)
    }
    return (<div></div>)
  }
}

const mapStateToProps = state => ({
  feedback: state.feedback.list,
  listings: state.listing.list,
  subscribers: state.subscribers.list,
  user: state.user.data,
  users: state.users.list
})

const mapDispatchToProps = dispatch => bindActionCreators({
  fetchFeedback,
  fetchListings,
  fetchSubscribers,
  fetchUsers
}, dispatch)

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(Header))
