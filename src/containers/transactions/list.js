import React, { Component } from 'react'
import { Button } from 'reactstrap'
import { capitalize, valueFormat } from '../../lib/helpers'
import moment from 'moment'

export default class TransactionsList extends Component {

  handleCancel(id, slug) {
    if ( window.confirm("You are about to cancel transaction ID #" + id + ". Are you sure?") ) {
      this.props.updateTransaction(slug, 'cancel')
    }
  }

  render() {
    const { data, selectedTab } = this.props
    return data.map((item) => {
      const date = !!item.createdAt ? moment(item.createdAt).format("MMM D, YYYY  HH:mm") : '-'
      return (
        <tr key={item.id}>
          <td className="text-center">{item.id}</td>
          <td className="text-center">{capitalize(item.type)}</td>
          <td className="text-center">{valueFormat(item.amount, 2)}</td>
          <td className="text-center">{item.userName}</td>
          <td className="text-center">{date}</td>
          <td className="text-center">{item.notes}</td>
          {selectedTab !== 'processed' && this.renderActionCell(item)}
        </tr>
      )
    })
  }

  renderActionCell(item) {
    const { slug, id } = item
    const { selectedTab } = this.props
    return selectedTab === 'pending' ? <td>
      <div className="d-flex justify-content-center">
        <Button className="mr-2" onClick={() => this.props.updateTransaction(slug, 'process')}>Process</Button>
        <Button onClick={() => this.handleCancel.call(this, id, slug)}>Cancel</Button>
      </div>
    </td> : <td>
      <div onClick={() => this.props.updateTransaction(slug, 'undo')} className="d-flex justify-content-center"><Button>Undo</Button></div>
    </td>
  }
}
