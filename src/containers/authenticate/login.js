import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'

import {
  Col,
  Form,
  FormGroup,
  Input,
  Label,
  Row
} from 'reactstrap'

import { isAuthenticated, login } from '../../reducers/user'

class Login extends Component {
  constructor(props) {
    super(props)

    this.state = {
      email: '',
      password: '',
      redirect: false
    }
  }

  componentWillMount() {
    let { isAuthenticated } = this.props
    this.setState({ redirect: isAuthenticated() })
  }

  componentWillReceiveProps() {
    let { isAuthenticated } = this.props
    this.setState({ redirect: isAuthenticated() })
  }

  submit(e) {
    let { email, password } = this.state
    e.preventDefault()
    this.props.login(email, password, this.handleResponse.bind(this))
  }

  handleEmailChange(e) {
    this.setState({ email: e.target.value })
  }

  handlePasswordChange(e) {
    this.setState({ password: e.target.value })
  }

  handleResponse() {
    let { authenticated } = this.props
    if (authenticated) {
      this.setState({ redirect: true })
    }
  }

  render() {
    let { email, password, redirect } = this.state

    if (redirect) { return <Redirect to='/users' /> }

    return(
      <Row className="mt-5">
        <Col md={{size: 4, offset: 4}} sm={{ size: 8, offset: 2}} size={12}>
          <h2>Login</h2>
          { this.displayError() }
          <Form>
            <FormGroup>
              <Label for="userEmail">Email</Label>
              <Input type='email' name="email" id="userEmail" maxLength="100" value={email} placeholder="admin" onChange={this.handleEmailChange.bind(this)}/>
            </FormGroup>
            <FormGroup>
              <Label for="userPassword">Password</Label>
              <Input type='password' name="password" maxLength="100" id="userPassword" value={password} placeholder="" onChange={this.handlePasswordChange.bind(this)} />
            </FormGroup>
            <button className="btn btn-primary" onClick={this.submit.bind(this)}>Login</button>
          </Form>
        </Col>
      </Row>
    )
  }

  displayError() {
    let { error, message } = this.props

    if (error) {
      return <h3>{message}</h3>
    }
  }
}

const mapStateToProps = state => ({
  error: state.user.error,
  user: state.user.data,
  message: state.user.message,
  authenticated: state.user.data !== null
})

const mapDispatchToProps = dispatch => bindActionCreators({
  isAuthenticated,
  login
}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Login)
