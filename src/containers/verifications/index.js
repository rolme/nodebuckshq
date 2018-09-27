import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Alert } from 'reactstrap'

import {
  fetchUsers,
  updateUserIdVerificationStatus
} from '../../reducers/users'

class Verifications extends Component {
  constructor(props) {
    super(props)

    this.state = {
      showAlert: false,
    }
  }

  componentWillMount() {
    this.props.fetchUsers(true)
  }

  handleAction = (slug, status) => {
    this.props.updateUserIdVerificationStatus(slug, status, () => {
      this.setState({ showAlert: true })
      setTimeout(() => {
        this.setState({ showAlert: false }) },
      3000);
    })
  }

  render() {
    let { list, user, error, message } = this.props
    if ( user === null || list === null ) {
      return <div>Loading Contacts</div>
    }

    return (
      <div>
        <Alert
          color={error ? "danger" : "success"}
          isOpen={this.state.showAlert}
        >
          <div style={{ textAlign: 'center'}}>{message}</div>
        </Alert>
        <div className="col-12 px-5">
          <h2 className="mt-2">Verifications ({list.length})</h2>
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
          <td align="center">
            <a style={{color: '#007bff', cursor: 'pointer'}} onClick={()=> window.open(item.verificationImage.url, "_blank")}>
              View Picture
            </a>
          </td>
          <td align="center">
            <button onClick={() => this.handleAction(item.slug, 'approved')} className="btn btn-info mr-3">
              Verify
            </button>
            <button onClick={() => this.handleAction(item.slug, 'denied')} className="btn btn-info">
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
  user: state.user.user,
  error: state.users.verificationError,
  message: state.users.verificationMessage,
})

const mapDispatchToProps = dispatch => bindActionCreators({
  fetchUsers,
  updateUserIdVerificationStatus,
}, dispatch)

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Verifications))
