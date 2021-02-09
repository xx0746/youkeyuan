import request from '@/utils/request'
// 登录前调用
export function loginInterfaceVerify() {
    return request({
        url: '/verify/login',
        method: 'get',
    })
}
// 登录
export function loginInterface(data) {
    return request({
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        transformRequest: function (obj) {
            var str = [];
            for (var p in obj) {
                str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
            }
            return str.join("&");
        },
        url: '/login',
        method: 'post',
        data: data
    })
}
// 登出
export function loginOutInterface() {
    return request({
        url: '/logout',
        method: 'get',
    })
}
// 代办提醒
export function gettoBeAudit() {
  return request({
    url: '/toBeAudit',
    method: 'POST',
  })
}
//修改密码
export function getModifyPwdInterface(data) {
    return request({
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        transformRequest: function (obj) {
            var str = [];
            for (var p in obj) {
                str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
            }
            return str.join("&");
        },
        url: '/user/passreset',
        method: 'post',
        data: data
    })
}

/*获取菜单*/
export function getMenu() {
    return request({
        url: '/authority/get_menu',
        method: 'get'
    })
}

export function getLogList(params){
    return request({
        url : '/operlog',
        method:'get',
        params:params
    })
}
export function getNoticeAudit(resourceId){
    return request({
        url : '/notice/audit/'+resourceId,
        method:'get',
    })
}
// 获取系统参数
export function getParamsList(){
    return request({
        url:'/params',
        method:'get'
    })
}
// 更新系统参数
export function UpdateParamsList(params){
    return request({
        url:`/params?sysParamJson=${params}`,
        method:'post',
    })
}
export function getVersionList(params){
    return request({
        url:'/version/list',
        method:'get',
        params:params
    })
}

export function insertVersion(data){
    return request({
        url:'/version/insert',
        method:'post',
        data:data
    })
}
export function delVersion(data){
    return request({
        url:'/version/'+data,
        method:'delete',
    })
}

// 获取系统性能检测数据
export function getCpuInfomation() {
    return request({
        url:'/system/list',
        method:'post',
    })
}
// 获取性能检测警告查询数据
export function getWarningInfoData(data) {
    return request({
        url:`/system/warning/list?pageNumber=${data.pageNumber}&pageSize=${data.pageSize}`,
        method:'post',
    })
}
// 资源目录排序
export function setResmenuSort(data) {
    return request({
        url:`/resmenu/sort/${data.aboveId}`,
        method:'post',
        data:data.arr
    })
}
