const express = require('express')
const path = require('path')
const app = express()
module.exports = app

// boilerplate middleware
app.use(require('./middleware'))

// 'api' routes
app.use(require('./routes'))

// all GET req's that aren't to an api route, will be sent to index.html

app.get('/*', (req, res, next) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'))
})

// error handling endware
app.use((err, req, res, next) => {
  res.status(err.status || 500)
  res.send(err.message || 'Internal server error')
})
