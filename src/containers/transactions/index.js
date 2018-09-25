import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { Row, Col, Input } from 'reactstrap'
import TransactionsList from './list'
import './index.css'

import {
  fetchTransactions,
  updateTransaction,
} from '../../reducers/transactions'


import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import { faAngleDown, faAngleUp } from '@fortawesome/fontawesome-free-solid'

class Transactions extends Component {
  constructor(props) {
    super(props)
    this.state = {
      sortedColumnName: 'createdAt',
      isDescending: true,
      selectedTab: 'pending',
      filterValue: '',
      sortedData: []
    }
    this.onSortClick = this.onSortClick.bind(this)
  }

  componentWillMount() {
    this.props.fetchTransactions()
  }

  componentDidMount() {
    document.addEventListener('scroll', this.trackScrolling);
  }

  componentWillUnmount() {
    document.removeEventListener('scroll', this.trackScrolling);
  }

  isBottom(el) {
    if ( el ) return el.getBoundingClientRect().bottom <= window.innerHeight;
  }

  trackScrolling = () => {
    const wrappedElement = document.getElementById('txsContainer');
    if ( this.isBottom(wrappedElement) ) {
      const prevScrollHeight = wrappedElement.getBoundingClientRect().bottom
      const {
        data,
        pendingTotal,
        canceledTotal,
        processedTotal,
      } = this.props

      switch ( this.state.selectedTab ) {
        case 'pending':
          if ( data.pending.length < pendingTotal )
            this.props.fetchTransactions('pending_offset', data.pending.length, () => {
              window.scrollTo(0, prevScrollHeight);
            });
          break;
        case 'processed':
          if ( data.processed.length < processedTotal )
            this.props.fetchTransactions('processed_offset', data.processed.length, () => {
              window.scrollTo(0, prevScrollHeight);
            });
          break;
        default:
          if ( data.canceled.length < canceledTotal )
            this.props.fetchTransactions('canceled_offset', data.canceled.length, () => {
              window.scrollTo(0, prevScrollHeight);
            });
      }
    }
  };

  filter(transactions) {
    return transactions.filter((transaction) => {
      let values = Object.values(transaction);
      let flag = false
      values.forEach((val) => {
        if ( val ) {
          if ( val.toString().toLowerCase().indexOf(this.state.filterValue) > -1 ) {
            flag = true;
            return;
          }
        }
      })
      if ( flag ) return transaction
      else return null
    });
  }

  handleFilterChange = (e) => {
    this.setState({ filterValue: e.target.value.toLowerCase() })
  }

  handleTabClick = (index) => {
    this.setState({ selectedTab: index })
  }

  renderHeader() {
    const { selectedTab, filterValue } = this.state
    return (
      <Row>
        <Col className="d-flex flex-wrap mb-3 mx-0">
          <div className={selectedTab === 'pending' ? 'transactionsTab active' : 'transactionsTab'} onClick={() => this.handleTabClick('pending')}>Pending</div>
          <div className={selectedTab === 'processed' ? 'transactionsTab active' : 'transactionsTab'} onClick={() => this.handleTabClick('processed')}>Processed</div>
          <div className={selectedTab === 'canceled' ? 'transactionsTab active' : 'transactionsTab'} onClick={() => this.handleTabClick('canceled')}>Canceled</div>
        </Col>
        <Col>
          <Input placeholder="Search..." maxLength="100" value={filterValue} onChange={this.handleFilterChange}/>
        </Col>
      </Row>
    )
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
      if ( isDescending ) {
        if ( a[ sortedColumnName ] > b[ sortedColumnName ] ) return -1;
        if ( a[ sortedColumnName ] < b[ sortedColumnName ] ) return 1;
        return 0;
      }
      if ( a[ sortedColumnName ] < b[ sortedColumnName ] ) return -1;
      if ( a[ sortedColumnName ] > b[ sortedColumnName ] ) return 1;
      return 0;
    })

    return sortedData
  }

  filterByStatusData() {
    const { data } = this.props
    switch ( this.state.selectedTab ) {
      case 'pending':
        return data.pending
      case 'processed':
        return data.processed
      default:
        return data.canceled
    }
  }

  render() {
    const { fetching } = this.props
    const { sortedColumnName, isDescending } = this.state
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
              <th className="text-center">Id</th>
              <th className="text-center"><p onClick={() => this.onSortClick('type')} className="clickableCell mb-0">Type <FontAwesomeIcon onClick={() => this.onSortClick('type')} icon={sortedColumnName === 'type' && !isDescending ? faAngleUp : faAngleDown} color="#9E9E9E" className="ml-2"/></p></th>
              <th className="text-center">Amount</th>
              <th className="text-center"><p onClick={() => this.onSortClick('userName')} className="clickableCell mb-0">User <FontAwesomeIcon onClick={() => this.onSortClick('userName')} icon={sortedColumnName === 'userName' && !isDescending ? faAngleUp : faAngleDown} color="#9E9E9E" className="ml-2"/></p></th>
              <th className="text-center">Slug</th>
              <th className="text-center"><p onClick={() => this.onSortClick('createdAt')} className="clickableCell mb-0">Date <FontAwesomeIcon onClick={() => this.onSortClick('createdAt')} icon={sortedColumnName === 'createdAt' && !isDescending ? faAngleUp : faAngleDown} color="#9E9E9E" className="ml-2"/></p></th>
              <th className="text-center">Notes</th>
              {this.state.selectedTab !== 'processed' && <th className="text-center">Action</th>}
            </tr>
            </thead>
            <tbody>
            {this.displayTransactions()}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  displayTransactions() {
    let data = this.filterByStatusData()
    const { selectedTab } = this.state
    if ( !data.length ) {
      return <tr>
        <td colSpan='8' className="text-center">There is no data to show.</td>
      </tr>
    }
    data = this.sortTable(this.filter(data))
    return (
      <TransactionsList
        data={data}
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
