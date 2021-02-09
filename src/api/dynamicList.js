import request from '@/utils/request'
// 获取动态列表
const Host = '/sysDynamic'
export const getList = (params) => request({
    url: `${Host}/systemDynamicByPage`,
    method: 'get',
    params: params
  })
  // 删除列表中的某一条数据
  export const deleteItem = (id) => request({
    url: `${Host}/deleteSystemDynamic/${id}`,
    method: 'delete',
  })

  // 文件上传
  export const Upload = fd => request({
    url:`/file/uploads`,
    method:'post',
    data:fd
  })
// 文件上传
export const pictureUpload = fd => request({
  url:`/picture/upload`,
  method:'POST',
  data:fd
})
  // 发布
  export const publish = data => request({
    url:`${Host}/addSystemDynamic`,
    method:'post',
    data
  })
// 审核
export const audit = data => request({
  url:`${Host}/systemDynamicAudit`,
  method:'post',
  data
})
// 查看驳回原因
export const turnReason = param => request({
  url:`${Host}/systemDynamicReason?id=${param}`,
  method:'get',
})
// 下载
export const downLoad = id => request({
  url:`${Host}/systemDynamicFilesDownAll/${id}`,
  method:'get'
})
