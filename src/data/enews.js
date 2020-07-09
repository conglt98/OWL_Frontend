import api from '../api/init'

export function getListNews(dateRange, paperName){
    return api.post(`${paperName}/article/info/list`, dateRange).then(res =>{
        return res
    })
}