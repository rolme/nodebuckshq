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
      selectedTabIndex: 0,
      filterValue: ''
    }
    this.handleTabClick = this.handleTabClick.bind(this)
    this.handleFilterNameChange = this.handleFilterNameChange.bind(this)
  }

  componentWillMount() {
    this.props.fetchTransactions()
  }

  componentWillReceiveProps(nextProps) {
    if ( !!nextProps.data.length ) {
      this.processUrlData(nextProps)
    }
  }

  processUrlData(props) {
    const filterValue = qs.parse(props.location.search).filter
    this.setState({ filterValue })
  }

  handleFilterNameChange(e) {
    this.props.filterTransactions(e.target.value)
    this.setState({ filterValue: e.target.value })
  }

  handleTabClick(index) {
    this.setState({ selectedTabIndex: index })
  }

  renderHeader() {
    const { selectedTabIndex, filterValue } = this.state
    return (
      <Row>
        <Col className="d-flex flex-wrap mb-3 mx-0">
          <div className={selectedTabIndex === 0 ? 'transactionsTab active' : 'transactionsTab'} onClick={() => this.handleTabClick(0)}>Pending</div>
          <div className={selectedTabIndex === 1 ? 'transactionsTab active' : 'transactionsTab'} onClick={() => this.handleTabClick(1)}>Processed</div>
          <div className={selectedTabIndex === 2 ? 'transactionsTab active' : 'transactionsTab'} onClick={() => this.handleTabClick(2)}>Canceled</div>
        </Col>
        <Col>
          <Input placeholder="Search..." maxLength="100" value={filterValue} onChange={this.handleFilterNameChange}/>
        </Col>
      </Row>
    )
  }

  filterData(data, filterValue) {
    filterValue = filterValue.toLowerCase()
    return data.filter(item => (!!item.type && (item.type).toLowerCase().includes(filterValue)) || (!!item.userName && (item.userName).toLowerCase().includes(filterValue)) || (!!item.userEmail && (item.userEmail).toLowerCase().includes(filterValue)))
  }

  render() {
    let { data } = this.props
    const { selectedTabIndex, filterValue } = this.state

    if ( !data.length ) {
      return <div>Loading Transactions</div>
    }

    if ( !!filterValue ) {
      data = this.filterData(data, filterValue)
    }

    return (
      <div className="row">
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
              {selectedTabIndex !== 1 && <th className="text-center">Action</th>}
            </tr>
            </thead>
            <tbody>
            {this.displayTransactions(data)}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  displayTransactions(list) {
    const { selectedTabIndex } = this.state

    return list.map((item, index) => {
      return (
        <tr key={index}>
          <td style={{ verticalAlign: 'middle' }}>{capitalize(item.type)}</td>
          <td>{valueFormat(item.amount, 2)}</td>
          <td>{item.userName}</td>
          <td>{item.notes}</td>
          {selectedTabIndex !== 1 && this.renderActionCell()}
        </tr>
      )
    })
  }

  renderActionCell() {
    const { selectedTabIndex } = this.state
    return selectedTabIndex === 0 ? <td>
      <div className="d-flex justify-content-center"><Button className="mr-2">Process</Button> <Button>Cancel</Button></div>
    </td> : <td>
      <div className="d-flex justify-content-center"><Button>Undo</Button></div>
    </td>
  }

}

const mapStateToProps = state => ({
  data: state.transactions.list
})

const mapDispatchToProps = dispatch => bindActionCreators({
  fetchTransactions,
  filterTransactions
}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Transactions)
