<template>
  <div id="global-uploader">
    <uploader
      ref="uploader"
      :options="uploadOptions"
      :autoStart="false"
      @file-added="onFileAdded"
      @file-removed="onFileRemoved"
      @file-success="onFileSuccess"
      @file-progress="onFileProgress"
      @file-error="onFileError"
      @complete="onComplete"
      class="uploader-app"
    >
      <uploader-unsupport></uploader-unsupport>
      <uploader-drop>
        <uploader-btn
          id="global-uploader-btn"
          ref="uploadBtn"
          :attrs="attrs"
          @click.native="clickBtn(0)"
          >选择文件</uploader-btn
        >
        <uploader-btn
          id="global-uploader-folder"
          :attrs="attrs"
          directory
          ref="uploadFolder"
          @click.native="clickBtn(1)"
          >选择文件夹</uploader-btn
        >
      </uploader-drop>
      <uploader-list v-show="panelShow">
        <div
          class="file-panel"
          slot-scope="props"
          :class="{ collapse: collapse }"
        >
          <ul class="file-list">
            <li v-for="file in props.fileList" :key="file.id">
              <div>
                <uploader-file
                  :class="'file_' + file.id"
                  ref="files"
                  :file="file"
                  :list="true"
                ></uploader-file>
              </div>
            </li>
            <div class="no-file" v-if="!props.fileList.length">
              <i class="iconfont icon-empty-file"></i> 暂无待上传文件
            </div>
          </ul>
        </div>
      </uploader-list>
    </uploader>
  </div>
</template>

<script>
import { merge } from "@/api/resource_list";
import { ACCEPT_CONFIG } from "./js/config";
import Bus from "./js/bus";
import SparkMD5 from "spark-md5";
/* eslint-disable */
export default {
  name: "HelloWorld",
  data() {
    return {
      uploadOptions: {
        // 测试环境
        target: "//132.10.10.42:8765/yzyjy/chunk",
        chunkSize: 2 * 1024 * 1024,
        testChunks: true,
        checkChunkUploadedByResponse: function (chunk, message) {
          // 判断是否是已经上传过的文件
          let objMessage = JSON.parse(message);
          // skipUpload = 1的时候说明已经上传过
          if (objMessage.data.skipUpload == 1) {
            return true;
          } else {
            let chunkNumbers = objMessage.data.chunkNumbers;
            return (chunkNumbers || []).indexOf(chunk.offset + 1) >= 0;
          }
        },
        headers: {},
        query() {},
      },
      attrs: {
        accept: ACCEPT_CONFIG.getAll(),
      },
      panelShow: false, //选择文件后，展示上传panel
      collapse: false,

      filesList: [],
      allUploadFiles: [],
      SuccessFiles: [],
      btnType: 0,
      fileNum: 0,
    };
  },
  computed: {
    //Uploader实例
    uploader() {
      return this.$refs.uploader.uploader;
    },
  },
  mounted() {
    Bus.$on("submitFile", () => {
      this.uploader.files.forEach((item, index) => {
        if (item.name.startsWith(".")) {
          this.uploader.files.splice(index, 1);
        }
      });
      if (this.uploader.files.length > 0) {
        for (let i = 0; i < this.uploader.files.length; i++) {
          this.uploader.files[i].resume();
        }
      }
    });
  },
  methods: {
    clickBtn(par) {
      Bus.$emit("fileAddFolder", par);
      this.btnType = par;
    },
    onFileAdded(file) {
      // 每次添加一个文件，需要转md5，转码结束再传输到应用页面
      this.computeMD5(file)
        .then((res) => {
          this.filesList = JSON.parse(JSON.stringify(this.uploader.fileList));
          if (this.btnType == 1) {
            this.btnType = 0;
            let path = this.uploader.fileList[this.uploader.fileList.length - 1]
              .path;
            this.open(path);
          }

          if (!file.name.startsWith(".")) {
            this.allUploadFiles.push(file);
            this.$emit("fileAdded", file, this.filesList, this.allUploadFiles);
            this.panelShow = true;
          }
        })
        .catch((err) => {
          this.$message.error(err.msg);
        });
    },
    onFileRemoved(file) {
      let folderFiles = this.removeFiles(file, this.allUploadFiles);
      if (this.allUploadFiles.length != 0) {
        if (file.isFolder) {
          folderFiles.forEach((item) => {
            this.allUploadFiles.splice(
              this.allUploadFiles.findIndex(
                (v) => v.relativePath == item.relativePath
              ),
              1
            );
            this.SuccessFiles.splice(
              this.SuccessFiles.findIndex(
                (v) => v.relativePath == item.relativePath
              ),
              1
            );
          });
        } else {
          this.allUploadFiles.splice(
            this.allUploadFiles.findIndex(
              (v) => file.relativePath == v.relativePath
            ),
            1
          );
          this.SuccessFiles.splice(
            this.SuccessFiles.findIndex(
              (v) => file.relativePath == v.relativePath
            ),
            1
          );
        }
      }
      this.filesList = JSON.parse(JSON.stringify(this.uploader.fileList));
      this.$emit("fileRemove", file, this.filesList, this.allUploadFiles);
      if (this.uploader.fileList.length == 0) {
        this.panelShow = false;
      }
    },
    onFileProgress(rootFile, file, chunk) {
      let size = this.uploader.sizeUploaded(); // 获取当前已上传的文件大小
      let allSize = this.uploader.getSize(); // 获取上传所有文件总大小
      let result = 0;
      result = Math.round((size / allSize) * 100);
      Bus.$emit("fileProgress", result, allSize);
    },
    onFileSuccess(rootFile, file, response, chunk) {
      let res = JSON.parse(response);
      console.log(res, file);
      if (res == null) return;
      // res.code为1说明是已经上传过的文件，return跳出，不再merge
      if (res.code == 1 && res.data.fileMap) {
        let result = JSON.parse(JSON.stringify(res.data.fileMap));
        this.SuccessFiles.push(result);
        Bus.$emit("fileSuccess", result);
      } else {
        // 没上传过的进行之后步骤，merge并提交新文件
        const formData = new FormData();
        formData.append("identifier", file.uniqueIdentifier);
        formData.append("filename", file.name);
        merge(formData).then((response1) => {
          let mergeResult = JSON.parse(JSON.stringify(response1.data.data));
          this.SuccessFiles.push(mergeResult);
          Bus.$emit("fileSuccess", mergeResult);
        });
      }
    },
    onComplete() {
      setTimeout((_) => {
        // 异步上传所以不得不添加一个延迟
        // 文件上传成功后，后端返回的文件路径数据中是无法读取客户端文件本地路径的，所以需要前端添加
        this.allUploadFiles.forEach((el) => {
          for (let i = 0; i < this.SuccessFiles.length; i++) {
            let item = this.SuccessFiles[i];
            if (item.fileName === el.name && item.relativePath === null) {
              item.relativePath = el.relativePath;
              return;
            }
          }
        });
        if (this.allUploadFiles.length == this.SuccessFiles.length) {
          Bus.$emit("fileComplete", this.SuccessFiles, this.uploader.getSize());
        } else {
          let arr = this.failFile(this.SuccessFiles, this.allUploadFiles);
          let str = arr.join(",");
          Bus.$emit("fileComplete", { msg: str });
        }
      }, 1000);
    },
    onFileError(rootFile, file, response, chunk) {
      console.log(response);
      Bus.$emit("fileError", { msg: file.name });
    },
    // 文件夹文件条数提醒
    open(path) {
      let num = 0;
      this.uploader.files.forEach((item) => {
        if (item.relativePath.startsWith(path)) {
          num++;
        }
      });
      if (num >= 20) {
        this.$alert(`此文件夹将有${num}条文件上传到系统。`, "提示", {
          confirmButtonText: "确定",
          type: "info",
        })
          .then(() => {})
          .catch(() => {});
      }
    },
    removeFiles(folder, files) {
      let folderFiles = files.filter((item, index) => {
        return item.relativePath.startsWith(folder.name);
      });
      return folderFiles;
    },
    // 找上传出错误的文件
    failFile(suc, upload) {
      let arr = [];
      upload.forEach((item) => {
        let isInner = true;
        suc.forEach((file) => {
          if (file.relativePath == item.relativePath) {
            isInner = false;
          }
        });
        if (isInner) arr.push(item.name);
      });
      return arr;
    },
    /**
     * 计算md5，实现断点续传及秒传
     * @param file
     */
    computeMD5(file) {
      return new Promise((relove, reject) => {
        let fileReader = new FileReader();
        let time = new Date().getTime();
        let md5 = "";
        file.pause();
        fileReader.readAsArrayBuffer(file.file);
        fileReader.onload = (e) => {
          if (file.size != e.target.result.byteLength) {
            this.error(
              "Browser reported success but could not read the file until the end."
            );
            return reject({
              msg: `${file.name}文件转码失败, 浏览器错误，请刷新浏览器后重试！`,
            });
          }
          md5 = SparkMD5.ArrayBuffer.hash(e.target.result);
          // 添加额外的参数
          this.uploader.opts.query = {
            ...this.params,
          };

          file.uniqueIdentifier = md5;
          // file.resume();
          return relove(file);
        };
        fileReader.onerror = () => {
          this.error(
            "FileReader onerror was triggered, maybe the browser aborted due to high memory usage."
          );
          return reject({
            msg: `${file.name}文件转码失败, 浏览器内存饱和，请关掉不必要的页面重试！`,
          });
        };
      });
    },
    fileListShow() {
      let $list = $("#global-uploader .file-list");
      if ($list.is(":visible")) {
        $list.slideUp();
        this.collapse = true;
      } else {
        $list.slideDown();
        this.collapse = false;
      }
    },
    close() {
      this.uploader.cancel();
      this.panelShow = false;
    },
    error(msg) {
      this.$notify({
        title: this.$t("c.false"),
        message: msg,
        type: "error",
        duration: 2000,
      });
    },
  },
  destroyed() {
    Bus.$off("submitFile");
  },
};
</script>
<style lang="scss" scoped>
#global-uploader {
  .uploader-drop {
    border: none;
    margin: 0;
    padding: 0;
    background-color: #fff;
    .uploader-btn {
      font-size: 14px;
      height: 26px;
    }
  }
  .file-panel {
    background-color: #fff;
    border: 1px solid #e2e2e2;
    .file-title {
      display: flex;
      height: 40px;
      line-height: 40px;
      padding: 0 15px;
      border-bottom: 1px solid #ddd;
      .operate {
        flex: 1;
        text-align: right;
      }
    }
    .file-list {
      position: relative;
      overflow-x: hidden;
      overflow-y: auto;
      background-color: #fff;
      > li {
        background-color: #fff;
      }
    }
    &.collapse {
      .file-title {
        background-color: #e7ecf2;
      }
    }
  }
  .no-file {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 16px;
  }
  /deep/ .uploader-file-icon {
    // display: none;
    margin-top: 8px;
    margin-right: 0;
    background-size: 12px 12px;
    &:before {
      content: "" !important;
    }
    &[icon="image"] {
      background: url(images/image-icon.png) no-repeat;
      background-size: 14px 14px;
    }
    &[icon="video"] {
      background: url(images/video-icon.png) no-repeat;
      background-size: 14px 14px;
    }
    &[icon="document"] {
      background: url(images/text-icon.png) no-repeat;
      background-size: 14px 14px;
    }
    &[icon="unknown"] {
      background: url(images/text-icon.png) no-repeat;
      background-size: 14px 14px;
    }
    &[icon="folder"] {
      background: url(images/folder-icon.png) no-repeat;
      background-size: 14px 14px;
    }
  }
  /deep/ .uploader-file-info {
    font-size: 12px;
  }
  /deep/ .uploader-file-status {
    width: 30%;
  }
  /deep/ .uploader-file-actions {
    width: 4%;
  }
  /deep/ .uploader-file-actions > span {
    margin-top: 6px;
  }
  /* 文件夹上传插件样式 */
  /deep/ .uploader-file[status="waiting"] .uploader-file-pause,
  /deep/ .uploader-file[status="uploading"] .uploader-file-pause {
    display: none;
  }
  /deep/ .uploader-file[status="paused"] .uploader-file-resume {
    display: none;
  }
  /deep/ .uploader-file[status="error"] .uploader-file-retry {
    display: block;
  }
  /deep/ .uploader-file[status="success"] .uploader-file-remove {
    display: block;
  }
  /deep/ .uploader-btn {
    color: #fff;
    border: none;
    background-color: #009a52;
  }
  /deep/ .uploader-btn:hover {
    background-color: #127714;
  }
  .uploader-file {
    height: 30px;
    line-height: 30px;
    border: none;
  }
  /deep/ .uploader-file-name {
    width: 95%;
  }
  /deep/ .uploader-file-size {
    display: none;
  }
  /deep/ .uploader-file-status {
    display: none;
  }
  /deep/ .uploader-file-meta {
    display: none;
  }
}
#global-uploader-folder {
  margin-left: 10px;
}
/* 隐藏上传按钮 */
/*#global-uploader-btn {*/
/*position: absolute;*/
/*clip: rect(0, 0, 0, 0);*/
/*}*/
</style>
