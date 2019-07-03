const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const fs = require('fs')
const path = require('path')
const Value = require('./models/data')

app.use(cors())
app.use(bodyParser.json())
app.use(morgan(':method :url content-type: :type, request.body: :request, status: :status, content-length: :res[content-length], response time: :response-time ms'))

morgan.token('type', function (req, res) { return req.headers['content-type'] })
morgan.token('request', function (req, res) { return JSON.stringify(req.body) })

// app.use(morgan('common', {
//   stream: fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' }),
//   skip: function (req, res) { return res.statusCode < 400 }
// }))


const formatValue = (value) => {
  const formattedValue = { ...value._doc, id: value._id }
  delete formattedValue._id
  delete formattedValue.__v

  return formattedValue
}

app.get('/', (req, res) => {
  res.send('Arduino Weather Station')
})

// list all data
app.get('/data', (req, res) => {
  Value
    .find({})
    .then(values => {
      res.json(values.map(formatValue))
    })
    .catch(error => {
      console.log(error)
    })
})

// list data with id value
app.get('/data/:id', (req, res) => {
  Value
    .findById(req.params.id)
    .then(value => {
      res.json(formatValue(value))
    })
    .catch(error => {
      console.log(error)
    })
})

// add data
app.post('/data', (request,response) => {

  const value = new Value({
    temperature: request.body.temperature,
    humidity: request.body.humidity,
    pressure: request.body.pressure,
    light: request.body.light,
    time: Math.round((new Date).getTime()/1000),
    timeString: new Date().toISOString().split('.')[0]+"Z"
  })

  value
    .save()
    .then(savedValue => {
      response.json(formatValue(savedValue))
    })
    .catch(error => {
      console.log(error)
    })

})

// delete data with id
app.delete('/data/:id', (req, res) => {
  Value
    .findByIdAndRemove(req.params.id)
    .then(result => {
      res.status(204).end()
    })
    .catch(error => {
      res.status(400).send({ error: 'malformatted id' })
    })
})

const port = 3001
app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})