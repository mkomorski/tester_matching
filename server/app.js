const createError = require('http-errors')
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')

const indexRouter = require('./routes/index')
const dictsRouter = require('./routes/dicts')
const bugsRouter = require('./routes/bugs')

const app = express()

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS')
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With')

  if (req.method === 'OPTIONS') {
    res.send(200)
  } else {
    next()
  }
})

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static(__dirname + '/public'))
app.use(cookieParser())

app.use('/', indexRouter)
app.use('/dicts', dictsRouter)
app.use('/bugs', bugsRouter)

app.get('/panel', function (req, res) {
  res.sendFile(path.join(__dirname + '/public/index.html'))
})

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404))
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.json({ messageCode: 'error.message.code', description: err })
})

module.exports = app
