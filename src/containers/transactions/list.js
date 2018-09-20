import React, { Component } from 'react'
import { Button } from 'reactstrap'
import { capitalize, valueFormat } from '../../lib/helpers'

export default class TransactionsList extends Component {
  render() {
    const { data, selectedTab } = this.props
    return data.map((item) => {
      return (
        <tr key={item.id}>
          <td className="text-center">{item.id}</td>
          <td className="text-center">{capitalize(item.type)}</td>
          <td className="text-center">{valueFormat(item.amount, 2)}</td>
          <td className="text-center">{item.userName}</td>
          <td className="text-center">{item.slug || '-'}</td>
          <td className="text-center">{item.date || '-'}</td>
          <td className="text-center">{item.notes}</td>
          {selectedTab !== 'processed' && this.renderActionCell(item.id)}
        </tr>
      )
    })
  }

  renderActionCell(id) {
    const { selectedTab } = this.props
    return selectedTab === 'pending' ? <td>
      <div className="d-flex justify-content-center">
        <Button className="mr-2" onClick={() => this.props.updateTransaction(id, {status: 'processed'})}>Process</Button>
        <Button onClick={() => this.props.updateTransaction(id, {status: 'canceled'})}>Cancel</Button>
      </div>
    </td> : <td>
      <div className="d-flex justify-content-center"><Button>Undo</Button></div>
    </td>
  }
}
