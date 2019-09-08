import axios from 'axios'

const baseUrl = 'https://arduino-weatherstation.now.sh/data'

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)  
}

export default {
  getAll
}