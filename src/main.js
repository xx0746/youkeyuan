// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import router from './router'
import ElementUI from 'element-ui'
import vueSwiper from 'vue-awesome-swiper'
import store from '@/store/store.js'
import uploader from 'vue-simple-uploader'
import moment from 'moment'
import HappyScroll from 'vue-happy-scroll'
import $ from 'jquery'
import '@/plugins/zTree/css/zTreeStyle/zTreeStyle.css'
import 'element-ui/lib/theme-chalk/index.css'
import 'swiper/dist/css/swiper.css'
// import tinymce from 'vue-tinymce-editor'
import "@/assets/iconfont/iconfont.css";
import '@/assets/iconfont/icomoon/icomoon.css'
import '@/assets/css/style.css'
import 'vue-happy-scroll/docs/happy-scroll.css'
import App from './App'

// 全局注册自定义组件
import DiyBtn from '@/components/diyButton/diyBtn'
Vue.component('diy-btn', DiyBtn);
require ('./t1.js')
require ('./t2.js')

// Vue.component('tinymce', tinymce)
Vue.config.productionTip = false
// 引入第三方组件
Vue.use(ElementUI)
Vue.use(vueSwiper);
Vue.use(uploader);
Vue.use(HappyScroll)

// 时间格式化
Vue.filter('formatDateTime', function (value) {
  if (!value) return ''
  let date = new Date(value);
  let y = date.getFullYear() + '/';
  let mon = (date.getMonth() + 1) + '/';
  let d = date.getDate();
  return y + mon + d;
});
// moment时间格式化插件
Vue.filter('momentTime', function(dataStr, pattern = 'MM月DD日 HH:mm') {
  return moment(dataStr).format(pattern)
})
// moment时间格式化插件
Vue.filter('momentsTime', function(dataStr, pattern = 'YYYY-MM-DD') {
  return moment(dataStr).format(pattern)
})

new Vue({
  router,
  store,
  el: '#app',
  render: h => h(App)
})
