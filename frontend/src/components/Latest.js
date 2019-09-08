import React from 'react'
import translations from '../translations'
import moment from 'moment';
import finnish from 'moment/locale/fi'
import english from 'moment/locale/en-gb'

const Latest = ({obs, lang, message}) => {

  if (obs == null) {
    return (
      <div className='content-latest'>{ message }</div>
    )
  }

  var suffix = ''
  if(lang === 'en')
  suffix = moment(obs.dateString).locale("en", english).fromNow()
  else
  suffix = moment(obs.dateString).locale("fi", finnish).fromNow()

  return(
    <div className='content-latest'>
      {translations[lang].latest} ({translations[lang].measured} { suffix }):
      <br/>
      { obs.temperature } °C, { obs.humidity } %,
      { obs.pressure } hPa, { obs.light }
    </div>
  )
}

export default Latest