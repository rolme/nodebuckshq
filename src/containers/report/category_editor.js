import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { capitalize } from '../../lib/helpers'

import Editor from '../../components/editor'
import MetricsEditor from './metrics_editor'
import Note from '../../components/note'

import {
  updateReportScore,
} from '../../reducers/reports'

class CategoryEditor extends Component {
  constructor(props) {
    super(props)
    this.state = {
      modified: false,
      rating: this.props.score.value,
      showMetricsEditor: this.props.isOpenedByDefault,
      height: 0,
    }
    this.onSave = this.props.onSave.bind(this)
  }

  componentDidMount() {
    if(this.divElement) {
      const height = this.divElement.clientHeight;
      this.setState({ height });
    }
  }

  toggleMetricsEditor() {
    this.setState({ showMetricsEditor: !this.state.showMetricsEditor})
    this.props.onMetricEdit(this.props.score.id)
  }

  handleSummaryChange(slug, summary) {
    this.props.updateReportScore(slug, { summary: summary })
  }

  handleScoreChange(value) {
    this.setState({ rating: value})
  }

  handleModified(isModified) {
    this.setState({ modified: isModified })
  }

  handleSave() {
    this.setState({
      modified: false,
      showMetricsEditor: true
    })
    this.onSave()
  }

  updateHeight() {
    if(this.divElement) {
      const height = this.divElement.clientHeight;
      this.setState({ height });
    }
  }

  render() {
    if(this.props.isForEditPage) return this.renderCategoryForEditPage()
    return(
      <div key={this.props.score.id} className="p-5 bg-light rounded">
        { this.renderContent() }
      </div>
    )
  }

  renderContent() {
    let { reportSlug, score, isForEditPage } = this.props
    let { modified, showMetricsEditor, rating } = this.state

    return (
      <div>
        <div className="row">
          <h4 className="col-9">
            {capitalize(score.name)}: {Number(score.value).toFixed(2)}
            <span className="ml-2 text-danger">(Current: {Number(rating).toFixed(2)})</span>
          </h4>
          <div className="col-3 text-right">
            { !isForEditPage &&
              <button className="btn btn-secondary mb-3" color="secondary" disabled={modified} onClick={this.toggleMetricsEditor.bind(this)}>
                {(!showMetricsEditor) ? 'Edit Metrics' : 'Close'}
              </button>
            }
          </div>
        </div>
        {this.displayEditor(score, reportSlug)}
      </div>
    )
  }

  renderCategoryForEditPage() {
    return(
      <div className="d-inline-flex col-12">
        <div 
          key={this.props.score.id} 
          className="col-8 p-5 mb-3 bg-light rounded" 
          ref={ (divElement) => this.divElement = divElement}
        >
          { this.renderContent() }
        </div>
        <div className="col-md-4">
          <Note
            comments={this.props.comments} 
            noteType={this.props.score.name}
            height={this.state.height}
          />
        </div>
      </div>
    )
  }

  displayEditor(score, reportSlug) {
    let { showMetricsEditor, rating } = this.state

    if (showMetricsEditor) {
      return <MetricsEditor
        isPublished={this.props.isPublished}
        score={score}
        reason={score.reason}
        rating={rating}
        summary={score.summary}
        onModified={this.handleModified.bind(this)}
        onSave={this.handleSave.bind(this)}
        onScoreChange={this.handleScoreChange.bind(this)}
        isForEditPage={this.props.isForEditPage} />
    } else {
      return <Editor
        text={score.summary || 'none'}
        onChange={this.handleSummaryChange.bind(this, score.slug)} />
    }
  }
}



const mapStateToProps = state => ({
  user: state.user.user
})

const mapDispatchToProps = dispatch => bindActionCreators({
  updateReportScore
}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CategoryEditor)
