import request from '@/utils/request'
import JSZip from 'jszip';
import FileSaver from 'file-saver';
import { callbackify } from 'util';
// 多文件下载
export const downloadFile = (url, name) => {
  const iframe = document.createElement("iframe");
  iframe.style.display = "none"; // 防止影响页面
  iframe.style.height = 0; // 防止影响页面
  iframe.src = url;
  document.body.appendChild(iframe); // 这一行必须，iframe挂在到dom树上才会发请求
  // 5分钟之后删除（onload方法对于下载链接不起作用，就先抠脚一下吧）
  setTimeout(()=> {
    iframe.remove();
  }, 5 * 60 * 1000);
};
// 多文件下载并压缩
const getFile = url => {
  return new Promise((resolve, reject) => {
    request({
      method:'get',
      url: `/resource/preview/file/output?fileUrl=${url.fileUrl}&fileName="文件下载"`,
      // url: url,
      responseType: 'arraybuffer'
    }).then(data => {
      resolve(data.data)
    }).catch(error => {
      reject(error.toString())
    })
  })
 }
export const handleBatchDownload = (urlArr, foldName, callback) => {
  // 需要下载打包的路径, 可以是本地相对路径, 也可以是跨域的全路径
  const zip = new JSZip()
  const cache = {}
  const promises = []
  let total = urlArr.length;
  let temp = 0;
  let progress;
  urlArr.forEach(item => {
    // let src = item.fileUrl.replace('http://132.10.10.52:8888', '/api').split('?')[0];
    const promise = getFile(item).then(data => { // 下载文件, 并存成ArrayBuffer对象
      const arr_name = item.name.split("=");
      const file_name = arr_name[arr_name.length - 1] // 获取文件名
      zip.file(file_name, data, { binary: true }) // 逐个添加文件
      cache[file_name] = data
      // 下载打包进度监听
      temp++;
      progress = Math.ceil(temp / total * 100);
      return callback(progress)
    })
    promises.push(promise)
  })
  Promise.all(promises).then(() => {
    zip.generateAsync({type:"blob"}).then(content => { // 生成二进制流
      FileSaver.saveAs(content, `${foldName}.zip`) // 利用file-saver保存文件
    })
  })
}