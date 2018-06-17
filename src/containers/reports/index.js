import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { Col, Row } from 'reactstrap'
import { RingLoader } from 'react-spinners'
import './dashboard.css'


import NewReportForm from '../report/new_report_form'

import { fetchCryptos } from '../../reducers/cryptos'
import { fetchReports } from '../../reducers/reports'
import { fetchSubscribers } from '../../reducers/subscribers'
import { fetchUsers } from '../../reducers/users'

class Dashboard extends Component {
  componentWillMount() {
    let { cryptos, user, reports, subscribers, users } = this.props

    if (reports.length <= 1 && user !== '') {
      this.props.fetchReports()
    }

    if (cryptos.length <= 1 && user !== '') {
      this.props.fetchCryptos()
    }

    if (!subscribers || (subscribers.length === 0 && user !== '')) {
      this.props.fetchSubscribers()
    }

    if (!users || (users.length === 0 && user !== '')) {
      this.props.fetchUsers()
    }

  }

  render() {
    let { reports, user } = this.props

    if (user === null || reports.length === 0) {
      return (
        <div className="spinnerContainer">
          <RingLoader
            size={150}
            color={'#FD552D'}
            loading={true}
          />
        </div>
      )
    }

    return(
      <Row className="mt-5">
        <Col md={{size: 10, offset: 1}} sm={{ size: 8, offset: 2}} size={12}>
          <h2 className="py-2">Reports</h2>
          <NewReportForm
            excludeCryptos={reports.map(report => { return report.cryptoId })}
            user={user}
          />
          <div className="fixed-column-wrapper">
            <div className="fixed-column-scroller">
              <table className="table table-striped thead-light fixed-column-table">
                <thead>
                  <tr>
                    <th className="sticky-col">report</th>
                    <th>status</th>
                    <th>author</th>
                    <th>reviewer</th>
                    <th>assignee</th>
                  </tr>
                </thead>
                <tbody>
                  { this.displayReportRows() }
                </tbody>
              </table>
            </div>
          </div>
        </Col>
      </Row>
    )
  }

  displayReportRows() {
    let { reports } = this.props

    return reports.sort((a,b) => {
      if (a.slug > b.slug) return 1
      if (a.slug < b.slug) return -1
      return 0
    }).map(report => {
      return(
        <tr key={report.id}>
          <td className="sticky-col">
            <Link to={`/reports/${report.slug}`}>
              <img src={`https://rency.com${report.logo}`} width="16" height="16" alt={report.name}/> {report.name} ({report.symbol})
            </Link>
          </td>
          <td>{report.status}</td>
          <td>{report.author.fullName}</td>
          <td>{report.reviewer.fullName}</td>
          <td>{report.assignee.fullName}</td>
        </tr>
      )
    })
  }
}

const mapStateToProps = state => ({
  cryptos: state.cryptos.list,
  reports: state.reports.list,
  user: state.user.data,
})

const mapDispatchToProps = dispatch => bindActionCreators({
  fetchCryptos,
  fetchReports,
  fetchSubscribers,
  fetchUsers
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard)
