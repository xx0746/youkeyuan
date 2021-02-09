import request from '@/utils/request'
// 获取左侧菜单
export function getLeftTreeInterface(params){
  return request({
    url:'/resmenu/left',
    method:'get',
    params:params
  })
}
//标签库管理页面
//获取列表 /data/label/group/list/all
export function getlabelListInterface(data){
  return request({
    url:'/data/label/list',
    method:'get',
    params:data
  })
}
//弹窗 新建标签--下拉
export function typeListAllInterface(params){
  return request({
    url:'/data/label/group/and/label',
    method:'get',
    params : params
  })
}
//新建标签 --提交
export function labelInsertInterface(data){
  return request({
    url:'/data/label/insert',
    method:'post',
    data:data
  })
}
//弹窗
export function typeListInterface(data){
  return request({
    url:'/data/label/group/list',
    method:'get',
    params:data
  })
}
//弹窗 新建分组
export function NewGroupAddInterface(data){
  return request({
    url:'/data/label/group/insert',
    method:'post',
    data:data
  })
}
//标签 --删除
export function deleteLabelInterface(data){
  return request({
    url:'/data/label/delete?ids='+data,
    method:'delete'
  })
}
//标签分组 --删除
export function deleteLabelTypeInterface(data){
  return request({
    url:'/data/label/group/delete?ids=' + data,
    method:'delete'
  })
}
//标签 --修改 PUT /label/updateLabelEntity
export function updateLabelInterface(data){
  return request({
    url:'/data/label/update',
    method:'PUT',
    data:data
  })
}
//标签分组 --修改
export function updateLabelTypeInterface(data){
  return request({
    url:'/data/label/group/update',
    method:'put',
    data:data
  })
}
