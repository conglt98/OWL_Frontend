import fakeAuth from './fakeAuth'
import swal from 'sweetalert'
import {postDataTokenMode} from './fetch'
export async function createCondition(data, token) {
    return await postDataTokenMode('POST','/api/conditionConfigs', data, token).then((data) => {
        console.log(data)
        if (data.status && data.status!==200){
            throw data.message;
        }
        return data;// JSON data parsed by `response.json()` call
      });
}

export async function editCondition(conId, data, token) {
    return await postDataTokenMode('PUT','/api/conditionConfigs/'+conId, data, token).then((data) => {
        console.log(data)
        return data;// JSON data parsed by `response.json()` call
      });
}

export async function deleteCondition(conId, data, token) {
    return await postDataTokenMode('DELETE','/api/conditionConfigs/'+conId, data, token).then((res) => {
        console.log(res)
        if (res.error) throw res.message
        return data;// JSON data parsed by `response.json()` call
      });
}


export async function getConditions(token,page,size){
    let url='/api/conditionConfigs?page='+page+'&size='+size
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