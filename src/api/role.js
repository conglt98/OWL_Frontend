
import {postDataToken} from './fetch'
import fakeAuth from './fakeAuth';

const data = {
  data: [
    {
      'id': '2',
      'name': 'Lê Thành Công',
      'username': 'conglt',
      'role': 'ADMIN',
      'status': 'ON'
    }, {
      'id': '3',
      'name': 'Nguyễn Quốc Vương',
      'username': 'vuongnq4',
      'role': 'USER',
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
      // console.log("URL: " + url + " 200 OK")
      // return response
      //   .json()
      //   .then(data => {
      //     console.log(data)
      //     res.data = data;
      //     return res;
      //   })
      res.data = data.data
      return res
    }

    return res
  }).catch(() => {
    console.log("Can’t access " + url + " response. Blocked by browser?")
    return {};
  })
}

export async function getOneRole(username, token) {
  let res = {}
  res.data = {
    role: ["ADMIN"]
  }
  return res
  // let url = '/api/get_role/' + username;
  // return await fetch(url, {
  //   method: 'GET',
  //   headers: {
  //     'Authorization': 'Bearer ' + token
  //   }
  // }).then(response => {
  //   let res = response
  //   res.data = []
  //   if (response.status !== 200) {
  //     console.log("URL: " + url + " " + response.status + " " + response.statusText)
  //     res.data = {
  //       role: ["ADMIN"]
  //     }
  //     // fakeAuth.signout(() => {});
  //     return res
  //   }
  //   if (response.status === 200) {
  //     console.log("URL: " + url + " 200 OK")
  //     return response
  //       .json()
  //       .then(data => {
  //         console.log(data)
  //         if (data.length === 0 || data[0].status === 'OFF') {
  //           res.data = {
  //             role: ["Guest"]
  //           }
  //         } else {
  //           res.data = {
  //             role: data[0]
  //               .role
  //               .split(",")
  //           }
  //         }
  //         return res;
  //       })
  //   }
  //   return res
  // }).catch(() => {
  //   console.log("Can’t access " + url + " response. Blocked by browser?")
  //   return {};
  // })
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