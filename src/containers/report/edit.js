import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import CategoryEditor from './category_editor'
import IntroductionEditor from './introduction_editor'

import {
  fetchReport,
  deleteUpdate,
  publishUpdate,
  publishReport,
  refreshReport,
  unpublishReport,
  unpublishUpdate,
  updateReport,
} from '../../reducers/reports'

class EditReport extends Component {
  constructor(props) {
    super(props)
    this.state = {
      reportSlug: this.props.match.params.slug,
      openCategories: [],
      reset: false
    }
  }

  componentWillMount() {
    let { match: { params } } = this.props
    this.props.fetchReport(params.slug)
  }

  handleMetricEditor(categoryId) {
    let { openCategories } = this.state
    if (openCategories.includes(categoryId)) {
      openCategories.splice(openCategories.indexOf(categoryId), 1)
    } else {
      openCategories.push(categoryId)
    }
    this.setState({ openCategories: openCategories })
  }

  handleDescriptionChange(description) {
    let { reportSlug } = this.state
    this.props.updateReport(reportSlug, description)
  }

  handleSave() {
    this.props.fetchReport(this.props.report.slug)
  }

  render() {
    let { report, user } = this.props

    if (user === null || report === null || report.noteComments === null) {
      return <div>Loading report</div>
    }

    return(
      <div className="row">
        <div className="offset-md-1 col-md-10 mt-3">
          <h2>{report.crypto.name} ({report.crypto.symbol}) Report</h2>
          <div className="text-left bg-white">
            { this.displaySummary() }
            { this.displayScores() }
          </div>
        </div>
      </div>
    )
  }

  displayScores() {
    const { report } = this.props
    const { scores } = report
    return scores.sort((a,b) => {
      return +a.order > +b.order
    }).map(score => {
      return <CategoryEditor
        key={score.id}
        reportSlug={report.slug}
        isPublished={report.status === 'published'}
        score={score}
        comments={report.noteComments.filter(comment => comment.noteType === score.name)}
        reset={this.state.reset}
        onMetricEdit={this.handleMetricEditor.bind(this)}
        onSave={this.handleSave.bind(this)}
        isForEditPage={true}
        isOpenedByDefault={true} />
    })
  }

  displaySummary() {
    return <IntroductionEditor 
      report={this.props.report} 
      handleDescriptionChange={this.handleDescriptionChange.bind(this)} />
  }
}

const mapStateToProps = state => ({
  report: state.reports.selected,
  user: state.user.user
})

const mapDispatchToProps = dispatch => bindActionCreators({
  fetchReport,
  deleteUpdate,
  publishUpdate,
  publishReport,
  refreshReport,
  unpublishReport,
  unpublishUpdate,
  updateReport,
}, dispatch)

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(EditReport))
