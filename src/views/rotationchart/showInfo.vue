<template>
  <div>
    <div v-if="options.banner != ''" class="itembox">
      <h5>封面图片:</h5>
      <div style="line-height: 20px;">{{data[options.banner]}}</div>
    </div>
    <div v-if="options.sort != ''" class="itembox">
      <h5>排序位置:</h5>
      <p>{{data[options.sort]}}</p>
    </div>
    <div v-if="options.title != ''" class="itembox">
      <h5>标题:</h5>
      <p>{{data[options.title]}}</p>
    </div>
    <div v-if="options.content != ''" class="itembox">
      <h5>正文:</h5>
      <div v-html="data[options.content]" class="imgbox">{{data[options.content]}}</div>
    </div>
    <div v-if="options.originalLink != ''" class="itembox">
      <h5>原文链接:</h5>
      <p>{{data[options.originalLink]}}</p>
    </div>
    <div v-if="list.length != 0" class="itembox">
      <h5>附件列表:</h5>
      <p class="listbox">
        <span style="cursor:pointer" v-for="(item, index) in list" :key="index" @click="openViewFile(item.fileName,item.fileUrl)">{{item.fileName}}</span>
      </p>
    </div>
    <div v-if="isShow">
      <!-- 预览 -->
      <el-dialog
                 title="文件预览"  class="dialogTitle el-preview"
                 append-to-body="append-to-body"
                 :visible.sync="isShow">
        <div class="pdf-cont" style="width: 860px;" v-if="isShowPdf">
          <pdf-preview :title="fileName" :dataFlow="src"  style="width: 860px; height: 100%; margin-top: -10px; overflow: hidden;"></pdf-preview>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import {Loading} from "element-ui";
import pdfPreview from "@/components/pdfPreview/PdfPreview";
import {
  getCommentPreviewList,
  getCommentPreview,
  getCommentFileMenudata,
  getCommentFileMenu,
  getPreviewBase64
} from '@/api/comment'
export default {
  components: { pdfPreview },
  name: 'show-info',
  props:{
    data: {},
    list: {
      type: Array,
      default: () => []
    },
    options: {
      title: "",
      content: "",
      originalLink: "",
      banner: "",
      sort: ""
    },
  },
  data(){
    return {
      isShowPdf: false,
      src: "",
      isShow: false
    }
  },
  watch: {
    src(val) {
      if(val) {
        this.isShowPdf = false;
        this.$nextTick(() => {
          // 在此处执行你要执行的函数
          this.isShowPdf = true;
        });
      }
    },
  },
  methods:{
    openViewFile(name,url){
      let file = {
        fileName: name,
        fileUrl: url
      }
      this.review(file)
    },
    review(val) {
      console.log(val);
      let file = {
        fileUrl: null
      }
      if(typeof val == 'string') {
        file.fileUrl = val;
      } else {
        let fileText = /\.(doc|docx|xls|xlsx|csv|ppt|pptx|pdf|txt|tif|tiff|db|zip|rar|psd|wps|et|ett|jpg|png)(\?.*)?$/.test(val.fileName.toLocaleLowerCase());
        let fileExtension = val.fileName.substring( val.fileName.lastIndexOf('.') + 1);
        if(!fileText) return this.$message.warning(`以.${fileExtension}结尾的文件类型不支持预览`);
        this.fileName = val.fileName;
        file.fileUrl = val.fileUrl;
      }
      let loadingInstance = Loading.service({
        text: '正在努力加载中...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      getPreviewBase64(file).then(resrc => {
        if(resrc.data.code == 1) {
          this.src = resrc.data.data;
          this.isShow = true;
        } else {
          this.$message.warning(resrc.data.msg);
        }
        this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
          loadingInstance.close();
        });
      })
    }
  },
}
</script>
<style lang="scss" scoped>
.itembox {
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  padding: 20px 0;
  border-bottom: 1px dashed #c4c9d0;
  h5 {
    display: block;
    flex-wrap: nowrap;
    width: 80px !important;
    font-size: 14px;
    color: #333;
  }
  p {
    display: block;
    line-height: 20px;
    width: 720px;
    word-wrap:break-word;
  }
  .imgbox, .listbox {
    width: 760px;
  }
  .imgbox /deep/ img {
    width: 760px !important;
  }
  .listbox span {
    margin-right: 20px;
    margin-bottom: 4px;
    display: inline-block;
    border-bottom: 1px solid #c4c9d0;
  }
}
</style>
