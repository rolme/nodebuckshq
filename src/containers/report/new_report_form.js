import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { Col, Row } from 'reactstrap'

import { Typeahead } from 'react-bootstrap-typeahead'
import 'react-bootstrap-typeahead/css/Typeahead.css'

import {
  createReport,
} from '../../reducers/reports'

import {
  fetchCryptos
} from '../../reducers/cryptos'

class NewReportForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      cryptoId: '',
      redirect: false,
      slug: null
    }
  }

  componentWillMount() {
    let { cryptos, token } = this.props

    if (cryptos.length <= 1 && token !== '') {
      this.props.fetchCryptos()
    }
  }

  handleCryptoChange(crypto) {
    let cryptoId = (crypto.length === 1) ? crypto[0].id : ''
    this.setState({ cryptoId: cryptoId })
  }

  createReport() {
    let { user } = this.props
    let { cryptoId } = this.state

    this.props.createReport({ crypto_id: cryptoId, authored_by_user_id: user.id}, (slug) => {
      this.setState({
        redirect: true,
        slug: slug
      })
    })
  }

  render() {
    let { excludeCryptos } = this.props
    let { cryptoId, redirect, slug } = this.state

    if (redirect) {
      return <Redirect to={`/reports/${slug}`} />
    }

    let cryptos = this.props.cryptos.sort((a,b) => {
      if (a.name.toUpperCase() > b.name.toUpperCase()) { return 1 }
      if (a.name.toUpperCase() < b.name.toUpperCase()) { return -1 }
      return 0
    }).filter(crypto => {
      return !excludeCryptos.includes(crypto.id)
    })

    return(
      <Row className="my-2 p-2 mx-0 border justify-content-end bg-white">
        <Col lg={6} size={12}>
          <span className="align-middle text-muted">Select a cryptocurrency from the input box. Then click New Report.</span>
        </Col>
        <Col lg={4} size={12}>
          <Typeahead
            labelKey="name"
            options={cryptos}
            placeholder="Select a cryptocurrency."
            onChange={this.handleCryptoChange.bind(this)}
          />
        </Col>
        <Col lg={2} size={12} className="pt-lg-0 pt-1 text-right">
          <button className="btn btn-dark" disabled={cryptoId.length === 0} onClick={this.createReport.bind(this)}>New Report</button>
        </Col>
      </Row>
    )
  }

  displayCryptoOptions() {
    let { cryptos } = this.props

    return cryptos.sort((a,b) => {
      if (a.name.toUpperCase() > b.name.toUpperCase()) { return 1 }
      if (a.name.toUpperCase() < b.name.toUpperCase()) { return -1 }
      return 0
    }).map(crypto => {
      return <option key={crypto.id} value={crypto.id}>{crypto.name} ({crypto.symbol})</option>
    })
  }
}

const mapStateToProps = state => ({
  cryptos: state.cryptos.list,
  token: state.user.token,
  user: state.user.data
})

const mapDispatchToProps = dispatch => bindActionCreators({
  fetchCryptos,
  createReport,
}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NewReportForm)
