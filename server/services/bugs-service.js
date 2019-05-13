const dataStore = require('../store/data-store')

class BugsService {
  async prepareOutput (filteredBugs) {
    let output = []

    let testers = await dataStore.getCollectionByParams('testers', { testerId: filteredBugs.map(b => b.testerId) })

    for (let bug of filteredBugs) {
      let currentTester = testers.find(t => t.testerId === bug.testerId)

      if (!currentTester) { return }

      let testerInOutput = output.find(t => t.testerId === currentTester.testerId)

      if (!testerInOutput) { output.push({ bugsReported: 1, ...currentTester }) } else { testerInOutput.bugsReported++ }
    }

    return output.sort((a, b) => b.bugsReported - a.bugsReported)
  }

  async getBugsOverview (devicesIds, countries) {
    let devicesIdsArray = devicesIds ? (Array.isArray(devicesIds) ? devicesIds : [devicesIds]) : []
    let countriesArray = countries ? (Array.isArray(countries) ? countries : [countries]) : []

    let filteredBugs = await dataStore.getCollectionByParams('bugs', { deviceId: devicesIdsArray })

    if (countriesArray.length) {
      let testers = await dataStore.getCollectionByParams('testers', { testerId: filteredBugs.map(b => b.testerId) })
      let testersIds = testers.filter(t => countriesArray.includes(t.country))
        .map(t => t.testerId)

      filteredBugs = filteredBugs.filter(bug => testersIds.includes(bug.testerId))
    }

    let output = await this.prepareOutput(filteredBugs)
    return output
  }
}

module.exports = new BugsService()
