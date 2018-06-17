import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { Button } from 'reactstrap'

import {
  fetchListings,
  reviewListing
} from '../../reducers/listing'

class Listing extends Component {
  componentWillMount() {
    this.props.fetchListings()
  }

  render() {
    let { list, user } = this.props

    if (user === null || list === null) {
      return <div>Loading Listing</div>
    }

    return(
      <div className="row">
        <div className="offset-1 col-10">
          <h2 className="mt-2">Listing Requests</h2>
          <table className="table table-striped">
            <thead>
              <tr>
                <th>submitted</th>
                <th>crypto</th>
                <th>url</th>
                <th>name</th>
                <th>email</th>
                <th>info</th>
                <th>reviewed?</th>
              </tr>
            </thead>
            <tbody>
              {this.displayListing(list)}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  displayListing(list) {
    return list.map(item => {
      return(
        <tr key={item.id}>
          <td>{item.createdAt}</td>
          <td>{item.cryptoName}</td>
          <td><a href={item.website} target="_new">{item.website}</a></td>
          <td>{item.name}</td>
          <td>{item.email}</td>
          <td>{item.info}</td>
          <td><Button color="primary" onClick={this.props.reviewListing.bind(this, item.slug)}>Reviewed</Button></td>
        </tr>
      )
    })
  }
}

const mapStateToProps = state => ({
  list: state.listing.list,
  user: state.user.user
})

const mapDispatchToProps = dispatch => bindActionCreators({
  fetchListings,
  reviewListing
}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Listing)
