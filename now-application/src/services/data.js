import axios from 'axios'

const baseUrl = '/api/data/latest/3000'

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)  
}

export default {
  getAll
}
