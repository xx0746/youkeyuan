import request from '@/utils/request'
// 知识专区数据
export function getResourceInfo(){
  return request({
    url:`/result/resource/info`,
    method:'get',
  })
}
// 数据专区数据
export function getDataInfo(){
  return request({
    url:`/result/data/info`,
    method:'get',
  })
}
// 知识管理资源分布
export function getResourceFenbu(){
  return request({
    url:`/result/cake/resource`,
    method:'get',
  })
}
// 数据管理资源分布
export function getDataFenbu(){
  return request({
    url:`/result/cake/data`,
    method:'get',
  })
}
// 数据管理资源分布
export function getThendData(){
  return request({
    url:`/result/resource/month`,
    method:'get',
  })
}