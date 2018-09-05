import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import qs from 'query-string'

import { capitalize, valueFormat } from '../../lib/helpers'
import { Row, Col, Button, Input } from 'reactstrap'
import './index.css'

import {
  fetchTransactions,
  filterTransactions
} from '../../reducers/transactions'


class Transactions extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedTab: 'pending',
      filterValue: '',
    }
    this.handleTabClick = this.handleTabClick.bind(this)
    this.handleFilterNameChange = this.handleFilterNameChange.bind(this)
  }

  componentWillMount() {
    this.props.fetchTransactions()
  }

  componentDidMount() {
    document.addEventListener('scroll', this.trackScrolling);
  }

  componentDidUpdate() {
    document.addEventListener('scroll', this.trackScrolling);
  }

  componentWillUnmount() {
    document.removeEventListener('scroll', this.trackScrolling);
  }

  isBottom(el) {
    return el.getBoundingClientRect().bottom <= window.innerHeight;
  }

  trackScrolling = () => {
  const wrappedElement = document.getElementById('txsContainer');
    if (this.isBottom(wrappedElement)) {
      const {
        data,
        pendingTotal, 
        canceledTotal, 
        processedTotal,
      } = this.props

      switch(this.state.selectedTab) {
        case 'pending':
          if(data.pending.length < pendingTotal)
            this.props.fetchTransactions('pending_offset', data.pending.length);
          break;
        case 'processed':
          if(data.processed.length < processedTotal)
            this.props.fetchTransactions('processed_offset', data.processed.length);
          break;
        default:
          if(data.canceled.length < canceledTotal)
            this.props.fetchTransactions('canceled_offset', data.canceled.length);
      }

      document.removeEventListener('scroll', this.trackScrolling);
    }
  };
  
  processUrlData(props) {
    const filterValue = qs.parse(props.location.search).filter
    const lowercaseFilterValue = !!filterValue ? filterValue.toLowerCase() : ''
    let { data } = this.state
    if ( !!filterValue ) {
      data = data.filter(item => (!!item.type && (item.type).toLowerCase().includes(lowercaseFilterValue)) || (!!item.userName && (item.userName).toLowerCase().includes(lowercaseFilterValue)) || (!!item.userEmail && (item.userEmail).toLowerCase().includes(lowercaseFilterValue)) || (!!item.notes && (item.notes).toLowerCase().includes(lowercaseFilterValue)))
    }
    this.setState({ filterValue, data })
  }

  handleFilterNameChange(e) {
    this.props.filterTransactions(e.target.value)
  }

  handleTabClick(index) {
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
          <Input placeholder="Search..." maxLength="100" value={filterValue} onChange={this.handleFilterNameChange}/>
        </Col>
      </Row>
    )
  }

  filterByStatusData() {
    const { data } = this.props
    switch(this.state.selectedTab) {
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

    return data.map((item, index) => {
      return (
        <tr key={index}>
          <td style={{ verticalAlign: 'middle' }}>{capitalize(item.type)}</td>
          <td>{valueFormat(item.amount, 2)}</td>
          <td>{item.userName}</td>
          <td>{item.notes}</td>
          {selectedTab !== 'processed' && this.renderActionCell()}
        </tr>
      )
    })
  }

  renderActionCell() {
    const { selectedTab } = this.state
    return selectedTab === 'pending' ? <td>
      <div className="d-flex justify-content-center"><Button className="mr-2">Process</Button> <Button>Cancel</Button></div>
    </td> : <td>
      <div className="d-flex justify-content-center"><Button>Undo</Button></div>
    </td>
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
  filterTransactions
}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Transactions)
