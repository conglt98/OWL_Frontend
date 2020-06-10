import fakeAuth from './fakeAuth'
import {postDataToken, postDataTokenMode} from './fetch'
import swal from 'sweetalert'

export async function getAll(token){
    let url='/api/member_config'
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
            swal("Thông báo",response.status+ " "+response.statusText,"error")
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