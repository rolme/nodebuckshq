import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import {
  fetchUsers
} from '../../reducers/users'

class Verifications extends Component {
  componentWillMount() {
    this.props.fetchUsers(true)
  }

  render() {
    let { list, user } = this.props
    if ( user === null || list === null ) {
      return <div>Loading Contacts</div>
    }

    return (
      <div className="row">
        <div className="offset-1 col-10">
          <h2 className="mt-2">Verificatons (list.length})</h2>
          <table className="table table-striped">
            <thead>
            <tr>
              <th style={{ textAlign: 'center' }}>User</th>
              <th style={{ textAlign: 'center' }}>Email</th>
              <th style={{ textAlign: 'center' }}>Image</th>
              <th style={{ textAlign: 'center' }}>Actions</th>
            </tr>
            </thead>
            <tbody>
            {this.displayVerifications(list)}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  displayVerifications(list) {
    if ( !list.length ) {
      return <tr>
        <td colSpan='5' className="text-center">There is no data to show.</td>
      </tr>
    }

    return list.map(item => {
      return (
        <tr key={item.id}>
          <td align="center">{item.fullName}</td>
          <td align="center">{item.email}</td>
          <td align="center">{item.verificationImage.url}</td>
          <td align="center">
            <button className="btn btn-info mr-3">
              Verify
            </button>
            <button className="btn btn-info">
              Decline
            </button>
          </td>
        </tr>
      )
    })
  }
}

const mapStateToProps = state => ({
  list: state.users.verifications,
  user: state.user.user
})

const mapDispatchToProps = dispatch => bindActionCreators({
  fetchUsers
}, dispatch)

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Verifications))
