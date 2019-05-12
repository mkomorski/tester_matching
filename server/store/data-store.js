const csvService = require('csvtojson/v2')
const dataFilesPath = `${__dirname}/../data`
const fs = require('fs')

/** Some kind of data layer abstraction, just for avoiding using a database
 I chose third-party library for parsing csv files to json format which is also able to work on streams
 in case of big files. **/
class DataStore {
  getStream (fileName) {
    return fs.createReadStream(`${dataFilesPath}/${fileName}.csv`).pipe(csvService())
  }

  /**
   * This method can be used for passing stream directly to response object
   * can be helpful in large collections case
   * @param id
   * @param mapFunction
   */
  getCollectionLazily (id, mapFunction) {
    let availableCollections = ['devices', 'testers', 'bugs']

    if (!availableCollections.includes(id)) { throw new Error('Unknown collection name') }

    return this.getStream(id).subscribe(mapFunction)
  }

  async getCollectionByParams (collectionName, params, mapFunction) {
    return new Promise((res, rej) => {
      let convertedStream = this.getStream(collectionName)

      if (mapFunction) { convertedStream.subscribe(mapFunction) }

      let outputCollection = []

      convertedStream.on('data', (data) => {
        let item = JSON.parse(data)
        let flag = true

        for (let paramKey of Object.keys(params)) {
          if (params[paramKey].length && !params[paramKey].includes(item[paramKey])) { flag = false }
        }

        if (flag) { outputCollection.push(item) }
      })

      convertedStream.on('end', () => {
        res(outputCollection)
      })
    })
  }
}

module.exports = new DataStore()
