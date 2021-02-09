import axios from 'axios'
import { Message } from 'element-ui'
import router from '@/router/index'


const service = axios.create({
  // 测试环境 1
  baseURL: 'http://132.10.10.42:8765/yzyjy',
  timeout: 100000
})
service.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';

service.defaults.withCredentials = true;
//添加请求拦截器
service.interceptors.request.use(config => {
  //在发送请求之前做什么
  return config;
}, error => {
  console.log(error);
  //对请求错误做些什么
  Promise.reject(error)
})

//添加响应拦截器
service.interceptors.response.use(
  response => response,
  error => {
    //  1.判断请求超时
    if (error.code === 'ECONNABORTED' && error.message.indexOf('timeout') !== -1) {
      console.log('请求超时。。。');
      return service.request(originalRequest);//再重复请求一次
    }
    if (error.response) {
      let userType = window.sessionStorage.getItem("userType");
      switch (error.response.status) {
        case 401:
          error.message = '用户会话过期，请重新登录。'
          if (userType == 2) {
            router.replace({
              path: '/'
            })
          } else {
            router.replace({
              path: '/loginsys'
            })
          }
          break
      }
      Message({
        message: error.message,
        showClose: true,
        type: 'error',
        duration: 5 * 1000
      })
    }

    return Promise.reject(error)
  }
)
export default service
