import React, { Component } from 'react'
import './App.css'
import Select from './components/Select.js'
import UpdateButton from './components/UpdateButton'
import ClearButton from './components/ClearButton'
import ResultsList from './components/ResultsList'
import { Provider } from 'react-redux'
import store from './stores/store'

class App extends Component {
  render () {
    return (
      <Provider store={store}>
        <section>

          <h3>Tester Matching</h3>

          <div id='filter-bar'>
            <div>
              <Select id={'countries'} />
              <Select id={'devices'} />
            </div>
            <div>
              <UpdateButton />
              <ClearButton />
            </div>
          </div>

          <ResultsList itemsByPage={5} />

        </section>
      </Provider>
    )
  }
}

export default App
