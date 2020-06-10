import fakeAuth from './fakeAuth'
import {postDataTokenMode} from './fetch'
export async function createRuleVersion(data, token) {
    return await postDataTokenMode('POST','/api/ruleVersions', data, token).then((data) => {
        console.log(data)
        if (data.status && data.status!==200){
            throw data.message;
        }
        return data;// JSON data parsed by `response.json()` call
      });
}

export async function getRuleVersions(token,page,size){
    let url='/api/ruleVersions?page='+page+'&size='+size
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