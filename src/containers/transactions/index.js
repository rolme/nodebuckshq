import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { capitalize, valueFormat } from '../../lib/helpers'
import { Row, Col, Button, Input } from 'reactstrap'
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
      filterValue: '',
    }
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
    if(el) return el.getBoundingClientRect().bottom <= window.innerHeight;
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
    }
  };
  
  filter(transactions) {
    return transactions.filter((transaction) => {
      let values = Object.values(transaction);
      let flag = false
      values.forEach((val) => {
        if(val) {
          if(val.toString().toLowerCase().indexOf(this.state.filterValue) > -1) {
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

    return this.filter(data).map((item, index) => {
      return (
        <tr key={index}>
          <td className="text-center">{capitalize(item.type)}</td>
          <td className="text-center">{valueFormat(item.amount, 2)}</td>
          <td className="text-center">{item.userName}</td>
          <td className="text-center">{item.notes}</td>
          {selectedTab !== 'processed' && this.renderActionCell(item.Id)}
        </tr>
      )
    })
  }

  renderActionCell(id) {
    const { selectedTab } = this.state
    return selectedTab === 'pending' ? <td>
      <div className="d-flex justify-content-center">
        <Button className="mr-2" onClick={() => this.props.updateTransaction(id, {status: 'processed'})}>Process</Button> 
        <Button onClick={() => this.props.updateTransaction(id, {status: 'canceled'})}>Cancel</Button>
      </div>
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
  updateTransaction,
}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Transactions)
