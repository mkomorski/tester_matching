import React from 'react'
import ReactDOM from 'react-dom'
import UpdateButton from '../src/components/UpdateButton'
import ClearButton from '../src/components/ClearButton'
import ResultsList from '../src/components/ResultsList'
import App from '../src/App'
import Select from '../src/components/Select'
import { create } from 'react-test-renderer'
import { act } from 'react-dom/test-utils'
import { resultsLoaded } from '../src/actions/actions'
import store from '../src/stores/store'

const resultsMock = [
  { testerId: 1, firstName: 'Mietek', lastName: 'Jurecki', bugsReported: 120, country: 'US' },
  { testerId: 2, firstName: 'Mirosław', lastName: 'Szymkowiak', bugsReported: 111, country: 'JP' },
  { testerId: 3, firstName: 'Bartłomiej', lastName: 'Brzęczyszczykiewicz', bugsReported: 94, country: 'US' },
  { testerId: 4, firstName: 'Ziemosław', lastName: 'Czempiński', bugsReported: 88, country: 'GB' },
  { testerId: 5, firstName: 'Grzegorz', lastName: 'Budrys', bugsReported: 40, country: 'US' },
  { testerId: 6, firstName: 'Krzysztof', lastName: 'Pałys', bugsReported: 4, country: 'JP' }
]

let container
describe('components tests', () => {
  beforeEach(() => {
    container = document.createElement('div')
    document.body.appendChild(container)
  })

  afterEach(() => {
    document.body.removeChild(container)
    container = null
  })

  it('should not render collection element on start', () => {
    act(() => {
      ReactDOM.render(<ResultsList itemsByPage={5} store={store} />, container)
    })

    let div = document.getElementById('results-container')
    expect(div).toBeNull()
  })

  it('should render collection on resultsLoaded dispatch', () => {
    act(() => {
      ReactDOM.render(<ResultsList itemsByPage={5} store={store} />, container)
      store.dispatch(resultsLoaded(resultsMock))
    })

    let div = document.getElementById('results-container')
    expect(div).toBeDefined()

    let rows = document.getElementsByClassName('collection-item')
    expect(Array.from(rows).length).toBe(5)
  })

  it('should display row in collection with proper country and bugs information', () => {
    act(() => {
      ReactDOM.render(<ResultsList itemsByPage={3} store={store} />, container)
      store.dispatch(resultsLoaded(resultsMock))
    })

    let rows = Array.from(document.getElementsByClassName('collection-item'))
    let children = rows[0].children

    expect(children[0].textContent === '120').toBe(true)
    expect(children[1].textContent === 'US').toBe(true)
  })

  it('should render pagination properly on resultsLoaded dispatch', () => {
    act(() => {
      ReactDOM.render(<ResultsList itemsByPage={2} store={store} />, container)
      store.dispatch(resultsLoaded(resultsMock))
    })

    let pagination = document.getElementById('pagination')
    expect(Array.from(pagination.children).length).toBe(3)
  })

  it('should change displayed chunk on page change', () => {
    act(() => {
      ReactDOM.render(<ResultsList itemsByPage={2} store={store} />, container)
      store.dispatch(resultsLoaded(resultsMock))
    })

    let firstElementBeforePageChange = document.getElementsByClassName('collection-item')[0]
    let secondPage = document.getElementById('pagination').children[1].children[0]

    act(() => {
      secondPage.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    })

    let firstElementAfterPageChange = document.getElementsByClassName('collection-item')[0]

    expect(firstElementBeforePageChange.childNodes[2].textContent !== firstElementAfterPageChange.childNodes[2].textContent).toBe(true)
    expect(firstElementAfterPageChange.childNodes[2].textContent).toBe('3. Bartłomiej Brzęczyszczykiewicz')
  })

  it('should clear collection after clear button click', () => {
    act(() => {
      ReactDOM.render([<ClearButton key={'clearBtn'} />, <ResultsList key={'resultsList'} itemsByPage={2} store={store} />], container)
      store.dispatch(resultsLoaded(resultsMock))
    })

    let div = document.getElementById('results-container')
    expect(div).toBeDefined()

    let clearButton = document.getElementById('clear-button')
    act(() => {
      clearButton.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    })

    div = document.getElementById('results-container')
    expect(div).toBeNull()
  })
})
