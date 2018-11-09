import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { withRouter, NavLink } from 'react-router-dom'

import Toggle from 'react-toggle'
import "react-toggle/style.css"

import {
  delistCrypto,
  fetchCryptos,
  relistCrypto
} from '../../reducers/cryptos'

class Cryptos extends Component {
  componentWillMount() {
    const { list, user } = this.props

    if ( list.length <= 1 && user !== '' ) {
      this.props.fetchCryptos()
    }
  }

  handleListedToggle(crypto) {
    if (crypto.isListed) {
      this.props.delistCrypto(crypto.slug)
    } else {
      this.props.relistCrypto(crypto.slug)
    }
  }

  render() {
    let { list, user } = this.props

    if ( user === null || list === null ) {
      return <div>Loading Cryptos</div>
    }

    const sortedList = this.sortTableByName(list)

    return (
      <div className="row">
        <div className="col-12 px-5">
          <h2 className="mt-2">Cryptos ({list.length})</h2>
          <table className="table table-striped">
            <thead>
              <tr>
                <th className="text-center">Id</th>
                <th className="text-center">Name</th>
                <th className="text-center">Symbol</th>
                <th className="text-center">Purchasable?</th>
                <th className="text-center">Action</th>
                <th className="text-center">Listed</th>
              </tr>
            </thead>
            <tbody>
              {this.displayCryptos(sortedList)}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  sortTableByName(list) {
    let sortedData = [].concat(list)

    sortedData.sort((a, b) => {
      if ( a.name < b.name ) return -1;
      if ( a.name > b.name ) return 1;
      return 0;
    })

    return sortedData
  }

  displayCryptos(list) {
    return list.map(item => {
      return (
        <tr key={item.slug}>
          <td className="text-center">{item.slug}</td>
          <td className="text-center"><NavLink to={`/cryptos/${item.slug}`}>{item.name}</NavLink></td>
          <td className="text-center">{item.symbol}</td>
          <td className="text-center">{this.purchaseStatus(item)}</td>
          <td className="text-center"><NavLink to={`/cryptos/${item.slug}/edit`}>Edit</NavLink></td>
          <td className="text-center">
            <Toggle
              defaultChecked={item.isListed}
              onChange={(event) => this.handleListedToggle(item)}
            />
          </td>
        </tr>
      )
    })
  }

  purchaseStatus(crypto) {
    const { purchasable, purchasableStatus} = crypto

    if (purchasableStatus === 'Buy Node') {
      return (purchasable) ? 'Available' : 'Out of Stock'
    } else {
      return crypto.purchasableStatus
    }
  }
}

const mapStateToProps = state => ({
  list: state.cryptos.list,
  user: state.user.user
})

const mapDispatchToProps = dispatch => bindActionCreators({
  delistCrypto,
  fetchCryptos,
  relistCrypto
}, dispatch)

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Cryptos))
