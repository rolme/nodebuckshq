import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import moment from 'moment'

import {
  fetchNode,
  updateNode
} from '../../reducers/nodes'

class Node extends Component {
  componentWillMount() {
    let { match: { params } } = this.props
    this.props.fetchNode(params.slug)
  }

  render() {
    const { match: { params }, node, pending } = this.props

    if (pending || node.slug === undefined) {
      return <h4 className="pt-3">Loading {params.slug}... </h4>
    }

    return(
      <div>
        {this.displayHeader(node)}
        <div className="row pt-3">
          {this.displayHistory(node)}
          <div className="col-md-4">
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
                      <td>{(node.rewardTotal/node.cost).toFixed(2).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")} %</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
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

  displayHistory(node) {
    let total = node.events.map(e => e.value).reduce((t, v) => +t + +v)
    return(
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
  fetchNode,
  updateNode
}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Node)
