import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import {
  fetchSubscribers
} from '../../reducers/subscribers'

class Subscribers extends Component {
  componentWillMount() {
    this.props.fetchSubscribers()
  }

  render() {
    let { list, user } = this.props

    if (user === null || list === null) {
      return <div>Loading Subscribers</div>
    }

    return(
      <div className="row">
        <div className="offset-1 col-10">
          <h2 className="mt-2">Subscribers ({list.length})</h2>
          <table className="table table-striped">
            <thead>
              <tr>
                <th>email</th>
                <th>subscribed at</th>
                <th>verified?</th>
                <th>announcements?</th>
                <th>new coins?</th>
                <th>updates?</th>
                <th>unsubscribed?</th>
              </tr>
            </thead>
            <tbody>
              {this.displaySubscribers(list)}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  displaySubscribers(list) {
    return list.map(item => {
      return(
        <tr key={item.id}>
          <td>{item.email}</td>
          <td>{item.createdAt}</td>
          <td>{(item.verified) ? 'verified' : 'unverified'}</td>
          <td>{(item.isAnnoucementsOn) ? 'Annoucements' : 'Off'}</td>
          <td>{(item.isNewCoinOn) ? 'New Coins' : 'Off'}</td>
          <td>{(item.isUpdatesOn) ? 'Updates' : 'Off'}</td>
          <td>{(!item.isUpdatesOn && !item.isNewCoinsOn && !item.isAnnoucementsOn) ? 'Unsubscribed' : 'Subscribed' }</td>
        </tr>
      )
    })
  }
}

const mapStateToProps = state => ({
  list: state.subscribers.list,
  user: state.user.user
})

const mapDispatchToProps = dispatch => bindActionCreators({
  fetchSubscribers
}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Subscribers)
