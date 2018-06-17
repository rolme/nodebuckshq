import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { Button } from 'reactstrap'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

import Fee from '../../components/fee'
import Metric from '../../components/metric'
import Speed from '../../components/speed'
import Throughput from '../../components/throughput'

import {
  updateCategoryScores,
  updateReportScore,
} from '../../reducers/reports'

class MetricsEditor extends Component {
  constructor(props) {
    super(props)
    this.state = {
      changes: {},
      reason: this.props.reason || "",
      summaryDescription: this.props.summary || "",
      reset: false
    }

    this.onModified = this.props.onModified.bind(this)
    this.onScoreChange = this.props.onScoreChange.bind(this)
    this.onSave = this.props.onSave.bind(this)
  }

  componentDidMount() {
    this.onScoreChange(this.liveScore())
  }

  liveScore(reset=false) {
    const { score } = this.props
    const { changes } = this.state

    return score.metricScores.sort((a,b) => {
      return a.order < b.order
    }).map(ms => {
      let changedScore = changes[ms.slug]
      if (reset || changedScore === undefined) {
        return parseFloat(ms.value) * parseFloat(ms.weight)
      } else {
        return parseFloat(changedScore.value) * parseFloat(ms.weight)
      }
    }).reduce((a, c) => a + c)
  }

  handleSummaryChange(slug, newSummary) {
    const { score }   = this.props
    const metricScore = score.metricScores.find(ms => ms.slug === slug)
    let { changes }   = this.state

    if (changes[slug] === undefined) {
      changes[slug] = { value: metricScore.value }
    }
    changes[slug].summary = newSummary

    this.setState({ changes: changes, reset: false })
    this.onModified(true)
  }

  handleScoreChange(slug, value) {
    const { score }   = this.props
    const metricScore = score.metricScores.find(ms => ms.slug === slug)
    let { changes }   = this.state

    if (changes[slug] === undefined) {
      changes[slug] = { summary: metricScore.summary }
    }
    changes[slug].value = value
    this.onScoreChange(this.liveScore())
    this.onModified(true)
    this.setState({ changes: changes, reset: false })
  }

  handleReasonChange(value) {
    let { changes } = this.state

    changes.reason = value
    this.setState({
      changes: changes,
      reason: value
    })
    this.onModified(true)
  }

  handleSummaryDescriptionChange(value) {
    this.setState({ summaryDescription: value })
    this.onModified(true)
  }

  handleResetClick() {
    const { reason, summary } = this.props
    const reset = true
    this.setState({
      changes: {},
      reason: reason || "",
      summaryDescription: summary || "",
      reset: true
    })
    this.onScoreChange(this.liveScore(reset))
    this.onModified(false)
}

  handleSaveClick() {
    const { score, isForEditPage, rating } = this.props
    const { changes, summaryDescription } = this.state
    this.props.updateCategoryScores(score, changes, rating, status => {
      this.onSave()
    })
    if(isForEditPage) {
      this.props.updateReportScore(score.slug, { summary: summaryDescription })
    }
  }

  render() {
    const { pending, score, isForEditPage } = this.props
    return(
      <div className="row bg-white">
        <div className="col-12">
          <div className="row">
            <div className="col-12 pt-3">
              { this.displayMessage() }
              { this.displayMetrics(score) }
              { isForEditPage && this.displaySummary() }
            </div>
          </div>
          { this.displayReasonField() }
          <div className="row pt-5 pb-3">
            <div className="col-6">
              <Button color="primary" disabled={pending} onClick={this.handleSaveClick.bind(this)}>Save</Button>
            </div>
            <div className="col-6 text-right">
              <Button color="secondary" disabled={pending} onClick={this.handleResetClick.bind(this)}>Reset</Button>
            </div>
          </div>

        </div>
      </div>
    )
  }

  displayMessage() {
    const { message } = this.props
    if (message) {
      return <p>{message}</p>
    }
  }

  displaySummary() {
    const { pending } = this.props
    let { summaryDescription } = this.state
    return(
      <div className="row mb-5">
        <div className="col-12 pb-3">
          Summary
          <ReactQuill theme="snow" disabled={pending} style={{"height": "80px"}} value={summaryDescription} onChange={this.handleSummaryDescriptionChange.bind(this)}/>
        </div>
      </div>
    )
  }

  displayMetrics(score) {
    const { pending } = this.props
    const { reset } = this.state

    if (score.name === 'speed') {
      let sortedMetricScores = score.metricScores.sort((a,b) => a.order > b.order)
      let throughput = sortedMetricScores[0]
      let speed = sortedMetricScores[1]
      return(
        <div>
          <Throughput
            key={throughput.id}
            metric={throughput}
            summary={throughput.summary}
            value={throughput.value}
            reset={reset}
            disabled={pending}
            onSummaryChange={this.handleSummaryChange.bind(this, throughput.slug)}
            onScoreChange={this.handleScoreChange.bind(this, throughput.slug)} />
          <Speed
            key={speed.id}
            metric={speed}
            summary={speed.summary}
            value={speed.value}
            reset={reset}
            disabled={pending}
            onScoreChange={this.handleScoreChange.bind(this, speed.slug)} />
        </div>
      )
    } else if (score.name === 'fee') {
      let sortedMetricScores = score.metricScores.sort((a,b) => a.order > b.order)
      let micro = sortedMetricScores[0]
      let regular = sortedMetricScores[1]
      return(
        <div>
          <Fee
            key={micro.id}
            type='micro'
            metric={micro}
            summary={micro.summary}
            value={micro.value}
            reset={reset}
            disabled={pending}
            onScoreChange={this.handleScoreChange.bind(this, micro.slug)} />
          <Fee
            key={regular.id}
            type='regular'
            metric={regular}
            summary={regular.summary}
            value={regular.value}
            reset={reset}
            disabled={pending}
            onScoreChange={this.handleScoreChange.bind(this, regular.slug)} />
        </div>
      )
    }

    return score.metricScores.sort((a,b) => {
      return +a.order > +b.order
    }).map(metric => {
      return(
        <Metric
          key={metric.id}
          metric={metric}
          summary={metric.summary}
          value={metric.value}
          reset={reset}
          disabled={pending}
          onSummaryChange={this.handleSummaryChange.bind(this, metric.slug)}
          onScoreChange={this.handleScoreChange.bind(this, metric.slug)} />
      )
    })
  }

  displayReasonField() {
    const { isPublished, pending } = this.props
    let { reason } = this.state

    if (isPublished) {
      return(
        <div className="row">
          <div className="col-12 pb-3">
            Reason (optional)
            <ReactQuill theme="snow" disabled={pending} style={{"height": "80px"}} value={reason} onChange={this.handleReasonChange.bind(this)}/>
          </div>
        </div>
      )
    }
  }
}

const mapStateToProps = state => ({
  error: state.reports.error,
  message: state.reports.message,
  pending: state.reports.pending
})

const mapDispatchToProps = dispatch => bindActionCreators({
  updateCategoryScores,
  updateReportScore,
}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MetricsEditor)
