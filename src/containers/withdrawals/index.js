import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { withRouter, NavLink } from 'react-router-dom'

import {
  fetchWithdrawals,
  updateWithdrawal
} from '../../reducers/withdrawals'

class Withdrawals extends Component {
  componentWillMount() {
    const { list, user } = this.props

    if (list.length <= 1 && user !== '') {
      this.props.fetchWithdrawals()
    }
  }

  handleCancelClick(slug) {
    this.props.updateWithdrawal(slug, {status: 'cancelled'})
  }

  handleProcessClick(slug) {
    this.props.updateWithdrawal(slug, {status: 'processed'})
  }

  render() {
    let { list, user } = this.props

    if (user === null || list === null) {
      return <div>Loading Withdrawals</div>
    }

    return(
      <div className="row">
        <div className="offset-1 col-10">
          <h2 className="mt-2">Withdrawals ({list.length})</h2>
          <table className="table table-striped">
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
              {this.displayWithdrawals(list)}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  displayWithdrawals(list) {
    return list.map(item => {
      return(
        <tr key={item.slug}>
          <td><NavLink to={`/withdrawals/${item.slug}`}>{item.slug.toUpperCase().substring(0, 5)}...</NavLink></td>
          <td style={{verticalAlign: 'middle'}}>
            {item.owner.fullName}<br/>
            ({item.owner.email})
          </td>
          <td>{item.balance} {item.crypto.symbol}</td>
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
}

const mapStateToProps = state => ({
  list: state.withdrawals.list,
  user: state.user.user
})

const mapDispatchToProps = dispatch => bindActionCreators({
  fetchWithdrawals,
  updateWithdrawal
}, dispatch)

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Withdrawals))
