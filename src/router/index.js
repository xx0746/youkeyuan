import Vue from 'vue'
import Router from 'vue-router'
import { Message } from 'element-ui'

// 路由懒加载方式，当路由被访问的时候才加载对应组件
const LeftNav = () => import ('@/components/nav/leftNav')
const Home = () => import ('@/views/home')
const manu = () => import ('@/views/resource/manu')
const manualupload = () => import ('@/views/resource/manualupload')
const uploadhistory = () => import ('@/views/resource/uploadhistory')
const resourceupload = () => import ('@/views/resource/upload')
const downexamine = () => import ('@/views/resource/downexamine') //资源下载审核页面
const downhistory = () => import ('@/views/resource/downhistory') //资源下载审核页面
const resourcerow = () => import ('@/views/resource/row')
const warehousaudit = () => import ('@/views/resource/warehousaudit')
const library = () => import ('@/views/resource/library')
const label = () => import ('@/views/resource/label')
const resourcelist = () => import ('@/views/resource/list')
const resourceupdate = () => import ('@/views/resource/update')
const resview = () => import ('@/views/resview/index')
const ressubscribe = () => import ('@/views/ressubscribe/index')
const rotationchart = () => import ('@/views/rotationchart/index')
const ImageRelease = () => import ('@/views/rotationchart/ImageRelease')
const ImageRecord = () => import ('@/views/rotationchart/ImageRecord')
const Toexamine = () => import ('@/views/rotationchart/Toexamine')
const sysrole = () => import ('@/views/sys/role')
const syslog = () => import ('@/views/sys/loglist')
const sysparam = () => import ('@/views/sys/params')
const sysversion = () => import ('@/views/sys/version')
const sysmonitor = () => import ('@/views/sys/monitor')

const datares = () => import ('@/views/data/dataresource')
const dataclean = () => import ('@/views/data/dataclean')
const datarepeat = () => import ('@/views/data/datarepeat')
const dataAudit = () => import ('@/views/data/dataAudit')
const dataIntegration = () => import ('@/views/data/dataintegration')
const dataclencopy = () => import ('@/views/data/dataclencopy')
const dataimportcopy = () => import ('@/views/data/dataimportcopy')
const dataimportcopyone = () => import ('@/views/data/dataimportcopyone')
const datasplit = () => import ('@/views/data/datasplit')
const datalog = () => import ('@/views/data/datalog')

const datamenu = () => import ('@/views/data/datamenu')
const datalabel = () => import ('@/views/data/datalabel')
const datatemplate = () => import ('@/views/data/datatemplate')

const dataimport = () => import ('@/views/data/dataimport')
const datarecord = () => import ('@/views/data/datarecord')
const datadown = () => import ('@/views/data/datadown')
const datapro = () => import ('@/views/data/procession')
const dataresult = () => import ('@/views/data/dataresult')

const syslist = () => import ('@/views/sys/list')
const sysorganize = () => import ('@/views/sys/organize')
const userlist = () => import ('@/views/sys/userlist')
const NotFound = () => import ('@/components/404')

const Reportform = () => import ('@/views/sys/Reportform')  //各中心入库情况统计
const yearReportform = () => import ('@/views/sys/yearReportform')  //年度入库情况统计
const uploadReportform = () => import ('@/views/sys/uploadReportform')  //单用户上传情况统计
const downloadReportform = () => import ('@/views/sys/downloadReportform')  //单用户下载情况统计
const accessQueryReportForm = () => import ('@/views/sys/accessQueryReportForm') // 访问查询统计
const uploadFile = () => import ('@/views/resource/upload')
const uploadFiles = () => import ('@/views/demo')

// import comment from '@/views/resb/comment.vue'
const Login = resolve => require(['@/views/login'], resolve)
const Loginsys = resolve => require(['@/views/loginsys'], resolve)
const index = resolve => require(['@/views/index'], resolve)
const resbindex = resolve => require(['@/views/resb/index'], resolve)
const resbsearch = resolve => require(['@/views/resb/search'], resolve)
const comment = resolve => require(['@/views/resb/comment'], resolve)
const details = resolve => require(['@/views/resb/details'], resolve)
const dataAnalysis = resolve => require(['@/views/resb/dataAnalysis'], resolve)
const resultsshow = resolve => require(['@/views/resultsshow/index'], resolve)

// czm
const dynamicList = () => import ('@/views/sys/dynamicList')
const dynamicRelease = () => import ('@/views/sys/dynamicRelease')
const dynamicReview = () => import ('@/views/sys/dynamicReview')
const releaseRecord = () => import ('@/views/sys/releaseRecord')
const noticeList = () => import ('@/views/sys/noticeList')
const noticeRelease = () => import ('@/views/sys/noticeRelease')
const noticeReview = () => import ('@/views/sys/noticeReview')
const noticeRecord = () => import ('@/views/sys/noticeRecord')
const newRefresh = () => import ('@/views/sys/newRefresh')
Vue.use(Router)

let router = new Router({
  routes: [
    {
      path: '/',
      type: 'login',
      component: Login,
    },
    {
      path: '/login',
      type: 'login',
      component: Login,
    },
    {
      path: '/loginsys',
      type: 'login',
      component: Loginsys,
    },
    {
      path: '/index',//首页
      type: 'index',
      component: index,
      meta:{
        flag: 'enterprise',
      }
    },


    {
      path: '/resultsshow',
      type: 'resultsshow',
      component: resultsshow,
      meta:{
        flag: 'login',
      }
    },

    {
      path: '/uploadFile',
      type: 'uploadFile',
      component: uploadFile,
    },

    {
      path: '/uploadFiles',
      type: 'uploadFiles',
      component: uploadFiles,
    },


    {
      path: '/resbindex',
      type: 'resbindex',
      component: resbindex,
      meta:{
        flag: 'login',
      }
    },

    {
      path: '/comment',
      type: 'comment',
      component: comment,
      meta:{
        flag: 'login',
      }
    },

    {
      path: '/resbsearch',
      type: 'resbsearch',
      component: resbsearch,
      meta:{
        flag: 'login',
      }
    },
    {
      path: '/details',
      type: 'details',
      component: details,
      meta:{
        flag: 'login',
      }
    },
    {
      path: '/dataAnalysis',
      type: 'dataAnalysis',
      component: dataAnalysis,
      meta:{
        flag: 'login',
      }
    },

    {
      path: '*',
      component: NotFound
    },



    {//系统管理
      path: '/sys',
      type: 'enterprise',
      name: 'sys',
      component: Home,
      redirect: '/sys/role',
      menuShow: true,
      meta:{
        flag: 'enterprise',
      },
      children: [
        {
          path: '/sys',
          component: LeftNav,
          name: '报表统计',
          leaf: false, // 只有一个节点
          menuShow: true,
          meta:{
            flag: 'enterprise'
          },
          children: [
            { path: '/report/storage/center', component: Reportform , name: '各中心入库情况统计', menuShow: true, meta:{flag: 'enterprise'} },
            { path: '/report/storage/year', component: yearReportform , name: '年度入库情况统计', menuShow: true , meta:{flag: 'enterprise'}},
            { path: '/report/storage/upload', component: uploadReportform , name: '单用户上传情况统计', menuShow: true, meta:{flag: 'enterprise'}},
            { path: '/report/storage/search', component: accessQueryReportForm , name: '访问查询统计', menuShow: true, meta:{flag: 'enterprise'} },
            { path: '/report/storage/download', component: downloadReportform , name: '单用户下载情况统计', menuShow: true, meta:{flag: 'enterprise'} },
          ]
        },
        {
          path: '/sys',
          component: LeftNav,
          name: '用户管理',
          leaf: false, // 只有一个节点
          menuShow: true,
          meta:{
            flag: 'enterprise'
          },
          children: [
            { path: '/userlist', component: userlist, name: '用户列表', menuShow: true, meta:{flag: 'enterprise'} },
          ]
        },

        {
          path: '/sys',
          component: LeftNav,
          name: '机构管理',
          leaf: false, // 只有一个节点
          menuShow: true,
          meta:{
            flag: 'enterprise'
          },
          children: [
            { path: '/orglist', component: syslist, name: '机构列表', menuShow: true, meta:{flag: 'enterprise'} },
            { path: '/orgimg', component: sysorganize, name: '机构图', menuShow: true, meta:{flag: 'enterprise'} },
          ]
        },

        {
          path: '/sys',
          component: LeftNav,
          name: '角色管理',
          leaf: false, // 只有一个节点
          menuShow: true,
          meta:{
            flag: 'enterprise'
          },
          children: [
            { path: '/rolelist', component: sysrole, name: '角色管理', menuShow: true, meta:{flag: 'enterprise'} },
          ]
        },
        {
          path: '/log',
          component: LeftNav,
          name: '日志管理',
          leaf: false, // 只有一个节点
          menuShow: true,
          meta:{
            flag: 'enterprise'
          },
          children: [
            { path: '/log/loglist', component: syslog, name: '日志列表', menuShow: true, meta:{flag: 'enterprise'} },
          ]
        },
        {
          path: '/sys',
          component: LeftNav,
          name: '系统参数',
          leaf: false, // 只有一个节点
          menuShow: true,
          meta:{
            flag: 'enterprise'
          },
          children: [
            { path: '/sys/params/set', component: sysparam, name: '参数设置', menuShow: true, meta:{flag: 'enterprise'} },
          ]
        },
        {
          path: '/sys',
          component: LeftNav,
          name: '性能监控',
          leaf: false, // 只有一个节点
          menuShow: true,
          meta:{
            flag: 'enterprise'
          },
          children: [
            { path: '/sys/monitor/list', component: sysmonitor, name: '性能监控', menuShow: true, meta:{flag: 'enterprise'} },
          ]
        },
        {
          path: '/sys',
          component: LeftNav,
          name: '版本管理',
          leaf: false, // 只有一个节点
          menuShow: true,
          meta:{
            flag: 'enterprise'
          },
          children: [
            { path: '/sys/version', component: sysversion, name: '版本管理', menuShow: true, meta:{flag: 'enterprise'} },
          ]
        },

      ]
    },



    {//知识管理
      path: '/resource',
      type: 'enterprise',
      name: 'resource',
      component: Home,
      redirect: '/resource/upload',
      menuShow: true,
      meta:{
        flag: 'enterprise'
      },
      children: [
        {
          path: '/resource',
          component: LeftNav,
          name: '资源采集',
          leaf: false, // 只有一个节点
          menuShow: true,
          meta:{
            flag: 'enterprise'
          },
          children: [
            { path: '/resource/manu', component: manu, meta:{flag: 'enterprise'}},
            { path: '/resource/manualupload', component: manualupload, name: '人工上传', menuShow: true, meta:{flag: 'enterprise'}},
            { path: '/resource/uploadhistory', component: uploadhistory, name: '上传记录查看', menuShow: true, meta:{flag: 'enterprise'} },
          ]
        },
        {
          path: '/resource',
          component: LeftNav,
          name: '资源加工',
          leaf: false, // 只有一个节点
          menuShow: true,
          meta:{
            flag: 'enterprise'
          },
          children: [
            { path: '/resource/warehousaudit', component: warehousaudit, name: '资源入库审核', menuShow: true, meta:{flag: 'enterprise'} },
            { path: '/resource/row', component: resourcerow, name: '资源排重', menuShow: true, meta:{flag: 'enterprise'} },
            // { path: '/resource/update', component: resourceupdate, name: '资源更新', menuShow: true },
          ]
        },
        {
          path: '/resource',
          component: LeftNav,
          name: '资源管理',
          leaf: false, // 只有一个节点
          menuShow: true,
          meta:{
            flag: 'enterprise'
          },
          children: [
            { path: '/resource/label', component: label, name: '标签库管理', menuShow: true, meta:{flag: 'enterprise'} },
            { path: '/resource/library', component: library, name: '资源库管理', menuShow: true, meta:{flag: 'enterprise'} },
            { path: '/resource/list', component: resourcelist, name: '资源目录管理', menuShow: true, meta:{flag: 'enterprise'} },
            { path: '/resource/upload', component: resourceupload, name: '资源下载', menuShow: false, meta:{flag: 'enterprise'} },
            { path: '/resource/downexamine', component: downexamine, name:'资源下载审核', menuShow: true, meta:{flag: 'enterprise'} },
            { path: '/resource/downhistory', component: downhistory, name:'资源下载记录', menuShow: true, meta:{flag: 'enterprise'} },
          ]
        },

      ]
    },

    {//数据管理
      path: '/data',
      type: 'enterprise',
      name: 'data',
      component: Home,
      redirect: '/data/import',
      menuShow: true,
      meta:{
        flag: 'enterprise',
      },
      children: [
        {
          path: '/data',
          component: LeftNav,
          name: '数据采集',
          leaf: false, // 只有一个节点
          menuShow: true,
          meta:{
            flag: 'enterprise'
          },
          children: [
            { path: '/data/import', component: dataimportcopy, name: '数据导入', menuShow: true, meta:{flag: 'enterprise'} },
            { path: '/data/record', component: datarecord, name: '数据导入记录', menuShow: true, meta:{flag: 'enterprise'} },
            { path: '/data/importcopy', component: dataimportcopy, name: '数据导入复制', menuShow: true, meta:{flag: 'enterprise'} },
            { path: '/data/importcopyone', component: dataimportcopyone, name: '数据导入复制1', menuShow: true, meta:{flag: 'enterprise'} },
          ]
        },
        {
          path: '/data',
          component: LeftNav,
          name: '数据加工',
          leaf: false, // 只有一个节点
          menuShow: true,
          meta:{
            flag: 'enterprise'
          },
          children: [
            { path: '/data/procession', component: datapro, name: '数据处理', menuShow: true, meta:{flag: 'enterprise'}},
            { path: '/data/clean', component: dataclean, name: '数据清洗', menuShow: true, meta:{flag: 'enterprise'} },
            { path: '/data/repeat', component: datarepeat, name: '数据排重', menuShow: true, meta:{flag: 'enterprise'} },
            { path: '/data/audit', component: dataAudit, name: '数据入库审核', menuShow: true, meta:{flag: 'enterprise'} },
            { path: '/data/integration', component: dataIntegration, name: '数据整合', menuShow: true, meta:{flag: 'enterprise'} },
            { path: '/data/cleancopy', component: dataclencopy, name: '数据清洗复制', menuShow: true, meta:{flag: 'enterprise'} },
            { path: '/data/split', component: datasplit, name: '数据拆分', menuShow: true, meta:{flag: 'enterprise'} },
            { path: '/data/log', component: datalog, name: '数据拆分', menuShow: true, meta:{flag: 'enterprise'} },
            // { path: '/resource/update', component: resourceupdate, name: '资源更新', menuShow: true },  dataintegration dataclencopy datasplit
          ]
        },
        {
          path: '/data',
          component: LeftNav,
          name: '数据管理',
          leaf: false, // 只有一个节点
          menuShow: true,
          meta:{
            flag: 'enterprise'
          },
          children: [
            { path: '/data/resource', component: datares, name: '数据资源库管理', menuShow: true, meta:{flag: 'enterprise'} },
            { path: '/data/result', component: dataresult, name: '分析结果查询', menuShow: true, meta:{flag: 'enterprise'} },
            { path: '/data/label', component: datalabel, name: '标签管理', menuShow: true, meta:{flag: 'enterprise'} },
            { path: '/data/menu', component: datamenu, name: '数据目录管理', menuShow: true, meta:{flag: 'enterprise'} },
            { path: '/data/template', component: datatemplate, name: '数据模型管理', menuShow: true, meta:{flag: 'enterprise'} },
            { path: '/data/down', component: datadown, name: '数据下载管理', menuShow: true, meta:{flag: 'enterprise'} },
          ]
        },

      ]
    },

    {//资源评论
      path: '/comment',
      type: 'enterprise',
      name: 'comment',
      component: Home,
      redirect: '/resview/index',
      menuShow: true,
      meta:{
        flag: 'enterprise',
      },
      children: [
        {
          path: '/resview',
          component: LeftNav,
          name: '资源评论',
          leaf: false, // 只有一个节点
          menuShow: true,
          meta:{
            flag: 'enterprise'
          },
          children: [
            { path: '/resview/index', component: resview, name: '资源评论', menuShow: true, meta:{flag: 'enterprise'} },
          ]
        },

      ]
    },

    {//资源订阅
      path: '/subscribe',
      type: 'enterprise',
      name: 'subscribe',
      component: Home,
      redirect: '/ressubscribe/index',
      menuShow: true,
      meta:{
        flag: 'enterprise',
      },
      children: [
        {
          path: '/ressubscribe',
          component: LeftNav,
          name: '资源订阅管理',
          leaf: false, // 只有一个节点
          menuShow: true,
          meta:{
            flag: 'enterprise'
          },
          children: [
            { path: '/ressubscribe/index', component: ressubscribe, name: '资源订阅管理', menuShow: true, meta:{flag: 'enterprise'} },
          ]
        },

      ]
    },

    {//数据管理
      path: '/carousel',
      type: 'enterprise',
      name: 'carousel',
      component: Home,
      redirect: '/rotationchart/ImageRelease',
      menuShow: true,
      meta:{
        flag: 'enterprise',
      },
      leaf: false,
      children: [
        {
          path: '/rotationchart',
          component: LeftNav,
          name: '图文管理',
          leaf: false, // 只有一个节点
          menuShow: true,
          meta:{
            flag: 'enterprise'
          },
          children: [
            { path: '/rotationchart/ImageRelease', component: ImageRelease, name: '图文发布', menuShow: true, meta:{flag: 'enterprise'} },
            { path: '/rotationchart/ImageRecord', component: ImageRecord, name: '发布记录', menuShow: true, meta:{flag: 'enterprise'} },
            { path: '/rotationchart/Toexamine', component: Toexamine, name: '图文审核', menuShow: true, meta:{flag: 'enterprise'} },
            { path: '/rotationchart/index', component: rotationchart, name: '图文列表', menuShow: true, meta:{flag: 'enterprise'} },
          ]
        },{
          path: '/carousel',
          component: LeftNav,
          name: '动态管理',
          leaf: false, // 只有一个节点
          menuShow: true,
          meta:{
            flag: 'enterprise'
          },
          children: [
            { path: '/dynamic/publish', component: dynamicRelease, name: '动态发布', menuShow: true, meta:{flag: 'enterprise'} },
            { path: '/dynamic/record', component: releaseRecord, name: '发布记录', menuShow: true, meta:{flag: 'enterprise'} },
            { path: '/dynamic/audit', component: dynamicReview, name: '动态审核', menuShow: true, meta:{flag: 'enterprise'} },
            { path: '/dynamic/list', component: dynamicList, name: '动态列表', menuShow: true, meta:{flag: 'enterprise'} },
          ]
        },
        {
          path: '/carousel',
          component: LeftNav,
          name: '公告管理',
          leaf: false, // 只有一个节点
          menuShow: true,
          meta:{
            flag: 'enterprise'
          },
          children: [
            { path: '/notice/publish', component: noticeRelease, name: '公告发布', menuShow: true, meta:{flag: 'enterprise'} },
            { path: '/notice/record', component: noticeRecord, name: '发布记录', menuShow: true, meta:{flag: 'enterprise'} },
            { path: '/notice/audit', component: noticeReview, name: '公告审核', menuShow: true, meta:{flag: 'enterprise'} },
            { path: '/notice/list', component: noticeList, name: '公告列表', menuShow: true, meta:{flag: 'enterprise'} },
            { path: '/notice/newRefresh', component: newRefresh, menuShow: false, meta:{flag: 'enterprise'} },
          ]
        },
      ]
    },
  ]
});
// 路由前置拦截
router.beforeEach((to, from, next) => {
  let roleName = window.sessionStorage.getItem("roleName");
  let loginSys = window.sessionStorage.getItem("loginSysStyle");
  if( to.path === '/resbsearch' ||
      to.path === '/resbindex' ||
      to.path === '/comment' ||
      to.path === '/details' ||
      to.path === '/login' ||
      to.path === '/loginsys' ||
      to.path === '/dataAnalysis' ||
      to.path === '/'
  ) {
    window.sessionStorage.setItem("loginSysStyle", "前台");
    next();
  } else {
    if(loginSys === '前台' && from.path !== '/loginsys') {
      if(roleName === "用户") {
        Message({
          message: '用户没有访问后台的权限！',
          showClose: true,
          type: 'error',
          duration: 3 * 1000
        })
      } else {
        // Message({
        //   message: '如果您想访问后台，请先退出前台。',
        //   showClose: true,
        //   type: 'warning',
        //   duration: 3 * 1000
        // })
        next();
      }
    } else if(loginSys === '后台'){
      next();
    }
  }
});

router.afterEach((to, from) => {
  window.scrollTo(0, 0)
})

export default router
