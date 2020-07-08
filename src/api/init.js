import axios from 'axios'
import fakeAuth from './fakeAuth'
import {host,port} from '../config/api'
// Create an axios instance
const api = axios.create({
  baseURL: host+':'+port+'/',
  headers: {
    'Authorization': 'Bearer '+fakeAuth.getAccessToken(),
  }
})

export const headers = {
  'Authorization': 'Bearer '+fakeAuth.getAccessToken(),
}

export default api