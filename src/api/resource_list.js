import request from '@/utils/request'
// 资源目录管理页面
export function addMenuInterface(data){
    return request({
        url:'/resmenu',
        method:'post',
        data:data
    })
}
// 目录列表展示
export function getMenuInterface(data){
    return request({
        url:'/resmenu',
        method:'get',
        params: data
    })
}
// 点击修改按钮
export function handUpdateInterface(data){
    return request({
        url:'/resmenu/'+data,
        method:'get',
    })
}
// 点击弹窗的确定后修改某一条数据
export function updateInterface(data){
    return request({
        url:'/resmenu',
        method:'put',
        data: data
    })
}
// 点击弹窗的确定后删除某一条数据
export function handDelInterface(prama){
    return request({
        url:`/resmenu/${prama.menuId}`,
        method:'delete',
    })
}
// 获取左侧菜单
export function getLeftTreeInterface(params){
    return request({
        url:`/resmenu/left`,
        method:'get',
        params:params
    })
}
// 资源入库审核页面
// 获取待审核数据
export function getAuditListInterface(data){
    return request({
        url:`/basic/review/${data.menuId}?pageNumber=${data.pageNumber}&getAudit=${data.getAudit}`,
        method:'get',
    })
}
//待审核 通过--驳回
export function getPassInterface(data){
    return request({
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        transformRequest: function (obj) {
            var str = [];
            for (var p in obj) {
                str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
            }
            return str.join("&");
        },
        url:'/basic/review/'+data.dataTree+'/'+data.type+'/'+data.ids,
        method: 'post',
        data: data
    })
}
// 获取审核记录
export function getAuditLogListInterface(params){
    return request({
        url:'/review',
        method:'get',
        params:params
    })
}
// 获取审核记录
export function getAuditSuccessInterface(params){
    return request({
        url:'/resource/',
        method:'get',
        params:params
    })
}

// 驳回原因查看
export function rejectInterface(data){
    return request({
        url:'/basic/reject/info?basicId='+ data.basicId,
        method:'get',
    })
}

// 上传记录页面
// 获取上传记录
export function getUploadHistoryInterface(data){
    return request({
        url:`/basic/upload?pageNumber=${data.pageNumber}&state=${data.state}&menuId=${data.menuId}`,
        method:'get',
    })
}
// export function getUploadHistoryInterface(data){
//     return request({
//         url:'/thesis/list?menuId='+data.menuId+'&state='+data.state+'&pageNumber='+data.pageNumber,
//         method:'get',
//     })
// }
//重新提交查询内容详情
// 资源库管理页面   /basic/{resourceId}
export function getresource(data){
  return request({
    url:`/basic/${data.resourceId}`,
    method:'get',
  })
}
export function getreSourceFiles(data){
  return request({
    url:`/resource/file/${data.resourceId}`,
    method:'get',
    params: data
  })
}
export function getLabels(data){
  return request({
    url:`/resource/label/${data}`,
    method:'get',
  })
}
//文件列表
export function getPreviewFiles(data){
  return request({
    url:`/resource/file/${data.resourceId}`,
    method:'get',
    params: data
  })
}
//详情
export function getLookFiles(data){
    return request({
      url:`/resource/file/${data.resourceId}`,
      method:'get',
      params: data
    })
  }
// 资源管理获取表格信息
export function getLibraryListInterface(data){
    return request({
        url:`resource/${data.menuId}`,
        method:'get',
        params: data
    })
}
// 资源管理单条记录信息获取
export function getRcodeInfo(data){
    return request({
        url:`/resource/info/${data.resourceId}?type=${data.type}`,
        method:'get',
    })
}
// 资源管理单条记录信息修改提交
export function setRcodeInfo(data){
    return request({
        url:`/resource/info`,
        method:'post',
        data:data
    })
}
// 资源管理单条记录信息修改切换目录获取属性列表
export function getColumns(data){
    return request({
        url:`/menu/column/${data.dataThree}`,
        method:'get',
    })
}
// 资源管理单个文件信息获取
export function getFileInfo(data){
    return request({
        url:`/resource/file/${data.fileId}/${data.menuId}`,
        method:'get',
    })
}
// 资源管理单个文件信息修改提交
export function setFileInfo(data){
    return request({
        url:`/resource/file/${data.menuId}`,
        method:'post',
        data:data
    })
}
// 获取待审核数据  审核记录数据
export function getReviewHistory(data){
    return request({
        url:`basic/review/history/${data.menuId}`,
        method:'get',
        params: data  
    })
}
// 资源下载审核页面
// 获取待审核数据  审核记录数据
export function getDownExamineInterface(data){
    return request({
        url:'/apply/file/list?menuId='+data.menuId+'&applyState='+data.applyState+'&fileName='+data.fileName+'&applyFlag=1&pageNumber='+data.pageNumber,
        method:'GET',
    })
}
// 通过
export function getPassExamInterface(data){
    return request({
        url:'/apply/file/update?menuId='+data.menuId+'&applyState='+data.applyState+ '&applyFileId='+data.applyFileId +'&id='+data.id+'&dataOne='+data.dataOne,
        method:'post',
    })
}

// 多文件下载
export function fileMoreDownLoad(params){
    return request({
        url:'/apply/file/getBatchFileUrl',
        method: 'get',
        params : params
    })
}
///apply/file/getBasicFile/{resourceId}
// 上传修改下载
export function fileMoreUpDownLoad(params){
    return request({
        url:`/apply/file/getBasicFile/${params.resourceId}`,
        method: 'get',
    })
}

// 多文件下载压缩
export function fileMoreDownLoadZip(params){
    return request({
        url:'/apply/file/getBatchFileUrl',
        method: 'get',
        params : params,
    })
}

//标签库管理页面
//获取列表
export function getlabelListInterface(data){
    return request({
        url:'/label/list?labelName='+data.labelName+'&pageNumber='+data.pageNumber,
        method:'GET',
    })
}
//弹窗 新建标签--下拉
export function typeListAllInterface(params){
    return request({
        url:'/label/type/list/all',
        method:'get',
        params:params
    })
}
//新建标签 --提交
export function labelInsertInterface(data){
    return request({
        url:'/label/insert',
        method:'post',
        data:data
    })
}
//标签 --删除
export function deleteLabelInterface(data){
    return request({
        url:'/label/delete?ids='+data,
        method:'DELETE',
        data:data
    })
}

//标签 --修改 PUT /label/updateLabelEntity
export function updateLabelInterface(data){
    return request({
        url:'/label/updateLabelEntity',
        method:'put',
        data:data
    })
}


//弹窗 新建分组
export function typeListInterface(data){
    return request({
        url:'/label/type/list?typeName='+data.typeName+'&pageNumber='+data.pageNumber,
        method:'GET',
        data
    })
}
//弹窗 新建分组
export function newGroupAddInterface(data){
    return request({
        url:'/label/type/insert',
        method:'post',
        data:data
    })
}
//标签分组 --删除
export function deleteLabelTypeInterface(data){
    return request({
        url:'/label/type/delete?ids='+data,
        method:'DELETE',
        data: data
    })
}

//标签分组 --修改
export function updateLabelTypeInterface(data){
    return request({
        url:'/label/type/update',
        method:'PUT',
        data:data
    })
}

// 获取所有标签信息
export function labelListAllInterface(params){
    return request({
        url:'/label/list/all?labelTypeId='+data,
        method:'get',
        params:params
    })
}

export function getlabelListAllData(params) {
    return request({
        url:`/label/type/list/all?state=1&menuId=${data}`,
        method: 'get',
        params:params
    })
}


export function resourceRemove(menuId, id){
    return request({
        url:`/resource/`+menuId+'/'+id,
        method: 'delete'
    })
}

export function auditResourceDown(data){
    return request({
        url:'/basic/download/'+ data.dataOne + '/' + data.resourceId,
        method: 'get',
        params:data
    })
}


export function downloadHistory(params){
    return request({
        url:'/file/down/history/list?menuId='+params.menuId + '&fileName='+ params.fileName + '&pageNumber=' + params.pageNumber,
        method: 'post',
        data:params
    })
}

export function withdrawPost(params){
    return request({
        url:'/basic/withdraw?menuId='+params.menuId + '&id='+ params.id,
        method: 'post'
    })
}

export function merge(form) {
    return request({
        url: '/merge',
        method: 'post',
        data: form
    })
}
//获取属性列表
export function propertyNameList(id){
    return request({
        url:'/menu/column/' + id ,
        method: 'get',
    })
}
//增加属性
export function addPropertyName(data){
    return request({
        url:'/menu/column/'+ data.id,
        method: 'post',
        data:data.list,
    })
}
//修改单条属性
export function editPropertyName(data){
    return request({
        headers: {
         'Content-Type': 'application/json'
        },
        url:'/menu/column',
        method: 'post',
        data:data.resourceMenuColumn
    })
}
//改变单条属性状态
export function editPropertyState(prama){
    return request({
        url:`/resmenu/column/${prama.id}/${prama.state}`,
        method: 'get',
    })
}
//改变目录状态
export function editMenuState(prama){
    return request({
        url:`/resmenu/${prama.id}/${prama.state}`,
        method: 'get',
    })
}
//获取单个资源目录
export function getSingleResource(id){
    return request({
        url:'/resmenu/'+id,
        method: 'get',
    })
}
//审核通过和审核记录
//review/file/{reviewId}
export function getReviewFile(prama){
    return request({
        url:`/review/file/${prama.reviewId}`,
        method: 'get',
    })
}

