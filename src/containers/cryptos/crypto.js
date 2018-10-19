import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Container, Button, Form, FormGroup, Input } from 'reactstrap';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import { ClipLoader } from 'react-spinners';
import { 
  fetchCrypto,
  testRewardScraper 
} from '../../reducers/cryptos'

import 'react-datepicker/dist/react-datepicker.css';

class Crypto extends Component {

  constructor(props) {
    super(props)
    this.state = {
      date: moment(),
      wallet: ''
    }
  }

  componentWillMount() {
    let { match: { params } } = this.props
    this.props.fetchCrypto(params.slug)
  }

  handleDateChange = (date) => {
    this.setState({ date });
  }

  handleWalletChange = (e) => {
    this.setState({ wallet: e.target.value });
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
            { this.renderBuyFees(crypto) }
            <br/>
            { this.renderSellFees(crypto) }
            <br/>
            { this.renderMonthlyFees(crypto) }
            <br/>
            { this.renderRoi(crypto) }
          </div>
          <div className="col-md-6 px-2">
            { this.renderOrderBookTable(crypto) }
            <br/>
            { this.renderScrapedTable(crypto) }
            { this.renderCheckRewardScrapingForm(crypto) }
          </div>
        </div>
        { this.renderOrderBookPrices(crypto) }
      </div>
    )
  }

  renderCheckRewardScrapingForm(crypto) {
    const { wallet, date } = this.state
    const { rewarderMessage, rewarderError, successfullyScraped, isScraping } = this.props
    return(
      <Container className="mt-4 pt-4">
        <Form>
          <FormGroup>
            <div>Wallet:</div>
            <Input 
              placeholder="Enter wallet here"
              value={wallet}
              onChange={this.handleWalletChange}
            />
          </FormGroup>
          <FormGroup>
            <div>Date:</div>
            <DatePicker
              selected={date}
              onChange={this.handleDateChange}
            />
          </FormGroup>
          <Button 
            color="primary"
            onClick={() => this.props.testRewardScraper(crypto.slug, wallet, date)}
            style={{ height: 40, width: 200}}
          >
            { isScraping ?
              <div>
                <ClipLoader
                  size={30}
                  loading={true}
                />
              </div> :
              <div>Test Reward Scraping</div>
            }
          </Button>
          { rewarderError && <p className='mt-2 text-danger'>{rewarderMessage}</p> }
          { successfullyScraped &&
            <div>
              <div className="text-success mt-2">Url: {' '} 
                <a onClick={()=> window.open(successfullyScraped.url, "_blank")} style={{cursor: 'pointer'}}>
                  {successfullyScraped.url}
                </a>
              </div>
              <div className="text-success mt-1">Total amount: {successfullyScraped.total_amount_scraped}</div>
            </div>
          }
        </Form>
      </Container>
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
            { !!sortedOrders && sortedOrders.map((order, index) => {
              return(
                <tr key={index}>
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

  renderBuyFees(crypto) {
    let purchasablePrice = (+crypto.purchasablePrice).toFixed(2).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
    let nodePrice = (+crypto.nodePrice).toFixed(2).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
    let percentageSetupFee = ((+crypto.percentageSetupFee) * 100.0).toFixed(0)
    let percentageConversionFee = ((+crypto.percentageConversionFee) * 100.0).toFixed(0)
    let flatSetupFee = (+crypto.flatSetupFee).toFixed(2).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")

    let conversionFee = +crypto.purchasablePrice * +crypto.percentageConversionFee
    conversionFee = (+conversionFee).toFixed(2).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")

    let setupFee = (+crypto.purchasablePrice * +crypto.percentageSetupFee) + +crypto.flatSetupFee
    setupFee = (+setupFee).toFixed(2).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")

    return(
      <table className="table">
        <thead>
          <tr>
            <th>{crypto.name} ({crypto.symbol}): Buy Breakdown</th>
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
        </tbody>
      </table>
    )
  }

  renderSellFees(crypto) {
    let sellablePrice = (+crypto.sellablePrice).toFixed(2).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
    let nodeSellPrice = (+crypto.nodeSellPrice).toFixed(2).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
    let percentageDecommissionFee = ((+crypto.percentageDecommissionFee) * 100.0).toFixed(0)
    let percentageConversionFee = ((+crypto.percentageConversionFee) * 100.0).toFixed(0)

    let conversionFee = +crypto.sellablePrice * +crypto.percentageConversionFee
    conversionFee = (+conversionFee).toFixed(2).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")

    let decommissionFee = (+crypto.sellablePrice * +crypto.percentageDecommissionFee)
    decommissionFee = (+decommissionFee).toFixed(2).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")

    return(
      <table className="table">
        <thead>
          <tr>
            <th>{crypto.name} ({crypto.symbol}): Sell Breakdown</th>
            <th style={{textAlign: 'right'}}>${nodeSellPrice} USD</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th>Selling Price</th>
            <td style={{textAlign: 'right'}}>{sellablePrice}</td>
          </tr>
          <tr>
            <th>Decommission Fee ({percentageDecommissionFee}%)</th>
            <td style={{textAlign: 'right', color: 'red'}}>(-{decommissionFee})</td>
          </tr>
          <tr>
            <th>Conversion Fee ({percentageConversionFee}%)</th>
            <td style={{textAlign: 'right', color: 'red'}}>(-{conversionFee})</td>
          </tr>
        </tbody>
      </table>
    )
  }

  renderMonthlyFees(crypto) {
    let monthlyReward = (+crypto.dailyReward * 30 * +crypto.price * +crypto.percentageHostingFee).toFixed(2).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
    let dailyReward   = (+crypto.dailyReward * +crypto.price * +crypto.percentageHostingFee).toFixed(2).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
    let percentageHostingFee = ((+crypto.percentageHostingFee) * 100.0).toFixed(0)
    return(
      <table className="table">
        <thead>
          <tr>
            <th>{crypto.name} ({crypto.symbol}): Monthly Hosting/Reward</th>
            <th style={{textAlign: 'right'}}>${monthlyReward} USD</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th>Daily Reward Fee (USD)</th>
            <td style={{textAlign: 'right'}}>${dailyReward}</td>
          </tr>
          <tr>
            <th>Reward Fee %</th>
            <td style={{textAlign: 'right'}}>{percentageHostingFee}%</td>
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
  pending: state.cryptos.pending,
  rewarderMessage: state.cryptos.rewarderMessage,
  rewarderError: state.cryptos.rewarderError,
  successfullyScraped: state.cryptos.successfullyScraped,
  isScraping: state.cryptos.isScraping,
})

const mapDispatchToProps = dispatch => bindActionCreators({
  fetchCrypto,
  testRewardScraper,
}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Crypto)
