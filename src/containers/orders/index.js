import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Table } from 'reactstrap'
import { valueFormat } from '../../lib/helpers'

import {
  fetchOrders,
} from '../../reducers/orders'

class Orders extends Component {

  componentWillMount() {
    this.props.fetchOrders()
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
          <Table striped hover responsive>
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
            </tr>
            </thead>
            <tbody>
            {this.displayOrders(list)}
            </tbody>
          </Table>
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
        <tr key={order.orderId} onClick={() => this.props.history.push('/orders/' + slug)}  style={{ cursor: 'pointer' }}>
          <td style={{ verticalAlign: 'middle' }}>{date}</td>
          <td style={{ verticalAlign: 'middle' }}>{orderId}</td>
          <td style={{ verticalAlign: 'middle' }}>{slug}</td>
          <td style={{ verticalAlign: 'middle' }}>{username} ({email})</td>
          <td style={{ verticalAlign: 'middle' }}>{masternode}</td>
          <td style={{ verticalAlign: 'middle' }}>{orderType}</td>
          <td style={{ verticalAlign: 'middle' }}>$ {valueFormat(amount, 2)}</td>
          <td style={{ verticalAlign: 'middle' }}>{status}</td>
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
