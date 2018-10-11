import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import {
  fetchUser
} from '../../reducers/users'

import {
  fetchNodes
} from '../../reducers/nodes'

import { Table, Alert } from 'reactstrap'

class User extends Component {
  constructor(props) {
    super(props)
    this.toggleAlert = this.toggleAlert.bind(this)
  }

  componentWillMount() {
    let { match: { params }, nodes } = this.props
    this.props.fetchUser(params.slug)
    !nodes.length && this.props.fetchNodes()
  }

  toggleAlert() {
    this.props.clearMessages()
  }

  render() {
    const { match: { params }, user, nodes, pending, error, message } = this.props

    if ( pending || user.slug === undefined ) {
      return <h4 className="pt-3">Loading {params.slug}... </h4>
    }

    return (
      <div>
        <div className="col-12 mt-2">
          <Alert color={error ? 'danger' : 'success'} isOpen={!!message} toggle={this.toggleAlert}>
            {message}
          </Alert>
          <div className="col-10 offset-1 px-5">
            <h2 className="mt-2">User</h2>
            <Table responsive striped>
              <thead>
              <tr>
                <th> Name</th>
                <th> Email</th>
                <th> Btc Wallet</th>
                <th> Balances</th>
              </tr>
              </thead>
              <tbody>
              {this.renderUserData(user)}
              </tbody>
            </Table>
          </div>
          <div className="col-10 offset-1 px-5">
            <h2 className="mt-2">Nodes</h2>
            <Table responsive striped>
              <thead>
              <tr>
                <th> Id</th>
                <th> Date</th>
                <th> Type</th>
                <th> Status</th>
              </tr>
              </thead>
              <tbody>
              {this.renderNodesData(nodes)}
              </tbody>
            </Table>
          </div>
        </div>
      </div>
    )
  }

  renderUserData(user) {
    const { fullName, email, btcWallet, balances } = user
    return (
      <tr>
        <td>{fullName}</td>
        <td>{email}</td>
        <td>{btcWallet || '-'}</td>
        <td>
          <ul>
            {!!balances && balances.map(balance => {
              return <li key={balance.symbol}>
                {(+balance.value).toFixed(3)} {balance.symbol} ($ {(+balance.usd).toFixed(2)} ) fee ({balance.fee})
              </li>
            })}
          </ul>
        </td>
      </tr>
    )
  }
}

const mapStateToProps = state => ({
  user: state.users.data,
  nodes: state.nodes.list,
  error: state.users.error,
  message: state.users.message,
  pending: state.users.pending
})

const mapDispatchToProps = dispatch => bindActionCreators({
  fetchUser,
  fetchNodes,
}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(User)
