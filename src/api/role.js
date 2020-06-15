
import {postDataToken} from './fetch'
import fakeAuth from './fakeAuth';

const data = {
  data: [
    {
      'id': '1',
      'name': 'ADMIN',
      'username': 'ADMIN',
      'role': 'Administrator',
      'status': 'ON'
    }, {
      'id': '2',
      'name': 'Lê Thành Công',
      'username': 'conglt',
      'role': 'Administrator',
      'status': 'OFF'
    }, {
      'id': '3',
      'name': 'Bùi Mạnh Cường',
      'username': 'cuongbm2',
      'role': 'Executive',
      'status': 'ON'
    }, {
      'id': '4',
      'name': 'Nguyễn Hữu Phong',
      'username': 'phongnh',
      'role': 'Executive',
      'status': 'ON'
    }
  ]
}

export async function getAllRole(token) {
  let url = '/api/roles'
  return await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + token
    }
  }).then(response => {
    let res = response
    res.data = []
    if (response.status !== 200) {
      console.log("URL: " + url + " " + response.status + " " + response.statusText)
      res.data = data.data
      // fakeAuth.signout(() => {})
      return res
    }
    if (response.status === 200) {
      console.log("URL: " + url + " 200 OK")
      return response
        .json()
        .then(data => {
          console.log(data)
          res.data = data;
          return res;
        })
    }

    return res
  }).catch(() => {
    console.log("Can’t access " + url + " response. Blocked by browser?")
    return {};
  })
}

export async function getOneRole(username, token) {
  let url = '/api/get_role/' + username;
  return await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + token
    }
  }).then(response => {
    let res = response
    res.data = []
    if (response.status !== 200) {
      console.log("URL: " + url + " " + response.status + " " + response.statusText)
      res.data = {
        role: ["Administrator"]
      }
      // fakeAuth.signout(() => {});
      return res
    }
    if (response.status === 200) {
      console.log("URL: " + url + " 200 OK")
      return response
        .json()
        .then(data => {
          console.log(data)
          if (data.length === 0 || data[0].status === 'OFF') {
            res.data = {
              role: ["Guest"]
            }
          } else {
            res.data = {
              role: data[0]
                .role
                .split(",")
            }
          }
          return res;
        })
    }
    return res
  }).catch(() => {
    console.log("Can’t access " + url + " response. Blocked by browser?")
    return {};
  })
}

export async function updateUserRole(data, token) {
  return postDataToken('/api/roles/edit', data, token).then((data) => {
    console.log(data)
    return data;
  });
}

export async function createUserRole(data, token) {
  return postDataToken('/api/roles/add', data, token).then((data) => {
    console.log(data)
    return data;
  });
}

export async function deleteUserRole(data, token){
  return postDataToken('/api/roles/delete', data, token).then((data) => {
    console.log(data)
    return data;
  });
}