import { connect } from 'react-redux'
import React, { Component } from 'react'
import { requestLoadDict, selectOption } from '../actions/actions'
import M from 'materialize-css'

class Select extends Component {
  constructor () {
    super()
    this.valueChanged = this.valueChanged.bind(this)
  }

  componentWillMount () {
    this.props.dispatch(requestLoadDict(this.props.id))
  }

  componentDidUpdate () {
    let elems = document.querySelectorAll('select')
    M.FormSelect.init(elems, {})

    let lis = Array.from(document.getElementsByTagName('li'))
    for (let li of lis) {
      if (li.classList[0] === 'disabled') { li.style.display = 'none' }
    }
  }

  valueChanged (e) {
    let values = Array.from(e.target.options).filter(o => o.selected).map(o => o.value)
    this.props.dispatch(selectOption(this.props.id, values))
  }

  render () {
    let { props } = this

    return (
      <div className='input-field'>
        <select value={props.criteria} multiple onChange={this.valueChanged}>
          <option value='' disabled>ALL</option>
          {props.dicts[props.id].map((o, key) => <option key={key} value={o.key}>{o.value}</option>)}
        </select>
        <label>Select {props.id}</label>
      </div>
    )
  }
}

const mapStateToParams = (state, ownProps) => ({
  dicts: state.dicts,
  criteria: state.criteria[ownProps.id],
  ...ownProps
})

export default connect(mapStateToParams)(Select)
