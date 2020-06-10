import fakeAuth from './fakeAuth'
import {postDataTokenMode} from './fetch'
import swal from 'sweetalert'
export async function createProfile(data, token) {
    return await postDataTokenMode('POST','/api/profileConfigs', data, token).then((data) => {
        console.log(data)
        if (data.status && data.status!==200){
            throw data.message;
        }
        return data;// JSON data parsed by `response.json()` call
      });
}

export async function editProfile(profileId, data, token) {
    console.log(profileId)
    return await postDataTokenMode('PUT','/api/profileConfigs/'+profileId, data, token).then((data) => {
        console.log(data)
        return data;// JSON data parsed by `response.json()` call
      });
}

export async function getProfiles(token,page,size){
    let url='/api/profileConfigs?page='+page+'&size='+size
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

export async function getOneProfile(token,domainId){
    let url='/api/profileConfigs/'+domainId
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
            fakeAuth.signout(()=>{})
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