const dataStore = require('../store/data-store')

class DictsService {
  constructor () {
    this.dictsMap = {
      devices: {
        key: 'deviceId', display: 'description'
      },
      countries: {
        key: '', display: ''
      }
    }
  }

  getDict (key) {
    let collection = dataStore.getCollection(key)

    /** parsing collection to {key: .., value: ..} format based on information from config map */
    return collection.map(item => {
      let map = this.dictsMap
      let k = map[key]['key']; let v = map[key]['display']

      return {
        key: k ? item[k] : item,
        value: v ? item[v] : item
      }
    })
  }
}

module.exports = new DictsService()
