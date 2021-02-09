<template>
  <div
    v-loading="fileLoading"
    :element-loading-text="progress"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)"
  >
    <div class="title">人工上传</div>
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      label-width="90px"
      style="margin-top:20px;width:80%;margin-left:30px;"
    >
      <el-form-item label="选择资源目录" label-width="120px" required>
        <el-cascader
          :options="options"
          change-on-select
          expand-trigger="hover"
          @change="sel"
          v-model="values">
        </el-cascader>
      </el-form-item>
      <el-form-item label="选择文件" label-width="120px" required>
        <global-uploader v-if="isShowUpdom" ref="upload" @fileAdded="fileAdd" @fileRemove="fileRemove"></global-uploader>
      </el-form-item>
      <el-form-item label="下载是否审核" label-width="120px" required>
        <template>
          <el-radio v-model="form.dataOne" label="1">是</el-radio>
          <el-radio v-model="form.dataOne" label="2">否</el-radio>
        </template>
      </el-form-item>
      <el-form-item prop="title" label="名称" label-width="120px">
        <el-input maxlength="50" clearable v-model="form.title"></el-input>
      </el-form-item>
      <el-form-item style>
        <el-button
          style="margin-left:30px;"
          type="primary"
          size="small"
          @click="addForm"
          :loading="Publish"
        >提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  import { addform,getlabelListAllData,getDownloadIsAudit } from "@/api/manualupload";
  import Bus from "@/components/uploader/js/bus";
  import globalUploader from "@/components/uploader/globalUploader.vue";
  import { isInteger,typePureSpace } from "@/utils/elValidate"; // 引入自定义校验方法

  export default {
    components: {
      globalUploader
    },
    //app.vue注入局部刷新该组件，调用在需要刷新该组件的地方this.reload()
    inject: ['reload'],
    data() {
      return {
        Publish:false,
        filelistdata: true,
        // 上传组件上传动画
        fileLoading: false,
        progress: "0%",
        // 下拉选择库
        value: "",
        values: [],
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
        options: [],
        result: {
          fileUrl: "",
          fileName: "",
          fileSize: null,
          fileDirs: []
        },
        isAudit:'',
        form: {
          title: "",
          dataOne: "",
          dataThree: "",
          fileDirs: [],
          fileSize: null,
        },
        rules: {
          title: [
            { required: true, message: '请输入名称', trigger: 'blur' },
            { validator: typePureSpace,message: "输入不可以为纯空格", trigger: "blur" }
          ],
        },
        filesList: [],
        isShowUpdom: true
      };
    },
    mounted() {
      this.getLeftTreeData();
      this.getDownloadAudit();
      Bus.$on("fileAddFolder", data => {
        this.btnType = data;
      });
      // 文件添加和删除的回调
      Bus.$on("fileAdded", (res, state) => {
        if (res instanceof Array) {
          this.filesList = res;
          if(this.btnType == 1 && state == 'add') {
            this.fileNum++;
            this.open(this.fileNum);
          }
          //删除的回调函数
          if(state == 'remove' && this.successFiles.length != 0) {
            let removeFiles = this.removeFile(this.filesList, this.successFiles);
            removeFiles.forEach(item => {
              this.successFiles.splice(this.successFiles.findIndex((v) => v.fileName == item.fileName), 1);
              this.result.fileDirs.splice(this.result.fileDirs.findIndex((v) => v.filename == item.fileName), 1);
            })
          }
          this.beforeChangeList(res);
        }
      });
    },
    methods: {
      getDownloadAudit(){
        let params = {
          type : 1
        }
        getDownloadIsAudit(params).then(res => {
          this.isAudit = res.data.data;
          this.form.dataOne = res.data.data
        });
      },
      fileAdd(file, fileList) {
        this.filesList = fileList;
        this.beforeChangeList(fileList);
      },
      fileRemove(file, fileList) {
        this.filesList = fileList;
        this.beforeChangeList(fileList);
      },
      uploadFileList() {
        Bus.$emit("submitFile");
        return new Promise((resolve, reject) => {
          this.fileLoading = true;
          // 上传进度监听
          Bus.$on("fileProgress", (num, res) => {
            this.progress = num + "%";
          });
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
            return reject({ code: 0, res })
            this.fileLoading = false;
          })
        });
      },
      // 上传钩子函数
      beforeChangeList(fileList) {
        if (fileList.length > 0) {
          this.form.title = fileList[0].name;
        } else {
          this.form.title = '';
        }
      },
      beforeChange(fileList) {},
      // 上传限制文件数
      handleExceed(files, fileList) {
        this.$message.warning(
          `当前限制选择 15 个文件，本次选择了 ${
            files.length
          } 个文件，共选择了 ${files.length + fileList.length} 个文件`
        );
      },
      //点击提交
      addForm(){
        var _this = this;
        if (this.value <= 0) {
          this.Publish = false
          return this.$message.warning("请选择对应的资源目录！");
        } 
        if (this.filesList.length == 0) {
          this.Publish = false
          return this.$message.warning("请选择上传文件！");
        }
        this.$refs.form.validate(valid => {
          if (valid) {
            this.Publish = true;
            this.uploadFileList()
            .then(response => {
              console.log(response)
              if(response.fileDirs.length != 0){
                this.form.fileDirs = response.fileDirs;
                this.form.fileSize = response.fileSize;
                addform(this.form).then(function(res) {
                  if (res.data.code == 1) {
                    _this.$message.success('提交成功！');
                    _this.isShowUpdom = false;
                    _this.Publish = false;
                    _this.fileLoading = false;
                    _this.$nextTick(_=> {
                      _this.isShowUpdom = true;
                    })
                    _this.reloadPage()
                    _this.clear();
                  } else {
                    // code为-2时标题名已经存在
                    _this.$alert(res.data.msg, "提示", {
                      type: "error"
                    });
                    _this.Publish = false;
                    _this.fileLoading = false;
                  }
                });
              }else{
                this.Publish = false;
                this.fileLoading = false;
                this.$message.error(`文件传参失败，请重新上传所有文件！`);
              }
            })
            .catch(err => {
              this.Publish = false;
              this.fileLoading = false;
              this.$confirm(`${err.msg}文件上传失败, 请点击确定刷新页面之后上传或点击取消删除此文件重试！`, "提示", {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: "error"
              }).then(_=>{
                this.isShowUpdom = false;
                this.Publish = false;
                this.fileLoading = false;
                this.$nextTick(_=> {
                  this.isShowUpdom = true;
                })
                this.reloadPage()
                this.clear();
                // this.addForm();
              }).catch(_=>{
                this.$message.info('请删除错误文件！');
              });
            });
          } else {
            return false;
          }
        });
      },
      // 获取标签
      getLeftTreeData() {
        getlabelListAllData().then(res => {
          this.options = res.data.data[0].children;
        });
      },
      sel(val) {
        this.clear();
        let id = val[0];
        this.value = id;
        this.form.dataThree = val[val.length - 1];
        this.beforeChangeList(this.filesList);
      },
      // 局部组件刷新
      reloadPage() {
        this.filesList = [],
        this.result = {
          fileUrl: "",
          fileName: "",
          fileSize: null,
          fileDirs: []
        },
        Bus.$off("fileSuccess")
        Bus.$off("fileProgress")
        Bus.$off("fileComplete")
        Bus.$off("fileError")
      },
      clear() {
        this.form = {
          dataOne: this.isAudit,
          dataThree: this.values[this.values.length-1],
          fileDirs:[],
          title:'',
          fileSize:null
        };
      },
    },
    destroyed() {
      Bus.$off("fileAddFolder");
      Bus.$off("fileAdded");
      Bus.$off("fileSuccess");
      Bus.$off("fileComplete");
      Bus.$off("fileProgress");
      Bus.$off("fileError");
    }
  };
</script>
<style scoped>
  li {
    margin: 0 !important;
    padding-right: 12px !important;
  }

  .tag-hidden {
    display: none;
  }
</style>
