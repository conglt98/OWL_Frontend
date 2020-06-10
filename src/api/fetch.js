import {headers} from './init'
import fakeAuth from './fakeAuth'
export async function postData(url = '', data = {}) {
  // Default options are marked with *
  const response = await fetch(url, {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    mode: 'no-cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      'Content-Type': 'application/json'
    //   'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: 'follow', // manual, *follow, error
    referrerPolicy: 'no-referrer', // no-referrer, *client
    body: JSON.stringify(data) // body data type must match "Content-Type" header
  });
  return response.text().then(data=>{
    console.log(data)
    return JSON.parse(data)}); // parses JSON response into native JavaScript objects
}
export async function postDataToken(url = '', data = {},token) {
  // Default options are marked with *
  const response = await fetch(url, {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    headers: {
      'Content-Type': 'application/json',
      'Authorization':'Bearer '+token,
    //   'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: JSON.stringify(data) // body data type must match "Content-Type" header
  });
  return response.text().then(data=>{
    console.log(data)
    return JSON.parse(data)}); // parses JSON response into native JavaScript objects
}

function isJson(str) {
  try {
      JSON.parse(str);
  } catch (e) {
      return false;
  }
  return true;
}

export async function postDataTokenMode(mode, url = '', data = {}, token) {
  // Default options are marked with *
  const response = await fetch(url, {
    method: mode, // *GET, POST, PUT, DELETE, etc.
    headers: {
      'Content-Type': 'application/json',
      'Authorization':'Bearer '+token,
    //   'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: JSON.stringify(data) // body data type must match "Content-Type" header
  });
  return response.text().then(res=>{
    if (isJson(res)){
      return JSON.parse(res)
    }else{
      throw "Cannot parse value not JSON"
    }
  }); // parses JSON response into native JavaScript objects
}

export async function signIn(username, password) {
    let user = {
      username: username,
      code: password,
      type: 'ga'
    };

    return postData('/api/auth',user).then((data) => {
        console.log(data)
        return data;// JSON data parsed by `response.json()` call
      });
}