import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Tabs, Tab } from 'react-bootstrap-tabs'

import Editable from 'react-x-editable'
import { Button, Alert } from 'reactstrap'
import { valueFormat } from "../../lib/helpers"
import Checkmark from '../../components/checkmark'

import "./index.css"

import {
  clearMessages,
  deleteNode,
  disburseNode,
  fetchNode,
  offlineNode,
  onlineNode,
  unDisburseNode,
  updateNode,
  restoreNode
} from '../../reducers/nodes'

class Node extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showCheckmark: false,
      tab: 'Summary'
    }
    this.toggleAlert = this.toggleAlert.bind(this)
    this.selectEditableField = this.selectEditableField.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  componentWillMount() {
    let { match: { params } } = this.props
    this.props.fetchNode(params.slug)
  }

  componentWillReceiveProps(nextProps) {
    let { message } = nextProps
    if ( message.includes("updated successful") ) {
      const name = message.split(' updated successful.')[ 0 ]
      this.setState({ showCheckmark: name }, () => {
        setTimeout(() => {
          this.setState({ showCheckmark: false })
        }, 3000)
      })
    }
  }

  handleDelete() {
    const { node } = this.props
    if ( window.confirm("Are you sure you want to delete this node?") ) {
      this.props.deleteNode(node.slug)
    }
  }

  handleSubmit(name, label, el) {
    const { node } = this.props
    let data = {}
    data[ name ] = el.value

    this.props.updateNode(node.slug, data, label)
  }

  toggleAlert() {
    this.props.clearMessages()
  }

  render() {
    const { match: { params }, node, pending, error, message } = this.props
    const { tab } = this.state

    if ( pending || node.slug === undefined ) {
      return <h4 className="pt-3">Loading {params.slug}... </h4>
    }

    return (
      <div>
        <div className="col-8 offset-2 mt-2">
          <Alert color={error ? 'danger' : 'success'} isOpen={!!message} toggle={this.toggleAlert}>
            {message}
          </Alert>
        </div>
        {this.displayHeader(node)}
        <div className="pt-3">
          <Tabs onSelect={(idx, label) => this.setState({ tab: label })} selected={tab}>
            <Tab label="Summary">
              <div className="col-12 mt-3">
                <div className="d-flex">
                  {this.displaySummary(node)}
                  {this.displayFinancialSection(node)}
                </div>
                {this.displayConfiguration(node)}
              </div>
            </Tab>
            <Tab label="History">
              <div className="col-12 mt-3">
                {this.displayHistory(node)}
              </div>
            </Tab>
          </Tabs>
        </div>
      </div>
    )
  }

  displayHeader(node) {
    let uptime = node.uptime
    if ( +uptime === 0 ) {
      uptime = '0 days'
    } else {
      if ( +uptime < 60 ) {
        uptime = uptime + ' secs'
      } else if ( +uptime < 3600 ) {
        uptime = (+uptime / 60).toFixed(0) + ' mins'
      } else if ( +uptime < 86400 ) {
        uptime = (+uptime / 3600).toFixed(0) + ' hrs'
      } else {
        uptime = (+uptime / 86400).toFixed(0) + ' days'
      }
    }


    return (
      <div className="row">
        <h5 className="col-md-4">
          <img alt={node.crypto.slug} src={`/assets/images/logos/${node.crypto.slug}.png`} height="45px" width="45px"/> {node.crypto.name}
        </h5>
        <h5 className="col-md-4">
          IP: {node.ip}
        </h5>
        <h5 className="col-md-4">
          Uptime: {uptime}
        </h5>
      </div>
    )
  }

  displaySummary(node) {
    return (
      <div className="row col-6">
        <div className="col-md-12">
          <h5>Summary</h5>
          <table className="table">
            <tbody>
            <tr>
              <th>Owner</th>
              <td className="text-right">{node.owner.fullName} ({node.owner.email})</td>
            </tr>
            <tr>
              <th>Node ID</th>
              <td className="text-right">{node.id}</td>
            </tr>
            <tr>
              <th>Value</th>
              <td className="text-right">$ {(+node.value).toFixed(2).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")} USD</td>
            </tr>
            <tr>
              <th>Cost</th>
              <td className="text-right">$ {(+node.cost).toFixed(2).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}</td>
            </tr>
            <tr>
              <th>Total Rewards</th>
              <td className="text-right">$ {(+node.rewardTotal).toFixed(2).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}</td>
            </tr>
            <tr>
              <th>Reward %</th>
              <td className="text-right">{(node.rewardTotal / node.cost).toFixed(2).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")} %</td>
            </tr>
            <tr>
              <th>Reward Settings</th>
              <td className="text-right">
                {this.renderRewardSettings(node)}
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  renderRewardSettings(data) {
    const { rewardSetting, wallet } = data
    switch ( rewardSetting ) {
      case 10:
        return <p>Auto Purchase</p>
      case 20:
        return <p>Auto Withdraw <br/> {wallet}</p>
      default:
        return <p>Nodebuck</p>
    }

  }

  selectEditableField() {
    setTimeout(() => {
      const element = document.getElementById('formBasicText')
      !!element && element.select()
    }, 5)

  }

  displayFinancialSection(node) {
    const { showCheckmark } = this.state
    return (
      <div className="row col-6">
        <div className="col-md-12">
          <h5>Financial Section</h5>
          <table className="table">
            <tbody>
            <tr>
              <th>Buy Price</th>
              <td className="text-right">
                {valueFormat(node.buyPrice, 2)}
              </td>
            </tr>
            <tr>
              <th>Nodebucks Buy Price</th>
              <td className="text-right">
                <div className="d-flex nodeEditableData align-items-center justify-content-end">
                  {showCheckmark === 'Nodebucks Buy Price' && <Checkmark success={true}/>}
                  <Editable
                    dataType="text"
                    mode="inline"
                    name="nodebucksBuyAmount"
                    showButtons={false}
                    value={node.nodebucksBuyAmount}
                    display={value => {
                      return (<span onClick={this.selectEditableField} style={{ borderBottom: "1px dashed", textDecoration: "none" }}>${valueFormat(value, 2)}</span>)
                    }}
                    handleSubmit={(el) => this.handleSubmit('nb_buy_amount', 'Nodebucks Buy Price', el)}
                  />
                </div>
              </td>
            </tr>
            <tr>
              <th>Buy Profit</th>
              <td className="text-right">
                {valueFormat(node.buyProfit, 2)}
              </td>
            </tr>
            </tbody>
          </table>
          <table className="table">
            <tbody>
            <tr>
              <th>Sell Price</th>
              <td className="text-right">
                {valueFormat(+node.crypto.nodeSellPrice, 2)}
              </td>
            </tr>
            <tr>
              <th>Nodebucks Sell Price</th>
              <td className="text-right">
                <div className="d-flex nodeEditableData align-items-center justify-content-end">
                  {showCheckmark === 'Nodebucks Sell Price' && <Checkmark success={true}/>}
                  <Editable
                    dataType="text"
                    mode="inline"
                    name="nodebucksSellAmount"
                    showButtons={false}
                    value={node.nodebucksSellAmount}
                    display={value => {
                      return (<span onClick={this.selectEditableField} style={{ borderBottom: "1px dashed", textDecoration: "none" }}>${valueFormat(value, 2)}</span>)
                    }}
                    handleSubmit={(el) => this.handleSubmit('nb_sell_amount', 'Nodebucks Sell Price', el)}
                  />
                </div>
              </td>
            </tr>
            <tr>
              <th>Sell Profit</th>
              <td className="text-right">
                {valueFormat(node.sellProfit, 2)}
              </td>
            </tr>
            </tbody>
          </table>
          <table className="table">
            <tbody>
            <tr>
              <th>Total Fees</th>
              <td className="text-right">
                {valueFormat(node.totalFees, 2)}
              </td>
            </tr>
            <tr>
              <th>Collected</th>
              <td className="text-right">
                {valueFormat(node.totalFeesCollected, 2)}
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  displayConfiguration(node) {
    const { showCheckmark } = this.state
    return (
      <div className="row">
        <div className="col-md-12">
          <h5>Configuration</h5>
          <table className="table">
            <tbody>
            <tr>
              <th>IP</th>
              <td>
                <div className="d-flex nodeEditableData align-items-center justify-content-end">
                  {showCheckmark === 'IP' && <Checkmark success={true}/>}
                  <Editable
                    dataType="text"
                    mode="inline"
                    name="ip"
                    showButtons={false}
                    value={node.ip}
                    display={value => {
                      return (<span onClick={this.selectEditableField} style={{ borderBottom: "1px dashed", textDecoration: "none" }}>{value}</span>)
                    }}
                    handleSubmit={(el) => this.handleSubmit('ip', 'IP', el)}
                  />
                  {node.duplicatedIp && <p className="text-danger">Duplicated ip!</p>}
                </div>
              </td>
            </tr>
            <tr>
              <th>Wallet</th>
              <td>
                <div className="d-flex nodeEditableData align-items-center justify-content-end">
                  {showCheckmark === 'Wallet' && <Checkmark success={true}/>}
                  <Editable
                    dataType="text"
                    mode="inline"
                    name="wallet"
                    showButtons={false}
                    value={node.wallet}
                    display={value => {
                      return (<span onClick={this.selectEditableField} style={{ borderBottom: "1px dashed", textDecoration: "none" }}>{value}</span>)
                    }}
                    handleSubmit={(el) => this.handleSubmit('wallet', 'Wallet', el)}
                  />
                  {node.duplicatedWallet && <p className="text-danger">Duplicated wallet!</p>}
                </div>
              </td>
            </tr>
            <tr>
              <th>VPS URL:</th>
              <td>
                <div className="d-flex nodeEditableData align-items-center justify-content-end">
                  {showCheckmark === 'VPS URL' && <Checkmark success={true}/>}
                  <Editable
                    dataType="text"
                    mode="inline"
                    name="vpsUrl"
                    showButtons={false}
                    value={node.vpsUrl}
                    display={value => {
                      return (<span onClick={this.selectEditableField} style={{ borderBottom: "1px dashed", textDecoration: "none" }}>{value}</span>)
                    }}
                    handleSubmit={(el) => this.handleSubmit('vps_url', 'VPS URL', el)}
                  />
                </div>
              </td>
            </tr>
            <tr>
              <th>VPS Monthly:</th>
              <td>
                <div className="d-flex nodeEditableData align-items-center justify-content-end">
                  {showCheckmark === 'VPS Monthly' && <Checkmark success={true}/>}
                  <Editable
                    dataType="text"
                    mode="inline"
                    name="vpsMonthlyCost"
                    showButtons={false}
                    value={node.vpsMonthlyCost}
                    display={value => {
                      return (<span onClick={this.selectEditableField} style={{ borderBottom: "1px dashed", textDecoration: "none" }}>$ {valueFormat(value, 2)} USD</span>)
                    }}
                    handleSubmit={(el) => this.handleSubmit('vps_monthly_cost', 'VPS Monthly', el)}
                  />
                </div>
              </td>
            </tr>
            <tr>
              <th>Status</th>
              <td className="text-right">
                {!node.deletedAt && <span className={`badge badge-${(node.status === 'online') ? 'success' : 'danger'}`}>{node.status}</span>}
                {!!node.deletedAt && <span className="badge badge-danger ml-1">Deleted</span>}
              </td>
            </tr>
            <tr>
              <td colSpan='2'>
                <div className="d-flex justify-content-center">
                  {this.displayActionButtons(node)}
                </div>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  displayActionButtons(node) {
    let buttons = []

    if ( node.isReady ) {
      if ( node.status === 'online' ) {
        buttons.push(<Button key="disable" onClick={this.props.offlineNode.bind(this, node.slug)}
                             className="btn btn-sm btn-outline-secondary">Disable</Button>)
      } else {
        buttons.push(<Button key="enable" onClick={this.props.onlineNode.bind(this, node.slug)}
                             className="btn btn-sm btn-outline-primary">Enable</Button>)
      }
    } else {
      buttons.push(<Button key="enableMissingData" disabled={true}>Enable (missing data)</Button>)
    }

    if ( node.status === 'sold' ) {
      buttons.push(<Button key="disburse" onClick={this.props.disburseNode.bind(this, node.slug)}
                           className="btn btn-sm ml-2 btn-primary">Disburse</Button>)
    } else if ( node.status === 'disbursed' ) {
      buttons.push(<Button key="unDisburse" onClick={this.props.unDisburseNode.bind(this, node.slug)}
                           className="btn btn-sm ml-2 btn-primary">Undisburse</Button>)
    }

    if ( node.deletedAt === null ) {
      buttons.push(<Button key="delete" onClick={this.handleDelete.bind(this)} className="btn btn-sm ml-2 btn-danger">Delete</Button>)
    } else {
      buttons.push(<Button key="restore" onClick={this.props.restoreNode.bind(this, node.slug)}
                           className="btn btn-sm ml-2 btn-danger">Restore</Button>)
    }
    return buttons
  }

  displayHistory(node) {
    let total = node.events.map(e => e.value).reduce((t, v) => +t + +v)
    return (
      <div className="col-12">
        <div className="d-flex justify-content-between">
          <h5>History</h5>
          <a href={node.walletUrl || node.explorerUrl} target="_blank" rel="noopener noreferrer">Explorer</a>
        </div>
        <table className="table">
          <thead>
          <tr>
            <th>Date</th>
            <th>Event</th>
            <th>Total Rewards</th>
          </tr>
          </thead>
          <tbody>
          {true && node.events.map(event => {
            total = (total < 0) ? 0.00 : +total
            const row = (
              <tr key={event.id}>
                <td>{event.timestamp}</td>
                <td>{event.description}</td>
                <td>{total.toFixed(2).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}</td>
              </tr>
            )
            total = +total - +event.value
            return row
          })}
          </tbody>
        </table>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  node: state.nodes.data,
  error: state.nodes.error,
  message: state.nodes.message,
  pending: state.nodes.pending
})

const mapDispatchToProps = dispatch => bindActionCreators({
  clearMessages,
  fetchNode,
  offlineNode,
  onlineNode,
  deleteNode,
  disburseNode,
  restoreNode,
  updateNode,
  unDisburseNode
}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Node)
