const mongoose = require('mongoose')

const url = 'mongodb://handler:arduino1@ds343217.mlab.com:43217/weatherdata'

mongoose.connect(url, { useNewUrlParser: true })

const Value = mongoose.model('Value', {
  time: Number,
  temperature: Number,
  humidity: Number,
  pressure: Number,
  light: Number,
  timeString: String
})

module.exports = Value