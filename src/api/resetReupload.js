import request from '@/utils/request'
let host = 'resourceupload'
// 人工上传 接口--
// 成果上传
export function resetRechengguo(data){
    return request({
        url:`/achievement/${host}`,
        method:'put',
        data:data
    })
}
// 论文上传
export function resetRelunwen(data){
  return request({
    // headers: {
    //   `Content-Type`: `multipart/form-data`
    // },
    url:`/thesis/${host}`,
    method:'put',
    data:data
  })
}
export function resetRewenzhang(data){
  return request({
    url:`/thesis/get/url`,
    method:'put',
    data:data
  })
}
// 案例库上传
export function resetReanliku(data){
  return request({
    url:`/case/${host}`,
    method:'put',
    data:data
  })
}
// 图书上传
export function resetRebook(data){
  return request({
    url:`/book/${host}`,
    method:'put',
    data:data
  })
}
// 知识产权
export function resetRezhishichanquan(data){
  return request({
    url:`/patent/${host}`,
    method:'put',
    data:data
  })
}
// 标准上传
export function resetRestandardInterface(data){
  return request({
    url:`/standard/${host}`,
    method:'put',
    data:data
  })
}
// 实验室上传
export function resetRelabInterface(data){
  return request({
    url:`/laboratory/${host}`,
    method:'put',
    data:data
  })
}
// 图片上传
export function resetRepictureInterface(data){
  return request({
    url:`/picture/${host}`,
    method:'put',
    data:data
  })
}
//视频上传
export function resetRevideoFormInterface(data){
  return request({
    url:`video/${host}`,
    method:'put',
    data:data
  })
}
//文件上传
export function resetReimportFormInterface(data){
  return request({
    url:`import/${host}`,
    method:'put',
    data:data
  })
}
//报告上传
export function resetReresearchFormInterface(data){
  return request({
    url:`research/${host}`,
    method:'put',
    data:data
  })
}
//获取表单所属库id
export function getFromMenuId(data){
  return request({
    url:`/resource/menu/array/${data}`,
    method:'get'
  })
}
