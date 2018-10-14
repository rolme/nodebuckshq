import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { NavLink } from 'react-router-dom'

import Toggle from 'react-toggle'
import "react-toggle/style.css"

import {
  disableUser,
  fetchUsers,
  enableUser
} from '../../reducers/users'

class Users extends Component {
  componentWillMount() {
    const { list, user } = this.props

    if (list.length <= 1 && user !== '') {
      this.props.fetchUsers()
    }
  }

  handleEnabledToggle(user) {
    if (user.enabled) {
      this.props.disableUser(user.slug)
    } else {
      this.props.enableUser(user.slug)
    }
  }

  render() {
    let { list, user } = this.props

    if (user === null || list === null) {
      return <div>Loading Users</div>
    }

    return(
      <div className="row">
        <div className="col-12 px-5">
          <h2 className="mt-2">Users ({list.length})</h2>
          <table className="table table-striped">
            <thead>
              <tr>
                <th>id</th>
                <th>user</th>
                <th>created</th>
                <th>confirmed?</th>
                <th>deleted?</th>
                <th>Enabled?</th>
              </tr>
            </thead>
            <tbody>
              {this.displayUsers(list)}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  displayUsers(list) {
    return list.sort((a, b) => a.first > b.first).map(item => {
      return(
        <tr key={item.id}>
          <td style={{verticalAlign: 'middle'}}>{item.id}</td>
          <td>
            <NavLink to={`/users/${item.slug}`}>{item.fullName} {(item.admin) ? '(Admin)' : ''}</NavLink>
          </td>
          <td>{item.createdAt}</td>
          <td>{(item.confirmedAt) ? item.confirmedAt : 'Unconfirmed'}</td>
          <td>{(item.deletedAt) ? item.deletedAt : 'Active'}</td>
          <td>
            <Toggle
              defaultChecked={item.enabled}
              onChange={(event) => this.handleEnabledToggle(item)}
            />
          </td>
        </tr>
      )
    })
  }

  displayAvatar(image) {
    if (image === null || image === '') {
      return <img src="/assets/images/user.jpg" alt="avatar" style={{borderRadius: '50%', paddingRight: '5px'}} />
    }

    return <img src={image}  alt="avatar" width="60" height="60" style={{borderRadius: '50%', paddingRight: '5px'}} />
  }
}

const mapStateToProps = state => ({
  list: state.users.list,
  user: state.user.user
})

const mapDispatchToProps = dispatch => bindActionCreators({
  disableUser,
  fetchUsers,
  enableUser
}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Users)
