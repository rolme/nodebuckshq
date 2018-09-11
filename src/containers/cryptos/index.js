import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { withRouter, NavLink } from 'react-router-dom'

import {
  fetchCryptos
} from '../../reducers/cryptos'

class Cryptos extends Component {
  componentWillMount() {
    const { list, user } = this.props

    if (list.length <= 1 && user !== '') {
      this.props.fetchCryptos()
    }
  }

  render() {
    let { list, user } = this.props

    if (user === null || list === null) {
      return <div>Loading Cryptos</div>
    }

    return(
      <div className="row">
        <div className="offset-1 col-10">
          <h2 className="mt-2">Cryptos ({list.length})</h2>
          <table className="table table-striped">
            <thead>
              <tr>
                <th className="text-center">Id</th>
                <th className="text-center">Name</th>
                <th className="text-center">Symbol</th>
                <th className="text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {this.displayCryptos(list)}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  displayCryptos(list) {
    return list.map(item => {
      return(
        <tr key={item.slug}>
          <td className="text-center">{item.slug}</td>
          <td className="text-center"><NavLink to={`/cryptos/${item.slug}`}>{item.name}</NavLink></td>
          <td className="text-center">{item.symbol}</td>
          <td className="text-center"><NavLink to={`/cryptos/${item.slug}/edit`}>Edit</NavLink></td>
        </tr>
      )
    })
  }
}

const mapStateToProps = state => ({
  list: state.cryptos.list,
  user: state.user.user
})

const mapDispatchToProps = dispatch => bindActionCreators({
  fetchCryptos
}, dispatch)

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Cryptos))
