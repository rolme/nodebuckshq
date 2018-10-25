import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem, Input } from 'reactstrap';
import Autosuggest from 'react-autosuggest';

import {
  fetchUser,
  fetchUsers,
} from '../../reducers/users'

import {
  fetchNodes
} from '../../reducers/nodes'

import {
  fetchOrders
} from '../../reducers/orders'

import {
  fetchWithdrawals
} from '../../reducers/withdrawals'

import { Table, Alert } from 'reactstrap'
import { NavLink } from "react-router-dom";
import { valueFormat } from "../../lib/helpers";
import moment from "moment";

class User extends Component {
  constructor(props) {
    super(props)
    this.toggleAlert = this.toggleAlert.bind(this)
    this.state = {
      suggestions: [],
      value: '',
      value2: '',
      value3: '',
    }
  }

  componentWillMount() {
    let { match: { params }, nodes, orders, withdrawals, list, user } = this.props
    this.props.fetchUser(params.slug)
    !nodes.length && this.props.fetchNodes()
    !orders.length && this.props.fetchOrders(1, Number.MAX_SAFE_INTEGER)
    !withdrawals.length && this.props.fetchWithdrawals()
    if (list.length <= 1 && user !== '') {
      this.props.fetchUsers()
    }
  }

  toggleAlert() {
    this.props.clearMessages()
  }

  onSuggestionsFetchRequested = ({ value }) => {
    this.setState({
      suggestions: this.getSuggestions(value)
    });
  };

  getSuggestions = value => {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;

    return inputLength === 0 ? [] : this.props.list.filter(user =>
      user.email.toLowerCase().slice(0, inputLength) === inputValue && user.slug !== this.props.user.slug
    );
  };

  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    });
  };

  getSuggestionValue = suggestion => suggestion.name;

  renderSuggestion = suggestion => (
    <div key={suggestion.slug}>{suggestion.email}</div>
  );

  onChangeTier1 = (event, { newValue }) => {
    this.setState({
      value: newValue
    });
  };

   onChangeTier2 = (event, { newValue }) => {
    this.setState({
      value2: newValue
    });
  };

   onChangeTier3 = (event, { newValue }) => {
    this.setState({
      value3: newValue
    });
  };

  render() {
    const { match: { params }, user, nodes, orders, withdrawals, pending, error, message } = this.props

    if ( pending || user.slug === undefined ) {
      return <h4 className="pt-3">Loading {params.slug}... </h4>
    }

    return (
      <div>
        <div className="col-12 mt-2">
          <Alert color={error ? 'danger' : 'success'} isOpen={!!message} toggle={this.toggleAlert}>
            {message}
          </Alert>
          <div className="col-10 offset-1 px-5 mb-4">
            <h2 className="mt-2">User</h2>
            <Table responsive striped>
              <thead>
              <tr>
                <th> Name</th>
                <th> Email</th>
                <th> Btc Wallet</th>
                <th> Balances</th>
              </tr>
              </thead>
              <tbody>
              {this.renderUserData(user)}
              </tbody>
            </Table>
            <UncontrolledDropdown>
              <DropdownToggle caret>
                Affiliates
              </DropdownToggle>
              <DropdownMenu>
                <DropdownItem header style={{ fontSize: 18 }}>
                  <b>Tier1:</b> {user.affiliates.tier1 ? `${user.affiliates.tier1.first} ${user.affiliates.tier1.last} (${user.affiliates.tier1.email})` : ''}
                </DropdownItem>
                <Autosuggest
                  suggestions={this.state.suggestions}
                  onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                  onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                  getSuggestionValue={this.getSuggestionValue}
                  renderSuggestion={this.renderSuggestion}
                  inputProps={{
                    placeholder: 'Type user email here',
                    value: this.state.value || '',
                    onChange: this.onChangeTier1
                  }}
                />
                <DropdownItem divider/>
                <DropdownItem header style={{ fontSize: 18 }}>
                  <b>Tier2:</b> {user.affiliates.tier2 ? `${user.affiliates.tier2.first} ${user.affiliates.tier2.last} (${user.affiliates.tier2.email})` : ''}
                </DropdownItem>
                <Autosuggest
                  suggestions={this.state.suggestions}
                  onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                  onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                  getSuggestionValue={this.getSuggestionValue}
                  renderSuggestion={this.renderSuggestion}
                  inputProps={{
                    placeholder: 'Type user email here',
                    value: this.state.value2 || '',
                    onChange: this.onChangeTier2
                  }}
                />
                <DropdownItem divider/>
                <DropdownItem header style={{ fontSize: 18 }}>
                  <b>Tier3:</b> {user.affiliates.tier3 ? `${user.affiliates.tier3.first} ${user.affiliates.tier3.last} (${user.affiliates.tier3.email})` : ''}
                </DropdownItem>
                <Autosuggest
                  suggestions={this.state.suggestions}
                  onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                  onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                  getSuggestionValue={this.getSuggestionValue}
                  renderSuggestion={this.renderSuggestion}
                  inputProps={{
                    placeholder: 'Type user email here',
                    value: this.state.value3 || '',
                    onChange: this.onChangeTier3
                  }}
                />
              </DropdownMenu>
            </UncontrolledDropdown>
          </div>
          <div className="col-10 offset-1 px-5">
            <h2 className="mt-2">Nodes</h2>
            <Table responsive striped>
              <thead>
              <tr>
                <th> Id </th>
                <th> Date </th>
                <th> Type </th>
                <th> Status </th>
              </tr>
              </thead>
              <tbody>
              {this.renderNodesData(nodes, user)}
              </tbody>
            </Table>
          </div>
          <div className="col-10 offset-1 px-5">
            <h2 className="mt-2">Orders</h2>
            <Table responsive hover striped>
              <thead>
              <tr>
                <th> Date</th>
                <th> Masternode</th>
                <th> Type</th>
                <th> Amount</th>
                <th> Status</th>
              </tr>
              </thead>
              <tbody>
              {this.renderOrdersData(orders, user)}
              </tbody>
            </Table>
          </div>
          <div className="col-10 offset-1 px-5">
            <h2 className="mt-2">Withdrawals</h2>
            <Table responsive hover striped>
              <thead>
              <tr>
                <th> Id </th>
                <th> Balance </th>
                <th> Amount </th>
                <th> Created at </th>
                <th> Processed at </th>
                <th> Cancelled at </th>
                <th> Status </th>
              </tr>
              </thead>
              <tbody>
              {this.renderWithdrawalsData(withdrawals, user)}
              </tbody>
            </Table>
          </div>
        </div>
      </div>
    )
  }

  renderUserData(user) {
    const { fullName, email, btcWallet, balances } = user
    return (
      <tr>
        <td>{fullName}</td>
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

  renderNodesData(nodes, user) {
    return nodes.filter(node => node.owner.slug === user.slug).map(item => {
      return (
        <tr key={item.slug}>
          <td><NavLink to={`/nodes/${item.slug}`}>{item.id}</NavLink></td>
          <td>{item.createdAt}</td>
          <td>{item.crypto.name}</td>
          <td>
            {!item.deletedAt && this.displayBadge(item)}
            {!!item.deletedAt && <span className="badge badge-danger ml-1">Deleted</span>}
          </td>
        </tr>
      )
    })
  }

  renderOrdersData(orders, user) {
    return orders.filter(order => order.user.slug === user.slug).map(order => {
      const date = !!order.node ? order.node.createdAt : '-',
        masternode = !!order.node && !!order.node.crypto ? order.node.crypto.name + ' (' + order.node.id + ')' : '-',
        { orderType, amount, status, slug } = order;
      return (
        <tr key={order.orderId} onClick={() => this.props.history.push('/orders/' + slug)} style={{ cursor: 'pointer' }}>
          <td style={{ verticalAlign: 'middle' }}>{date}</td>
          <td style={{ verticalAlign: 'middle' }}>{masternode}</td>
          <td style={{ verticalAlign: 'middle' }}>{orderType}</td>
          <td style={{ verticalAlign: 'middle' }}>$ {valueFormat(amount, 2)}</td>
          <td style={{ verticalAlign: 'middle' }}>{status}</td>
        </tr>
      )
    })
  }

  renderWithdrawalsData(withdrawals, user) {
    return withdrawals.filter(withdrawal => withdrawal.user.slug === user.slug).map(withdrawal => {
      const createdAt = !!withdrawal.createdAt ? moment(withdrawal.createdAt).format("MMM D, YYYY  HH:mm") : '-'
      const processedAt = !!withdrawal.processedAt ? moment(withdrawal.processedAt).format("MMM D, YYYY  HH:mm") : '-'
      const cancelledAt = !!withdrawal.cancelledAt ? moment(withdrawal.cancelledAt).format("MMM D, YYYY  HH:mm") : '-'
      return (
        <tr onClick={() => this.onRowClick(withdrawal.slug)} key={withdrawal.slug} className="clickableRow">
          <td>{withdrawal.id}</td>
          <td>
            <ul>
              {!!withdrawal.balances && withdrawal.balances.map(balance => {
                return <li key={balance.symbol}>{(+balance.value).toFixed(3)} {balance.symbol} ($ {(+balance.usd).toFixed(2)} )</li>
              })}
              {!!withdrawal.affiliateBalance &&
              <li key = 'affiliateBalance'>Affiliate btc ($ {(+withdrawal.affiliateBalance).toFixed(2)})</li>
              }
            </ul>
          </td>
          <td>$ {(+withdrawal.amount.usd).toFixed(2)}</td>
          <td>{createdAt}</td>
          <td>{processedAt}</td>
          <td>{cancelledAt}</td>
          <td>{withdrawal.status}</td>
        </tr>
      )
    })
  }

  displayBadge(node) {
    if ( node.status === 'online' ) {
      return <span className="badge badge-success">{node.status}</span>
    } else if ( node.status === 'offline' ) {
      return <span className="badge badge-danger">{node.status}</span>
    } else if ( node.status === 'new' ) {
      return <span className="badge badge-primary">{node.status}</span>
    }
    return <span className="badge badge-secondary">{node.status}</span>
  }
}

const mapStateToProps = state => ({
  user: state.users.data,
  nodes: state.nodes.list,
  orders: state.orders.list,
  withdrawals: state.withdrawals.list,
  error: state.users.error,
  message: state.users.message,
  pending: state.users.pending,
  list: state.users.list,
})

const mapDispatchToProps = dispatch => bindActionCreators({
  fetchUser,
  fetchNodes,
  fetchOrders,
  fetchWithdrawals,
  fetchUsers,
}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(User)
