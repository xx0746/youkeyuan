import request from '@/utils/request'
// 订阅管理列表
export function getSubscribeList(data){
  return request({
    url:`/resource/subscribe?pageSize=${data.pageSize}&pageNumber=${data.pageNumber}&state=${data.state}`,
    method:'get',
  })
}
// 获得订阅状态
export function getSubscribeInfo(data){
  return request({
    url:`/resource/isSubscribeByMenuId?menuId=${data}`,
    method:'get',
  })
}
// 删除订阅
export function delSubscribeInfo(data){
  return request({
    url:`/resource/removeSubscribe?menuId=${data.menuId}&userId=${data.userId}`,
    method:'delete',
  })
}
// 添加订阅
export function addSubscribeInfo(data){
  return request({
    url:`/resource/addSubscribe?menuIds=${data}`,
    method:'post',
    data: data
  })
}
