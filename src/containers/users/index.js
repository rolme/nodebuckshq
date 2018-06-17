import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import {
  fetchUsers
} from '../../reducers/users'

class Users extends Component {
  componentWillMount() {
    const { list, user } = this.props

    if (list.length <= 1 && user !== '') {
      this.props.fetchUsers()
    }
  }

  render() {
    let { list, user } = this.props

    if (user === null || list === null) {
      return <div>Loading Subscribers</div>
    }

    return(
      <div className="row">
        <div className="offset-1 col-10">
          <h2 className="mt-2">Users ({list.length})</h2>
          <table className="table table-striped">
            <thead>
              <tr>
                <th>id</th>
                <th>user</th>
                <th>created</th>
                <th>confirmed?</th>
                <th>deleted?</th>
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
    return list.map(item => {
      return(
        <tr key={item.id}>
          <td style={{verticalAlign: 'middle'}}>{item.id}</td>
          <td>
            {this.displayAvatar(item.avatar)} {item.fullName} {(item.admin) ? '(Admin)' : ''}
          </td>
          <td>{item.createdAt}</td>
          <td>{(item.confirmedAt) ? item.confirmedAt : 'Unconfirmed'}</td>
          <td>{(item.deletedAt) ? item.deletedAt : 'Active'}</td>
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
  fetchUsers
}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Users)
