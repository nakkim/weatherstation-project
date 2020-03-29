const mongoose = require('mongoose')

// const url = 'mongodb://handler:arduino1@ds157707.mlab.com:57707/weatherobs'
const url = 'mongodb+srv://handler:arduino@cluster0-tmh36.mongodb.net/test?retryWrites=true&w=majority'

mongoose.connect(url, { useNewUrlParser: true, useCreateIndex: true })

const schema = new mongoose.Schema({
  time: Number,
  temperature: Number,
  humidity: Number,
  pressure: Number,
  light: Number,
  timeString: String,
  createdAt: { type: Date, expires: 8640000}
}, {timestamps: true});

const Value = mongoose.model('Value', schema)

module.exports = Value