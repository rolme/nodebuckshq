import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'

import { logout } from '../../reducers/user'

class Logout extends Component {
  componentWillMount() {
    let { user } = this.props

    if (user !== null) {
      this.props.logout()
    }
  }

  render() {
    return <Redirect to={{
      pathname: '/login',
      state: { from: this.props.location }
    }}/>
  }
}

const mapStateToProps = state => ({
  user: state.user.data
})

const mapDispatchToProps = dispatch => bindActionCreators({
  logout
}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Logout)
