import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import moment from 'moment'
import Editable from 'react-x-editable'
import { Button, Alert } from 'reactstrap'

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
    this.toggleAlert = this.toggleAlert.bind(this)
  }

  componentWillMount() {
    let { match: { params } } = this.props
    this.props.fetchNode(params.slug)
  }

  handleDelete() {
    const { node } = this.props
    if ( window.confirm("Are you sure you want to delete this node?") ) {
      this.props.deleteNode(node.slug)
    }
  }

  handleSubmit(name, el) {
    const { node } = this.props
    let data = {}
    data[ name ] = el.value

    this.props.updateNode(node.slug, data)
  }

  toggleAlert() {
    this.props.clearMessages()
  }

  render() {
    const { match: { params }, node, pending, error, message } = this.props

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
        <div className="row pt-3">
          <div className="col-12 px-5">
            <div className="col-md-4">
              {this.displaySummary(node)}
              {this.displayConfiguration(node)}
            </div>
            {this.displayHistory(node)}
          </div>
        </div>
      </div>
    )
  }

  displayHeader(node) {
    const uptime = (node.onlineAt !== null) ? moment().diff(moment(node.onlineAt), 'days') : 0

    return (
      <div className="row">
        <h5 className="col-md-4">
          <img alt={node.crypto.slug} src={`/assets/images/logos/${node.crypto.slug}.png`} height="45px" width="45px"/> {node.crypto.name}
        </h5>
        <h5 className="col-md-4">
          IP: {node.ip}
        </h5>
        <h5 className="col-md-4">
          Uptime: {uptime} days
        </h5>
      </div>
    )
  }

  displaySummary(node) {
    return (
      <div className="row">
        <div className="col-md-12">
          <h5>Summary</h5>
          <table className="table">
            <tbody>
            <tr>
              <th>Value</th>
              <td>$ {(+node.value).toFixed(2).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")} USD</td>
            </tr>
            <tr>
              <th>Cost</th>
              <td>$ {(+node.cost).toFixed(2).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}</td>
            </tr>
            <tr>
              <th>Total Rewards</th>
              <td>$ {(+node.rewardTotal).toFixed(2).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}</td>
            </tr>
            <tr>
              <th>Reward %</th>
              <td>{(node.rewardTotal / node.cost).toFixed(2).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")} %</td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  displayConfiguration(node) {
    return (
      <div className="row">
        <div className="col-md-12">
          <h5>Configuration</h5>
          <table className="table">
            <tbody>
            <tr>
              <th>IP</th>
              <td>
                <Editable
                  dataType="text"
                  mode="inline"
                  name="ip"
                  showButtons={false}
                  value={node.ip}
                  display={value => {
                    return (<span style={{ borderBottom: "1px dashed", textDecoration: "none" }}>{value}</span>)
                  }}
                  handleSubmit={this.handleSubmit.bind(this, 'ip')}
                />
              </td>
            </tr>
            <tr>
              <th>Wallet</th>
              <td>
                <Editable
                  dataType="text"
                  mode="inline"
                  name="wallet"
                  showButtons={false}
                  value={node.wallet}
                  display={value => {
                    return (<span style={{ borderBottom: "1px dashed", textDecoration: "none" }}>{value}</span>)
                  }}
                  handleSubmit={this.handleSubmit.bind(this, 'wallet')}
                />
              </td>
            </tr>
            <tr>
              <th>Status</th>
              <td>
                {!node.deletedAt && <span className={`badge badge-${(node.status === 'online') ? 'success' : 'danger'}`}>{node.status}</span>}
                {!!node.deletedAt && <span className="badge badge-danger ml-1">Deleted</span>}
              </td>
            </tr>
            <tr>
              <th></th>
              <td>{this.displayActionButtons(node)}</td>
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
        buttons.push(<Button key="disable" onClick={this.props.offlineNode.bind(this, node.slug)} className="btn btn-sm btn-outline-secondary">Disable</Button>)
      } else {
        buttons.push(<Button key="enable" onClick={this.props.onlineNode.bind(this, node.slug)} className="btn btn-sm btn-outline-primary">Enable</Button>)
      }
    } else {
      buttons.push(<Button key="enableMissingData" disabled={true}>Enable (missing data)</Button>)
    }

    if ( node.status === 'sold' ) {
      buttons.push(<Button key="disburse" onClick={this.props.disburseNode.bind(this, node.slug)} className="btn btn-sm ml-2 btn-primary">Disburse</Button>)
    } else if ( node.status === 'disbursed' ) {
      buttons.push(<Button key="unDisburse" onClick={this.props.unDisburseNode.bind(this, node.slug)} className="btn btn-sm ml-2 btn-primary">Undisburse</Button>)
    }

    if ( node.deletedAt === null ) {
      buttons.push(<Button key="delete" onClick={this.handleDelete.bind(this)} className="btn btn-sm ml-2 btn-danger">Delete</Button>)
    } else {
      buttons.push(<Button key="restore" onClick={this.props.restoreNode.bind(this, node.slug)} className="btn btn-sm ml-2 btn-danger">Restore</Button>)
    }
    return buttons
  }

  displayHistory(node) {
    let total = node.events.map(e => e.value).reduce((t, v) => +t + +v)
    return (
      <div className="col-md-8">
        <h5>History</h5>
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
