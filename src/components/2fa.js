import React, { Component } from 'react'
import { Button, Modal, ModalHeader, ModalBody, Input, Label } from 'reactstrap';
import speakeasy from 'speakeasy'
import { withCookies } from 'react-cookie';
import localIpUrl from 'local-ip-url';

class Modal2FA extends Component {
  constructor(props) {
    super(props)

    this.state = {
      token: '',
      message: '',
      trusted: false,
      visible: false,
    }
  }

  componentWillReceiveProps(nextProps) {
    this.showModal(nextProps.show);
  }

  handleTokenChange = (e) => {
    this.setState({ token: e.target.value, message: '' })
  }

  handleKeyPress = (target) => {
    if(target.charCode === 13) {
      this.handleSubmit()  
    }
  }

  handleSubmit = () => {
    const { email, password, secret, cookies } = this.props
    const { trusted } = this.state
    const isTokenValid = speakeasy.totp.verify({ 
      secret: secret,
      encoding: 'ascii',
      token: this.state.token,
    })

    if(trusted) {
      cookies.set("trustedIpNodebucks", localIpUrl(), 
        { path: "/", secure: process.env.NODE_ENV !== 'development', maxAge: 2592000 }) // 30 days in seconds
      this.props.login(email, password)
    }
    else if(isTokenValid) {
      this.props.login(email, password)
      this.props.onToggle()
    } else {
      this.setState({ token: '', message: 'Token is invalid.'})
    }
  }

  handleCheckboxChange = () => {
    this.setState({ trusted: !this.state.trusted })
  }

  showModal = (val) => {
    this.setState({ visible: val }, ()=> {
      setTimeout(()=>{this.twoFAInput && this.twoFAInput.focus()}, 1);
    });
 }

  render() {
    return (
      <Modal isOpen={this.state.visible} toggle={this.props.onToggle} className={this.props.className} autoFocus={false}>
        <ModalHeader toggle={this.props.onToggle}>Two Factor Authentication</ModalHeader>
        <ModalBody>
          <Input 
            type="text"
            name="2fa"
            placeholder="Enter Google authenticator token here"
            value={this.state.token}
            onChange={this.handleTokenChange}
            onKeyPress={this.handleKeyPress}
            ref={(input) => { this.twoFAInput = input; }}
            autoFocus
          />
          <p className="text-danger mt-2">{this.state.message}</p>
          <hr />
          { !this.props.isOtherIP && navigator.cookieEnabled &&
            <div className="d-flex justify-content-between">
              <div className="ml-4">
                <Input
                  type="checkbox"
                  name="trusted"
                  onChange={this.handleCheckboxChange}
                  checked={this.state.trusted}
                />
                <Label for="trusted">This is a trusted computer</Label>
              </div>
              <Button 
                color="primary" 
                onClick={this.handleSubmit}
              >
                Submit
              </Button>
            </div>
          }
        </ModalBody>
      </Modal>
    );
  }
}

export default withCookies(Modal2FA);
