import React from 'react';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { createAnnouncement } from '../../reducers/announcements'

import { Input, Button, Alert } from 'reactstrap'

class Announcements extends React.Component {
  state = {
    text: ''
  }

  handleSubmit = (text) => {
    this.props.createAnnouncement(text);
  }

  render() {
    const { text } = this.state
    const { message, error, pending } = this.props

    return (
      <div className="row">
        <div className="offset-1 col-10">
          <h2 className="mt-2">Announcements</h2>
          {
            message === 'Announcement created' && !error &&
            <div>
              <Alert color="success">
                Announcement successfully created.
              </Alert>
            </div>
          }
          {
            error && !pending &&
            <div>
              <Alert color="danger">
                Something went wrong.
              </Alert>
            </div>
          }
          <Input type="textarea" name="text" value={text} onChange={e => this.setState({ text: e.target.value })} />
          <div style={{textAlign: 'right', marginTop: '10px'}}>
            <Button color="primary" onClick={() => this.handleSubmit(text)}>Submit</Button>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  announcement: state.announcements.data,
  pending: state.announcements.pending,
  message: state.announcements.message,
  error: state.announcements.error
})

const mapDispatchToProps = dispatch => bindActionCreators({
  createAnnouncement
}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Announcements)
