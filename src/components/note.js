import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import ReactQuill from 'react-quill'
import Comment from './comment'

import { 
  createNoteComment,
  removeNoteComment,
  updateNoteComment,
} from '../reducers/reports'

class Note extends Component {
  constructor(props) {
    super(props)
    this.state = { input: '' }
    this.onInputChange = this.onInputChange.bind(this)
    this.postComment = this.postComment.bind(this)
  }

  postComment() {
    if(this.state.input.length > 0) {
      this.props.createNoteComment({
        report_id: this.props.report.id,
        user_id: this.props.users.find(user => user.email === this.props.user.email).id,
        comment: this.state.input,
        note_type:  this.props.noteType,
      })
      this.setState({input: ''});
    }
  }

  onInputChange(value) {
    this.setState({input: value});
  }

  getModules() {
    return {
      toolbar: {
        container: ['bold', 'italic', 'underline', 'link']
      }
    }
  }

  render() {
    const { comments, height } = this.props
    return (
        <div className="card mb-3" style={{height: height}}>
          <div className="card-body" style={{overflowY: 'auto'}}>
            {
              comments.map(comment => {
                return(
                  <Comment
                    key={comment.id}
                    comment={comment} 
                    removeNoteComment={this.props.removeNoteComment}
                    updateNoteComment={this.props.updateNoteComment}
                    getModules={this.getModules}
                    note_type={this.props.note_type}
                    users={this.props.users}
                    user={this.props.user}
                    report={this.props.report}
                  />)
              })
            }
          </div>
          <div className="card-footer">
            <ReactQuill theme="snow" value={this.state.input} onChange={this.onInputChange} modules={this.getModules()}/>
            <button className="btn btn-info float-right mt-2" onClick={this.postComment}>Comment</button>
          </div>
        </div>
    )
  }
}

const mapStateToProps = state => ({
  report: state.reports.selected,
  user: state.user.data,
  users: state.users.list,
})

const mapDispatchToProps = dispatch => bindActionCreators({
  createNoteComment,
  removeNoteComment,
  updateNoteComment,
}, dispatch)

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(Note))
