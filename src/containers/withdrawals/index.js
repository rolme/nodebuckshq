import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { withRouter, NavLink } from 'react-router-dom'

import { Tabs, Tab } from 'react-bootstrap-tabs'

import { fetchUsers } from '../../reducers/users'
import {
  fetchWithdrawals,
  updateWithdrawal
} from '../../reducers/withdrawals'

class Withdrawals extends Component {
  constructor(props) {
    super(props)
    this.state = {
      tab: 'Pending'
    }
  }

  componentWillMount() {
    const { list, user } = this.props

    if (list.length <= 1 && user !== '') {
      this.props.fetchWithdrawals()
    }

    this.props.fetchUsers()
  }

  handleTabSelected(label) {
    this.setState({tab: label})
  }

  handleCancelClick(slug) {
    this.props.updateWithdrawal(slug, {status: 'cancelled'})
  }

  handleProcessClick(slug) {
    this.props.updateWithdrawal(slug, {status: 'processed'})
  }

  handleUndoClick(slug) {
    this.props.updateWithdrawal(slug, {status: 'pending'})
  }

  render() {
    let { list, user, users } = this.props
    let { tab } = this.state

    if (user === null || !users.length) {
      return <div>Loading Withdrawals</div>
    }

    const filteredList = list.filter(item => item.status === tab.toLowerCase())
    return(
      <div className="row">
        <div className="offset-1 col-10">
          <h2 className="mt-2">Withdrawals</h2>
          <Tabs onSelect={(idx, label) => this.setState({tab: label})} selected={tab}>
            <Tab label="Pending">
              <table className="table table-striped mt-3">
                <thead>
                  <tr>
                    <th>id</th>
                    <th>user</th>
                    <th>balance</th>
                    <th>amount</th>
                    <th>requested at</th>
                    <th>status</th>
                    <th>action</th>
                  </tr>
                </thead>
                <tbody>
                  {this.displayPendingWithdrawals(filteredList)}
                </tbody>
              </table>
            </Tab>
            <Tab label="Processed">
              <table className="table table-striped mt-3">
                <thead>
                  <tr>
                    <th>id</th>
                    <th>user</th>
                    <th>amount</th>
                    <th>requested at</th>
                    <th>processed at</th>
                    <th>action</th>
                  </tr>
                </thead>
                <tbody>
                  {this.displayProcessedWithdrawals(filteredList)}
                </tbody>
              </table>
            </Tab>
            <Tab label="Cancelled">
              <table className="table table-striped mt-3">
                <thead>
                  <tr>
                    <th>id</th>
                    <th>user</th>
                    <th>amount</th>
                    <th>requested at</th>
                    <th>cancelled at</th>
                    <th>action</th>
                  </tr>
                </thead>
                <tbody>
                  {this.displayCancelledWithdrawals(filteredList)}
                </tbody>
              </table>
            </Tab>
          </Tabs>
        </div>
      </div>
    )
  }

  displayPendingWithdrawals(list) {
    const { users } = this.props

    console.log("list:", list)
    return list.map(item => {
      const itemUser      = users.find(u => u.slug === item.owner.slug)
      const balance       = itemUser.balances.find(b => b.symbol === item.crypto.symbol)

      return(
        <tr key={item.slug}>
          <td><NavLink to={`/withdrawals/${item.slug}`}>{item.slug.toUpperCase().substring(0, 5)}...</NavLink></td>
          <td style={{verticalAlign: 'middle'}}>
            {item.owner.fullName}<br/>
            ({item.owner.email})
          </td>
          <td>{balance.value} {item.crypto.symbol}</td>
          <td>{item.amount} {item.crypto.symbol}</td>
          <td>{item.createdAt}</td>
          <td>{item.status}</td>
          <td>
            <button onClick={this.handleProcessClick.bind(this, item.slug)} className="btn btn-small btn-primary">Process</button>&nbsp;
            <button onClick={this.handleCancelClick.bind(this, item.slug)} className="btn btn-small btn-secondary">Cancel</button>
          </td>
        </tr>
      )
    })
  }

  displayProcessedWithdrawals(list) {
    return list.map(item => {
      return(
        <tr key={item.slug}>
          <td><NavLink to={`/withdrawals/${item.slug}`}>{item.slug.toUpperCase().substring(0, 5)}...</NavLink></td>
          <td style={{verticalAlign: 'middle'}}>
            {item.owner.fullName}<br/>
            ({item.owner.email})
          </td>
          <td>{item.amount} {item.crypto.symbol}</td>
          <td>{item.createdAt}</td>
          <td>{item.processedAt}</td>
            <td>
              <button onClick={this.handleUndoClick.bind(this, item.slug)} className="btn btn-small btn-primary">Undo</button>
            </td>
        </tr>
      )
    })
  }

  displayCancelledWithdrawals(list) {
    return list.map(item => {
      return(
        <tr key={item.slug}>
          <td><NavLink to={`/withdrawals/${item.slug}`}>{item.slug.toUpperCase().substring(0, 5)}...</NavLink></td>
          <td style={{verticalAlign: 'middle'}}>
            {item.owner.fullName}<br/>
            ({item.owner.email})
          </td>
          <td>{item.amount} {item.crypto.symbol}</td>
          <td>{item.createdAt}</td>
          <td>{item.cancelledAt}</td>
          <td>
            <button onClick={this.handleUndoClick.bind(this, item.slug)} className="btn btn-small btn-primary">Undo</button>
          </td>
        </tr>
      )
    })
  }
}

const mapStateToProps = state => ({
  list: state.withdrawals.list,
  user: state.user.data,
  users: state.users.list
})

const mapDispatchToProps = dispatch => bindActionCreators({
  fetchUsers,
  fetchWithdrawals,
  updateWithdrawal
}, dispatch)

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Withdrawals))
