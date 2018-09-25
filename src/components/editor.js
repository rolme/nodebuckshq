import React, { Component } from 'react'
import { Button } from 'reactstrap'
import ReactQuill from 'react-quill'
import $ from 'jquery'
import { debounce } from 'lodash'
import 'react-quill/dist/quill.snow.css'

export default class Editor extends Component {
  constructor(props) {
    super(props)
    this.state = {
      fieldName: this.props.fieldName || 'Summary',
      showEditor: this.props.showEditor,
      text: this.props.text
    }
    this.handleChange = debounce(this.props.onChange.bind(this), 1000);
  }

  componentWillReceiveProps(newProps) {
    this.setState({ text: newProps.text })
  }

  componentDidMount() {
    if(this.props.style) {
      $('.ql-editor').css({"height":this.props.style.height});
    }
  }

  toggleEditor() {
    this.setState({ showEditor: !this.state.showEditor })
  }

  handleQuillChange(value, delta, source) {
    if(source === 'user') this.handleChange(value)
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
    const { fieldName, showEditor, text } = this.state

    if (!showEditor) {
      return(
        <div>
          <p dangerouslySetInnerHTML={{__html: text}}/> <Button color="secondary" onClick={this.toggleEditor.bind(this)}>Edit {fieldName}</Button>
        </div>
      )
    }

    return(
      <ReactQuill 
        theme="snow" 
        value={text} 
        style={this.props.style}
        onChange={this.handleQuillChange.bind(this)}
      />
    )
  }
}
