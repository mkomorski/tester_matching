const assert = require('assert')
const dataStore = require('../store/data-store')
const dictsService = require('../services/dicts-service')
const bugsService = require('../services/bugs-service')
const sinon = require('sinon')

before(function () {
  let stub = sinon.stub(dataStore, 'loadData')
  stub.callsFake(function loadTestData () {
    this.collections = {
      bugs: [
        { bugId: '1', testerId: '1', deviceId: '1' },
        { bugId: '2', testerId: '2', deviceId: '1' },
        { bugId: '3', testerId: '1', deviceId: '1' },
        { bugId: '4', testerId: '3', deviceId: '2' },
        { bugId: '5', testerId: '2', deviceId: '1' },
        { bugId: '6', testerId: '1', deviceId: '3' },
        { bugId: '7', testerId: '4', deviceId: '2' }
      ],
      testers: [
        { testerId: '1', country: 'US' },
        { testerId: '2', country: 'JP' },
        { testerId: '3', country: 'US' },
        { testerId: '4', country: 'GB' }
      ],
      devices: [
        { deviceId: '1', description: 'IPhone 4' },
        { deviceId: '2', description: 'IPhone 5' },
        { deviceId: '3', description: 'IPhone XS' }
      ]
    }

    this.dataLoaded = true
  })

  dataStore.loadData()
})

describe('DataStore', function () {
  it('should properly return all bugs for blank criteria', function () {
    let blankCriteriaResult = dataStore.getBugsByParams([], [])
    assert.strictEqual(blankCriteriaResult.length, 7)
  })

  it('should return proper number of bugs for mixed criteria', function () {
    let mixedCriteriaResult = dataStore.getBugsByParams(['1'], [])
    assert.strictEqual(mixedCriteriaResult.length, 4)
  })

  it('should return only properly filtered bugs for mixed criteria', function () {
    let mixedCriteriaResult = dataStore.getBugsByParams(['1'], [])
    assert.ok(!mixedCriteriaResult.filter(bug => bug.deviceId !== '1').length)
  })

  it('should return only properly filtered bugs for all criteria', function () {
    let allCriteriaResult = dataStore.getBugsByParams(['1'], ['US', 'GB'])
    let ids = allCriteriaResult.map(bug => bug.bugId)

    assert.strictEqual(allCriteriaResult.length, 2)
    assert.ok(ids[0] === '1' && ids[1] === '3')
  })

  it('should properly create countries dicts based on testers information', function () {
    let countries = dataStore.getCountriesDictContent(dataStore.collections['testers'])
    let condition = countries.length === 3 && countries[0] === 'US' && countries[1] === 'JP' && countries[2] === 'GB'
    assert.ok(condition)
  })

  it('should throw an error for invalid criteria', function () {
    try {
      dataStore.getBugsByParams([])
    } catch (e) {
      assert.strictEqual(String(e), 'Error: Unexpected param type')
    }
  })
})

describe('DictsService', function () {
  it('should return properly parsed devices collection', function () {
    let unparsedDevicesList = dataStore.getCollection('devices')
    let parsedDevicesList = dictsService.getDict('devices')
    let invalidElemsList = unparsedDevicesList.filter((item, nr) => item.deviceId !== parsedDevicesList[nr].key)
    assert.ok(!invalidElemsList.length)
  })

  it('should return properly parsed countries collection', function () {
    let unparsedDevicesList = dataStore.getCollection('devices')
    let parsedDevicesList = dictsService.getDict('devices')
    let invalidElemsList = unparsedDevicesList.filter((item, nr) => item.deviceId !== parsedDevicesList[nr].key)
    assert.ok(!invalidElemsList.length)
  })
})

describe('BugsService', function () {
  it('should return properly prepared output of bug overview for lack of criteria', function () {
    let testersWithBugs = bugsService.getBugsOverview()
    assert.ok(testersWithBugs[0].testerId === '1' && testersWithBugs[0].bugsReported === 3)
    assert.ok(testersWithBugs[1].testerId === '2' && testersWithBugs[1].bugsReported === 2)
    assert.ok(testersWithBugs[2].testerId === '3' && testersWithBugs[2].bugsReported === 1)
  })

  it('should return properly prepared output of bug overview for set criteria', function () {
    let testersWithBugs = bugsService.getBugsOverview(['1'], ['US'])
    assert.ok(testersWithBugs[0].testerId === '1' && testersWithBugs[0].bugsReported === 2)
    assert.ok(testersWithBugs.length === 1)
  })
})
