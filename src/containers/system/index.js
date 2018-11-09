import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import {
  fetchSystem,
  updateSystemSetting
} from '../../reducers/system'

class System extends Component {
  render() {
    return (
      <div className="row">
        <div className="col-12 px-5">
          <h2 className="mt-2">System Info</h2>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  system: state.system.data,
  user: state.user.user
})

const mapDispatchToProps = dispatch => bindActionCreators({
  fetchSystem,
  updateSystemSetting
}, dispatch)

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(System))
