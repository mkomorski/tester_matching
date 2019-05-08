const dataStore = require('../store/data-store')

class BugsService {
  prepareOutput (filteredBugs) {
    let output = []
    let testers = dataStore.getCollection('testers')

    filteredBugs.forEach(bug => {
      let currentTester = testers.find(tester => tester.testerId === bug.testerId)

      if (!currentTester) { return }

      let testerInOutput = output.find(t => t.testerId === currentTester.testerId)

      if (!testerInOutput) { output.push({ bugsReported: 1, ...currentTester }) } else { testerInOutput.bugsReported++ }
    })

    return output.sort((a, b) => b.bugsReported - a.bugsReported)
  }

  getBugsOverview (devicesIds, countries) {
    let devicesIdsArray = devicesIds ? (Array.isArray(devicesIds) ? devicesIds : [devicesIds]) : []
    let countriesArray = countries ? (Array.isArray(countries) ? countries : [countries]) : []

    let filteredBugs = dataStore.getBugsByParams(devicesIdsArray, countriesArray)

    return this.prepareOutput(filteredBugs)
  }
}

module.exports = new BugsService()
