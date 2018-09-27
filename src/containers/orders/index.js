import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Table } from 'reactstrap'
import { valueFormat } from '../../lib/helpers'

import {
  fetchOrders,
} from '../../reducers/orders'
import qs from "query-string";

import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import { faAngleDown, faAngleUp } from '@fortawesome/fontawesome-free-solid'

class Orders extends Component {
  constructor(props) {
    super(props)
    this.state = {
      sortedColumnName: 'node.createdAt',
      isDescending: false,
    }
    this.onSortClick = this.onSortClick.bind(this)
  }

  componentWillMount() {
    this.props.fetchOrders()
  }

  onSortClick(columnName) {
    let { sortedColumnName, isDescending } = this.state
    isDescending = sortedColumnName === columnName && !isDescending
    this.setState({ sortedColumnName: columnName, isDescending })
  }

  sortTable(list) {
    let { sortedColumnName, isDescending } = this.state

    let sortedData = [].concat(list)

    sortedData.sort((a, b) => {
      const aValue = eval('a.' + sortedColumnName)
      const bValue = eval('b.' + sortedColumnName)
      if ( isDescending ) {
        if ( aValue > bValue ) return -1;
        if ( aValue < bValue ) return 1;
        return 0;
      }
      if ( aValue < bValue ) return -1;
      if ( aValue > bValue ) return 1;
      return 0;
    })

    return sortedData
  }

  render() {
    let { list } = this.props
    const { sortedColumnName, isDescending } = this.state

    if ( list === null ) {
      return <div>Loading Orders</div>
    }

    list = this.sortTable(list)

    return (
      <div className="row">
        <div className="offset-1 col-10">
          <h2 className="mt-2">Orders ({list.length})</h2>
          <Table striped hover responsive>
            <thead>
            <tr>
              <th><p onClick={() => this.onSortClick('node.createdAt')} className="clickableCell mb-0">Date <FontAwesomeIcon onClick={() => this.onSortClick('node.createdAt')} icon={sortedColumnName === 'node.createdAt' && !isDescending ? faAngleUp : faAngleDown} color="#9E9E9E" className="ml-2"/></p></th>
              <th><p onClick={() => this.onSortClick('slug')} className="clickableCell mb-0">Slug <FontAwesomeIcon onClick={() => this.onSortClick('slug')} icon={sortedColumnName === 'slug' && !isDescending ? faAngleUp : faAngleDown} color="#9E9E9E" className="ml-2"/></p></th>
              <th><p onClick={() => this.onSortClick('user.first')} className="clickableCell mb-0">Username <FontAwesomeIcon onClick={() => this.onSortClick('user.first')} icon={sortedColumnName === 'user.first' && !isDescending ? faAngleUp : faAngleDown} color="#9E9E9E" className="ml-2"/></p></th>
              <th><p onClick={() => this.onSortClick('node.crypto.name')} className="clickableCell mb-0">Masternode <FontAwesomeIcon onClick={() => this.onSortClick('node.crypto.name')} icon={sortedColumnName === 'node.crypto.name' && !isDescending ? faAngleUp : faAngleDown} color="#9E9E9E" className="ml-2"/></p></th>
              <th><p onClick={() => this.onSortClick('orderType')} className="clickableCell mb-0">Type <FontAwesomeIcon onClick={() => this.onSortClick('orderType')} icon={sortedColumnName === 'orderType' && !isDescending ? faAngleUp : faAngleDown} color="#9E9E9E" className="ml-2"/></p></th>
              <th>Amount</th>
              <th><p onClick={() => this.onSortClick('status')} className="clickableCell mb-0">Status <FontAwesomeIcon onClick={() => this.onSortClick('status')} icon={sortedColumnName === 'status' && !isDescending ? faAngleUp : faAngleDown} color="#9E9E9E" className="ml-2"/></p></th>
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
        { orderType, amount, status, slug } = order;
      return (
        <tr key={order.orderId} onClick={() => this.props.history.push('/orders/' + slug)} style={{ cursor: 'pointer' }}>
          <td style={{ verticalAlign: 'middle' }}>{date}</td>
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
