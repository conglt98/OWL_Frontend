import fakeAuth from './fakeAuth'
import {postDataTokenMode} from './fetch'
import swal from 'sweetalert'
export async function createDataDefinitions(data, token) {
    data.createAt = new Date().getTime()
    return await postDataTokenMode('POST','/api/dataDefinitionConfigs', data, token).then((res) => {
        console.log(res)
        if (res.error) throw res.message + res.path
        for (let i=0;i<data.accumulationKeys.length;i++){
            let key = data.accumulationKeys[i]
            delete key.id
            key.dataDefinition={
                id:res.id
            }
            console.log(key)
            postDataTokenMode('POST','api/accumulationKeyConfigs',key,token).then(res=>{
                console.log(res)
                if (res.error) throw res.message+res.path
            })
        }
        return res;// JSON data parsed by `response.json()` call
      });
}

export async function editDataDefinitions(conId, data, token) {
    if (!data.dataType){
        data.dataType='JSON'
    }
    return await postDataTokenMode('PUT','/api/dataDefinitionConfigs/'+conId, data, token).then((res) => {
        console.log(res)
        if (res.error) throw res.message
        return res;// JSON data parsed by `response.json()` call
      });
}

export async function deleteDataDefinitions(conId, data, token) {
    return await postDataTokenMode('DELETE','/api/dataDefinitionConfigs/'+conId, data, token).then((data) => {
        console.log(data)
        if (data.error) throw data.message+data.path
        return data;// JSON data parsed by `response.json()` call
      });
}

export async function getDataDefinitions(token,page,size){
    let url='/api/dataDefinitionConfigs?page='+page+'&size='+size
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

export async function getOneDataDefinitions(token,id){
    let url='/api/dataDefinitionConfigs/'+id
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