import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { Button } from 'reactstrap'

import {
  fetchFeedback,
  reviewFeedback
} from '../../reducers/feedback'

class Feedback extends Component {
  componentWillMount() {
    this.props.fetchFeedback()
  }

  render() {
    let { list, user } = this.props

    if (user === null || list === null) {
      return <div>Loading feedback</div>
    }

    return(
      <div className="row">
        <div className="offset-1 col-10">
        <h2 className="mt-2">Feedback</h2>
          <table className="table table-striped">
            <thead>
              <tr>
                <th>crypto</th>
                <th>criteria</th>
                <th>comment</th>
                <th>submitted</th>
                <th>email</th>
                <th>review & close?</th>
              </tr>
            </thead>
            <tbody>
              {this.displayFeedback(list)}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  displayFeedback(list) {
    return list.map(item => {
      return(
        <tr key={item.id}>
          <td>{item.report.name}</td>
          <td>{item.score.name}</td>
          <td>{item.comment}</td>
          <td>{item.createdAt}</td>
          <td>{item.email}</td>
          <td><Button color="primary" onClick={this.props.reviewFeedback.bind(this, item.slug)}>Reviewed</Button></td>
        </tr>
      )
    })
  }
}

const mapStateToProps = state => ({
  list: state.feedback.list,
  user: state.user.user
})

const mapDispatchToProps = dispatch => bindActionCreators({
  fetchFeedback,
  reviewFeedback
}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Feedback)
