import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { withRouter, NavLink } from 'react-router-dom'

import { Tabs, Tab } from 'react-bootstrap-tabs'

import {Table} from 'reactstrap'

import { fetchUsers } from '../../reducers/users'
import {
  fetchWithdrawals,
  updateWithdrawal
} from '../../reducers/withdrawals'

import moment from 'moment'

class Withdrawals extends Component {
  constructor(props) {
    super(props)
    this.state = {
      tab: 'Pending'
    }
  }

  componentWillMount() {
    const { list, user } = this.props

    if ( list.length <= 1 && user !== '' ) {
      this.props.fetchWithdrawals()
    }

    this.props.fetchUsers()
  }

  handleTabSelected(label) {
    this.setState({ tab: label })
  }

  handleCancelClick(slug) {
    if ( window.confirm("Are you sure you want to cancel?") ) {
      this.props.updateWithdrawal(slug, { status: 'cancelled' })
    }
  }

  handleProcessClick(slug) {
    this.props.updateWithdrawal(slug, { status: 'processed' })
  }

  render() {
    let { list, user, users } = this.props
    let { tab } = this.state

    if ( user === null || !users.length ) {
      return <div>Loading Withdrawals</div>
    }

    const filteredList = list.filter(item => item.status === tab.toLowerCase())
    return (
      <div className="row">
        <div className="col-12 px-5">
          <h2 className="mt-2">Withdrawals</h2>
          <Tabs onSelect={(idx, label) => this.setState({ tab: label })} selected={tab}>
            <Tab label="Pending">
              <Table striped responsive className="fullWidthTable mt-3">
                <thead>
                <tr>
                  <th>id</th>
                  <th>created at</th>
                  <th>user</th>
                  <th>balance</th>
                  <th>amount</th>
                  <th>status</th>
                  <th>action</th>
                </tr>
                </thead>
                <tbody>
                {this.displayPendingWithdrawals(filteredList)}
                </tbody>
              </Table>
            </Tab>
            <Tab label="Processed">
              <Table striped responsive className="fullWidthTable mt-3">
                <thead>
                <tr>
                  <th>id</th>
                  <th>user</th>
                  <th>balance</th>
                  <th>amount</th>
                  <th>created at</th>
                  <th>processed at</th>
                </tr>
                </thead>
                <tbody>
                {this.displayProcessedWithdrawals(filteredList)}
                </tbody>
              </Table>
            </Tab>
            <Tab label="Cancelled">
              <Table striped responsive className="fullWidthTable mt-3">
                <thead>
                <tr>
                  <th>id</th>
                  <th>user</th>
                  <th>balance</th>
                  <th>amount</th>
                  <th>created at</th>
                  <th>cancelled at</th>
                </tr>
                </thead>
                <tbody>
                {this.displayCancelledWithdrawals(filteredList)}
                </tbody>
              </Table>
            </Tab>
          </Tabs>
        </div>
      </div>
    )
  }

  displayPendingWithdrawals(list) {
    return list.map(item => {
      const date = !!item.createdAt ? moment(item.createdAt).format("MMM D, YYYY  HH:mm") : '-'
      return (
        <tr key={item.slug}>
          <td><NavLink to={`/withdrawals/${item.slug}`}>{item.id}</NavLink></td>
          <td>{date}</td>
          <td>
            {item.user.fullName}<br/>
            ({item.user.email})
          </td>
          <td>
            <ul>
              {!!item.balances && item.balances.map(balance => {
                return <li key={balance.symbol}>{(+balance.value).toFixed(3)} {balance.symbol} ($ {(+balance.usd).toFixed(2)} )</li>
              })}
              {!!item.affiliateBalance &&
              <li key = 'affiliateBalance'>Affiliate btc ($ {(+item.affiliateBalance).toFixed(2)})</li>
              }
            </ul>
          </td>
          <td>$ {(+item.amount.usd).toFixed(2)}</td>
          <td>{item.status}</td>
          <td>
            <button onClick={this.handleProcessClick.bind(this, item.slug)} className="btn btn-small btn-primary">Process</button>
            &nbsp;
            <button onClick={this.handleCancelClick.bind(this, item.slug)} className="btn btn-small btn-secondary">Cancel</button>
          </td>
        </tr>
      )
    })
  }

  displayProcessedWithdrawals(list) {
    return list.map(item => {
      const createdAt = !!item.createdAt ? moment(item.createdAt).format("MMM D, YYYY  HH:mm") : '-'
      const processedAt = !!item.processedAt ? moment(item.processedAt).format("MMM D, YYYY  HH:mm") : '-'
      return (
        <tr key={item.slug}>
          <td><NavLink to={`/withdrawals/${item.slug}`}>{item.id}</NavLink></td>
          <td>
            {item.user.fullName}<br/>
            ({item.user.email})
          </td>
          <td>
            <ul>
              {!!item.balances && item.balances.map(balance => {
                return <li key={balance.symbol}>{(+balance.value).toFixed(3)} {balance.symbol} ($ {(+balance.usd).toFixed(2)} )</li>
              })}
              {!!item.affiliateBalance &&
              <li key = 'affiliateBalance'>Affiliate btc ($ {(+item.affiliateBalance).toFixed(2)})</li>
              }
            </ul>
          </td>
          <td>$ {(+item.amount.usd).toFixed(2)}</td>
          <td>{createdAt}</td>
          <td>{processedAt}</td>
        </tr>
      )
    })
  }

  displayCancelledWithdrawals(list) {
    return list.map(item => {
      const createdAt = !!item.createdAt ? moment(item.createdAt).format("MMM D, YYYY  HH:mm") : '-'
      const cancelledAt = !!item.cancelledAt ? moment(item.cancelledAt).format("MMM D, YYYY  HH:mm") : '-'
      return (
        <tr key={item.slug}>
          <td><NavLink to={`/withdrawals/${item.slug}`}>{item.id}</NavLink></td>
          <td>
            {item.user.fullName}<br/>
            ({item.user.email})
          </td>
          <td>
            <ul>
              {!!item.balances && item.balances.map(balance => {
                return <li key={balance.symbol}>{(+balance.value).toFixed(3)} {balance.symbol} ($ {(+balance.usd).toFixed(2)} )</li>
              })}
              {!!item.affiliateBalance &&
              <li key = 'affiliateBalance'>Affiliate btc ($ {(+item.affiliateBalance).toFixed(2)})</li>
              }
            </ul>
          </td>
          <td>$ {(+item.amount.usd).toFixed(2)}</td>
          <td>{createdAt}</td>
          <td>{cancelledAt}</td>
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
