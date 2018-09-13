import React, { Fragment } from 'react'
import { Link } from 'react-static'
import Flash from './Flash'
import { receiveSignoutSuccess } from 'actions'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'

const styles = theme => ({
  signInAgain: {
    color: theme.palette.common.white
  },
  flash: {
    textAlign: 'center'
  }
})

export class Notifications extends React.Component {
  signOutLocally = () => {
    this.props.receiveSignoutSuccess()
  }

  errorPresenter = (err, i, classes) => {
    if (err.status === 401) {
      return (
        <p key={i}>
          {err.detail} <Link to='/signin?forceSignout=1' className={classes.signInAgain}>
            Sign In Again
          </Link>
        </p>
      )
    }
    return <p key={i}>{err.detail}</p>
  }

  successPresenter = (success, i) => {
    const isJob = success => success.data && success.data.type === 'specs'
    const isJobRun = success => success.data && success.data.type === 'runs'
    const isBridge = success => success.data && success.data.type === 'bridges'
    const attributes = success.data.attributes
    if (isJob(success)) {
      return <p key={i}>
        Job <Link to={`/job_specs/${attributes.id}`}>{attributes.id}</Link> was successfully created
      </p>
    }
    if (isJobRun(success)) {
      return <p key={i}>
        Job <Link to={`/job_specs/${attributes.jobId}/runs/id/${attributes.id}`}>{attributes.id}</Link> was successfully run
      </p>
    }
    if (isBridge(success)) {
      return <p key={i}>
        Bridge <Link to={`/bridges/${attributes.name}`}>{attributes.name}</Link> was successfully created
      </p>
    }
  }

  render () {
    const { errors, successes, classes } = this.props
    return (
      <Fragment>
        {errors.length > 0 &&
          <Flash error className={classes.flash}>
            {errors.map((err, i) => this.errorPresenter(err, i, classes))}
          </Flash>
        }
        {successes.length > 0 && (
          <Flash success className={classes.flash}>
            {successes.map((succ, i) => this.successPresenter(succ, i))}
          </Flash>
        )}
      </Fragment>
    )
  }
}

const mapStateToProps = state => ({
  errors: state.notifications.errors,
  successes: state.notifications.successes
})

const mapDispatchToProps = dispatch => bindActionCreators({receiveSignoutSuccess}, dispatch)

export const ConnectedNotifications = connect(mapStateToProps, mapDispatchToProps)(Notifications)

export default withStyles(styles)(ConnectedNotifications)