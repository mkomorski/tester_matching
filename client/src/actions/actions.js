import * as actions from '../constants/actions-labels'
import { API_ENDPOINT } from '../constants/rest-config'
import regeneratorRuntime from 'regenerator-runtime'

export function dictLoaded (key, value) {
  return {
    type: actions.DICTS_LOADED,
    key,
    value
  }
}

export function resultsLoaded (value) {
  return {
    type: actions.RESULTS_LOADED,
    value
  }
}

export function selectOption (param, value) {
  return {
    type: actions.SELECT_OPTION,
    value,
    param
  }
}

export function processXHR (state) {
  return {
    type: actions.PROCESS_XHR,
    state
  }
}

export function requestLoadDict (key) {
  return async dispatch => {

      try{
          let response = await fetch(`${API_ENDPOINT}/dicts?key=${key}`)
          let jsonBody = await response.json()

          if (response.ok) {
            dispatch(dictLoaded(key, jsonBody))
          } else {
            console.error(`HTTP Request error response: ${jsonBody.messageCode}`)
            // @TODO Display message modal on http error
          }
      }catch(e)
      {
          console.error(`HTTP Request failed`)
          // @TODO Display message modal on http error
      }
  }
}

export function requestLoadResults () {
  return async (dispatch, getState) => {
    dispatch(processXHR(true))

    let { devices, countries } = getState()['criteria']

    let paramsStr = devices.reduce((prev, curr) => `${prev}devicesIds=${curr}&`, '')
    paramsStr = countries.reduce((prev, curr) => `${prev}countries=${curr}&`, paramsStr)

      try {
          let response = await fetch(`${API_ENDPOINT}/bugs?${paramsStr}`)
          let jsonBody = await response.json()
          dispatch(processXHR(false))
          if (response.ok) {
              dispatch(resultsLoaded(jsonBody))
          } else {
              dispatch(resultsLoaded([]))
              console.error(`HTTP Request error: ${jsonBody.messageCode}`)
              // @TODO Display message modal on http error
          }
      }catch(e)
      {
          console.error(`HTTP Request failed`)
          // @TODO Display message modal on http error
      }

  }
}
