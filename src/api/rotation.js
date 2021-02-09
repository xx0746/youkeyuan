import request from '@/utils/request'

export function getRotationData(params){
  return request({
      url:'/carousel',
      method:'get',
      params:params
  })
}

export function insertCarousel(data){
  return request({
      url:'/carousel',
      method:'post',
      data:data
  })
}
export function updImageText(data){
  return request({
      url:'/updateImageText',
      method:'put',
      data:data
  })
}
export function addImageText(data){
  return request({
    url:'/addImageText',
    method:'post',
    data:data
  })
}
// export function imageTextByPage(data){
//   return request({
//     url:`/imageTextByPage?title=${data.title}&&pageNumber=${data.pageNumber}`,
//     method:'get',
//     data:data
//   })
// }
export const imageTextByPage = (params) => request({
  url: `/imageTextByPage`,
  method: 'get',
  params: params
})
export function handDelInterface(id){
  return request({
    url:'/carousel/' + id,
    method:'delete'
})
}
export function deleteImageText(id){
  return request({
    url:'/deleteImageText/' + id,
    method:'delete'
  })
}
export function imageTextAudit(data){
  return request({
    url:'/imageTextAudit',
    method:'POST',
    data:data
  })
}
