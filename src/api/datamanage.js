import request from '@/utils/request'
import qs from 'qs'
// 物流公司列表
export function getLogisticsList() {
  return request({
    url: '/logistics/company',
    method: 'get',
  })
}
// 上传文件及物流导入
export function sendUploadFile(fd, prama) {
  return request({
    url: `/logistics/collect/${prama.expressType}?chars=${prama.chars}&splitStr=${prama.splitStr}`,
    method: 'post',
    data: fd
  })
}
// 获取省事行政区
export function getDistrictList(prama) {
  return request({
    url: `/area?pid=${prama}`,
    method: 'get',
  })
}
// 物流数据分析
export function logisticsAnalysis(prama) {
  return request({
    url: `/logistics/analysis/${prama.expressType}`,
    method: 'post',
    data: prama
  })
}
// 物流数据分析liebiao
export function logisticsAnalysisPage(prama) {
  return request({
    url: `/logistics/analysis`,
    method: 'get',
    params: prama
  })
}
// 物流数据采集列表
export function logisticsCollectList(param) {
  return request({
    url: '/logistics/collect',
    method: 'get',
    params : param
  })
}
// 物流分析列表
export function logisticsAnalysisList(param) {
  return request({
    url: '/logistics/analysis/list',
    method: 'get',
    params: param
  })
}
// 物流分析结果
export function logisticsAnalysisResult(param) {
  return request({
    url: '/logistics/analysis/' + param,
    method: 'get'
  })
}
// 物流导入删除
export function logisticsCollectDel(param) {
  return request({
    url: '/logistics/collect/' + param,
    method: 'delete'
  })
}
// 获取数据模板属性类型
export function getDataModelTypeList() {
  return request({
    url: '/data/table/column/type',
    method: 'get'
  })
}
// 提交数据模板定义
export function setDataModelTypeForm(param) {
  return request({
    url: '/data/table',
    method: 'post',
    data: param
  })
}
// 获取数据模型表格
export function getDataModelTablelist(param) {
  return request({
    url: `/data/table`,
    method: 'get',
    params:param
  })
}
//数据专区获取标签分组目录
export function getTypeListAll() {
  return request({
    url:`/label/type/list/all`,
    method:'get',
  })
}
//数据专区获取标签分组的内容目录
export function getLabellistall(params) {
  return request({
    url:'/label/list/all',
    method:'get',
    params:params
  })
}
//数据模型预览
export function getDataModelShow(row) {
  return request({
    url: `/data/table/column/${row.ID}`,
    method: 'get'
  })
}
//删除数据模型
export function getDataModelRemove(row){
  return request({
    url:`/data/table/${row.ID}/${row.DATATYPE}`,
    method: 'DELETE'
  })
}
// 获取数据模板下拉
export function getTemplateNameSelect(param) {
  return request({
    url: `/data/table/${param}`,
    method: 'get',
  })
}
// 获取追加导入的数据集
export function getCollectListSelect(param) {
  return request({
    url: `/data/table/addition`,
    method: 'get',
    params: param
  })
}
// 追加导入提交
export function submitAddto(fd, param) {
  return request({
    url: `/data/collect/addition`,
    method: 'post',
    data: fd,
    params: param
  })
}
// 提交自定义模板
export function addTemplateTableData(fd, param) {
  return request({
    url: `/data/collect/${param.menuType}?firstSelect=${param.firstSelect}
        &tableId=${param.tableId}&collectName=${param.collectName}
        &dataA=${param.dataA}&dataB=${param.dataB}&auditState=${param.auditState}&splitStr=${param.splitStr}`,
    method: 'post',
    data: fd,
  })
}

// 自动识别表头
export function addAutoTemplate(fd, param) {
  return request({
    url: `/data/import/auto?firstSelect=${param.firstSelect}
    &collectName=${param.collectName}
    &dataA=${param.dataA}&dataB=${param.dataB}&auditState=${param.auditState}&splitStr=${param.splitStr}`,
    method: 'post',
    data: fd,
    // paramsSerializer: function(params) {
    //   return qs.stringify(params, {arrayFormat: 'brackets'})
    // },
  })
}

// 数据模板物流表单列表
export function LogisticsFormData(param) {
  return request({
    url: `/data/collect/${param.menuId}`,
    method: 'get',
    params : param
  })
}
// 自定义数据模型下载
export function downloadModelForm(param) {
  return request({
    url: `/data/table/down/${param.tableId}?fileName=${param.fileName}`,
    method: 'get',
  })
}
// 物流数据清洗，获取清洗物流表单
export function getCleanDataList(param) {
  return request({
    url: `/data/clean?menuId=${param}`,
    method: 'get',
  })
}
// 物流数据清洗，获取清洗属性
export function getCleanFormPropList(param) {
  return request({
    url: `/data/table/column/${param}`,
    method: 'get',
  })
}
// 开始清洗接口
export function getCleanDataResult(param) {
  return request({
    url: `/data/clean`,
    method: 'post',
    data: param
  })
}
// 开始排重接口
export function getRepeatDataResult(param) {
  return request({
    url: `/data/repeat`,
    method: 'post',
    data: param
  })
}

// 下载请求接口
export function getDatasDown(param) {
  return request({
    url: '/data/down',
    method: 'get',
    params: param
  })
}
export function getDataDownList(param) {
  return request({
    url: `/data/down/list`,
    method: 'get',
    params: param
  })
}
export function auditDataDownCommit(params){
  return request({
    url: `/data/down/audit/${params.dataType}/${params.dataId}`,
    method: 'get'
  })
}
export function auditDataDown(params){
  return request({
    url: `/data/down/${params.auditId}/${params.state}/${params.dataType}`,
    method: 'get',
    params:params
  })
}

export function getDataCollect(params){
  return request({
    url: `/data/collect/info/${params}`,
    method: 'get',
  })
}

export function dataCollectInfo(params){
  return request({
    url: `/data/collect/info`,
    method: 'post',
    data:params
  })
}