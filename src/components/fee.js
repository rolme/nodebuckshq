import React, { Component } from 'react'
import { Input } from 'reactstrap'

export default class Fee extends Component {
  constructor(props) {
    super(props)
    this.state = {
      reset: !!this.props.reset,
      summary: this.props.summary,
      value: this.props.value
    }

    this.onScoreChange = this.props.onScoreChange.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.reset) {
      this.setState({
        reset: false,
        summary: nextProps.summary,
        text: nextProps.text,
        value: nextProps.value
      })
    }
    this.setState({ disabled: nextProps.disabled })
  }

  handleScoreChange(e) {
    let value = e.target.value
    this.props.onScoreChange(value)
    this.setState({ value })
  }

  render() {
    let { disabled, metric, type } = this.props
    let { value } = this.state
    return(
      <div className="pb-4">
        <div className="row">
          <div className="col-md-8 text-muted mt-2">{metric.definition}</div>
          <div className="col-md-4 text-muted mt-2">
            <small style={{position: 'absolute', bottom: '0'}}>
              last updated:<br/>
              {metric.updatedAt}
            </small>
          </div>
        </div>
        <div className="row">
          <div className="col-md-8">
            Translated value: {value}
          </div>
          <div className="col-md-4">
              {this.displayOptions(value, disabled, type)}
          </div>
        </div>
      </div>
    )
  }

  displayOptions(value, disabled, type) {
    if (type === 'micro') {
      return (
        <Input type="select" value={value} disabled={disabled} onChange={this.handleScoreChange.bind(this)}>
          <option value="10.0">Free</option>
          <option value="9.0">&lt; $0.01</option>
          <option value="8.0">&lt; $0.02</option>
          <option value="7.0">&lt; $0.03</option>
          <option value="6.0">&lt; $0.04</option>
          <option value="5.0">&lt; $0.06</option>
          <option value="4.0">&lt; $0.10</option>
          <option value="3.0">&lt; $0.15</option>
          <option value="2.0">&lt; $0.20</option>
          <option value="1.0">&lt; $0.25</option>
          <option value="0.0">n/a</option>
        </Input>
      )
    } else {
      return (
        <Input type="select" value={value} disabled={disabled} onChange={this.handleScoreChange.bind(this)}>
          <option value="10.0">Free</option>
          <option value="9.0">&lt; $0.10</option>
          <option value="8.0">&lt; $1.00</option>
          <option value="7.0">&lt; $2.00</option>
          <option value="6.0">&lt; $4.00</option>
          <option value="5.0">&lt; $6.00</option>
          <option value="4.0">&lt; $10.00</option>
          <option value="3.0">&lt; $15.00</option>
          <option value="2.0">&lt; $20.00</option>
          <option value="1.0">&lt; $25.00</option>
          <option value="0.0">n/a</option>
        </Input>
      )
    }
  }
}
