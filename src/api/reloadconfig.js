import fakeAuth from './fakeAuth'

import {postDataTokenMode} from './fetch'
export async function getOrApplyConfigAPI(data, token) {
    console.log(data)
    return await postDataTokenMode('POST','/api/getOrApplyConfig', data, token).then((res) => {
        console.log(res)
        if (res.status!==1)
         throw res.message
        return res;
      });
}