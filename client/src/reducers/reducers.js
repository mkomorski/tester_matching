import { combineReducers } from 'redux'
import { DICTS_LOADED, PROCESS_XHR, RESULTS_LOADED, SELECT_OPTION } from '../constants/actions-labels'

function dicts (state = { countries: [], devices: [] }, action) {
  switch (action.type) {
    case DICTS_LOADED:
      return { ...state, [action.key]: action.value }
    default:
      return state
  }
}

function criteria (state = { devices: [], countries: [] }, action) {
  switch (action.type) {
    case SELECT_OPTION:
      return { ...state, [action.param]: action.value }
    default:
      return state
  }
}

function results (state = [], action) {
  switch (action.type) {
    case RESULTS_LOADED:
      return action.value
    default:
      return state
  }
}

function loading (state = false, action) {
  switch (action.type) {
    case PROCESS_XHR:
      return action.state
    default:
      return state
  }
}

const reducers = combineReducers({ results, dicts, criteria, loading })
export default reducers
