import React, { Component } from 'react'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Input } from 'reactstrap';
import speakeasy from 'speakeasy'

export default class Modal2FA extends Component {
  constructor(props) {
    super(props)

    this.state = {
      token: '',
      message: '',
    }
  }

  handleTokenChange = (e) => {
    this.setState({ token: e.target.value, message: '' })
  }

  handleSubmit = () => {
    const { email, password, secret } = this.props
    const isTokenValid = speakeasy.totp.verify({ 
      secret: secret,
      encoding: 'ascii',
      token: this.state.token,
    })

    if(isTokenValid) {
      this.props.login(email, password)
      this.props.onToggle()
    } else
      this.setState({ message: 'Token is invalid.'})
  }

  render() {
    return (
      <Modal isOpen={this.props.show} toggle={this.props.onToggle} className={this.props.className}>
        <ModalHeader toggle={this.props.onToggle}>Two Factor Authentication</ModalHeader>
        <ModalBody>
          <Input 
            type="password"
            name="2fa"
            placeholder="Enter Google authenticator token here"
            value={this.state.token}
            onChange={this.handleTokenChange}
            autoFocus={true}
          />
          <p className="text-danger mt-2">{this.state.message}</p>
        </ModalBody>
        <ModalFooter>
          <Button 
            color="primary" 
            onClick={this.handleSubmit}
          >
            Submit
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}
