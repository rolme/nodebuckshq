import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import moment from 'moment'

import {
  fetchOrders
} from '../../reducers/orders'

class Orders extends Component {
  componentWillMount() {
    this.props.fetchOrders()
  }

  sortData(data) {
    return data.sort((a, b) => {
      if ( a.status === b.status ) {
        return moment(b.node.createdAt) - moment(a.node.createdAt)
      } else if ( a.status === 'unpaid' ) {
        return -1
      }
      return 1
    })
  }

  render() {
    let { list } = this.props

    if ( list === null ) {
      return <div>Loading Orders</div>
    } else {
      list = this.sortData(list)
    }

    return (
      <div className="row">
        <div className="offset-1 col-10">
          <h2 className="mt-2">Orders ({list.length})</h2>
          <table className="table table-striped">
            <thead>
            <tr>
              <th>date</th>
              <th>username</th>
              <th>masternode</th>
              <th>type</th>
              <th>amount</th>
              <th>status</th>
            </tr>
            </thead>
            <tbody>
            {this.displayOrders(list)}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  displayOrders(list) {
    return list.map(order => {
      const date = !!order.node ? order.node.createdAt : '-',
        username = !!order.user ? order.user.first : '-',
        email = !!order.user ? order.user.email : '',
        masternode = !!order.node && !!order.node.crypto ? order.node.crypto.name + ' (' + order.node.slug + ')' : '-',
        { orderType, amount, status } = order;
      return (
        <tr key={order.orderId}>
          <td style={{ verticalAlign: 'middle' }}>{date}</td>
          <td>{username} ({email})</td>
          <td>{masternode}</td>
          <td>{orderType}</td>
          <td>{amount}</td>
          <td>{status}</td>
        </tr>
      )
    })
  }
}

const mapStateToProps = state => ({
  list: state.orders.list
})

const mapDispatchToProps = dispatch => bindActionCreators({
  fetchOrders
}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Orders)
