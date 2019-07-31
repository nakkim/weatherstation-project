const mongoose = require('mongoose')

const url = 'mongodb://handler:arduino1@ds343217.mlab.com:43217/weatherdata'

mongoose.connect(url, { useNewUrlParser: true })

const schema = new mongoose.Schema({
  time: Number,
  temperature: Number,
  humidity: Number,
  pressure: Number,
  light: Number,
  timeString: String
}, {timestamps: true});

schema.index({createdAt: 1},{expireAfterSeconds: 3600});

const Value = mongoose.model('Value', schema)

module.exports = Value