const express = require('express')
const router = express.Router()
const dictsService = require('../services/dicts-service')

/* GET users listing. */
router.get('/', async function (req, res, next) {
  let { key } = req.query
  let collection = await dictsService.getDict(key)
  res.json(collection)
})

module.exports = router
