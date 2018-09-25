import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Row, Col, Input } from 'reactstrap'
import TransactionsList from './list'
import Pagination from "react-js-pagination";
import qs from 'query-string'
import './index.css'

import {
  fetchTransactions,
  updateTransaction,
} from '../../reducers/transactions'


class Transactions extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedTab: 'pending',
      filter: '',
      page: parseInt(qs.parse(props.location.search).page, 10) || 1,
      limit: parseInt(qs.parse(props.location.search).limit, 10) || 25,
    }
  }

  componentWillMount() {
    this.props.fetchTransactions();
  }

  filter(transactions) {
    return transactions.filter((transaction) => {
      let values = Object.values(transaction);
      let flag = false
      values.forEach((val) => {
        if(val) {
          if(val.toString().toLowerCase().indexOf(this.state.filter) > -1) {
            flag = true;
            return;
          }
        }
      })
      if(flag) return transaction
      else return null
    });
  }

  handleFilterChange = (e) => {
    this.setState({ filter: e.target.value.toLowerCase() })
  }

  handleTabClick = (index) => {
    this.setState({ selectedTab: index })
  }

  handlePageChange = (page) => {
    this.setState({ page })
    this.props.fetchTransactions(page, this.state.limit)
  }

  renderHeader() {
    const { selectedTab, filter } = this.state
    return (
      <Row>
        <Col className="d-flex flex-wrap mb-3 mx-0">
          <div className={selectedTab === 'pending' ? 'transactionsTab active' : 'transactionsTab'} onClick={() => this.handleTabClick('pending')}>Pending</div>
          <div className={selectedTab === 'processed' ? 'transactionsTab active' : 'transactionsTab'} onClick={() => this.handleTabClick('processed')}>Processed</div>
          <div className={selectedTab === 'canceled' ? 'transactionsTab active' : 'transactionsTab'} onClick={() => this.handleTabClick('canceled')}>Canceled</div>
        </Col>
        <Col>
          <Input placeholder="Search..." maxLength="100" value={filter} onChange={this.handleFilterChange}/>
        </Col>
      </Row>
    )
  }

  filterByStatusData() {
    const { data } = this.props
    if (data.length === 0) { return data }
    switch(this.state.selectedTab) {
      case 'pending':
        return data.pending
      case 'processed':
        return data.processed
      default:
        return data.canceled
    }
  }

  totalItems() {
    switch(this.state.selectedTab) {
      case 'pending':
        return this.props.pendingTotal
      case 'processed':
        return this.props.processedTotal
      default:
        return this.props.canceledTotal
    }
  }

  render() {
    const { fetching } = this.props
    if ( fetching ) {
      return <div>Loading Transactions</div>
    }

    return (
      <div id="txsContainer" className="row">
        <div className="offset-1 col-10">
          <h2 className="mt-2">Transactions</h2>
          {this.renderHeader()}
          <table className="table table-striped">
            <thead>
            <tr>
              <th className="text-center">Type</th>
              <th className="text-center">Amount</th>
              <th className="text-center">User</th>
              <th className="text-center">Notes</th>
              {this.state.selectedTab !== 'processed' && <th className="text-center">Action</th>}
            </tr>
            </thead>
            <tbody>
            {this.displayTransactions()}
            </tbody>
          </table>
          <div className="pagination-container">
            <Pagination
              activePage={this.state.page}
              itemsCountPerPage={this.state.limit}
              totalItemsCount={this.totalItems()}
              pageRangeDisplayed={10}
              onChange={this.handlePageChange}
            />
          </div>
        </div>
      </div>
    )
  }

  displayTransactions() {
    const data = this.filterByStatusData()
    const { selectedTab } = this.state
    if ( !data.length ) {
      return <tr>
        <td colSpan='5' className="text-center">There is no data to show.</td>
      </tr>
    }

    return (
      <TransactionsList
        data={this.filter(data)}
        selectedTab={selectedTab}
        updateTransaction={this.props.updateTransaction}
      />
    )
  }
}

const mapStateToProps = state => ({
  data: state.transactions.list,
  fetching: state.transactions.fetching,
  pendingTotal: state.transactions.list.pendingTotal,
  canceledTotal: state.transactions.list.canceledTotal,
  processedTotal: state.transactions.list.processedTotal,
})

const mapDispatchToProps = dispatch => bindActionCreators({
  fetchTransactions,
  updateTransaction,
}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Transactions)
