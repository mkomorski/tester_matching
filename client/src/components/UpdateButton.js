import React, { Component } from 'react'
import { requestLoadResults } from '../actions/actions'
import store from '../stores/store'

class UpdateButton extends Component {
  constructor () {
    super()
    this.fetchData = this.fetchData.bind(this)
  }

  fetchData () {
    store.dispatch(requestLoadResults())
  }

  render () {
    return (
      <a className='waves-effect waves-light btn' onClick={this.fetchData}>FETCH</a>
    )
  }
}

export default UpdateButton
