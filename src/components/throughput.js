import React, { Component } from 'react'
import { Input, InputGroup, InputGroupAddon } from 'reactstrap'
import { debounce } from 'underscore'

export default class Throughput extends Component {
  constructor(props) {
    super(props)
    this.onSummaryChange = debounce(this.props.onSummaryChange, 1000)

    this.state = {
      reset: !!this.props.reset,
      summary: this.props.summary,
      value: this.props.value
    }

    this.onScoreChange = this.props.onScoreChange.bind(this)
    this.onSummaryChange = this.props.onSummaryChange.bind(this)
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

  convertValueToScore(value) {
    if (value >= 24000) {
      return 10
    } else if (value >= 10000) {
      return (9 + ((value - 10000)/(24000-10000)))
    } else if (value >= 5000) {
      return (8 + ((value - 5000)/(10000-5000)))
    } else if (value >= 1000) {
      return (7 + ((value - 1000)/(5000-1000)))
    } else if (value >= 500) {
      return (6 + ((value - 500)/(1000-500)))
    } else if (value >= 200) {
      return (5 + ((value - 200)/(500-200)))
    } else if (value >= 100) {
      return (4 + ((value - 100)/(200-100)))
    } else if (value >= 50) {
      return (3 + ((value - 50)/(100-50)))
    } else if (value >= 20) {
      return (2 + ((value - 20)/(50-20)))
    } else {
      return 1
    }
  }

  handleScoreChange(e) {
    let value = e.target.value
    let score = this.convertValueToScore(value)
    this.onSummaryChange(value)
    this.props.onScoreChange(score)
    this.setState({ summary: value, value })
  }

  render() {
    let { disabled, metric } = this.props
    let { summary } = this.state

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
            Translated value: {this.convertValueToScore(summary)}
          </div>
          <div className="col-md-4">
            <InputGroup>
              <Input type="number" disabled={disabled} value={summary} onChange={this.handleScoreChange.bind(this)}/>
              <InputGroupAddon addonType="append">tx/sec</InputGroupAddon>
            </InputGroup>
          </div>
        </div>
      </div>
    )
  }
}
