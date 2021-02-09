import request from '@/utils/request'
// 获取动态列表
  const Host = '/sysNotice'
  export const getList = (params) => request({
    url: `${Host}/systemNoticeByPage`,
    method: 'get',
    params: params
  })
  // 删除列表中的某一条数据
  export const deleteItem = (id) => request({
    url: `${Host}/deleteSystemNotice/${id}`,
    method: 'delete',
  })

  // 文件上传
  export const Upload = fd => request({
    url:`/file/uploads`,
    method:'post',
    data:fd
  })
  // 发布
  export const publish = data => request({
    url:`${Host}/addSysNotice`,
    method:'post',
    data
  })
  // 审核通过
 export const audit = data => request({
   url:`${Host}/systemNoticeAudit`,
   method:'post',
   data
 })
//  查看驳回原因
 export const turnReason = param => request({
   url:`${Host}/systemNoticeReason?id=${param}`,
   method:'get',
 })
  // 下载
 export const downLoad = id => request({
    url:`${Host}/systemNoticeFilesDownAll/${id}`,
    method:'get'
})

// 公告删除
export const deleteSystemNotice = id => request({
  url:`/sysNotice/deleteSystemNotice/${id}`,
  method:'DELETE'
})

// 动态删除
export function deleteSystemDynamic(param){
  return request({
    url:`/sysDynamic/deleteSystemDynamic/${param.id}`,
    method:'DELETE',
  })
}

