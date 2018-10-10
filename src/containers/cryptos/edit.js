import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Container, Row, Col, Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { withRouter } from 'react-router-dom'
import Editor from '../../components/editor'

import Dropdown from 'react-dropdown'
import 'react-dropdown/style.css'

import {
  fetchCrypto,
  updateCrypto,
} from '../../reducers/cryptos'

import { fetchPurchasableStatuses } from '../../reducers/purchasable_statuses'

class CryptoEdit extends Component {

  constructor(props) {
    super(props)
    this.state = {
      description: '',
      profile: '',
      purchasableStatus: ''
    }
  }

  componentWillMount() {
    let { match: { params } } = this.props
    this.props.fetchCrypto(params.slug, false)
    this.props.fetchPurchasableStatuses()
  }

  componentWillReceiveProps(nextProps) {
    const { crypto: { description, profile, purchasableStatus }, pending } = nextProps
    !pending && this.setState({ description, profile, purchasableStatus })
  }

  purchasableOptions() {
    const { purchasableStatuses } = this.props
    if (purchasableStatuses.count === 0) { return [{}] }

    return purchasableStatuses.map(status => {
      return { value: status, label: status }
    })
  }

  handleInputChange = (name) => (event) => {
    this.setState({ [ name ]: event.target.value })
  }

  handleSelectChange = (type) => (e) => {
    this.setState({ [type]: e.value })
  }

  handleProfileChange = (profile) => {
    this.setState({ profile })
  }

  handleSubmit = () => {
    const { crypto } = this.props
    const { description, profile, purchasableStatus } = this.state
    this.props.updateCrypto(crypto.slug, { description, profile, purchasable_status: purchasableStatus })
  }

  render() {
    const { match: { params }, crypto, message, error, pending } = this.props
    const { description, profile, purchasableStatus } = this.state

    if ( Object.keys(crypto).length === 0 ) {
      return <h4 className="pt-3">Loading {params.slug}... </h4>
    }

    return (
      <Container>
        <h1>Edit {pending ? '' : crypto.name}</h1>
        <Row>
          <Col xs="8">
            <Form>
              <FormGroup>
                <Label for="purchasableStatus">Purchasable Status:</Label>
                <Dropdown name="purchasableStatus" className="ml-2" options={this.purchasableOptions()} value={purchasableStatus} onChange={this.handleSelectChange('purchasableStatus')} />
              </FormGroup>
              <FormGroup>
                <Label for="description">Description:</Label>
                <Input
                  type="textarea"
                  rows="8"
                  name="description"
                  placeholder="Crypto description"
                  onChange={this.handleInputChange('description')}
                  value={description}
                />
              </FormGroup>
              <FormGroup>
                <Label for="profile">Profile:</Label>
                <Editor
                  onChange={this.handleProfileChange}
                  text={profile}
                  showEditor={true}
                  style={{ height: 200 }}
                />
              </FormGroup>
              <Button
                color="primary"
                onClick={this.handleSubmit}
                style={{ marginTop: 50 }}
              >
                Save
              </Button>
              <p className={`mt-3 ${error ? 'text-warning' : 'text-success'}`}>{message}</p>
            </Form>
          </Col>
        </Row>
      </Container>
    )
  }
}

const mapStateToProps = state => ({
  crypto: state.cryptos.data,
  purchasableStatuses: state.purchasableStatuses.list,
  error: state.cryptos.errorUpdating,
  pending: state.cryptos.pending,
  message: state.cryptos.updateMessage,
})

const mapDispatchToProps = dispatch => bindActionCreators({
  fetchCrypto,
  updateCrypto,
  fetchPurchasableStatuses
}, dispatch)

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CryptoEdit))
