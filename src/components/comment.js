import React, { Component } from 'react'
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import ReactQuill from 'react-quill'

import moment from 'moment'

import dropdownIcon from '../assets/images/dropdown-icon.png'

export default class Comment extends Component {
  constructor(props) {
    super(props)
    this.state = { 
      input: this.props.comment.text, 
      showDropdown: false,
      isEditMode: false,
    }
    this.toogleDropdown = this.toogleDropdown.bind(this)
    this.handleEditClick = this.handleEditClick.bind(this)
    this.editComment = this.editComment.bind(this)
    this.onInputChange = this.onInputChange.bind(this)
  }

  editComment() {
    if(this.state.input.length > 0) {
      this.props.updateNoteComment(this.props.comment.id, {
        report_id: this.props.report.id,
        user_id: this.props.users.find(user => user.email === this.props.user.email).id,
        comment: this.state.input,
        note_type:  this.props.noteType,
      })
      this.setState({ isEditMode: false });
    }
  }

  onInputChange(value) {
    this.setState({ input: value });
  }

  handleEditClick() {
    this.setState({ isEditMode: true });
  }

  toogleDropdown() {
    this.setState(function(prevState, props){
      return { showDropdown: !prevState.showDropdown}
    });
  }

  render() {
    const { comment } = this.props
    const { showDropdown, isEditMode } = this.state
    return (
      <div className="mb-3">
        <div>
          <b>{comment.user.fullName}</b>
          <span className="small ml-2">{moment(comment.createdAt).fromNow()}</span>
          <span className="float-right">
            <Dropdown isOpen={showDropdown} toggle={this.toogleDropdown}>
              <DropdownToggle color="link">
                <img src={dropdownIcon} alt='arrow-down' width="16" height="16" />
              </DropdownToggle>
              <DropdownMenu>
                <DropdownItem onClick={this.handleEditClick}>Edit</DropdownItem>
                <DropdownItem onClick={() => this.props.removeNoteComment(comment.id)}>Delete</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </span>
        </div>
        { isEditMode ?
          <div className="my-2">
            <ReactQuill theme="snow" value={this.state.input} onChange={this.onInputChange} modules={this.props.getModules()}/>
            <button className="btn btn-info btn-sm mt-2 mr-2" onClick={() => this.setState({ isEditMode: false })}>Cancel</button>
            <button className="btn btn-info btn-sm mt-2" onClick={this.editComment}>Save</button>
          </div> 
          :
          <div className="mt-1" dangerouslySetInnerHTML={{ __html: comment.text }} />
        }
      </div>
    )
  }
}
