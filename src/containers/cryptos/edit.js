import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Container, Row, Col, Button, Form, FormGroup, FormFeedback, Label, Input } from 'reactstrap';
import { withRouter } from 'react-router-dom'
import Editor from '../../components/editor'

import Dropdown from 'react-dropdown'
import Checkmark from "../../components/checkmark"
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
      purchasableStatus: '',
      firstRewardDays: '',
      firstRewardDaysMessage: ''
    }
  }

  componentWillMount() {
    let { match: { params } } = this.props
    this.props.fetchCrypto(params.slug, false)
    this.props.fetchPurchasableStatuses()
  }

  componentWillReceiveProps(nextProps) {
    const { crypto: { description, profile, purchasableStatus, firstRewardDays }, pending } = nextProps
    !pending && this.setState({ description, profile, purchasableStatus, firstRewardDays })
  }

  purchasableOptions() {
    const { purchasableStatuses } = this.props
    if ( purchasableStatuses.count === 0 ) {
      return [ {} ]
    }

    return purchasableStatuses.map(status => {
      return { value: status, label: status }
    })
  }

  handleInputChange = (name) => (event) => {
    this.setState({ [ name ]: event.target.value })
  }

  handleSelectChange = (type) => (e) => {
    this.setState({ [ type ]: e.value })
  }

  handleProfileChange = (profile) => {
    this.setState({ profile })
  }

  handleSubmit = () => {
    const { crypto } = this.props
    const { description, profile, purchasableStatus, firstRewardDays } = this.state
    const isValid = this.validation()
    isValid && this.props.updateCrypto(crypto.slug, { description, first_reward_days: +firstRewardDays, profile, purchasable_status: purchasableStatus })
  }

  validation() {
    let isValid = true, firstRewardDaysMessage = ""
    const { firstRewardDays } = this.state
    if ( !Number.isInteger(+firstRewardDays) || firstRewardDays <= 0 ) {
      firstRewardDaysMessage = "Please type a positive integer"
      isValid = false
    }
    this.setState({ firstRewardDaysMessage })
    return isValid
  }


  render() {
    const { match: { params }, crypto, message, error, pending } = this.props
    const { description, profile, purchasableStatus, firstRewardDays, firstRewardDaysMessage } = this.state

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
                <Dropdown name="purchasableStatus" className="ml-2" options={this.purchasableOptions()} value={purchasableStatus} onChange={this.handleSelectChange('purchasableStatus')}/>
              </FormGroup>
              <FormGroup row className="mx-0 align-items-center">
                <Label for="firstRewardDays" className="mb-0">Days before 1st reward:</Label>
                <Col xl={2} lg={3} md={3} sm={5} xs={10}>
                  <Input
                    type="text"
                    id="firstRewardDays"
                    name="firstRewardDays"
                    onChange={this.handleInputChange('firstRewardDays')}
                    value={firstRewardDays}
                    invalid={!!firstRewardDaysMessage}
                  />
                </Col>
                <Label for="firstRewardDays" className="mb-0">days</Label>
                <FormFeedback>{firstRewardDaysMessage}</FormFeedback>
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
              <Col className="d-flex align-items-center" style={{ marginTop: 70 }}>
                <Button
                  color="primary"
                  onClick={this.handleSubmit}
                >
                  Save
                </Button>
                {!!message &&
                <p className={`ml-2 mb-0 ${error ? 'text-danger' : 'text-success'}`}><Checkmark success={!error}/> {message}</p>
                }
              </Col>
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
