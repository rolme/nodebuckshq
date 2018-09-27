import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { valueFormat } from '../../lib/helpers'
import { Table, Button } from 'reactstrap'

import {
  fetchOrder,
  orderPaid,
  orderUnpaid,
} from '../../reducers/orders'

class Order extends Component {
  componentWillMount() {
    let { match: { params } } = this.props
    this.props.fetchOrder(params.slug)
  }

  togglePaid = (status, slug) => {
    status === 'unpaid' ? this.props.orderPaid(slug) : this.props.orderUnpaid(slug)
  }

  displayOrderData(order) {
    const { orderId, slug, description, orderType, paymentMethod, status } = order,
      date = order.node.createdAt,
      amount = valueFormat(order.amount, 2)
    return (
      <tr>
        <td>{orderId}</td>
        <td>{date}</td>
        <td>{slug}</td>
        <td>{description}</td>
        <td>${amount}</td>
        <td>{orderType}</td>
        <td>{paymentMethod}</td>
        <td>{status}</td>
        <td>
          <Button onClick={() => this.togglePaid(status, slug)}>
            {status === 'unpaid' ? 'Paid' : 'Unpaid'}
          </Button>
        </td>
      </tr>
    )
  }

  displayNodeData(node) {
    const { id, slug, status } = node,
      name = node.crypto.name,
      value = valueFormat(node.value, 2),
      cost = valueFormat(node.cost, 2)
    return (
      <tr>
        <td>{id}</td>
        <td>{name}</td>
        <td>{slug}</td>
        <td>${value}</td>
        <td>${cost}</td>
        <td>{status}</td>
      </tr>
    )
  }

  displayUserData(user) {
    const { email, slug } = user,
      name = user.fullName
    return (
      <tr>
        <td>{name}</td>
        <td>{email}</td>
        <td>{slug}</td>
      </tr>
    )
  }

  render() {
    const { match: { params }, order, pending } = this.props

    if ( pending || order.slug === undefined ) {
      return <h4 className="pt-3">Loading {params.slug}... </h4>
    }

    return (
      <div className="row">
        <div className="offset-1 col-10">
          <h2 className="mt-2">Order ({order.slug})</h2>
          <Table striped>
            <thead>
            <tr>
              <th>Id</th>
              <th>Date</th>
              <th>Slug</th>
              <th>Description</th>
              <th>Amount</th>
              <th>Type</th>
              <th>Payment Method</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
            </thead>
            <tbody>
            {this.displayOrderData(order)}
            </tbody>
          </Table>
        </div>
        <div className="offset-1 col-5 mt-4">
          <h2 className="mt-2">Node ({order.node.crypto.name})</h2>
          <Table striped>
            <thead>
            <tr>
              <th>Id</th>
              <th>Name</th>
              <th>Slug</th>
              <th>Value</th>
              <th>Cost</th>
              <th>Status</th>
            </tr>
            </thead>
            <tbody>
            {this.displayNodeData(order.node)}
            </tbody>
          </Table>
        </div>
        <div className="offset-1 col-4 mt-4">
          <h2 className="mt-2">User</h2>
          <Table striped>
            <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Slug</th>
            </tr>
            </thead>
            <tbody>
            {this.displayUserData(order.user)}
            </tbody>
          </Table>
        </div>
      </div>
    )
  }

}

const mapStateToProps = state => ({
  order: state.orders.data,
  error: state.orders.error,
  message: state.orders.message,
  pending: state.orders.pending
})

const mapDispatchToProps = dispatch => bindActionCreators({
  fetchOrder,
  orderPaid,
  orderUnpaid,
}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Order)
