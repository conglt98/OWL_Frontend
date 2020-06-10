import fakeAuth from './fakeAuth'
import swal from 'sweetalert'
import {postDataTokenMode} from './fetch'
export async function createClient(data, token) {
    return await postDataTokenMode('POST','/api/clientConfigs', data, token).then((data) => {
        console.log(data)
        return data;// JSON data parsed by `response.json()` call
      });
}

export async function editClient(conId, data, token) {
    return await postDataTokenMode('PUT','/api/clientConfigs/'+conId, data, token).then((data) => {
        console.log(data)
        return data;// JSON data parsed by `response.json()` call
      });
}

export async function deleteClient(conId, data, token) {
    return await postDataTokenMode('DELETE','/api/clientConfigs/'+conId, data, token).then((data) => {
        console.log(data)
        return data;// JSON data parsed by `response.json()` call
      });
}

export async function getClients(token,page,size){
    let url='/api/clientConfigs?page='+page+'&size='+size
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