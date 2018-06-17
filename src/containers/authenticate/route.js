import React, { Component } from 'react'
import { Redirect, Route as PublicRoute, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import {
  isAuthenticated,
} from '../../reducers/user'

class Route extends Component {
  constructor(props) {
    super(props)

    this.state = {
      redirect: true
    }
  }

  componentWillMount() {
    let { isAuthenticated } = this.props
    this.setState({ redirect: !isAuthenticated() })
  }

  componentWillReceiveProps() {
    let { isAuthenticated } = this.props
    this.setState({ redirect: !isAuthenticated() })
  }

  renderOrRedirect(ownProps) {
    let { component: Component } = this.props
    let { redirect } = this.state

    if (redirect) {
      return <Redirect to={{
        pathname: '/login',
        state: { from: ownProps.location }
      }}/>
    }

    return <Component {... ownProps} />
  }

  render() {
    let { path } = this.props
    return <PublicRoute path={path} render={this.renderOrRedirect.bind(this)}/>
  }
}

function mapStateToProps(state, ownProps) {
  return {
    token: state.user.token
  }
}

const mapDispatchToProps = dispatch => bindActionCreators({
  isAuthenticated
}, dispatch)

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Route))
