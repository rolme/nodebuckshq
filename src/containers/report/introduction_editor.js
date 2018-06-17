import React, { Component } from 'react'
import Editor from '../../components/editor'
import Note from '../../components/note'

export default class IntroductionEditor extends Component {

  render() {
    const { report } = this.props
    return (
      <div className="d-inline-flex col-md-12">
        <div className="col-8 p-5 mb-3 bg-light rounded">
          <div className="row mb-3">
            <h4 className="col-6">
              Introduction
            </h4>
          </div>
          { this.displayEditor(report) }
        </div>  
        <div className="col-md-4">
          <h4 style={{position: 'absolute', top: -36}}>Notes</h4>
          <Note
            comments={report.noteComments.filter(comment => comment.noteType === 'summary')} 
            noteType='summary'
            height={362}
          />
        </div>
      </div>
    )
  }

  displayEditor(report) {
    return <Editor
      fieldName='Introduction'
      onChange={this.props.handleDescriptionChange}
      text={this.props.report.description || 'none'}
      isForEditPage={true}
    />
  }
}
