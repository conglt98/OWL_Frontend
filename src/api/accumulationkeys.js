import fakeAuth from './fakeAuth'
import {postDataTokenMode} from './fetch'
import swal from 'sweetalert'

export async function lookUpValue(data, token) {
    data.type = data.type.toLowerCase()
    data.action = data.action.toLowerCase()
    return await postDataTokenMode('POST','/api/accumulation/lookup/value', data, token).then((res) => {
        console.log(res)
        return res;// JSON data parsed by `response.json()` call
      });
}


export async function createAccKey(data, token) {
    data.createAt = new Date().getTime()
    return await postDataTokenMode('POST','/api/accumulationKeyConfigs', data, token).then((res) => {
        console.log(res)
        return res;// JSON data parsed by `response.json()` call
      });
}

export async function editAccKey(conId, data, token) {
    return await postDataTokenMode('PUT','/api/accumulationKeyConfigs/'+conId, data, token).then((res) => {
        console.log(res)
        return res;// JSON data parsed by `response.json()` call
      });
}

export async function deleteAccKey(conId, data, token) {
    return await postDataTokenMode('DELETE','/api/accumulationKeyConfigs/'+conId, data, token).then((data) => {
        console.log(data)
        return data;// JSON data parsed by `response.json()` call
      });
}

export async function getAccKey(token,page,size){
    let url='/api/accumulationKeyConfigs?page='+page+'&size='+size
    return await fetch(url,{
        method:'GET',
        headers:{
            Authorization:'Bearer '+token,
        },
    })
    .then(response => {
        let res = response
        res.data = []
        if (response.status!==200){
            console.log("URL: " + url +" "+response.status+ " "+response.statusText)
            // fakeAuth.signout(()=>{})
            swal("Thông báo",response.status+ " "+response.statusText,"error")

            return res
        }
        if (response.status===200){
            console.log("URL: " + url + " 200 OK")
            return response.json().then(data=>{
                res.data = data;
                return res;
            })
        }

        return res
    })
    .catch(() => {
        console.log("Can’t access " + url + " response. Blocked by browser?")
        return {};
    })
}