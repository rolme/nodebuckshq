import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Button } from 'reactstrap'
import { valueFormat } from '../../lib/helpers'

import {
  fetchOrders,
  orderPaid,
  orderUnpaid,
} from '../../reducers/orders'

class Orders extends Component {

  componentWillMount() {
    this.props.fetchOrders()
  }

  tooglePaid = (status, slug) => {
    status === 'unpaid' ? this.props.orderPaid(slug) : this.props.orderUnpaid(slug)
  }

  render() {
    let { list } = this.props

    if ( list === null ) {
      return <div>Loading Orders</div>
    }

    return (
      <div className="row">
        <div className="offset-1 col-10">
          <h2 className="mt-2">Orders ({list.length})</h2>
          <table className="table table-striped">
            <thead>
            <tr>
              <th>Date</th>
              <th>Id</th>
              <th>Slug</th>
              <th>Username</th>
              <th>Masternode</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Action</th>
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
        { orderType, amount, status, slug, orderId } = order;
      return (
        <tr key={order.orderId} onClick={() => this.props.history.push('/orders/' + slug)}>
          <td style={{ verticalAlign: 'middle' }}>{date}</td>
          <td>{orderId}</td>
          <td>{slug}</td>
          <td>{username} ({email})</td>
          <td>{masternode}</td>
          <td>{orderType}</td>
          <td>$ {valueFormat(amount, 2)}</td>
          <td>{status}</td>
          <td>
            <Button onClick={() => this.tooglePaid(status, slug)}>
              {status === 'unpaid' ? 'Paid' : 'Unpaid'}
            </Button>
          </td>
        </tr>
      )
    })
  }
}

const mapStateToProps = state => ({
  list: state.orders.list
})

const mapDispatchToProps = dispatch => bindActionCreators({
  fetchOrders,
  orderPaid,
  orderUnpaid,
}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Orders)
