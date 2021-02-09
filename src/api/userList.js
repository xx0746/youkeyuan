import request from '@/utils/request'
// 用户管理 接口--
// 用户列表添加
export function addUserInterface(data){
    return request({
        url:'/user',
        method:'post',
        data:data
    })
}
// 用户列表展示
export function getUserInterface(data){
    return request({
        url:'/user?userName='+data.userName+"&pageNumber="+data.pageNumber+"&orgId="+data.orgId+"&roleId="+data.roleId,
        method:'get',
    })
}
// 点击修改按钮
export function handUpdateInterface(data){
    return request({
        url:'/user/'+data,
        method:'get',
    })
}
// 点击弹窗的确定后修改某一条数据
export function updateInterface(data){
    return request({
        url:'/user',
        method:'put',
        data:data
    })
}
// 点击弹窗的确定后修改某一条数据
export function handDelInterface(data){
    return request({
        url:'/user/'+data,
        method:'delete',
    })
}

// 密码重置
export function resetPassword(data){
    return request({
        url:'/user/reset/'+data,
        method:'post',
    })
}
