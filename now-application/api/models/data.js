const mongoose = require('mongoose')
const dotenv = require('dotenv').config();

const url = process.env.db_url

mongoose.connect(url, { useNewUrlParser: true, useCreateIndex: true })

const schema = new mongoose.Schema({
  time: Number,
  temperature: Number,
  humidity: Number,
  pressure: Number,
  light: Number,
  timeString: String,
  createdAt: { type: Date, expires: 86400}
}, {timestamps: true});

const Value = mongoose.model('Value', schema)

module.exports = Value