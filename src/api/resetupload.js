import request from '@/utils/request'
// import store from "@/store/store";
/**
 * host:  公共变量，值为upload和resourceupload，
 *        分别是上传记录页面的重新上传接口，资源管理的重新上传接口
 *        通过vuex中的公共resetUrl的改变进行切换
 */
// const host = store.state.resetUrl;
let host = 'upload'
// 人工上传 接口--
// 成果上传
export function resetchengguo(data){
    return request({
        url:`/achievement/${host}`,
        method:'put',
        data:data
    })
}
// 论文上传
export function resetlunwen(data){
  return request({
    // headers: {
    //   `Content-Type`: `multipart/form-data`
    // },
    url:`/thesis/${host}`,
    method:'put',
    data:data
  })
}
export function resetwenzhang(data){
  return request({
    url:`/thesis/get/url`,
    method:'put',
    data:data
  })
}
// 案例库上传
export function resetanliku(data){
  return request({
    url:`/case/${host}`,
    method:'put',
    data:data
  })
}
// 图书上传
export function resetbook(data){
  return request({
    url:`/book/${host}`,
    method:'put',
    data:data
  })
}
// 知识产权
export function resetzhishichanquan(data){
  return request({
    url:`/patent/${host}`,
    method:'put',
    data:data
  })
}
// 标准上传
export function resetstandardInterface(data){
  return request({
    url:`/standard/${host}`,
    method:'put',
    data:data
  })
}
// 实验室上传
export function resetlabInterface(data){
  return request({
    url:`/laboratory/${host}`,
    method:'put',
    data:data
  })
}
// 图片上传
export function resetpictureInterface(data){
  return request({
    url:`/picture/${host}`,
    method:'put',
    data:data
  })
}
//视频上传
export function resetvideoFormInterface(data){
  return request({
    url:`video/${host}`,
    method:'put',
    data:data
  })
}
//文件上传
export function resetimportFormInterface(data){
  return request({
    url:`import/${host}`,
    method:'put',
    data:data
  })
}
//报告上传
export function resetresearchFormInterface(data){
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
//知识库管理文件修改
export function resetFormInterface(data){
  return request({
    url:`basic/${host}`,
    method:'put',
    data:data
  })
}
