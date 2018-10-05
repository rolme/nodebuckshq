import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { Table, Button } from 'reactstrap'

import { createNode } from '../../reducers/nodes'
import { fetchCryptos } from '../../reducers/cryptos'
import { fetchUsers } from '../../reducers/users'

import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import { faAngleDown, faAngleUp } from '@fortawesome/fontawesome-free-solid'

class NewNode extends Component {
  constructor(props) {
    super(props)
    this.state = {
      amount: 0.0,
      crypto: {},
      user: {},
    }
  }

  componentWillMount() {

  }

  render() {
    return (<h1>New Node</h1>)
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
