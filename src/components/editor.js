import React, { Component } from 'react'
import { Button } from 'reactstrap'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

export default class Editor extends Component {
  constructor(props) {
    super(props)
    this.state = {
      fieldName: this.props.fieldName || 'Summary',
      showEditor: this.props.isForEditPage,
      text: this.props.text
    }
    this.handleChange = this.props.onChange.bind(this)
  }

  componentWillReceiveProps(newProps) {
    this.setState({ text: newProps.text })
  }

  toggleEditor() {
    this.setState({ showEditor: !this.state.showEditor })
  }

  handleQuillChange(value) {
    this.setState({text: value})
  }

  saveChanges() {
    this.handleChange(this.state.text)
    if(!this.props.isForEditPage) this.toggleEditor()
  }

  cancelChanges() {
    this.setState({ text: this.props.text })
    this.toggleEditor()
  }

  resetText() {
    this.setState({ text: this.props.text })
  }

  render() {
    let { fieldName, showEditor, text } = this.state

    if (!showEditor) {
      return(
        <div>
          <p dangerouslySetInnerHTML={{__html: text}}/> <Button color="secondary" onClick={this.toggleEditor.bind(this)}>Edit {fieldName}</Button>
        </div>
      )
    }

    return(
      <div className="pt-2">
        <ReactQuill theme="snow" value={text} onChange={this.handleQuillChange.bind(this)}/>
        <br/>
        <div className="row">
          <div className="col-6 text-left">
            <button className="btn btn-dark" onClick={this.saveChanges.bind(this)}>save</button>
          </div>
          <div className="col-6 text-right">
            <button className="btn btn-dark" onClick={this.resetText.bind(this)}>reset</button>&nbsp; 
            { !this.props.isForEditPage && <button className="btn btn-dark" onClick={this.cancelChanges.bind(this)}>cancel</button> }
          </div>
        </div>
      </div>
    )
  }
}
