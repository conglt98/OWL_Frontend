import {
    mockModels, mockTasks
} from './mock'
import axios from 'axios'

const CORS = 'https://lower-loon-61290.herokuapp.com/'
export function getConfig(name){
    let config = localStorage.getItem('config')
    if (config){
        config = JSON.parse(config)
        return config.find(ele=>ele.config===name).value
    }
}

export async function getModels() {
    if (getConfig('Use API')=='ON'){
        let res = await getFromURL(getConfig('MODEL')+'models')
        let data = res?res.data:{models:[]}
        return data['models']
    }
    return mockModels['models']
}

export async function getTasks() {
    if (getConfig('Use API')=='ON'){
        let res = await getFromURL(getConfig('MODEL')+'tasks')
        let data = res?res.data:{tasks:[]}
        return data['tasks']
    }
    return mockTasks
}

export async function getModelsAPI() {
    if (getConfig('Use API')=='ON'){
        let res = await getFromURL(getConfig('MODEL')+'models')
        let data = res?res.data:{models:[]}
        return data['models'].filter(ele => (ele.deploy === 'true'))
    }
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

export function postFromURL(url, data) {
    return axios.post(CORS+url, data)
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