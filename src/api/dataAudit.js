import request from '@/utils/request'
// 数据入库审核
// 获取左侧菜单
export function getLeftTreeInterface(params){
  return request({
      url:`/resmenu/left?resourceCountType=2`,
      method:'get',
      params:params
  })
}
// 数据入库审核表单列表
export function dataAuditTableList(param) {
  return request({
    url: `/data/collect/${param.menuId}`,
    method: 'get',
    params : param
  })
}
// 通过/驳回入库审核
export function setAuditInterface(param) {
  return request({
    url: `/data/collect/audit/${param.dataType}/${param.collectId}/${param.state}`,
    method: 'get',
    params: param
  })
}
// 调整下载是否需要审核
export function dataAuditAdjustDown(param) {
  return request({
    url: `/data/collect/down/${param.collectId}/${param.state}`,
    method: 'post',
  })
}
