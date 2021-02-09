import request from '@/utils/request'
// 角色管理 接口--
// 角色列表添加
export function addRoleInterface(data){
    return request({
        url:'/role',
        method:'post',
        data:data
    })
}
// 角色列表展示
export function getRoleInterface(data){
    return request({
        url:'/role?roleName='+data.roleName+"&pageNumber="+data.pageNumber,
        method:'get',
    })
}
// 点击修改按钮
export function handUpdateInterface(data){
    return request({
        url:'/role/'+data,
        method:'get',
    })
}
// 点击弹窗的确定后修改某一条数据
export function updateInterface(data){
    return request({
        url:'/role',
        method:'put',
        data:data
    })
}
// 点击弹窗的确定后删除某一条数据
export function handDelInterface(data){
    return request({
        url:'/role/'+data,
        method:'delete',
    })
}
// 点击配置权限按钮
export function getAuthorityInterface(roleId){
    return request({
        url:'/authority/menu/'+roleId,
        method:'get',
    })
}
// 配置权限
export function updateRoleInterface(temp){
    return request({
        url:'/authority/'+temp.id,
        method:'post',
        data:temp,
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        transformRequest: function (obj) {
        var str = [];
        for (var p in obj) {
            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
        }
        return str.join("&");
        },
    })
}
// 获取所有角色
export function getRoleListInterface(){
    return request({
        url:'/role/list',
        method:'get',
    })
}
// 改变角色状态
export function editUserState(prama){
    return request({
        url:`/user/state/${prama.userId}/${prama.state}`,
        method:'get',
    })
}
