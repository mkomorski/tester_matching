import { connect } from 'react-redux'
import React, { Component } from 'react'

class ResultsList extends Component {
  constructor () {
    super()
    this.state = { page: 1, chunk: [] }
  }

  componentDidUpdate (prevProps) {
    if (prevProps.loading !== this.props.loading) {
      this.setState({
        page: 1
      })
    }
  }

  setPage (page) {
    this.setState({
      page
    })
  }

  getPages () {
    let count = Math.ceil(this.props.results.length / this.props.itemsByPage)
    return Array(count).fill().map((x, i) => ++i)
  }

  getCurrentChunk () {
    let page = this.state.page - 1

    let start = page * this.props.itemsByPage
    let end = start + this.props.itemsByPage

    return this.props.results.slice(start, end)
  }

  render () {
    let { props } = this

    const preloader = (
      <div className='progress'>
        <div className='indeterminate' />
      </div>
    )

    const content = props.results.length ? (
      <div id={'results-container'} className={'results-container'}>
        <ul className='collection' >
          {this.getCurrentChunk().map((t, k) => <li key={t.testerId} href='#!' className='collection-item'>
            <span className='new badge' data-badge-caption='bugs'>{t.bugsReported}</span>
            <span className='badge'>{t.country}</span>
            {(this.state.page - 1) * props.itemsByPage + (++k) + '. ' + t.firstName + ' ' + t.lastName}
          </li>)}
        </ul>
        <ul id={'pagination'} className={'pagination'}>
          {this.getPages().map(p => <li key={p} className={this.state.page === p ? 'active' : 'waves-effect'}><a onClick={() => this.setPage(p)} href='#!'>{p}</a></li>)}
        </ul>
      </div>
    ) : <div id={'blank-results'} />

    return props.loading ? preloader : content
  }
}

const mapStateToParams = (state, ownProps) => ({
  results: state.results,
  loading: state.loading,
  ...ownProps
})

export default connect(mapStateToParams)(ResultsList)
