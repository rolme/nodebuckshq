import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { Container, Button, Form, FormGroup, Label, Input } from 'reactstrap'
import Dropdown from 'react-dropdown'
import 'react-dropdown/style.css'

import { createNode } from '../../reducers/nodes'
import { fetchCryptos } from '../../reducers/cryptos'
import { fetchUsers } from '../../reducers/users'

class NewNode extends Component {
  constructor(props) {
    super(props)
    this.state = {
      amount: '',
      cryptoId: '',
      userId: '',
    }
  }

  componentWillMount() {
    const { cryptos, users } = this.props

    if (cryptos.length <= 1) {
      this.props.fetchCryptos()
    }
    if (users.length <= 1) {
      this.props.fetchUsers()
    }
  }

  cryptoOptions() {
    const { cryptos } = this.props
    return cryptos.map(crypto => {
      return { value: `${crypto.id}`, label: crypto.name }
    })
  }

  userOptions() {
    const { users } = this.props
    return users.map(user => {
      return { value: `${user.id}`, label: `${user.fullName} (${user.email})` }
    })
  }

  handleSelect = (type) => (e) => {
    this.setState({ [type]: e.value })
  }

  handleInputChange = (name) => (event) => {
    this.setState({ [ name ]: event.target.value })
  }

  handleSubmit = () => {
    const { cryptos, users } = this.props
    const { cryptoId, userId, amount } = this.state
    const crypto = cryptos.find(c => c.id === +cryptoId)
    const user   = users.find(u => u.id === +userId)

    if (+cryptoId > 0 && +userId > 0 && +amount > 0) {
      if (window.confirm(`${crypto.name} MN for ${user.fullName} at $${amount}`)) {
        this.props.createNode({
          node: {
            amount: amount,
            crypto_id: cryptoId,
            user_id: userId
          }
        })
      }
    } else {
      window.alert('Make sure to select a crypto, user, and a $ amount greater than 0.00')
    }
  }

  render() {
    const { error, message, pending } = this.props
    const { cryptoId, userId, amount } = this.state

    if (pending && +cryptoId > 0) {
      return(
        <Container>
          <h1>New Node</h1>
          <p>Processing...</p>
        </Container>
      )
    }

    return (
      <Container>
        <h1>New Node</h1>
        <Form>
          <FormGroup>
            <Label for="crypto">Crypto:</Label>
            <Dropdown id="crypto" options={this.cryptoOptions()} value={cryptoId} onChange={this.handleSelect('cryptoId')} />
          </FormGroup>
          <FormGroup>
            <Label for="user">User:</Label>
            <Dropdown id="user" options={this.userOptions()} value={userId} onChange={this.handleSelect('userId')} />
          </FormGroup>
          <FormGroup>
            <Label for="amount">Amount $USD:</Label>
            <Input
              type="number"
              name="amount"
              placeholder="100.00"
              onChange={this.handleInputChange('amount')}
              value={amount}
            />
          </FormGroup>
          <Button color="primary" onClick={this.handleSubmit} style={{ marginTop: 50 }}>Save</Button>
        </Form>
      </Container>
    )
  }

}

const mapStateToProps = state => ({
  users: state.users.list,
  cryptos: state.cryptos.list,
  error: state.nodes.error,
  message: state.nodes.message,
  pending: state.nodes.pending
})

const mapDispatchToProps = dispatch => bindActionCreators({
  createNode,
  fetchUsers,
  fetchCryptos
}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NewNode)
