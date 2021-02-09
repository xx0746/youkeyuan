<template>
  <div
    v-loading="fileLoading"
    :element-loading-text="progress"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)"
  >
    <el-form ref="form" :model="form" label-width="120px" :rules="formlist">
      <el-form-item label="所属资源目录" label-width="120px">
        <el-cascader
          :options="options"
          filterable
          change-on-select
          expand-trigger="hover"
          @change="sel"
          v-model="values"
        ></el-cascader>
      </el-form-item>
      <el-form-item label="选择文件" label-width="120px">
        <global-uploader @fileAdded="fileAdd" @fileRemove="fileRemove"></global-uploader>
        <div>
          <h5>已有文件列表</h5>
          <ul class="file_list">
            <li v-for="(file, index) in oldFilesList" :key="index">
              <span :class="file.fileName | fileIcon"></span>
              <a class="file_name" :title="file.fileDir">{{file.fileDir}}</a>
              <span class="file_actions" @click="review(file)">
                <i class="el-icon-view"></i>
              </span>
              <span class="file_close" @click="delFile(index)">
                <i class="el-icon-close"></i>
              </span>
            </li>
            <div class="no-file" v-if="!oldFilesList.length">
              <i class="iconfont icon-empty-file" style="padding-left: 16px"></i> 暂无待上传文件
            </div>
          </ul>
        </div>
        <div v-show="unpassFilesList.length !== 0">
          <h5>驳回文件列表</h5>
          <file-list
            :data="unpassFilesList"
            @onPreview="review"
            class="file-list">
          </file-list>
        </div>
      </el-form-item>
      <el-form-item label="下载是否审核" label-width="120px">
        <template>
          <el-radio-group v-model="form.dataOne" @change="showValue">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="2">否</el-radio>
          </el-radio-group>
        </template>
      </el-form-item>
      <el-form-item prop="title" label="名称" label-width="120px">
        <el-input maxlength="50" clearable v-model="form.title" @change="showValue"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" class="btn-width" size="small" :disabled="disabled"  @click="resetSubmit">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  import { Loading } from "element-ui";
  import { getFromMenuId, resetFormInterface } from "@/api/resetupload";
  import { getlabelListAllData } from "@/api/manualupload";
  import { getresource, getreSourceFiles } from "@/api/resource_list";
  import Bus from "@/components/uploader/js/bus";
  import globalUploader from "@/components/uploader/globalUploader.vue";
  import fileList from "@/components/fileList/fileList";
  import { isInteger, typePureSpace } from "@/utils/elValidate"; // 引入自定义校验方法
  export default {
    name: "new-reset-upload",
    components: {
      globalUploader,
      fileList
    },
    props: ["datas"],
    data() {
      return {
        // 预览
        fileName: "",
        // 上传组件上传动画
        fileLoading: false,
        progress: "0%",
        // 下拉选择库
        values: [],
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
        options: [],
        form: {
          dataOne: null,
          dataThree:"",
          fileDirs: [],
          fileLists: [],
          title:'',
          fileSize: null,
        },
        formlist: {
          title: [
            { required: true, message: "请输入名称", trigger: "blur" },
            { validator: typePureSpace,message: "输入不可以为纯空格", trigger: "blur" }
          ],
        },
        filesList: [],
        allUploadFiles: [],
        oldFilesList: [],
        btnType: 0,
        fileNum: 0,
        result: {
          fileUrl: "",
          fileName: "",
          fileSize: null,
          fileDirs: [],
          oldFilesList: []
        },
        unpassFilesList: [],
        menuId:'',
        isAdit: false,
        flag:{
          isAudit : false,
          isUpload : false
        },
        disabled: false
      };
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
    mounted() {
      this.getLeftTreeData();
      this.EchoDisplay();
    },
    methods: {
      EchoDisplay() {
        getresource(this.datas).then(res => {
          if (res.data.code == 1) {
            let resObj = res.data.data;
            this.menuId = this.datas.value;
            console.log(resObj);
            if(this.menuId == null) return this.$message.warning("所属资源目录层级为空，此条数据有误！");
            // 获取所属资源目录
            getFromMenuId(this.menuId).then(result => {
              if(result.data.code == 1) {
                this.values = result.data.data.menuArray.split(",").map(item => {
                  return Number(item);
                });
                this.form={...this.form,...resObj}
              } else {
                this.$message.error(result.data.msg);
              }
            })
            // 获取文件列表
            let filesParam = {
              resourceId: this.datas.resourceId,
              type: this.datas.type,
              state: resObj.state
            };
            getreSourceFiles(filesParam).then(res => {
              if (res.data.code == 1) {
                let newarr = res.data.data;
                this.oldFilesList = newarr.filter(item => item.state===1);
                this.unpassFilesList = newarr.filter(item => item.state===-1);
                console.log(this.oldFilesList)
              } else {
                this.$message.error(res.data.msg);
              }
            });
          } else {
            this.$message.warning(res.data.msg);
          }
        });
      },
      // 文件夹文件条数提醒
      open(num) {
        if(num >= 20) {
          this.$confirm(`此文件夹将有${num}条文件上传到系统。`, '提示', {
            confirmButtonText: '确定',
            type: 'info'
          }).then(() => {
            this.fileNum = 0;
          })
        }
      },
      fileAdd(file, fileList, files) {
        this.filesList = fileList;
        this.allUploadFiles = files;
        this.disabled = false;
        this.isAdit = false;
      },
      fileRemove(file, fileList, files) {
        this.filesList = fileList;
        this.allUploadFiles = files;
        this.disabled = false;
        this.isAdit = false;
      },
      uploadFileList() {
        const that = this;
        return new Promise((resolve, reject) => {
          if(this.oldFilesList.length == 0 && this.filesList.length == 0) {
            return reject("文件不能为空，请选择文件！");
          }
          if (this.filesList.length == 0) {
            this.result.oldFilesList = this.oldFilesList;
            return resolve(this.result);
          } else {
            let warmsg = "";
            let array = [];
            array = this.allUploadFiles.filter((item, index) => {
              let i = null;
              this.oldFilesList.forEach((item1, index1) => {
                if (item.relativePath === item1.fileDir) {
                  i = index;
                }
              });
              if (i == index) {
                return item;
              }
            });
            if (array.length != 0) {
              warmsg = array.map(item => { return item.name; }).join(",");
              return reject({ msg: `【${warmsg}】等文件重复，在上传之前，请选择删除重复文件！` });
            } else {
              this.result.oldFilesList = this.oldFilesList;
            }
          }
          Bus.$emit("submitFile");
          this.fileLoading = true;
          // 上传进度监听
          Bus.$on("fileProgress", resul => {
            this.progress = resul + "%";
          });
          // 所有文件上传完成的监听
          Bus.$on("fileComplete", (succfiles, size) => {
            let Size = Math.round((size / 1024 / 1024) * 10000) / 10000;
            this.result.fileSize = Size;
            this.result.fileDirs = succfiles.map((res) => {
              return {
                filename: res.fileName, 
                fileUrl: res.fileUrl,
                relativePath: res.relativePath
              }
            })
            return resolve(this.result)
            this.fileLoading = false;
          });
          Bus.$on("fileError", res => {
            console.log(res);
            return reject({ code: 0, res })
            this.fileLoading = false;
          })
        });
      },
      // 获取目录
      getLeftTreeData() {
        getlabelListAllData().then(res => {
          this.options = res.data.data[0].children;
        });
      },
      // 删除已有列表中的某一项
      delFile(index) {
        this.disabled = false;
        this.isAdit = false;
        this.oldFilesList.splice(index, 1);
      },
      showValue() {
        this.isAdit = true;
      },
      isAditInfo() {
        if(this.isAdit || this.filesList != 0) {
          this.flag.isAudit = true;
          return this.flag;
        } else {
          this.flag.isAudit = false;
          return this.flag;
        }
      },    
      // 点击提交表单
      resetSubmit() {
        let _this = this;
        this.$refs.form.validate(valid => {
          if (valid) {
            this.flag.isUpload = true;
            this.disabled = true;
            this.uploadFileList()
              .then(response => {
                this.form.fileDirs = response.fileDirs;
                this.form.fileLists = response.oldFilesList;
                this.form.dataThree = this.menuId
                console.log(this.form)
                resetFormInterface(this.form).then(function(res) {
                  if (res.data.code == 1) {
                    _this
                      .$alert("提交成功", "提示", {
                        type: "success"
                      })
                      .then(() => {
                        _this.$store.commit("setDialog", 1);
                      });
                    _this.clear();
                    _this.$emit('showHistoryInterface')
                    _this.disabled = false;
                  } else {
                    _this.disabled = false;
                    if (res.data.code == -2) {
                      _this.$alert("该标题已存在", "提示", {
                        type: "error"
                      });
                    } else {
                      _this.$alert(res.data.msg, "提示", {
                        type: "error"
                      });
                    }
                  }
                  _this.flag = {
                    isAudit: false,
                    isUpload: false
                  }
                });
              })
              .catch(err => {
                if(err && err.code == 0) {
                  this.$message.warning(`${err.msg}文件上传失败，请删除文件后重试！`);
                } else {
                  this.$message.warning(err.msg)
                }
                this.disabled = false;
                this.flag.isUpload = false;
              });
          } else {
            return false;
          }
        });
      }, 
      review(file) {
        this.$emit('getfileInfo', file);
      },
      sel(val) {
        this.form.dataThree = this.values[this.values.length - 1];
        this.isAdit = true;
        console.log(this.form.dataThree)
      },
      clear() {
        this.form = {
          dataOne: "2",
          dataThree:"",
          fileDirs: [],
          fileLists: [],
          title:'',
        };
      }                        
    },
    destroyed() {
      Bus.$off("fileAdded");
      Bus.$off("fileSuccess");
      Bus.$off("fileComplete");
      Bus.$off("fileProgress");
    }
  };
</script>
<style rel="stylesheet/scss" lang="scss" scoped>

.file_list li {
  margin: 0 !important;
  padding-right: 4px !important;
}

.tag-hidden {
  display: none;
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
    }&:nth-child(even) {
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
    text-align: left;
    i {
      vertical-align: middle;
    }
    i:hover {
      color: #009A52;
    }
  }
  .file_close{
    cursor: pointer;
    display: inline-block;
    i {
      vertical-align: middle;
      font-size: 14px;
    }
    i:hover {
      color: #FF0000;
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
.no-file {
  font-size: 14px;
}

</style>


