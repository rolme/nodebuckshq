import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

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
                <th>id</th>
                <th>name</th>
                <th>symbol</th>
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
          <td style={{verticalAlign: 'middle'}}>{item.slug}</td>
          <td>{item.name}</td>
          <td>{item.symbol}</td>
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Cryptos)
