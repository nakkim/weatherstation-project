const mongoose = require('mongoose')
const dotenv = require('dotenv').config();

const url = process.env.DB_URL

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