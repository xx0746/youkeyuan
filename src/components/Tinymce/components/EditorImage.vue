<template>
  <div class="upload-container">
    <el-button style="height:26px;" :style="{background:color,borderColor:color}" icon="el-icon-upload" size="mini" type="primary" @click="images()">
      图片上传
    </el-button>
    <el-dialog title="图片上传" class="upload-dialog" :showClose="false" :visible.sync="dialogVisible" :close-on-click-modal="false" v-if="imagesshow">
      <el-upload
        :multiple="true"
        :file-list="fileList"
        :show-file-list="true"
        :on-remove="handleRemove"
        :on-success="handleSuccess"
        :http-request="handleUpload"
        :before-upload="beforeUpload"
        class="editor-slide-upload"
        action="https://httpbin.org/post"
        list-type="picture-card"
        >
        <i class="el-icon-plus"></i>
      </el-upload>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary4" size="small" @click="handleCancel">
          取消
        </el-button>
        <el-button type="primary" size="small" style="margin-left:50px;" @click="handleSubmit">
          确认
        </el-button>
      </span>  
    </el-dialog>
  </div>
</template>

<script>
import { Upload } from '@/api/dynamicList.js'
export default {
  name: 'EditorSlideUpload',
  props: {
    color: {
      type: String,
      default: '#1890ff'
    }
  },
  data() {
    return {
      imagesshow:false,
      dialogVisible: false,
      listObj: {},
      fileList: []
    }
  },
  methods: {
    images(){
      this.dialogVisible = true;
      this.imagesshow = true;
    },
    checkAllSuccess() {
      return Object.keys(this.listObj).every(item => this.listObj[item].hasSuccess)
      console.log(this.listObj)
    },
    handleSubmit() {
      const arr = Object.keys(this.listObj).map(v => this.listObj[v])
      if (!this.checkAllSuccess()) {
        this.$message('请等待所有图片上传成功 或 出现了网络问题，请刷新页面重新上传！')
        return
      }
      this.$emit('successCBK', arr)
      this.listObj = {}
      this.fileList = []
      this.dialogVisible = false;
      this.imagesshow = false;
      
    },
    handleSuccess(response, file) {
      console.log(response)
      console.log(file)
      const uid = file.uid
      const objKeyArr = Object.keys(this.listObj)
      for (let i = 0, len = objKeyArr.length; i < len; i++) {
        if (this.listObj[objKeyArr[i]].uid === uid) {
          this.listObj[objKeyArr[i]].url = response.data.fileUrl
          this.listObj[objKeyArr[i]].hasSuccess = true
          return
        }
      }
    },
    handleRemove(file) {
      console.log(file)
      const uid = file.uid
      const objKeyArr = Object.keys(this.listObj)
      for (let i = 0, len = objKeyArr.length; i < len; i++) {
        if (this.listObj[objKeyArr[i]].uid === uid) {
          delete this.listObj[objKeyArr[i]]
          return
        }
      }
    },
    beforeUpload(file) {
      console.log('-----beforeUpload-----'+file)
      console.log(file)
      const _self = this
      const _URL = window.URL || window.webkitURL
      const fileName = file.uid
      this.listObj[fileName] = {}
      return new Promise((resolve, reject) => {
        const img = new Image()
        img.src = _URL.createObjectURL(file)
        img.onload = function() {
          _self.listObj[fileName] = { hasSuccess: false, uid: file.uid, width: this.width, height: this.height }
        }
        resolve(true)
      })
    },
    handleUpload(item) {
      let fd = new FormData();
      fd.append("file", item.file, item.fileName);
        Upload(fd).then(res => {
          console.log('-----handleUpload-----'+item)
          console.log(item)
          if (res.data.code !== 1) {
            this.$message.error(res.data.msg);
          } else {
            this.handleSuccess(res.data,item.file)
          }
        })
    },
    handleCancel(response, file){
      this.fileList = []
      this.listObj = {}
      this.dialogVisible = false;
      this.imagesshow = false;
      console.log("-----handleCancel-----"+response)
      console.log(response)
      console.log(file)
    }
  }
}
</script>

<style scoped>
.editor-slide-upload {
  margin-bottom: 20px;
}
.editor-slide-upload >>> .el-upload--picture-card {
  width: 100%;
}
.upload-dialog /deep/ .el-dialog {
  width: 51%;
}
.el-upload--picture-card:hover, .el-upload:focus {
    border-color: #009A52;
    color: #009A52;
}
</style>
