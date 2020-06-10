import fakeAuth from './fakeAuth'
import swal from 'sweetalert'
import {postDataTokenMode} from './fetch'
export async function createRule(data, token) {
    console.log(data)
    let request = JSON.parse(JSON.stringify(data))
    delete request.latestVersion
    return postDataTokenMode('POST','/api/ruleConfigs', request, token).then((res) => {
        console.log(res)
        res.latestVersion = {
            ...data.latestVersion,
            createAt:new Date().getTime(),
            ruleId:res.id,
            rule:{
                id:res.id
            }
        }
        
        delete res.latestVersion.id
        console.log(res)
        postDataTokenMode('POST','api/ruleVersions',res,token).then(async latestVersion=>{
            console.log(latestVersion)
            console.log(data.ruleConditions)
            for(let i=0;i<data.ruleConditions.length;i++){
                let con = data.ruleConditions[i]
                delete con.id
                con.conditionTypeId =latestVersion.id
                await postDataTokenMode('POST','api/conditionConfigs',con,token)
            }
        })

        return res;// JSON data parsed by `response.json()` call
      });
}

export async function editRule(ruleId, data, dataOld, token) {
    console.log(ruleId)
    let tmp = JSON.parse(JSON.stringify(data))
    delete tmp.latestVersion
    return await postDataTokenMode('PUT','/api/ruleConfigs/'+ruleId, tmp, token).then((res) => {
        console.log(res)
        let request = JSON.parse(JSON.stringify(data))
        if (data.latestVersion.id&&data.latestVersion.id.toString().length>10){
            delete request.latestVersion.id
            request= {
                ...request,
                latestVersion:{
                    ...request.latestVersion,
                    createAt:new Date().getTime(),
                    ruleId:res.id,
                    rule:{
                        id:res.id
                    }
                }
            }
            console.log(request)
            postDataTokenMode('POST','api/ruleVersions',request,token).then(async latestVersion=>{
                console.log(latestVersion)
                console.log(data.ruleConditions)
                for(let i=0;i<data.ruleConditions.length;i++){
                    let con = data.ruleConditions[i]
                    delete con.id
                    con.conditionTypeId =latestVersion.id
                    console.log(con)
                    await postDataTokenMode('POST','api/conditionConfigs',con,token)
                }
            })
        }else{
            console.log(data.ruleConditions)
            console.log(dataOld.ruleConditions)
            data.ruleConditions.forEach(async con1=>{
                let isExist1 = false
                dataOld.ruleConditions.forEach(async con2=>{
                    if (con1.id===con2.id){
                        isExist1 = true
                        if (JSON.stringify(con1)!==JSON.stringify(con2)){
                            console.log("edit condition")
                            await postDataTokenMode('PUT','api/conditionConfigs/'+con1.id,con1,token)

                        }
                    }
                })
                if (!isExist1 && con1.id.toString().length>10){
                    console.log("create condition ")
                    let con = con1
                    delete con.id
                    con.conditionTypeId = data.latestVersion.id
                    await postDataTokenMode('POST','api/conditionConfigs',con,token)
                }
            })

            dataOld.ruleConditions.forEach(async con1=>{
                let isExist2 = false
                data.ruleConditions.forEach(async con2=>{
                    if (con1.id===con2.id){
                        isExist2 = true
                    }
                })
                if (!isExist2){
                    console.log("delete condition ")
                    await postDataTokenMode('DELETE','api/conditionConfigs/'+con1.id,con1,token)

                }
            })
        }
        return res;// JSON data parsed by `response.json()` call
      });
}

export async function deleteRule(ruleId, data, token) {
    console.log(ruleId)
    return await postDataTokenMode('DELETE','/api/ruleConfigs/'+ruleId, data, token).then((data) => {
        console.log(data)
        return data;// JSON data parsed by `response.json()` call
      });
}

export async function getRules(token,page,size){
    let url='/api/ruleConfigs?page='+page+'&size='+size
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