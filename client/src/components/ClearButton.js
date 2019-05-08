import React, { Component } from 'react'
import { resultsLoaded, selectOption } from '../actions/actions'
import store from '../stores/store'

class ClearButton extends Component {
  constructor () {
    super()
    this.clearCriteria = this.clearCriteria.bind(this)
  }

  clearCriteria () {
    store.dispatch(selectOption('devices', []))
    store.dispatch(selectOption('countries', []))
    store.dispatch(resultsLoaded([]))
  }

  render () {
    return (
      <a className='waves-effect waves-light btn grey' id={'clear-button'} onClick={this.clearCriteria}>{'CLEAR'}</a>
    )
  }
}

export default ClearButton
