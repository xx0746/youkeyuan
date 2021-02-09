import request from '@/utils/request'
// 原来知识专区搜索接口
export function searchInterface(data){
    return request({
        url:'/search?searchName='+data.searchName+'&pageNumber='+data.pageNumber+'&menuIds='+data.menuIds+'&labelIds='+data.labelIds+'&searchType='+data.searchType,
        method:'get',
    })
}
// 现在知识专区搜索接口
export function searchSolrInterface(data){
    return request({
        url:'/search/solr?searchName='+data.searchName+'&pageNumber='+data.pageNumber+'&menuIds='+data.menuIds+'&dataThree='+data.dataThree+'&groupIds='+data.groupIds+'&labelIds='+data.labelIds,
        method:'get',
    })
}
// 数据专区搜索接口
export function searchDataInterface(data){
    return request({
        url:'/search/data?searchName='+data.searchName+'&pageNumber='+data.pageNumber+'&dataType='+data.dataType+'&dataThree='+data.dataThree+'&groupIds='+data.groupIds+'&dataLabelIds='+data.dataLabelIds,
        method:'get',
    })
}
// 搜索页面点击文件名预览
export function searchFilePreview(data){
    return request({
        url: `/resource/preview/file/${data.resourceFileId}`,
        method:'get',
    })
}
// 查询文章评论列表
export function getArticleInfo(data) {
    return request({
        url: `/resource/comment/${data.menuId}/${data.id}`,
        method: 'get',
    })
}
// 提交文章评论
export function submitArticleInfo(data) {
    return request({
        url: `/resource/comment`,
        method: 'post',
        data: data
    })
}
//搜索历史接口
export function getSearchHistoryInterface(data){
    return request({
        url:'/search/history',
        method:'get',
        params : data
    })
}

//搜索历史清空
export function getsearchEmpty(data){
  return request({
    url:`/search/clearHistory?searchType=${data}`,
    method:'GET',
  })
}
//热搜词
export function getSearchHostInterface(data){
    return request({
        url:'/search/host',
        method:'get',
    })
}
//搜索联想
export function getSearchAssociate(data){
    return request({
        url:`/search/terms?searchName=${data}`,
        method:'get',
    })
}
// 多文件下载
export function fileMoreDownLoad(data){
    return request({
        url:'/apply/file/getBatchFileUrl?menuId='+data.MENUID+'&fileId='+data.ID+'&page=0',
        method:'post',
    })
}
// 下载弹窗  --是
export function fileAddInterface(data){
    return request({
        url:'/apply/file/add?menuId='+data.menuId+'&fileId='+data.fileId+'&flag='+data.flag,
        method:'post',
    })
}

// 获取轮播图列表
export function getBannerListData(){
    return request({
        url:'/imageText/list',
        method:'get',
    })
}
// searchindex页获取最新消息数据
export function getNewsInfoList(param){
    return request({
        url:`/notice/newMessages?userId=${param.userId}&pageSize=${param.pageSize}&pageNumber=${param.pageNumber}`,
        method:'get',
    })
}
//获取最新消息资源应用
export function getnewMessagesList(param){
  return request({
    url:`/notice/newMessagesList?userId=${param.userId}&pageSize=${param.pageSize}&pageNumber=${param.pageNumber}`,
    method:'get',
  })
}

// 信息公告
export function getSystemBulletin(param){
  return request({
    url:`/sysNotice/systemNoticeByPage?state=2`,
    method:'get',
    params:param
  })
}
// 信息公告详情
export function systemNoticeDetail(param){
  return request({
    url:`/sysNotice/systemNoticeDetail?id=`+param+``,
    method:'get',
  })
}

// 动态要闻
export function getDynamicnews(param){
  return request({
    url:`/sysDynamic/systemDynamicByPage?state=2`,
    method:'get',
    params:param
  })
}
// 动态要闻详情
export function getsystemDynamicDetail(param){
  return request({
    url:`/sysDynamic/systemDynamicDetail?id=`+param+``,
    method:'get',
  })
}
// 轮播图详情
export function imageTextDetail(id){
  return request({
    url:`/imageTextDetail?id=`+id+``,
    method:'get',
  })
}
// 收藏夹列表

// 是否已收藏
export function Isfavorites(param){
  return request({
    url:`/favorites/${param.menuId}/${param.fileId}`,
    method:'get',
  })
}

// 添加收藏夹
export function addfavorites(data){
  return request({
    url:'/favorites',
    method:'post',
    data:data
  })
}
// 删除收藏夹
export function DELETEfavorites(param){
  return request({
    url:`/favorites/${param.menuId}/${param.fileId}`,
    method:'DELETE',
  })
}

export function getfavorites(param){
  return request({
    url:`/favorites?pageNumber=${param.pageNumber}`,
    method:'GET',
  })
}
//公告下载
export function systemNoticeFilesDown(data){
  return request({
    url:`/sysNotice/systemNoticeFilesDown/${data.id}`,
    method:'GET',
  })
}
//动态下载
export function systemDynamicFilesDown(data){
  return request({
    url:`/sysDynamic/systemDynamicFilesDown/${data.id}`,
    method:'GET',
  })
}

//获取所属目录层级id数组
export function getMenuidArr(menuId){
  return request({
    url:`/resource/menu/array/${menuId}`,
    method:'GET',
  })
}