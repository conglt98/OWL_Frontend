import api from '../api/init'

export function getListChannel(dateRange){
    return api.post('youtube/channel/info/list', dateRange).then(res =>{
        return res
    })
}

export function getInfoChannel(dateRange, channelId){
    let req = {...dateRange,channelId:channelId}
    console.log(req)
    return api.post('youtube/channel/info/single', req).then(res =>{
        
        return res
    })
}

export function addYoutubeChannel(channelId){
    return api.post('youtube/channel/add', {channelId:channelId}).then(res =>{
        return res
    })
}

export function addYoutubeTopic(topicId){
    return api.post('youtube/topic/add', {topicId:topicId}).then(res =>{
        return res
    })
}

export function getTopicChannel(dateRange){
    return api.post('youtube/topic/info/list', dateRange).then(res =>{
        return res
    })
}

export function getVideoChannel(dateRange, channelId){
    let req = {...dateRange,channelId:channelId}
    return api.post('youtube/video/info/list', req).then(res =>{
        return res
    })
}
export function getVideoInfo(dateRange, videoId){
    let req = {...dateRange,videoId:videoId}
    return api.post('youtube/video/info/single', req).then(res =>{
        return res
    })
}

export function getListChannelStatistic(dateRange){
    let req = {...dateRange}
    return api.post('/youtube/channel/statistics/list', req).then(res =>{
        return res
    })
}

export function getChannelStatistic(dateRange, channelId){
    let req = {...dateRange, channelId:channelId}
    return api.post('/youtube/channel/statistics/single', req).then(res =>{
        return res
    })
}

export function getVideoStatistic(dateRange, videoId){
    let req = {...dateRange,videoId:videoId}
    return api.post('youtube/video/statistics/single', req).then(res =>{
        return res
    })
}

export function getVideoAnalysisComments(dateRange, videoId){
    let req = {...dateRange,videoId:videoId}
    return api.post('youtube/comment/sentiment/single', req).then(res =>{
        return res
    })
}