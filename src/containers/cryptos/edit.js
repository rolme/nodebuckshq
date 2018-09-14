import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Container, Row, Col, Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { withRouter } from 'react-router-dom'

import {
  fetchCrypto,
  updateCrypto,
} from '../../reducers/cryptos'

class CryptoEdit extends Component {

  constructor(props) {
    super(props)
    this.state = {
      description: this.props.crypto.description,
    }
  }

  componentWillMount() {
    let { match: { params } } = this.props
    this.props.fetchCrypto(params.slug, false)
  }

  handleInputChange = (name) => (event) => {
    this.setState({ [name]: event.target.value })
  }

  handleSubmit = () => {
    const { crypto } = this.props
    const { description } = this.state
    this.props.updateCrypto(crypto.slug, { description })
  }

  render() {
    const { match: { params }, crypto, message, error } = this.props

    if (Object.keys(crypto).length === 0) {
      return <h4 className="pt-3">Loading {params.slug}... </h4>
    }

    return(
      <Container>
        <h1>Edit {crypto.name}</h1>
        <Row>
          <Col xs="8">
            <Form>
              <FormGroup>
                <Label for="description">Description:</Label>
                <Input 
                  type="textarea"
                  rows="8"
                  name="description" 
                  placeholder="Crypto description" 
                  onChange={this.handleInputChange('description')}
                  value={this.state.description || crypto.description}
                />
              </FormGroup>
              <Button 
                color="primary" 
                onClick={this.handleSubmit}
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
  error: state.cryptos.errorUpdating,
  message: state.cryptos.updateMessage,
})

const mapDispatchToProps = dispatch => bindActionCreators({
  fetchCrypto,
  updateCrypto,
}, dispatch)

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CryptoEdit))
