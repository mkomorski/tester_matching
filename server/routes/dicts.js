const express = require('express')
const router = express.Router()
const dictsService = require('../services/dicts-service')

/* GET users listing. */
router.get('/', function (req, res, next) {
  let { key } = req.query
  let collection = dictsService.getDict(key)
  res.json(collection)
})

module.exports = router
