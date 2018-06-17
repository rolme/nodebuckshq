import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

import {
  fetchMetricScores
} from '../../reducers/metric_scores'

class Metrics extends Component {
  componentWillMount() {
    this.props.fetchMetricScores()
  }

  render() {
    let { list, user } = this.props

    if (user === null || list === null) {
      return <div>Loading Metric Scores</div>
    }

    return(
      <div className="row">
        <div className="offset-1 col-10">
          <h2 className="mt-2">Metric Scores</h2>
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Age</th>
                <th>Last Update</th>
                <th>(Criteria) Metric</th>
                <th>Report</th>
                <th>Value</th>
                <th>Criteria Summary</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {this.displayMetricScores(list)}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  displayMetricScores(list) {
    return list.map(item => {
      return(
        <tr key={item.id}>
          <td>{item.age}</td>
          <td>{item.updatedAt}</td>
          <td>({item.categoryName}) {item.definition}</td>
          <td>{item.reportName}</td>
          <td>{item.value}</td>
          <td dangerouslySetInnerHTML={{__html: item.categorySummary}}></td>
          <td><Link to={`/reports/${item.reportSlug}`}>Edit</Link></td>
        </tr>
      )
    })
  }
}

const mapStateToProps = state => ({
  list: state.metricScores.list,
  user: state.user.user
})

const mapDispatchToProps = dispatch => bindActionCreators({
  fetchMetricScores
}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Metrics)
