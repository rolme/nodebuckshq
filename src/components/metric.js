import React, { Component } from 'react'
import { Input } from 'reactstrap'
import { debounce } from 'underscore'

export default class Metric extends Component {
  constructor(props) {
    super(props)
    this.onSummaryChange = debounce(this.props.onSummaryChange, 1000)

    this.state = {
      reset: !!this.props.reset,
      summary: this.props.summary,
      value: this.props.value
    }
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

  handleSummaryChange(e) {
    this.setState({ summary: e.target.value })
    this.onSummaryChange(e.target.value)
  }

  handleScoreChange(e) {
    let score = parseFloat(e.target.value)

    console.log('score', score)
    this.props.onScoreChange((isNaN(score)) ?  0.0 : score)
    this.setState({ value: (isNaN(score)) ? '' : score })
  }

  render() {
    let { disabled, metric } = this.props
    let { summary, value } = this.state

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
            <Input type="text" disabled={disabled} value={summary} onChange={this.handleSummaryChange.bind(this)}/>
          </div>
          <div className="col-md-4">
            <Input type="number" disabled={disabled} value={value} onChange={this.handleScoreChange.bind(this)} />
          </div>
        </div>
      </div>
    )
  }
}
