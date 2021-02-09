import request from '@/utils/request'
// 报表
//各中心入库情况统计
export function resultcenter(param){
  return request({
    url:`/result/center?beginDate=${param.beginDate}&endDate=${param.endDate}`,
    method:'GET',
  })
}
//年度报表统计
export function storageInfoByYear(param){
  return request({
    url:`/result/storageInfoByYear?year=${param.year}`,
    method:'GET',
  })
}
//单用户上传报表统计
export function storageInfoByUser(param){
  return request({
    url:`/result/storageInfoByUser?userName=${param.userName}&beginDate=${param.beginDate}&endDate=${param.endDate}`,
    method:'GET',
  })
}
//访问查询报表统计
export function accessQuery(param){
  return request({
    url:`/search/stat?startTime=${param.beginDate}&endTime=${param.endDate}`,
    method:'GET',
  })
}

