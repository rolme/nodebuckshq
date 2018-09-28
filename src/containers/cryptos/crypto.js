import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import {
  fetchCrypto
} from '../../reducers/cryptos'

class Crypto extends Component {
  componentWillMount() {
    let { match: { params } } = this.props
    this.props.fetchCrypto(params.slug)
  }

  render() {
    const { match: { params }, crypto, pending } = this.props

    if (pending) {
      return <h4 className="pt-3">Loading {params.slug}... </h4>
    }

    return (
      <div>
        <div className="row">
          <div className="col-md-6 px-2">
            { this.renderFees(crypto) }
            <br/>
            { this.renderRoi(crypto) }
          </div>
          <div className="col-md-6 px-2">
            { this.renderOrderBookTable(crypto) }
            <br/>
            { this.renderScrapedTable(crypto) }
          </div>
        </div>
        { this.renderOrderBookPrices(crypto) }
      </div>
    )
  }

  renderOrderBookPrices(crypto) {
    if (crypto.orders === undefined) { return }

    const sortedOrders = crypto.orders.sort((a,b) => a.price - b.price)
    return(
      <div className="row mx-2">
        <table className="table">
          <thead>
            <tr>
              <th>Price (BTC)</th>
              <th>Volume</th>
              <th>Exchange</th>
            </tr>
          </thead>
          <tbody>
            { !!sortedOrders && sortedOrders.map(order => {
              return(
                <tr key={order.id}>
                  <td>{order.price}</td>
                  <td>{order.volume}</td>
                  <td>{order.exchange}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    )
  }

  renderOrderBookTable(crypto) {
    let nodePrice = (+crypto.nodePrice).toFixed(2).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
    let price = (+crypto.price).toFixed(2).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")

    return(
      <table className="table">
        <thead>
          <tr>
            <th colSpan={2}>From Order Books</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th>Coin Price</th>
            <td style={{textAlign: 'right'}}>{price} USD</td>
          </tr>
          <tr>
            <th>Node Price</th>
            <td style={{textAlign: 'right'}}>${nodePrice} USD</td>
          </tr>
        </tbody>
      </table>
    )
  }

  renderScrapedTable(crypto) {
    let masternodes = (+crypto.masternodes).toFixed(0).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
    let estimatedNodePrice = (+crypto.estimatedNodePrice).toFixed(2).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
    let estimatedPrice = (+crypto.estimatedPrice).toFixed(2).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")

    return(
      <table className="table">
        <thead>
          <tr>
            <th colSpan={2}>From Masternode.Pro</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th>Nodes</th>
            <td style={{textAlign: 'right'}}>{masternodes}</td>
          </tr>
          <tr>
            <th>Stake</th>
            <td style={{textAlign: 'right'}}>{crypto.stake}</td>
          </tr>
          <tr>
            <th>Coin Price</th>
            <td style={{textAlign: 'right'}}>{estimatedPrice} USD</td>
          </tr>
          <tr>
            <th>Node Price</th>
            <td style={{textAlign: 'right'}}>${estimatedNodePrice} USD</td>
          </tr>
        </tbody>
      </table>
    )
  }

  renderFees(crypto) {
    let purchasablePrice = (+crypto.purchasablePrice).toFixed(2).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
    let nodePrice = (+crypto.nodePrice).toFixed(2).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
    let percentageSetupFee = ((+crypto.percentageSetupFee) * 100.0).toFixed(0)
    let percentageConversionFee = ((+crypto.percentageConversionFee) * 100.0).toFixed(0)
    let percentageHostingFee = ((+crypto.percentageHostingFee) * 100.0).toFixed(0)
    let flatSetupFee = (+crypto.flatSetupFee).toFixed(2).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")

    let conversionFee = +crypto.purchasablePrice * +crypto.percentageConversionFee
    conversionFee = (+conversionFee).toFixed(2).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")

    let setupFee = (+crypto.purchasablePrice * +crypto.percentageSetupFee) + +crypto.flatSetupFee
    setupFee = (+setupFee).toFixed(2).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")

    return(
      <table className="table">
        <thead>
          <tr>
            <th>{crypto.name} ({crypto.symbol}): Pricing Breakdown</th>
            <th style={{textAlign: 'right'}}>${nodePrice} USD</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th>Purchasing Price</th>
            <td style={{textAlign: 'right'}}>{purchasablePrice}</td>
          </tr>
          <tr>
            <th>Setup Fee ({percentageSetupFee}% + ${flatSetupFee})</th>
            <td style={{textAlign: 'right'}}>{setupFee}</td>
          </tr>
          <tr>
            <th>Conversion Fee ({percentageConversionFee}%)</th>
            <td style={{textAlign: 'right'}}>{conversionFee}</td>
          </tr>
          <tr>
            <th>Hosting Fee ({percentageHostingFee}%)</th>
            <td style={{textAlign: 'right'}}>monthly</td>
          </tr>
        </tbody>
      </table>
    )
  }

  renderRoi(crypto) {
    const monthlyRoiValue = (+crypto.monthlyRoiValue).toFixed(2).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
    const monthlyRoiPercentage = ((+crypto.monthlyRoiPercentage) * 100.0).toFixed(1)
    const weeklyRoiValue = (+crypto.weeklyRoiValue).toFixed(2).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
    const weeklyRoiPercentage = ((+crypto.weeklyRoiPercentage) * 100.0).toFixed(1)
    const yearlyRoiValue = (+crypto.yearlyRoiValue).toFixed(2).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
    const yearlyRoiPercentage = ((+crypto.yearlyRoiPercentage) * 100.0).toFixed(1)

    return(
      <table className="table">
        <thead>
          <tr>
            <th colSpan={3}>Projected ROI</th>
          </tr>
          <tr>
            <th>Weekly</th>
            <th>Montly</th>
            <th>Yearly</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              ${weeklyRoiValue} USD ({weeklyRoiPercentage}%)
            </td>
            <td>
              ${monthlyRoiValue} USD ({monthlyRoiPercentage}%)
            </td>
            <td>
              ${yearlyRoiValue} USD ({yearlyRoiPercentage}%)
            </td>
          </tr>
        </tbody>
      </table>
    )
  }
}

const mapStateToProps = state => ({
  crypto: state.cryptos.data,
  error: state.cryptos.error,
  message: state.cryptos.message,
  pending: state.cryptos.pending
})

const mapDispatchToProps = dispatch => bindActionCreators({
  fetchCrypto
}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Crypto)
