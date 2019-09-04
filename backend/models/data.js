const mongoose = require('mongoose')

const url = 'mongodb://handler:arduino1@ds157707.mlab.com:57707/weatherobs'

mongoose.connect(url, { useNewUrlParser: true })

const schema = new mongoose.Schema({
  time: Number,
  temperature: Number,
  humidity: Number,
  pressure: Number,
  light: Number,
  timeString: String
}, {timestamps: true});

const Value = mongoose.model('Value', schema)

module.exports = Value