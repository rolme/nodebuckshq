import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link, withRouter } from 'react-router-dom'

import { Col, Button, Form, FormFeedback, FormGroup, FormText, Label, Input } from 'reactstrap'

import { fetchCrypto, updateCrypto } from '../../reducers/cryptos'

class Crypto extends Component {
  constructor(props) {
    super(props)
    this.state = {
      repository: this.props.crypto.repository,
      branch: this.props.crypto.branch,
      dataSourceSymbol: this.props.crypto.dataSourceSymbol,
      twitter_url: this.props.crypto.twitter_url,
      facebookUrl: this.props.crypto.facebookUrl,
      redditUrl: this.props.crypto.redditUrl,
      slackUrl: this.props.crypto.slackUrl,
      telegramUrl: this.props.crypto.telegramUrl,
      discordUrl: this.props.crypto.discordUrl,
      gitterUrl: this.props.crypto.gitterUrl,
      explorerUrl: this.props.crypto.explorerUrl,
      reset: false
    }
  }

  componentWillMount() {
    let { match: { params }, crypto } = this.props

    if (Object.keys(crypto).length <= 0 || crypto.slug !== params.slug) {
      this.props.fetchCrypto(params.slug)
    }
  }

  componentWillReceiveProps(nextProps) {
    const { branch, dataSourceSymbol, repository, twitter_url, facebookUrl, 
      redditUrl, slackUrl, telegramUrl, discordUrl, gitterUrl, explorerUrl } = nextProps.crypto
    this.setState({ branch, dataSourceSymbol, repository, twitter_url, facebookUrl, 
      redditUrl, slackUrl, telegramUrl, discordUrl, gitterUrl, explorerUrl })
  }

  handleBranchChange(e) {
    this.setState({ branch: e.target.value, reset: true })
  }

  handleDataSourceSymbolChange(e) {
    this.setState({ dataSourceSymbol: e.target.value, reset: true })
  }

  handleRepositoryChange(e) {
    this.setState({ repository: e.target.value, reset: true })
  }

  handleTwitterChange(e) {
    this.setState({ twitter_url: e.target.value, reset: true })
  }

  handleFacebookChange(e) {
    this.setState({ facebookUrl: e.target.value, reset: true })
  }

  handleRedditChange(e) {
    this.setState({ redditUrl: e.target.value, reset: true })
  }

  handleSlackChange(e) {
    this.setState({ slackUrl: e.target.value, reset: true })
  }

  handleTelegramChange(e) {
    this.setState({ telegramUrl: e.target.value, reset: true })
  }

  handleDiscordChange(e) {
    this.setState({ discordUrl: e.target.value, reset: true })
  }

  handleGitterChange(e) {
    this.setState({ gitterUrl: e.target.value, reset: true })
  }

  handleExplorerChange(e) {
    this.setState({ explorerUrl: e.target.value, reset: true })
  }

  handleReset() {
    const { branch, dataSourceSymbol, repository, twitter_url, facebookUrl, 
      redditUrl, slackUrl, telegramUrl, discordUrl, gitterUrl, explorerUrl } = this.props.crypto
    this.setState({ branch, dataSourceSymbol, repository, twitter_url, facebookUrl, 
      redditUrl, slackUrl, telegramUrl, discordUrl, gitterUrl, explorerUrl, reset: false })
  }

  handleSave(e) {
    const { crypto } = this.props
    const { branch, dataSourceSymbol, repository, twitter_url, facebookUrl, 
      redditUrl, slackUrl, telegramUrl, discordUrl, gitterUrl, explorerUrl } = this.state

    this.props.updateCrypto(crypto.slug, {
      branch,
      datasource_symbol: dataSourceSymbol,
      repository,
      twitter_url,
      facebook_url: facebookUrl,
      reddit_url: redditUrl,
      slack_url: slackUrl,
      telegram_url: telegramUrl,
      discord_url: discordUrl,
      gitter_url: gitterUrl,
      explorer_url: explorerUrl,
    })
    this.setState({ reset: false })
  }

  render() {
    let { crypto, error, message, pending, user } = this.props
    let { branch, dataSourceSymbol, repository, twitter_url, facebookUrl, 
      redditUrl, slackUrl, telegramUrl, discordUrl, gitterUrl, explorerUrl, reset } = this.state

    if (user === null || crypto === null) {
      return <div>Loading Crypto</div>
    }

    return(
      <div className="row">
        <div className="offset-1 col-10 mt-2">
          <div className="row">
            <div className="col-md-8">
              <h2>{crypto.name} ({crypto.symbol}) Report</h2>
            </div>
            <div className="col-md-4 text-right">
              <Link to={`/reports/${crypto.reportSlug}`}><Button color="secondary" outline>{crypto.name} Report</Button></Link>
            </div>
          </div>
          <Form>
            <FormGroup row>
              <Label for="data-source-symbol" sm={2}>Data Source Symbol</Label>
              <Col sm={10}>
                <Input type="text" onChange={this.handleDataSourceSymbolChange.bind(this)} value={dataSourceSymbol} disabled={pending} name="data-source-symbol" id="data-source-symbol" placeholder="Symbol used for getting prices" />
                <FormText>Symbol used by data source to get recent prices.</FormText>
              </Col>
            </FormGroup>
            <FormGroup row>
              <Label for="repository" sm={2}>Repository URL</Label>
              <Col sm={10}>
                <Input type="text" onChange={this.handleRepositoryChange.bind(this)} value={repository} disabled={pending} name="repository" id="repository" placeholder="Github repository" />
              </Col>
            </FormGroup>
            <FormGroup row>
              <Label for="branch" sm={2}>Branch</Label>
              <Col sm={10}>
                <Input type="text" onChange={this.handleBranchChange.bind(this)} value={branch} disabled={pending} name="branch" id="branch" placeholder="Active branch" />
              </Col>
            </FormGroup>
            <FormGroup row>
              <Label for="twitter" sm={2}>Twitter URL</Label>
              <Col sm={10}>
                <Input type="text" onChange={this.handleTwitterChange.bind(this)} value={twitter_url} disabled={pending} name="twitter-url" id="twitter-url" />
              </Col>
            </FormGroup>
            <FormGroup row>
              <Label for="facebook" sm={2}>Facebook URL</Label>
              <Col sm={10}>
                <Input type="text" onChange={this.handleFacebookChange.bind(this)} value={facebookUrl} disabled={pending} name="facebook-url" id="facebook-url" />
              </Col>
            </FormGroup>
            <FormGroup row>
              <Label for="reddit" sm={2}>Reddit URL</Label>
              <Col sm={10}>
                <Input type="text" onChange={this.handleRedditChange.bind(this)} value={redditUrl} disabled={pending} name="reddit-url" id="reddit-url" />
              </Col>
            </FormGroup>
            <FormGroup row>
              <Label for="slack" sm={2}>Slack URL</Label>
              <Col sm={10}>
                <Input type="text" onChange={this.handleSlackChange.bind(this)} value={slackUrl} disabled={pending} name="slack-url" id="slack-url" />
              </Col>
            </FormGroup>
            <FormGroup row>
              <Label for="telegram" sm={2}>Telegram URL</Label>
              <Col sm={10}>
                <Input type="text" onChange={this.handleTelegramChange.bind(this)} value={telegramUrl} disabled={pending} name="telegram-url" id="telegram-url" />
              </Col>
            </FormGroup>
            <FormGroup row>
              <Label for="discord" sm={2}>Discord URL</Label>
              <Col sm={10}>
                <Input type="text" onChange={this.handleDiscordChange.bind(this)} value={discordUrl} disabled={pending} name="discord-url" id="discord-url" />
              </Col>
            </FormGroup>
            <FormGroup row>
              <Label for="gitter" sm={2}>Gitter URL</Label>
              <Col sm={10}>
                <Input type="text" onChange={this.handleGitterChange.bind(this)} value={gitterUrl} disabled={pending} name="gitter-url" id="gitter-url" />
              </Col>
            </FormGroup>
            <FormGroup row>
              <Label for="explorerUrl" sm={2}>Explorer URL</Label>
              <Col sm={10}>
                <Input type="text" onChange={this.handleExplorerChange.bind(this)} value={explorerUrl} disabled={pending} name="explorer-url" id="explorer-url" />
                <FormFeedback style={(error) ? {display: 'inline'} : {display: 'none'}}>{message}</FormFeedback>
                <FormFeedback style={(message !== null && message !== 'Fetch cryptocurrency successful.' && !error) ? {display: 'inline', color: 'green'} : {display: 'none'}}>{message}</FormFeedback>
              </Col>
            </FormGroup>
            <Col className="text-right">
              <Button color="secondary" disabled={!reset || pending} onClick={this.handleReset.bind(this)}>Reset</Button> <Button color="primary" disabled={pending || !reset} onClick={this.handleSave.bind(this)}>Save</Button>
            </Col>
          </Form>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  user: state.user.data,
  crypto: state.cryptos.data,
  error: state.cryptos.error,
  pending: state.cryptos.pending,
  message: state.cryptos.message
})

const mapDispatchToProps = dispatch => bindActionCreators({
  fetchCrypto,
  updateCrypto
}, dispatch)

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(Crypto))
