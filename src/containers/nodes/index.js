import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { withRouter, NavLink } from 'react-router-dom'
import { Alert } from 'reactstrap'

import {
  fetchNodes,
  clearMessages
} from '../../reducers/nodes'

class Nodes extends Component {
  constructor(props) {
    super(props)
    this.toggleAlert = this.toggleAlert.bind(this)
  }

  componentWillMount() {
    const { list, user } = this.props

    if ( list.length <= 1 && user !== '' ) {
      this.props.fetchNodes()
    }
  }

  toggleAlert() {
    this.props.clearMessages()
  }

  render() {
    let { list, user, message, error } = this.props

    if ( user === null || list === null ) {
      return <div>Loading Nodes</div>
    }

    return (
      <div className="row">
        <div className="col-8 offset-2">
          <Alert color={error ? 'danger' : 'success'} isOpen={!!message} toggle={this.toggleAlert}>
            {message}
          </Alert>
        </div>
        <div className="offset-1 col-10">
          <h2 className="mt-2">Nodes ({list.length})</h2>
          <table className="table table-striped">
            <thead>
            <tr>
              <th>id</th>
              <th>owner</th>
              <th>type</th>
              <th>status</th>
            </tr>
            </thead>
            <tbody>
            {this.displayNodes(list)}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  displayNodes(list) {
    return list.map(item => {
      return (
        <tr key={item.slug}>
          <td><NavLink to={`/nodes/${item.slug}`}>{item.slug.toUpperCase()}</NavLink></td>
          <td style={{ verticalAlign: 'middle' }}>{item.owner.fullName}</td>
          <td>{item.crypto.name}</td>
          <td>
            { !item.deletedAt && this.displayBadge(item) }
            { !!item.deletedAt && <span className="badge badge-danger ml-1">Deleted</span> }
          </td>
        </tr>
      )
    })
  }

  displayBadge(node) {
    if ( node.status === 'online' ) {
      return <span className="badge badge-success">{node.status}</span>
    } else if ( node.status === 'offline' ) {
      return <span className="badge badge-danger">{node.status}</span>
    }
    return <span className="badge badge-secondary">{node.status}</span>
  }
}

const mapStateToProps = state => ({
  list: state.nodes.list,
  user: state.user.user,
  message: state.nodes.message,
  error: state.nodes.error
})

const mapDispatchToProps = dispatch => bindActionCreators({
  fetchNodes,
  clearMessages
}, dispatch)

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Nodes))
