import fakeAuth from './fakeAuth'
import {postDataTokenMode} from './fetch'

export async function checkExistValueManualList(data, token) {
    return await postDataTokenMode('POST','/api/accumulation/manual-data/exist', data, token).then((res) => {
        console.log(res)
        // if (res.error) throw res.message+res.path
        return res;// JSON data parsed by `response.json()` call
      });
}

export async function addArrayToManualList(data, token) {
    return await postDataTokenMode('POST','/api/accumulation/manual-data/add', data, token).then((res) => {
        console.log(res)
        // if (res.error) throw res.message+res.path
        return res;// JSON data parsed by `response.json()` call
      });
}

export async function delArrayToManualList(data, token) {
    return await postDataTokenMode('POST','/api/accumulation/manual-data/delete', data, token).then((res) => {
        console.log(res)
        // if (res.error) throw res.message+res.path
        return res;// JSON data parsed by `response.json()` call
      });
}