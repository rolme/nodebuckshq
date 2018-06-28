import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { withRouter, NavLink } from 'react-router-dom'

import {
  fetchNodes
} from '../../reducers/nodes'

class Nodes extends Component {
  componentWillMount() {
    const { list, user } = this.props

    if (list.length <= 1 && user !== '') {
      this.props.fetchNodes()
    }
  }

  render() {
    let { list, user } = this.props

    if (user === null || list === null) {
      return <div>Loading Nodes</div>
    }

    return(
      <div className="row">
        <div className="offset-1 col-10">
          <h2 className="mt-2">Nodes ({list.length})</h2>
          <table className="table table-striped">
            <thead>
              <tr>
                <th>owner</th>
                <th>type</th>
                <th>id</th>
                <th>status</th>
              </tr>
            </thead>
            <tbody>
              {this.displayNodes(list)}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  displayNodes(list) {
    return list.map(item => {
      return(
        <tr key={item.slug}>
          <td style={{verticalAlign: 'middle'}}>{item.owner.fullName}</td>
          <td>{item.crypto.name}</td>
          <td><NavLink to={`/nodes/${item.slug}`}>{item.slug}</NavLink></td>
          <td>{item.status}</td>
        </tr>
      )
    })
  }
}

const mapStateToProps = state => ({
  list: state.nodes.list,
  user: state.user.user
})

const mapDispatchToProps = dispatch => bindActionCreators({
  fetchNodes
}, dispatch)

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Nodes))
