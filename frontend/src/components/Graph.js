import React from 'react'
import { render } from 'react-dom'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import addNoDataModule from 'highcharts/modules/no-data-to-display';
import translations from '../translations'

addNoDataModule(Highcharts)
var moment = require('moment')

// convert data series to an array
function formatData(data) {
  var result = {}
  var dataArrayTemperature = []
  var dataArrayPressure = []
  var dataArrayLight = []
  var dataArrayHumidity = []

  for (var i = 1; i < data.length; i++) {
    var temperatureTmp = [data[i]['time'] * 1000, data[i]['temperature']]
    var pressureTmp = [data[i]['time'] * 1000, data[i]['pressure']]
    var lightTmp = [data[i]['time'] * 1000, data[i]['light']]
    var humidityTmp = [data[i]['time'] * 1000, data[i]['humidity']]

    dataArrayTemperature.push(temperatureTmp)
    dataArrayPressure.push(pressureTmp)
    dataArrayLight.push(lightTmp)
    dataArrayHumidity.push(humidityTmp)
  }
  // reverse the arrays for HighGraph
  // https://www.highcharts.com/errors/15/
  result.temperature = dataArrayTemperature.reverse()
  result.pressure = dataArrayPressure.reverse()
  result.light = dataArrayLight.reverse()
  result.humidity = dataArrayHumidity.reverse()
  return result
}

// calculate running average with N values
function runningAverage(data, N) {
  var runningAvg = [];
  if (data != null) {
    for (var i = N; i < data.length - N; i++) {
      var tmp = []
      var mean = data[i][1]
      for (var k = 1; k <= N; k++) {
        mean = mean + (data[i + k][1] + data[i - k][1]);
      }

      mean = mean / (N * 2 + 1)
      var n = Math.round(mean * 10) / 10
      runningAvg.push([data[i][0], n]);
    }
    return runningAvg
  } else {
    return []
  }
}

const Graph = ({ data, lang }) => {

  if (data == null || data.length < 1) {
    return false
  }

  const options = {
    colors: ['#2196F3', '#4CAF50', '#795548', '#BDBDBD'],

    title: null,

    chart: {
      height: '340px',
      animation: false,
      margin: [30, 60, undefined, undefined]
    },

    credits: {
      enabled: false
    },

    tooltip: {
      shared: true,
      split: false,
      enabled: true
    },

    series: [
      {
        type: 'line',
        data: runningAverage(formatData(data).temperature, 20),
        name: translations[lang].temperature,
        yAxis: 0,
        tooltip: {
          valueSuffix: ' °C'
        },
        zIndex: 4
      },
      {
        type: 'line',
        data: runningAverage(formatData(data).humidity, 20),
        name: translations[lang].humidity,
        yAxis: 1,
        tooltip: {
          valueSuffix: ' %'
        },
        zIndex: 3
      },
      {
        type: 'line',
        data: runningAverage(formatData(data).pressure, 20),
        name: translations[lang].pressure,
        yAxis: 2,
        tooltip: {
          valueSuffix: ' hPa'
        },
        zIndex: 2
      },
      {
        type: 'line',
        data: runningAverage(formatData(data).light, 100),
        name: translations[lang].light,
        yAxis: 3,
        tooltip: {
          valueSuffix: ''
        },
        zIndex: 1
      }
    ],

    xAxis: [{
      type: 'datetime',
      minorTicks: true
    }],

    yAxis: [
      {
        // https://stackoverflow.com/questions/40266621/highcharts-y-axis-horizontal-title
        // temperature
        opposite: true,
        title: {
          align: "high",
          textAlign: "right",
          rotation: 0,
          offset: 0,
          margin: 0,
          y: -6,
          x: -21,
          text: '# T'
        },
        labels: {
          align: "left",
          y: -6,
          format: '{value} °C'
        }
      },
      {
        // relative humidity
        opposite: true,
        title: {
          align: "high",
          textAlign: "right",
          rotation: 0,
          offset: 0,
          margin: 0,
          y: 13,
          x: -65,
          text: '# RH'
        },
        labels: {
          align: "left",
          y: 12,
          x: -37,
          format: '{value} %'
        }
      },
      {
        // pressure
        opposite: true,
        title: {
          enabled: false
        },
        labels: {
          enabled: false
        }
      },
      {
        // light
        opposite: true,
        title: {
          enabled: false
        },
        labels: {
          enabled: false
        }
      }
    ],
    lang: {
      noData: translations[lang].noData
    },
    noData: {
      style: {
        fontWeight: 'bold',
        fontSize: '15px',
        color: '#303030'
      }
    }
  }

  return (
    <div id="graph">
      <HighchartsReact
        highcharts={Highcharts}
        options={options}
        allowChartUpdate={true}
      />
    </div>
  )
}

export default Graph