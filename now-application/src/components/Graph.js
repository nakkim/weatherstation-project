import React from 'react'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import addNoDataModule from 'highcharts/modules/no-data-to-display';
import patternFillModule from 'highcharts/modules/pattern-fill';
import translations from '../translations'
var SunCalc = require('suncalc');

addNoDataModule(Highcharts)
patternFillModule(Highcharts)

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

function resolvePlotbands(data) {
  var reversed = data.reverse()
  var days = [],
      dayTimes = [],
      result = [],
      tmp = {}
  var day, month, year, dayString
  for(var i=0; i<reversed.length; i++) {
    day = (new Date(reversed[i].time*1000)).getDate()
    month = (new Date(reversed[i].time*1000)).getMonth()+1
    year = (new Date(reversed[i].time*1000)).getFullYear()

    if(month < 10) month = '0'+month
    dayString = year+'-'+month+'-'+day

    if(!days.includes(dayString)) {
      days.push(dayString)
    }
  }

  for(var k=0; k<days.length; k++) {
    dayTimes.push([SunCalc.getTimes(new Date(days[k]), 60, 24).dawn.getTime(),SunCalc.getTimes(new Date(days[k]), 60, 24).dusk.getTime()])
  }

  if(dayTimes.length<2) {
    tmp = {
      from: data[0].time*1000,
      to: dayTimes[0][0],
      color: 'rgba(186, 213, 255, 0.2)'
    }
    result.push(tmp)
  } else {
    for(var j=1; j<dayTimes.length; j++) {
      tmp = {
        from: dayTimes[j-1][1],
        to: dayTimes[j][0],
        color: 'rgba(186, 213, 255, 0.2)'
      }
      result.push(tmp)
    }
  }
  return result
}

// function resolveLightValues(data) {
//   var result = []
//   var mean = []
//   for(var i=1; i<data.length; i++) {
//     if((new Date(data[i-1][0])).getMinutes() % 5 === 0 && (new Date(data[i][0])).getMinutes() % 5 !== 0) {
//       // calculate mean value and push it to result array
//       mean.push(data[i][1])
//       result.push([data[i][0],
//         mean.reduce((previous, current) => current += previous) / mean.length])
//       mean = []
//     } else {
//       mean.push(data[i][1])
//     }  
//   }
//   return result
// }

// calculate running average with N values
function runningAverage(data, N) {

  if(N < 1) {
    return data
  }

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

const Graph = ({ data, lang, avg }) => {

  if (data == null || data.length < 1) {
    return false
  }

  // var plotBands = resolvePlotbands(data)

  let sample = 0
  if(avg === true || avg === 'true')
  sample = 5

  const options = {
    colors: ['#BDBDBD', '#2196F3', '#4CAF50', '#795548'],

    title: null,

    time: {
      useUTC: false
    },

    chart: {
      height: '340px',
      animation: false,
      margin: [30, 60, undefined, 80],
      backgroundColor: '#FFFFFF'
    },

    credits: {
      enabled: false
    },

    tooltip: {
      shared: true,
      split: true,
      enabled: true
    },

    plotOptions: {
      area: {
        fillColor: {
          pattern: {
            path: {
              d: 'M 0 0 L 10 10 M 9 -1 L 11 1 M -1 9 L 1 11',
              strokeWidth: 3
            },
            width: 10,
            height: 10,
            opacity: 0.4
          }
        }
      }
    },

    series: [
      {
        type: 'area',
        data: runningAverage(formatData(data).light, sample),
        name: translations[lang].light,
        color: '',
        yAxis: 3,
        tooltip: {
          valueSuffix: ''
        },
        zIndex: 1,
        fillColor: {
          pattern: {
            color: '#DBDBDB'
          }
        }
      },
      {
        type: 'spline',
        data: runningAverage(formatData(data).temperature, sample),
        name: translations[lang].temperature,
        yAxis: 0,
        tooltip: {
          valueSuffix: ' °C'
        },
        zIndex: 4
      },
      {
        type: 'line',
        data: runningAverage(formatData(data).humidity, sample),
        name: translations[lang].humidity,
        yAxis: 1,
        tooltip: {
          valueSuffix: ' %'
        },
        zIndex: 3
      },
      {
        type: 'line',
        data: runningAverage(formatData(data).pressure, sample),
        name: translations[lang].pressure,
        yAxis: 2,
        tooltip: {
          valueSuffix: ' hPa'
        },
        zIndex: 2
      }   
    ],

    xAxis: [{
      type: 'datetime',
      minorTicks: true,
      // plotBands: plotBands,
    }],

    yAxis: [
      // temperature
      {
        visible: true,
        opposite: true,
        tickPosition: "inside",
        offset: 0,
        title: {
          text: translations[lang].temperature,
          align: "high",
          textAlign: "right",
          style: {
            color: '#2196F3',
            fontWeight: 'bold'
          },
          rotation: 0,
          offset: 0,
          margin: 0,
          y: -5,
          x: 0
        },
        labels: {
          align: "right",
          y: -5,
          x: 50,
          format: '{value} °C'
        }
      },
      // humidity
      {
        visible: true,
        opposite: true,
        tickPosition: "inside",
        offset: 0,
        type: "linear",
        title: {
          text: translations[lang].humidity,
          style: {
            color: '#4CAF50',
            fontWeight: 'bold'
          },
          align: "high",
          textAlign: "right",
          rotation: 0,
          offset: 0,
          margin: 0,
          y: 12,
          x: 0
        },
        labels: {
          align: "right",
          y: 12,
          x: 50,
          format: '{value} %'
        }
      },
      // light
      {
        visible: true,
        tickPosition: "inside",
        offset: 0,
        title: {
          text: translations[lang].pressure,
          align: "high",
          textAlign: "left",
          style: {
            color: '#795548',
            fontWeight: 'bold'
          },
          rotation: 0,
          offset: 0,
          margin: 0,
          y: -5,
          x: 0
        },
        labels: {
          align: "right",
          y: -5,
          format: '{value} hPa'
        }
      },
      // pressure
      {
        visible: true,
        tickPosition: "inside",
        offset: 0,
        type: "linear",
        title: {
          text: translations[lang].light,
          style: {
            color: '#BDBDBD',
            fontWeight: 'bold'
          },align: "high",
          textAlign: "left",
          rotation: 0,
          offset: 0,
          margin: 0,
          y: 12,
          x: 0
        },
        labels: {
          align: "right",
          y: 12
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