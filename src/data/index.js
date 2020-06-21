import {mockModels} from './mock'

export function getModels(){
    return mockModels['models']
}

export function getModelsAPI(){
    return mockModels['models'].filter(ele=>(ele.deploy==='true'))
}