import {
    mockModels, mockTasks
} from './mock'
import axios from 'axios'

const CORS = 'https://lower-loon-61290.herokuapp.com/'
export function getConfig(name, type){
    let config = localStorage.getItem('config')
    if (config){
        config = JSON.parse(config)
        console.log(config)
        return config.filter(ele=>ele.config==name).find(ele => ele.type == type).value
    }
}

export async function getModels(type) {
    let mytype = type?type:'CenterNet'
    if (getConfig('Use API', mytype)=='ON'){
        let res = await getFromURL(getConfig('MODEL', 'CenterNet')+'models')
        let data = res?res.data:{models:[]}

        let faceres = await getFromURL(getConfig('MODEL', 'FaceRecognition')+'models')
        let facedata = faceres?faceres.data:{models:[]}

        facedata.models.map(ele=>{
            data['models'].push(ele)
        })        
        data['models'].sort((a,b)=>b.createAt - a.createAt)
        return data['models']
    }
    return mockModels['models']
}

export async function getModelsAPI(type) {
    let mytype = type?type:'CenterNet'

    if (getConfig('Use API', mytype)=='ON'){
        let res = await getFromURL(getConfig('MODEL', 'CenterNet')+'models')
        let data = res?res.data:{models:[]}

        let faceres = await getFromURL(getConfig('MODEL', 'FaceRecognition')+'models')
        let facedata = faceres?faceres.data:{models:[]}

        facedata.models.map(ele=>{
            data['models'].push(ele)
        })        
        
        return data['models'].filter(ele => (ele.deploy === 'true'))
    }
    return mockModels['models'].filter(ele => (ele.deploy === 'true'))
}

export async function getTasks(type) {
    let mytype = type?type:'CenterNet'
    if (getConfig('Use API',mytype)=='ON'){
        let res = await getFromURL(getConfig('MODEL', mytype)+'tasks')
        let data = res?res.data:{tasks:[]}
        data['tasks'].sort((a,b)=>b.createAt - a.createAt)
        return data['tasks']
    }
    return mockTasks
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