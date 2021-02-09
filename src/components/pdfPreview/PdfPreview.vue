<template>
  <div v-if="isShow" id="preview_box">
    <p>{{title}}</p>
    <el-progress :percentage="progress" :format="format(progress)"></el-progress>
    <canvas v-for="n in totalPage" :id="'the-canvas' + n" :key="n" class="pdf-content" style="background-color: antiquewhite" charset="gb2312"></canvas>
    <div class="handle-page">
      <button @click="enlarge"><i class="el-icon-plus"></i></button>
      <button @click="letting"><i class="el-icon-minus"></i></button>
      <button @click="rotation"><i class="el-icon-refresh"></i></button>
    </div>
    <!-- 组件：回到顶部 -->
    <back-top></back-top>
  </div>
</template>

<script>
import backTop from "@/components/backtop/backTop"
import pdfJS from 'pdfjs-dist'
export default {
  components: { backTop },
  props: {
    dataFlow: {
      type: String,
      required: true,
      default: "",
    },
    title: {
      type: String,
      default: '',
    },
    loadPage: {
      type: Number,
      default: 0,
    },
  },
  data () {
    return {
      pdfDoc: null,
      totalPage: 0,
      loadedPageCount: 0,
      scale: 1.3, //缩放倍数，1表示原始大小
      rotate: 0,
      progress: 0,
      isShow: false
    }
  },
  watch: {
    dataFlow (newval, oldval) {
      if(newval) {
        this.isShow = false;
        this.loadedPageCount = 0;
        this.progress = 0;
        console.log(newval);
        this.getPDFFile(newval);
      }
    }
  },
  computed: {
    // url() {
    //   // return this.src.replace('http://132.10.10.52:8888', '/api');
    // }
  },
  created() {
    pdfJS.GlobalWorkerOptions.workerSrc = require('pdfjs-dist/build/pdf.worker.min.js');
    this.getPDFFile(this.dataFlow);
  },
  mounted() {
    let aa = document.getElementById('preview_box');
    aa.addEventListener('scroll', this.getScrollTop)
  },
  methods: {
    getScrollTop(e) {
      console.log(e)
    },
    getPDFFile (res) {
      if (!res) return
      this.isShow = true;
      this.loadedPageCount = 0;
      // cmaps防止页面中乱码的问题,cdn引用和本地引用均可。cdn引入犹豫网络问题，容易加载丢失。
      // let CMAP_URL = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@2.0.943/cmaps/';
      let CMAP_URL = './static/cmaps/';
      /***********其实这里是base64解决跨域的关键************/
      let raw = window.atob(res) //从这里 到下面 得到 rawArray
      let rawLength = raw.length
      let rawArray = new Uint8Array(new ArrayBuffer(rawLength))
      for(var i = 0;i<rawLength;i++){
        rawArray[i] = raw.charCodeAt(i)
      }
      /********************************************/
      // 也就是这里！！！  这些语句是我们将base64格式的数据转成pdf.js可以解析的格式  !
      // (https://img-blog.csdnimg.cn/20190321174128417.png)这个是rawArray的最终格式 通过此链接可以查看图片
      // console.log(rawArray)
      pdfJS.getDocument({data: rawArray,cMapUrl: CMAP_URL,cMapPacked: true,}).then(pdf => {
        this.pdfDoc = pdf;
        this.renderPage();
      })
    },
    renderPage() {
      const that = this;
      if(this.loadPage == 0 || this.loadPage >= this.pdfDoc.numPages) {
        this.totalPage = this.pdfDoc.numPages;//总页数
      } else {
        this.totalPage = this.loadPage;
      }
      //一次加载了所有页，也可以一页页加载
      for(var i = 1; i<=this.totalPage; i++) {
        this.pdfDoc.getPage(i).then((page) => {
          var viewport = page.getViewport(this.scale, this.rotate);
          var canvas = document.getElementById('the-canvas' + page.pageNumber);
          var context = canvas.getContext('2d');
          canvas.height = viewport.height;
          canvas.width = viewport.width;
          var renderContext = {
            canvasContext: context,
            viewport: viewport
          };
          // 先加载完成所有页面，后渲染所有页面
          page.render(renderContext).promise.then(() => {
            this.loadedPageCount ++;//加载一个+1，最后总数和totalPage一样了，表示pdf加载完了
            this.$nextTick(() => {
              this.progress = Math.round( this.loadedPageCount / this.totalPage * 100);
              this.format(this.progress);
            })
          });
        }).catch(error => {
          this.progress = 100;
          console.log(error);
        });
      }
    },
    //放大
    enlarge(){
      if(this.progress == 100) {
        this.progress = 0;
        this.loadedPageCount = 0;
        this.scale += 0.1;
        this.renderPage();
      }
    },
    //缩小
    letting(){
      if(this.progress == 100) {
        this.progress = 0;
        this.loadedPageCount = 0;
        this.scale -= 0.1;
        this.renderPage();
      }
    },
    // 旋转
    rotation(){
      if(this.progress == 100) {
        this.progress = 0;
        this.loadedPageCount = 0;
        this.rotate += 90;
        this.renderPage();
      }
    },
    format(percentage) {
      return percentage === 100 ? '满' : `${percentage}%`;
    }
  }
}
</script>
<style lang="scss" scoped>
  .handle-page {
    border-radius: 3px;
    position: fixed;
    top: 280px;
    right: 48%;
    transform: translateX(500px);
    background-color: rgb(240, 240, 240);
    border: 1px solid #C4C9D0;
    button {
      display: block;
      width: 30px;
      height: 30px;
      padding: 10px 0;
      margin: 0 10px;
      border: 0;
      outline: none;
      box-sizing:content-box;
      font-size: 14px;
      cursor: pointer;
      border-bottom: 1px solid #C4C9D0;
      background-color: rgb(240, 240, 240);
      &:hover {
        color: #009A52;
      }
      &:last-child {
        border-bottom: none;
      }
    }
  }
  .pdf-content {
    position: relative;
    left: 50%;
    transform: translateX(-50%);
    background-color: antiquewhite;
  }
</style>

