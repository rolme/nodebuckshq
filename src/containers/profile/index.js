import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { Col, Button, Form, FormFeedback, FormGroup, FormText, Label, Input } from 'reactstrap'

import { isAuthenticated, updateUser } from '../../reducers/user'

class Profile extends Component {
  constructor(props) {
    super(props)
    this.state = {
      currentPassword: '',
      message: this.props.message,
      password: '',
      passwordConfirmation: '',
      reset: false
    }
  }

  componentWillReceiveProps(newProps) {
    const { password, passwordConfirmation } = this.state
    if (!newProps.error && newProps.message !== null && password === passwordConfirmation) {
      this.setState({ currentPassword: '', password: '', passwordConfirmation: ''})
    }
    this.setState({ message: newProps.message })
  }

  enableChangePasswordButtion() {
    const { currentPassword, password, passwordConfirmation } = this.state
    const { pending } = this.props
    return(
      currentPassword !== '' &&
      password !== '' &&
      passwordConfirmation !== '' &&
      !pending &&
      password === passwordConfirmation
    )
  }

  handleChangePasswordCurrent(e) {
    this.setState({ currentPassword: e.target.value, message: null })
  }

  handleChangePassword(e) {
    this.setState({ password: e.target.value })
  }

  handleChangePasswordConfirmation(e) {
    this.setState({ passwordConfirmation: e.target.value })
  }

  handleChangePasswordClick() {
    const { currentPassword, password, passwordConfirmation } = this.state
    const { user } = this.props
    this.props.updateUser(user.slug, currentPassword, {
      password,
      password_confirmation: passwordConfirmation
    })
  }

  render() {
    let { currentPassword, message, password, passwordConfirmation } = this.state
    let { user, error, pending } = this.props

    if (user === null) {
      return <div>Loading Profile</div>
    }

    return(
      <div className="row">
        <div className="offset-1 col-10 mt-2">
          <h2 className="mt-2">Profile</h2>
        </div>
        <div className="offset-1 col-3 mt-2 mr-1 p-4 bg-white">
          <h3 className="mb-2">Your Info</h3>
          {user.fullName}<br/>
          {user.email}<br/>
        </div>
        <div className="col-7 mt-2 ml-1 p-4 bg-white">
          <h3 className="mb-3">Change Password</h3>
          <Form>
            <FormGroup row>
              <Label for="current" sm={2}>Current Password</Label>
              <Col sm={10}>
                <Input type="password" onChange={this.handleChangePasswordCurrent.bind(this)} value={currentPassword} disabled={pending} name="current" id="current" placeholder="Current" />
                <FormText>Please re-enter the password you used to login.</FormText>
              </Col>
            </FormGroup>
            <FormGroup row>
              <Label for="new" sm={2}>New Password</Label>
              <Col sm={10}>
                <Input type="password" onChange={this.handleChangePassword.bind(this)} value={password} disabled={pending} name="new" id="new" placeholder="New" />
              </Col>
            </FormGroup>
            <FormGroup row>
              <Label for="confirm" sm={2}>Confirm Password</Label>
              <Col sm={10}>
                <Input type="password" onChange={this.handleChangePasswordConfirmation.bind(this)} value={passwordConfirmation} disabled={pending} name="confirm" id="confirm" placeholder="Confirm"/>
                <FormFeedback style={(password !== passwordConfirmation && passwordConfirmation.length !== 0) ? {display: 'inline'} : {display: 'none'}}>New password and password confirmation do not match.</FormFeedback>
                <FormFeedback style={(error) ? {display: 'inline'} : {display: 'none'}}>{message}</FormFeedback>
                <FormFeedback style={(message !== null && !error) ? {display: 'inline', color: 'green'} : {display: 'none'}}>{message}</FormFeedback>
              </Col>
            </FormGroup>
            <Button color="primary" disabled={!this.enableChangePasswordButtion()} onClick={this.handleChangePasswordClick.bind(this)}>Change Password</Button>
          </Form>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  user: state.user.data,
  error: state.user.error,
  pending: state.user.pending,
  message: state.user.message
})

const mapDispatchToProps = dispatch => bindActionCreators({
  isAuthenticated,
  updateUser
}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Profile)
