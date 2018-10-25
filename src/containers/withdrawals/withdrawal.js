import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { valueFormat } from '../../lib/helpers'
import { Tabs, Tab } from 'react-bootstrap-tabs'
import { Table, Button } from 'reactstrap'

import Editable from 'react-x-editable'

import {
  fetchWithdrawal,
  updateWithdrawal
} from '../../reducers/withdrawals'

import {
  updateTransaction,
  updateTransactionStatus,
} from '../../reducers/transactions'

import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import { faAngleDown, faAngleUp } from '@fortawesome/fontawesome-free-solid'

class Withdrawal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      tab: 'Actions',
      transactionsSortedColumnName: 'id',
      isTransactionDescending: false
    }
    this.onTransactionsSortClick = this.onTransactionsSortClick.bind(this)
  }

  componentWillMount() {
    let { match: { params } } = this.props
    this.props.fetchWithdrawal(params.slug)
  }

  componentWillReceiveProps(nextProps) {
    const { match: { params }, transactionsUpdating, withdrawal } = this.props
    if ( transactionsUpdating && !nextProps.transactionsUpdating && !!Object.keys(withdrawal).length ) {
      this.props.fetchWithdrawal(params.slug)
    }
  }

  handleCancelClick(slug) {
    this.props.updateWithdrawal(slug, { status: 'cancelled' })
  }

  displayWithdrawalData(withdrawal) {
    const { id, createdAt, cancelledAt, processedAt, status, balances, affiliateBalance } = withdrawal,
      amount = valueFormat(withdrawal.amount.usd, 2)
    return (
      <tr>
        <td>{id}</td>
        <td>{createdAt}</td>
        {status === 'processed' &&
        <td>{processedAt}</td>
        }
        {status === 'cancelled' &&
        <td>{cancelledAt}</td>
        }
        <td>
          <ul>
            {!!balances && balances.map(balance => {
              return <li key={balance.symbol}>{(+balance.value).toFixed(3)} {balance.symbol} ($ {(+balance.usd).toFixed(2)} )</li>
            })}
            {!!affiliateBalance &&
            <li key='affiliateBalance'>Affiliate btc ($ {(+affiliateBalance).toFixed(2)})</li>
            }
          </ul>
        </td>
        <td>${amount}</td>
        <td>{status}</td>
        {this.renderActionButtons(withdrawal)}
      </tr>
    )
  }

  renderActionButtons(withdrawal) {
    const { status } = withdrawal
    if ( status === 'pending' ) {
      return (
        <td>
          <button onClick={this.handleCancelClick.bind(this, withdrawal.slug)} className="btn btn-small btn-secondary">Cancel</button>
        </td>
      )
    }
    return <td> - </td>

  }

  displayUserData(user) {
    const { email, btcWallet, balances } = user,
      name = user.fullName
    return (
      <tr>
        <td>{name}</td>
        <td>{email}</td>
        <td>{btcWallet || '-'}</td>
        <td>
          <ul>
            {!!balances && balances.map(balance => {
              return <li key={balance.symbol}>
                {(+balance.value).toFixed(3)} {balance.symbol} ($ {(+balance.usd).toFixed(2)} ) fee ({balance.fee})
              </li>
            })}
          </ul>
        </td>
      </tr>
    )
  }

  handleTransactionAmountSubmit(slug, el) {
    this.props.updateTransaction(slug, { amount: el.value })
  }

  displayTransactionsData(transactions) {
    const { tab } = this.state

    return transactions.filter(t => {
      if (tab === 'Actions') {
        return t.type === 'transfer'
      } else {
        return t.type !== 'transfer'
      }
    }).map(transaction => {
      const { id, userName, userEmail, notes, type, amount, slug, status, symbol } = transaction
      let value = (notes.includes('USD transfer to')) ? `$${valueFormat(amount, 2)}` : `${amount} ${symbol}`
      if (notes.includes('convert to')) {
        let symbol = (notes.includes('convert to USD')) ? 'usd' : 'btc'
        let formattedValue = (notes.includes('convert to USD')) ? valueFormat(amount, 2) : amount
        value = (
          <span>
            <Editable
              dataType="text"
              mode="inline"
              name="amount"
              showButtons={false}
              value={formattedValue}
              validate={(value) => {
                if(!value.match(/^-?\d*(\.\d+)?$/)) {
                  return 'number required'
                }
              }}
              display={value => {
                return (<span style={{ borderBottom: "1px dashed", textDecoration: "none" }}>{(symbol === 'usd') ? `$${value}` : value  }</span>)
              }}
              handleSubmit={this.handleTransactionAmountSubmit.bind(this, slug)}
            />
            {symbol}
          </span>
        )
      }
      return (
        <tr key={id}>
          <td>{id}</td>
          { (tab !== 'Actions') && <td>{userName} {userEmail}</td> }
          <td dangerouslySetInnerHTML={{__html: notes}}/>
          { (tab !== 'Actions') && <td>{type}</td> }
          <td>{value}</td>
          { (tab !== 'Actions') && <td>{status}</td> }
          { (type === 'transfer') &&
          <td>
            {this.renderTransactionActions(transaction)}
          </td>
          }
        </tr>
      )
    })
  }

  renderTransactionActions(transaction) {
    const { slug, type, status } = transaction
    if ( status === 'pending' ) {
      return (
        <div className="d-flex justify-content-center">
          <Button className="mr-2" onClick={() => this.props.updateTransactionStatus(slug, 'processed')}>Process</Button>
        </div>
      )
    } else if ( type !== 'deposit' && type !== 'withdraw' ) {
      return (
        <div onClick={() => this.props.updateTransactionStatus(slug, 'undo')} className="d-flex justify-content-center">
          <Button>Undo</Button>
        </div>
      )
    } else {
      return <div className="d-flex justify-content-center">-</div>
    }


  }

  onTransactionsSortClick(columnName) {
    let { transactionsSortedColumnName, isTransactionDescending } = this.state
    isTransactionDescending = transactionsSortedColumnName === columnName && !isTransactionDescending
    this.setState({ transactionsSortedColumnName: columnName, isTransactionDescending })
  }

  sortTable(list, sortedColumnName, isDescending) {
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

  render() {
    const { tab, transactionsSortedColumnName, isTransactionDescending } = this.state
    const { match: { params }, withdrawal, pending } = this.props

    if ( pending || withdrawal.slug === undefined ) {
      return <h4 className="pt-3">Loading {params.slug}... </h4>
    }

    const transactions = this.sortTable(withdrawal.transactions, transactionsSortedColumnName, isTransactionDescending)

    return (
      <div className="row">
        <div className="col-12 px-5">
          <h2 className="mt-2">Withdrawal (ID: {withdrawal.id})</h2>
          <Table striped responsive>
            <thead>
            <tr>
              <th>Id</th>
              <th>Created Date</th>
              {withdrawal.status === 'processed' &&
              <th>Processed Date</th>
              }
              {withdrawal.status === 'cancelled' &&
              <th>Cancelled Date</th>
              }
              <th>Balances</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
            </thead>
            <tbody>
            {this.displayWithdrawalData(withdrawal)}
            </tbody>
          </Table>
        </div>
        <div className="col-12 px-5 mt-4">
          <h2 className="mt-2">Transactions</h2>
          <Tabs onSelect={(idx, label) => this.setState({ tab: label })} selected={tab}>
            <Tab label="Actions">
              <Table striped responsive className="mt-3">
                <thead>
                <tr>
                  <th><p onClick={() => this.onTransactionsSortClick('id')} className="clickableCell mb-0">Id <FontAwesomeIcon
                    onClick={() => this.onTransactionsSortClick('id')}
                    icon={transactionsSortedColumnName === 'id' && !isTransactionDescending ? faAngleUp : faAngleDown} color="#9E9E9E" className="ml-2"/>
                  </p></th>
                  <th>Notes</th>
                  <th>Amount</th>
                  <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                  {this.displayTransactionsData(transactions)}
                </tbody>
              </Table>
            </Tab>
            <Tab label="Log">
              <Table striped responsive className="mt-3">
                <thead>
                <tr>
                  <th><p onClick={() => this.onTransactionsSortClick('id')} className="clickableCell mb-0">Id <FontAwesomeIcon
                    onClick={() => this.onTransactionsSortClick('id')}
                    icon={transactionsSortedColumnName === 'id' && !isTransactionDescending ? faAngleUp : faAngleDown} color="#9E9E9E" className="ml-2"/>
                  </p></th>
                  <th>User</th>
                  <th>Notes</th>
                  <th><p onClick={() => this.onTransactionsSortClick('type')} className="clickableCell mb-0">Type <FontAwesomeIcon
                    onClick={() => this.onTransactionsSortClick('type')}
                    icon={transactionsSortedColumnName === 'type' && !isTransactionDescending ? faAngleUp : faAngleDown} color="#9E9E9E"
                    className="ml-2"/></p></th>
                  <th>Amount</th>
                  <th><p onClick={() => this.onTransactionsSortClick('status')} className="clickableCell mb-0">Status <FontAwesomeIcon
                    onClick={() => this.onTransactionsSortClick('status')}
                    icon={transactionsSortedColumnName === 'status' && !isTransactionDescending ? faAngleUp : faAngleDown} color="#9E9E9E"
                    className="ml-2"/></p></th>
                </tr>
                </thead>
                <tbody>
                  {this.displayTransactionsData(transactions)}
                </tbody>
              </Table>
            </Tab>
          </Tabs>
        </div>
        <div className="col-12 px-5 mt-4">
          <h2 className="mt-2">User</h2>
          <Table striped responsive>
            <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Btc Wallet</th>
              <th>Balances</th>
            </tr>
            </thead>
            <tbody>
            {this.displayUserData(withdrawal.user)}
            </tbody>
          </Table>
        </div>
      </div>
    )
  }

}

const mapStateToProps = state => ({
  withdrawal: state.withdrawals.data,
  transactionsUpdating: state.transactions.fetching,
  error: state.withdrawals.error,
  message: state.withdrawals.message,
  pending: state.withdrawals.pending
})

const mapDispatchToProps = dispatch => bindActionCreators({
  fetchWithdrawal,
  updateWithdrawal,
  updateTransaction,
  updateTransactionStatus
}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Withdrawal)
