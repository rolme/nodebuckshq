import React, { Component } from 'react'
import { Input } from 'reactstrap'

export default class Speed extends Component {
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
    let { disabled, metric } = this.props
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
            <Input type="select" value={value} disabled={disabled} onChange={this.handleScoreChange.bind(this)}>
              <option value="10.0">&lt; 5 seconds</option>
              <option value="9.0">&lt; 10 seconds</option>
              <option value="8.0">&lt; 1 minute</option>
              <option value="7.0">&lt; 5 minutes</option>
              <option value="6.0">&lt; 10 minutes</option>
              <option value="5.0">&lt; 30 minutes</option>
              <option value="4.0">&lt; 1 hour</option>
              <option value="3.0">&lt; 5 hours</option>
              <option value="2.0">&lt; 12 hours</option>
              <option value="1.0">&lt; 1 day</option>
              <option value="0.0">n/a</option>
            </Input>
          </div>
        </div>
      </div>
    )
  }
}
