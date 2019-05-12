const express = require('express')
const router = express.Router()
const bugsService = require('../services/bugs-service')

/** GET bugs listing.
 it receives query URL parameters for now, in future to make it more scalable it should be done
 using POST request and request body to avoid the limitation of get url size **/
router.get('/', async function (req, res, next) {
  let { devicesIds, countries } = req.query
  let bugs = await bugsService.getBugsOverview(devicesIds, countries)
  res.json(bugs)
})

module.exports = router
