import request from '@/utils/request'

export function getresource(params) {
    return request({
        url: `/resource/${params.menuId}/${params.resourceId}?type=2`,
        method: 'get',
    })
}

export function getCommentList(params) {
    return request({
        url: '/resource/comment',
        method: 'get',
        params: params
    })
}

// 插入评论
export function insertComment(data) {
    return request({
        url: '/resource/comment',
        method: 'post',
        data: data
    })
}

// 删除评论
export function handDelInterface(id) {
    return request({
        url: '/resource/comment/' + id,
        method: 'delete'
    })
}

// 删除评论
export function auditInterface(id) {
    return request({
        url: '/resource/comment/' + id,
        method: 'PUT'
    })
}

// 获取文章资源评论
export function getCommentByResourceId(menuId, resourceId) {
    return request({
        url: '/resource/comment/' + menuId + '/' + resourceId,
        method: 'get'
    })
}

// 评论预览
export function getCommentPreviewList(parma) {
    return request({
        url: `/resource/preview/${parma.menuId}/${parma.fileId}/${parma.fileState}`,
        method: 'post'
    })
}

export function getCommentFileMenu(parma) {
    return request({
        url: `/resource/preview/${parma.menuId}/${parma.fileId}?type=${parma.type}`,
        method: 'get'
    })
}

export function getCommentFileMenudata(parma) {
    return request({
        url: `/resource/preview/${parma.menuId}/${parma.fileId}`,
        method: 'get',
    })
}

// 评论预览
export function getCommentPreview(parma) {
    return request({
        url: `/resource/preview/${parma.menuId}/${parma.fileId}/${parma.fileState}/${parma.id}`,
        method: 'get'
    })
}

// 获取base64位的pdf预览文件
export function getPreviewBase64(parma) {
    return request({
        url: `/resource/preview/file/base64?fileUrl=${parma.fileUrl}`,
        method: 'get',
        data: parma
    })
}
