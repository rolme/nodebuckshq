import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { withRouter, NavLink } from 'react-router-dom'
import moment from 'moment'

import {
  fetchContacts,
  reviewed,
} from '../../reducers/contacts'

class Contacts extends Component {
  componentWillMount() {
    this.props.fetchContacts()
  }

  render() {
    let { list, user } = this.props

    if (user === null || list === null) {
      return <div>Loading Contacts</div>
    }

    return(
      <div className="row">
        <div className="offset-1 col-10">
          <h2 className="mt-2">Cryptos ({list.length})</h2>
          <table className="table table-striped">
            <thead>
              <tr>
                <th style={{textAlign: 'center'}}>subject</th>
                <th style={{textAlign: 'center'}}>email</th>
                <th style={{textAlign: 'center'}}>message</th>
                <th style={{textAlign: 'center'}}>createdAt</th>
                <th style={{textAlign: 'center'}}>review</th>
              </tr>
            </thead>
            <tbody>
              {this.displayContacts(list)}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  displayContacts(list) {
    return list.map(item => {
      return(
        <tr key={item.id}>
          <td align="center">{item.subject}</td>
          <td align="center">{item.email}</td>
          <td align="center">{item.message}</td>
          <td align="center">{moment(item.createdAt).fromNow()}</td>
          <td align="center">
            <button 
              className="btn btn-info" 
              onClick={() => this.props.reviewed(item.id)}
            >
              Reviewed
            </button>
          </td>
        </tr>
      )
    })
  }
}

const mapStateToProps = state => ({
  list: state.contacts.list,
  user: state.user.user
})

const mapDispatchToProps = dispatch => bindActionCreators({
  fetchContacts,
  reviewed,
}, dispatch)

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Contacts))
