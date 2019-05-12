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

    this.parseToKeyValueFormat = this.parseToKeyValueFormat.bind(this)
  }

  parseToKeyValueFormat(key)
  {

    return function(item){
      let map = this.dictsMap
      let k = map[key]['key']; let v = map[key]['display']

      item.key = k ? item[k] : item,
      item.value = v ? item[v] : item

      Object.keys(item).filter(key => !['key', 'value'].includes(key)).forEach(key => delete item[key])

    }.bind(this)

  }

  async getDict (key) {

    if(key === 'countries')
    {
      let testers = await dataStore.getCollectionByParams('testers', {})
      let countries = testers.reduce((prev, curr) => prev.includes(curr.country) ? prev : [...prev, curr.country], [])

      return countries.map(c => ({key: c, value: c}))
    }

    let collection = await dataStore.getCollectionByParams(key, {}, this.parseToKeyValueFormat(key))

    return collection

  }
}

module.exports = new DictsService()
