import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import { withCookies } from 'react-cookie';
import localIpUrl from 'local-ip-url';
import {
  Col,
  Form,
  FormGroup,
  Input,
  Label,
  Row
} from 'reactstrap'
import Modal2FA from '../../components/2fa'
import { 
  isAuthenticated, 
  get2FASecret, 
  login 
} from '../../reducers/user'

class Login extends Component {
  constructor(props) {
    super(props)

    this.state = {
      email: '',
      password: '',
      redirect: false,
      show2fa: false,
      secret: '',
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
    const { email, password } = this.state
    const trustedIp = this.props.cookies.get('trustedIpNodebucks')

    e.preventDefault()

    if(trustedIp && trustedIp === localIpUrl()) {
      this.props.login(email, password)
    } else {
      this.props.get2FASecret({email, password}, (response) => {
        if(trustedIp && trustedIp !== localIpUrl()) {
          this.setState({ show2fa: true, secret: response.secret, isOtherIP: true })
        } else if(response.enabled_2fa) {
          this.setState({ show2fa: true, secret: response.secret })
        } else {
          this.props.login(email, password)
        }
      })
    }
  }

  handleEmailChange(e) {
    this.setState({ email: e.target.value })
  }

  handlePasswordChange(e) {
    this.setState({ password: e.target.value })
  }

  toggleModal = () => {
    this.setState({
      show2fa: !this.state.show2fa
    });
  }

  render() {
    let { email, password, redirect, show2fa, secret, isOtherIP } = this.state

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
        <Modal2FA
          show={show2fa}
          onToggle={this.toggleModal}
          email={email}
          password={password}
          secret={secret}
          login={this.props.login}
          isOtherIP={isOtherIP}
        />
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
  login,
  get2FASecret,
}, dispatch)

export default withCookies(connect(
  mapStateToProps,
  mapDispatchToProps
)(Login))
