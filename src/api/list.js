import request from '@/utils/request'
// 组织机构 接口--
// 组织机构列表添加

export function addOrgInterface(data) {
    return request({
        url: '/organization',
        method: 'post',
        data: data
    })
}
// 组织机构列表展示
export function getOrgInterface(params) {
    return request({
        url: '/organization',
        method: 'get',
        params: params
    })
}
// 点击修改按钮
export function handUpdateInterface(data) {
    return request({
        url: '/organization/' + data,
        method: 'get',
    })
}
// 点击弹窗的确定后修改某一条数据
export function updateInterface(data) {
    return request({
        url: '/organization',
        method: 'put',
        data: data
    })
}

// 点击弹窗的确定后修改某一条数据
export function handDelInterface(data) {
    return request({
        url: '/organization/' + data,
        method: 'delete',
    })
}
// 获取隶属机构
export function getAffOrgInterface(s) {
    return request({
        url: '/organization/list',
        method: 'get',
        params: s
    })
}

// 获取所有机构
export function getOrgListInterface(pramas) {
    return request({
        url: `/organization/user`,
        method: 'get',
    })
}

// 获取所有机构
export function exportResource(pramas) {
    return request({
        url: `/export/resource`,
        method: 'get',
        params: pramas,
        responseType:'blob'
    })
}

