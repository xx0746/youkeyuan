import request from '@/utils/request'
// 人工上传 接口--
export function addform(data) {
  return request({
    url:`/basic/upload`,
    method:'post',
    data:data
  })
}

// 成果添加
export function addchengguo(data){
  return request({
      url:'/achievement/upload',
      method:'post',
      data:data
  })
}

// 论文添加
export function addlunwen(data){
  return request({
    // headers: {
    //   'Content-Type': 'multipart/form-data'
    // },
    url:'/thesis/upload',
    method:'post',
    data:data
  })
}


export function addwenzhang(data){
  return request({
    url:'/thesis/get/url',
    method:'post',
    data:data
  })
}

// 案例库添加
export function addanliku(data){
  return request({
    url:'/case/upload',
    method:'post',
    data:data
  })
}


// 图书添加
export function addbook(data){
  return request({
    url:'/book/upload',
    method:'post',
    data:data
  })
}

// 知识产权
export function addzhishichanquan(data){
  return request({
    url:'/patent/upload',
    method:'post',
    data:data
  })
}
// 标准上传
export function addstandardInterface(data){
  return request({
    url:'/standard/upload',
    method:'post',
    data:data
  })
}
// 实验室上传
export function addlabInterface(data){
  return request({
    url:'/laboratory/upload',
    method:'post',
    data:data
  })
}
// 图片上传
export function addpictureInterface(data){
  return request({
    url:'/picture/upload',
    method:'post',
    data:data
  })
}
//视频添加

export function addvideoFormInterface(data){
  return request({
    url:'video/upload',
    method:'post',
    data:data
  })
}
//文件添加

export function addImport(data){
  return request({
    url:'/import/upload',
    method:'post',
    data:data
  })
}
//报告添加

export function addResearch(data){
  return request({
    url:'/research/upload',
    method:'post',
    data:data
  })
}

//成果展示
//右上1
export function getlist(){
  return request({
    url:'/result/new/info',
    method:'get',
  })
}

//最下
export function datalist(){
  return request({
    url:'/result/info?time=0&depId=0',
    method:'get',
  })
}

//部门下载数据
export function deplist(){
  return request({
    url:'/result/info/dept',
    method:'get',
  })
}


//day
export function woday(){
  return request({
    url:'/result/info?time=1',
    method:'get',
  })
}

//yue
export function womonth(){
  return request({
    url:'/result/info?time=2',
    method:'get',
  })
}



//nian
export function woyear(){
  return request({
    url:'/result/info?time=3',
    method:'get',
  })
}

//zhou
export function woweek(){
  return request({
    url:'/result/info?time=4',
    method:'get',
  })
}

//总量
export function allcount(){
  return request({
    url:'/result/info?time=0',
    method:'get',
  })
}


// 获取人工上传下拉资源库目录
export function getlabelListAllData() {
  return request({
    url:'/resmenu/left',
    method:'get',
  })
}
// 获取标签分组目录
export function getTagListAllData(params) {
  return request({
    url:'/label/type/list/all',
    method:'get',
    params:params
  })
}

// 知识专区获取标签分组的内容目录
export function getTagcontentData(params) {
  return request({
    url:`/label/list/all`,
    method:'get',
    params:params
  })
}
// 人工上传，上传文件接口
export function sendLunwenUploadFile(fd) {
  return request({
    url:`/file/uploads`,
    method:'post',
    data:fd
  })
}

// 知识专区获取标签分组的内容目录
export function getDownloadIsAudit(params) {
  return request({
    url:`/params/download`,
    method:'get',
    params:params
  })
}