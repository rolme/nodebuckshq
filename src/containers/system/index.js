import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import { valueFormat } from '../../lib/helpers'

import Editable from 'react-x-editable'

import {
  fetchSystem,
  updateSystemSetting
} from '../../reducers/system'

class System extends Component {
  constructor(props) {
    super(props)
    this.selectEditableField = this.selectEditableField.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  componentWillMount() {
    const { system } = this.props

    if ( Object.keys(system).length === 0 ) {
      this.props.fetchSystem()
    }
  }

  handleSubmit(el) {
    this.props.updateSystemSetting('max float', el.value)
  }

  render() {
    const { system } = this.props

    if (Object.keys(system).length === 0) { return <span></span> }
    return (
      <div className="row">
        <div className="col-12 px-5">
          <h2 className="mt-2">System Info</h2>
        </div>
        { this.displayBalances(system.balances) }
        { this.displaySettings(system.settings) }
      </div>
    )
  }

  displayBalances(balances) {
    return(
      <div className="col-12 pt-2 pl-5">
        <h5>Balances</h5>
        <table className="table table-striped">
          <tbody>
            { !!balances && balances.map(balance =>
              <tr key={balance.symbol}>
                <td>{balance.name}</td>
                <td>{valueFormat(balance.value, 3)} {balance.symbol}</td>
                <td>{valueFormat(balance.btc, 3)} BTC</td>
                <td>${valueFormat(balance.usd, 2)} USD</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    )
  }

  displaySettings(settings) {
    const { unpaidAmount } = this.props.system
    const maxFloat = settings.find(s => s.key === 'max float')
    const currentFloat = +maxFloat.value - +unpaidAmount
    return(
      <div className="col-12 pt-2 pl-5">
        <h5>Float</h5>
        <table className="table table-striped">
          <tbody>
            <tr>
              <td>Max</td>
              <td>
                <Editable
                  dataType="text"
                  mode="inline"
                  name="maxFloat"
                  showButtons={false}
                  value={maxFloat.value}
                  display={value => {
                    return (<span onClick={this.selectEditableField} style={{ borderBottom: "1px dashed", textDecoration: "none" }}>${valueFormat(value, 2)}</span>)
                  }}
                  handleSubmit={(el) => this.handleSubmit(el)}
                />
              </td>
              <td>{maxFloat.description}</td>
            </tr>
            <tr>
              <td>Current</td>
              <td>${valueFormat(currentFloat,2)}</td>
              <td>Amount remaining for new orders</td>
            </tr>
          </tbody>
        </table>
      </div>
    )
  }

  selectEditableField() {
    setTimeout(() => {
      const element = document.getElementById('formBasicText')
      !!element && element.select()
    }, 5)
  }
}

const mapStateToProps = state => ({
  system: state.system.data,
  user: state.user.user
})

const mapDispatchToProps = dispatch => bindActionCreators({
  fetchSystem,
  updateSystemSetting
}, dispatch)

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(System))
