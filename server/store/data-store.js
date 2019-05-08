const csvService = require('csvtojson/v2')
const dataFilesPath = `${__dirname}/../data`

/** Some kind of data layer abstraction, just for avoiding using a database
 I chose third-party library for parsing csv files to json format which is also able to work on streams
 in case of big files. Data is being loaded for once at application start **/
class DataStore {
  constructor () {
    this.dataLoaded = false
    this.collections = {
      bugs: [], testers: [], devices: []
    }
  }

  async loadData () {
    let collectionKeys = Object.keys(this.collections)
    let readFilesPromises = collectionKeys.map(key => csvService().fromFile(`${dataFilesPath}/${key}.csv`))
    let resolved
    try {
      resolved = await Promise.all(readFilesPromises)
    } catch (e) {
      console.error('Problem during data loading')
      resolved = []
    }

    let nr = 0
    for (let item of resolved) {
      let key = collectionKeys[nr++]
      this.collections[key] = item
    }

    /** fetching tester_device.csv, despite it's actually not necessary for fulfilling requirements **/
    resolved = await csvService().fromFile(`${dataFilesPath}/tester_device.csv`)

    for (let row of resolved) {
      let tester = this.collections['testers'].find(item => item.testerId === row.testerId)
      let device = this.collections['devices'].find(item => item.deviceId === row.deviceId)

      if (!tester || !device) { return }

      Array.isArray(tester.devices) ? tester.devices.push(device) : tester.devices = [device]
    }

    this.collections['countries'] = this.getCountriesDictContent(this.collections['testers'])
    this.dataLoaded = true
  }

  /** populating countries dict based on testers collection information */
  getCountriesDictContent (testers) {
    return testers.reduce((prev, curr) => prev.includes(curr.country) ? prev : [...prev, curr.country], [])
  }

  getCollection (id) {
    if (!this.dataLoaded) { throw new Error('Data not loaded') }

    /** returning new copy of array to make the original one immutable */
    return [...this.collections[id]]
  }

  getBugsByParams (devicesIds, countries) {
    if (!this.dataLoaded) { throw new Error('Data not loaded') }

    if (!Array.isArray(devicesIds) || !Array.isArray(countries)) { throw new Error('Unexpected param type') }

    return this.collections['bugs'].filter(bug => {
      /** need to find tester to filter by countries */
      let currentTester = this.collections['testers'].find(tester => tester.testerId === bug.testerId)

      /** filtering data set with criteria */
      return !(!currentTester ||
                (devicesIds.length && !devicesIds.includes(bug.deviceId)) ||
                (countries.length && !countries.includes(currentTester.country)))
    })
  }
}

module.exports = new DataStore()
