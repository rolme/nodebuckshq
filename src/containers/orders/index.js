/* eslint no-eval: 0 */
import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Table } from 'reactstrap'
import { valueFormat } from '../../lib/helpers'
import { filter } from 'lodash'
import Pagination from "react-js-pagination";
import qs from 'query-string'
import Dropdown from 'react-dropdown'
import { fetchOrders } from '../../reducers/orders'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import { faAngleDown, faAngleUp } from '@fortawesome/fontawesome-free-solid'

import 'react-dropdown/style.css'

const TYPE_OPTIONS = [
  { value: 'none', label: 'None' },
  { value: 'buy', label: 'Buy' },
  { value: 'sold', label: 'Sold' }
]

const STATUS_OPTIONS = [
  { value: 'none', label: 'None' },
  { value: 'paid', label: 'Paid' },
  { value: 'unpaid', label: 'Unpaid' }
]

class Orders extends Component {
  constructor(props) {
    super(props)
    this.state = {
      sortedColumnName: 'node.createdAt',
      isDescending: false,
      page: parseInt(qs.parse(props.location.search).page, 10) || 1,
      limit: parseInt(qs.parse(props.location.search).limit, 10) || 25,
      filterType: 'none',
      filterStatus: 'unpaid',
      sortedData: [],
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

  handlePageChange = (page) => {
    this.setState({ page })
    this.props.fetchOrders(page, this.state.limit)
  }

  onFilterSelect = (type) => (e) => {
    this.setState({ [type]: e.value })
  }

  render() {
    let { list, counts } = this.props
    const { sortedColumnName, isDescending, filterType, filterStatus } = this.state

    if ( list === null ) {
      return <div>Loading Orders</div>
    }

    list = this.sortTable(list)

    if(filterType !== 'none') list = filter(list, (o) => { return o.orderType.toLowerCase() === filterType.toLowerCase() });
    if(filterStatus !== 'none') list = filter(list, (o) => { return o.status.toLowerCase() === filterStatus.toLowerCase() });

    return (
      <div className="row">
        <div className="col-12 px-5">
          <h2 className="mt-2">Orders ({list.length})</h2>
          <div>
            <div className="d-flex justify-content-around align-items-center">
              <Pagination
                activePage={this.state.page}
                itemsCountPerPage={this.state.limit}
                totalItemsCount={counts.ordersAll}
                pageRangeDisplayed={10}
                onChange={this.handlePageChange}
              />
              <div className="d-flex align-items-center">
                <div className="mr-1">Type:</div>
                <Dropdown options={TYPE_OPTIONS} value={filterType} onChange={this.onFilterSelect('filterType')} />
                <div className="ml-3 mr-1">Status:</div>
                <Dropdown options={STATUS_OPTIONS} value={filterStatus} onChange={this.onFilterSelect('filterStatus')} />
              </div>
            </div>
          </div>
          <Table striped hover responsive>
            <thead>
            <tr>
              <th><p onClick={() => this.onSortClick('node.createdAt')} className="clickableCell mb-0">Date <FontAwesomeIcon onClick={() => this.onSortClick('node.createdAt')} icon={sortedColumnName === 'node.createdAt' && !isDescending ? faAngleUp : faAngleDown} color="#9E9E9E" className="ml-2"/></p></th>
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
        masternode = !!order.node && !!order.node.crypto ? order.node.crypto.name + ' (' + order.node.id + ')' : '-',
        { orderType, amount, status, slug } = order;
      return (
        <tr key={order.orderId} onClick={() => this.props.history.push('/orders/' + slug)} style={{ cursor: 'pointer' }}>
          <td style={{ verticalAlign: 'middle' }}>{date}</td>
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
  list: state.orders.list,
  counts: state.counts.data,
})

const mapDispatchToProps = dispatch => bindActionCreators({
  fetchOrders
}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Orders)
