import api,{headers} from './init'
import {postDataToken} from './fetch'
import swal from 'sweetalert'
const data = {
  data:[
    {
      'id':1,
      'name':'Dashboard',
      'roles':['Administrator','Executive','Customer service'],
    },
    {
      'id':2,
      'name':'Events',
      'roles':['Administrator','Executive','Customer service'],
    },
    {
    'id':3,
    'name':'NavManagement',
    'roles':['Administrator'],
  },
  {
    'id':4,
    'name':'RoleManagement',
    'roles':['Administrator'],
  },
  {
    'id':5,
    'name':'Add new event',
    'roles':['Administrator'],
  },
  {
    'id':6,
    'name':'Edit',
    'roles':['Administrator'],
  },
  {
    'id':7,
    'name':'Info',
    'roles':['Administrator','Executive'],
  }
  ]
}
export async function getAllNavRole(token){
    let url='/api/nav_role'
    return await fetch(url,{
        method:'GET',
        headers:{
          Authorization:'Bearer '+token,
        },
    })
    .then(res => {
      if (res.status===200){
        return res.json().then((data)=>{
          data.map(ele=>{
            ele.roles = ele.roles.split(",");
          })
          console.log(data);
          return {data:data};
        })
      }
      return data;
    }).catch((err) => {
      console.log(err)
      swal("Thông báo",err,"error")
      return data
    })
}

export async function updateNavRole(data,token) {
  console.log(data);
  data.roles = data.roles.toString();
  console.log(data);
  return postDataToken('/api/nav_role/edit',data,token).then((data) => {
      console.log(data)
      return data;// JSON data parsed by `response.json()` call
    });
}

export async function createNavRole(data,token) {
  console.log(data);
  data.roles = data.roles.toString();
  console.log(data);
  return postDataToken('/api/nav_role/add',data,token).then((data) => {
      console.log(data)
      return data;// JSON data parsed by `response.json()` call
    });
}

export async function deleteNavRole(data,token) {
  console.log(data);
  data.roles = data.roles.toString();
  console.log(data);
  return postDataToken('/api/nav_role/delete',data,token).then((data) => {
      console.log(data)
      return data;// JSON data parsed by `response.json()` call
    });
}