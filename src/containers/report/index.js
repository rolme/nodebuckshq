import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link, withRouter } from 'react-router-dom'
import { capitalize } from '../../lib/helpers'

import { Button, Alert } from 'reactstrap'
import CategoryEditor from './category_editor'
import Editor from '../../components/editor'

import './report.css'

import {
  fetchReport,
  deleteUpdate,
  publishUpdate,
  publishReport,
  refreshReport,
  unpublishReport,
  unpublishUpdate,
  updateReport
} from '../../reducers/reports'

class Report extends Component {
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

  handleDescriptionChange(description) {
    let { reportSlug } = this.state
    this.props.updateReport(reportSlug, description)
  }

  handlePublish() {
    let { reportSlug } = this.state
    this.props.publishReport(reportSlug)
  }

  handleUnpublish() {
    let { reportSlug } = this.state
    this.props.unpublishReport(reportSlug)
  }

  handlePublishUpdate(id) {
    this.props.publishUpdate(id)
  }

  handleUnpublishUpdate(id) {
    this.props.unpublishUpdate(id)
  }

  handleDeleteUpdate(id) {
    if (window.confirm("You are about to delete this update. Are you sure?")) {
      this.props.deleteUpdate(id)
    }
  }

  hideAlert () {
    this.setState({reset: false})
  }

  handleRefreshClick() {
    const { slug } = this.props.report
    this.props.refreshReport(slug)
    this.setState({reset: true})
    setTimeout(this.hideAlert.bind(this), 1800);
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

  handleSave() {
    this.props.fetchReport(this.props.report.slug)
  }

  render() {
    let { report, user } = this.props

    if (user === null || report === null) {
      return <div>Loading report</div>
    }

    let disableRefresh = (this.state.openCategories.length > 0) ? ' disabled' : '';
    return(
      <div className="row">
        <div className="offset-md-1 col-md-10">
          <Alert color="default" isOpen={this.state.reset} className="refresh-alert">
             Report has been refreshed
          </Alert>
          <div className="row">
            <div className="col-md-8">
              <h2>{report.crypto.name} ({report.crypto.symbol}) Report</h2>
            </div>
            <div className="col-md-4 text-right">
              <Link to={`/cryptos/${report.crypto.slug}`}><Button color="secondary" outline>Edit {report.crypto.name}</Button></Link>
            </div>
          </div>
          <div className="row">
            <div className="col-md-4">
              <div className="row">
                <div className="card mr-3">
                  <div className="card-header">
                    <h5 className="card-title">Report Info</h5>
                    <h6 className="card-subtitle mb-2 text-muted">Author: {report.author.fullName}</h6>
                    <button className={`btn btn-outline-danger ${disableRefresh}`} disabled={disableRefresh.length > 0} onClick={this.handleRefreshClick.bind(this)}>
                      Refresh
                    </button>
                  </div>
                  <div className="card-body">
                    <dl className="row">
                      <dt className="col-sm-5 text-right">Created</dt>
                      <dd className="col-sm-7 text-truncate text-left">{report.createdAt}</dd>
                      <dt className="col-sm-5 text-right">Updated</dt>
                      <dd className="col-sm-7 text-truncate text-left">{report.updatedAt}</dd>
                      <dt className="col-sm-5 text-right">Repository</dt>
                      <dd className="col-sm-7 text-truncate text-left" style={{fontSize: '12px'}}>
                        <a href={report.crypto.repository} target='_new'>{report.crypto.repository}</a>
                      </dd>
                      <dt className="col-sm-5 text-right">Branch</dt>
                      <dd className="col-sm-7 text-truncate text-left">{report.crypto.branch}</dd>
                      <dt className="col-sm-5 text-right">Status</dt>
                      <dd className="col-sm-7 text-truncate text-left">{report.status || 'draft'}</dd>
                    </dl>
                    <Link to={`/reports`} className="card-link">List</Link>
                  </div>
                </div>
              </div>
              <div className="row pt-2">
                <div className="card mr-3">
                  <div className="card-header">
                    <h5 className="card-title">Actions</h5>
                  </div>
                  <div className="card-body">
                    <dl className="row">
                      <dt className="col-sm-5 text-right">Logo?</dt>
                      <dd className="col-sm-7 text-truncate text-left">
                        { this.displayLogo(report.logo) }
                      </dd>
                      <dt className="col-sm-5 text-right">Reviewed?</dt>
                      <dd className="col-sm-7 text-truncate text-left">{(report.reviewer.length) ? report.reviewer.fullName : 'No'}</dd>
                      <dt className="col-sm-5 text-right">Criteria</dt>
                      <dd className="col-sm-7 text-truncate text-left">{this.criteriaCompleted()}/10 completed</dd>
                    </dl>
                  </div>
                  <div className="card-footer text-center">
                    { this.displayPublishAction() }
                  </div>
                </div>
              </div>

              { this.displayUpdates() }
            </div>
            <div className="col-8 text-left bg-white">
              <div className="col-12 p-5 my-3 bg-light">
                <Editor
                  fieldName='Introduction'
                  onChange={this.handleDescriptionChange.bind(this)}
                  text={report.description || 'none'}
                />
              </div>
              { this.displayScores() }
            </div>
          </div>
        </div>
      </div>
    )
  }

  displayLogo(logo) {
    if (!!logo) {
      return <img src={`https://rency.com${logo}`} width="16" height="16" alt="logo missing"/>
    }
    return <strong>None</strong>
  }

  displayPublishAction() {
    const { report } = this.props
    if (report.status === 'published') {
      return <Button color="warning" onClick={this.handleUnpublish.bind(this)}>Unpublish</Button>
    }
    return <Button color="primary" onClick={this.handlePublish.bind(this)}>Publish</Button>
  }

  displayPublishUpdateAction(update) {
    if (update.status === 'published') {
      return <Button color="warning" onClick={this.handleUnpublishUpdate.bind(this, update.id)}>Unpublish</Button>
    }
    return <Button color="primary" onClick={this.handlePublishUpdate.bind(this, update.id)}>Publish</Button>
  }

  displayUpdates() {
    const { updates } = this.props.report
    if (updates.length < 0) {
      return (<div>No updates</div>)
    }
    return(
      <div className="row pt-2 mt-2 mr-1">
        <div className="col-12">
          <h5>Updates ({updates.length})</h5>
        </div>
        {(
          updates.map(update => {
            let dif = update.newValue - update.previousValue
            return(
              <div className="col-12 bg-white p-2 my-2 border" key={update.id}>
                <div className="row">
                  <div className="col-4"><strong>{capitalize(update.category)}</strong></div>
                  <div className="col-4">{(dif > 0) ? 'Up' : 'Down'}</div>
                  <div className="col-4">{parseFloat(update.newValue).toFixed(1)} ({dif.toFixed(2)})</div>
                </div>
                <div className="row">
                  <div className="col-12">
                    <p dangerouslySetInnerHTML={{__html: update.reason || 'no reason' }} />
                  </div>
                </div>
                <div className="row">
                  <div className="col-4">created at:</div>
                  <div className="col-8">{update.createdAt}</div>
                </div>
                <div className="row">
                  <div className="col-4">sent at:</div>
                  <div className="col-8">{update.sentAt || 'Pending'}</div>
                </div>
                <div className="row my-2 p-2">
                  <div className="col-12 text-center">{ this.displayPublishUpdateAction(update) } <Button color="danger" onClick={this.handleDeleteUpdate.bind(this, update.id)}>Delete</Button></div>
                </div>
              </div>
            )
          })
        )}
      </div>
    )
  }

  criteriaCompleted() {
    let { report } = this.props
    return report.scores.filter(score => !!score.summary).length
  }

  displayScores() {
    let { report } = this.props
    let { scores } = report

    return scores.sort((a,b) => {
      return +a.order > +b.order
    }).map(score => {
      return <CategoryEditor
        key={score.id}
        reportSlug={report.slug}
        isPublished={report.status === 'published'}
        score={score}
        reset={this.state.reset}
        onMetricEdit={this.handleMetricEditor.bind(this)}
        onSave={this.handleSave.bind(this)}/>
    })
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
  updateReport
}, dispatch)

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(Report))
