import React from 'react';

import { Row, Col, Input, Button } from 'reactstrap';

export default class Announcements extends React.Component {
  render() {
    return (
      <div className="row">
        <div className="offset-1 col-10">
          <h2 className="mt-2">Announcements</h2>
          <Input type="textarea" name="text" />
          <div style={{textAlign: 'right', marginTop: '10px'}}>
            <Button color="primary">Submit</Button>
          </div>
        </div>
      </div>
    )
  }
}
