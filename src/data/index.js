import {
    mockModels
} from './mock'
import axios from 'axios'

const CORS = 'https://cors-anywhere.herokuapp.com/'
export function getConfig(name){
    let config = localStorage.getItem('config')
    if (config){
        config = JSON.parse(config)
        return config.find(ele=>ele.config===name).value
    }
}

export function getModels() {
    return mockModels['models']
}

export function getModelsAPI() {
    return mockModels['models'].filter(ele => (ele.deploy === 'true'))
}

export function getFromURL(url) {
    return axios.get(CORS+url)
    .then(function (response) {
        // handle success
        console.log(response);
        return response
    })
    .catch(function (error) {
        // handle error
        console.log(error);
    })
}