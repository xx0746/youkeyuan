<template>
  <div>
    <div class="title-style">
      <span class="fontStyle" v-if="title != ''">{{title}}</span>
      <span class="fontStyle" v-if="name != ''">上传人：{{name}}</span>
    </div>
    <ul class="file_list" v-show="data.length !== 0">
      <li v-for="(file, index) in data" :key="index">
        <span :class="file.fileName | fileIcon"></span>
        <a class="file_name" :title="file.fileDir">{{file.fileDir}}</a>
        <span class="file_actions" @click="Preview(file)">
          <i class="el-icon-view"></i>
        </span>
      </li>
    </ul>
    <ul class="file_list" v-show="data.length == 0">
      <li>
        暂无文件。。。
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'file-list',
  props: {
    data: {
      type: Array,
      default: []
    },
    title: {
      type: String,
      default: ''
    },
    name: {
      type: String,
      default: ''
    },
  },
  data() {
    return {
      url: 'http://132.10.10.42:8012/onlinePreview?url='
    }
  },
  filters: {
    fileIcon(val) {
      let value = val.toLocaleLowerCase()
      let fileText = /\.(doc|docx|xls|xlsx|csv|ppt|pptx|pdf|txt|tif|tiff|db|zip|rar|psd|wps|et|ett|jpg|png)(\?.*)?$/.test(value)
      let fileImg = /\.(png|jpg|jpeg|gif|bmp)(\?.*)?$/.test(value)
      let fileVideo = /\.(mp4|rmvb|mkv|wmv|flv|mov)(\?.*)?$/.test(value)
      if(fileImg) {
        return 'file_img'
      } else
      if(fileVideo) {
        return 'file_video'
      } else {
        return 'file_text'
      }
    }
  },
  updated() {

  },
  methods: {
    Preview(file) {
      let value = file.fileUrl.toLocaleLowerCase()
      console.log(value)
      let fileText = /\.(txt)(\.*)?$/.test(value)
      if(fileText) {
        // this.$message.warning('.txt文件暂不支持预览！')
        this.getPreview(file.fileName, file.fileUrl);
      } else {
        this.$emit('onPreview', file);
      }
    },
    getPreview(name, href) {
      var a = document.createElement("a"), //创建a标签
      e = document.createEvent("MouseEvents"); //创建鼠标事件对象
      e.initEvent("click", false, false); //初始化事件对象
      a.href = href; //设置地址
      a.target = "_blank";
      a.dispatchEvent(e); //给指定的元素，执行事件click事件
    },
  }
}
</script>

<style lang="scss" scoped>
.title-style {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #333333;
  .fontStyle {
    display: inline-block;
    margin-bottom: 10px;
  }
  span {
    font-size: 12px;
  }
}
.file_list {
  width: 100%;
  border: 1px solid #ddd;
  li {
    width: 100%;
    height: 30px;
    line-height: 30px;
    font-size: 12px;
    padding: 0 4px;
    display: flex;
    align-items: center;
    span {
      height: 30px;
    }
    &:nth-child(even) {
      background-color: #f3f3f3;
    }
  }
  li:hover {
    background-color: #fafafa;
  }

  .file_text {
    background: url(./images/text-icon.png) no-repeat center;
  }
  .file_img {
    background: url(./images/image-icon.png) no-repeat center;
  }
  .file_video {
    background: url(./images/video-icon.png) no-repeat center;
  }
  .file_text, .file_img, .file_video {
    display: inline-block;
    width: 6%;
    background-size: 14px;
  }

  .file_name {
    display: inline-block;
    width: 86%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .file_actions {
    cursor: pointer;
    display: inline-block;
    width: 5%;
    text-align: right;
    i {
      font-size: 14px;
      vertical-align: middle;
    }
    i:hover {
      color: #009A52;
    }
  }
  .el-icon-close {
    display: inline-block;
    width: 16px;
    height: 16px;
    font-size: 16px;
    font-weight: 700;
    color: #888;
    cursor: pointer;
  }
}
</style>
