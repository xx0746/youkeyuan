<template>
<div>
  <div class="title" style="margin-top:0px">图文发布</div>
  <el-form
    ref="form"
    :model="form"
    label-width="100px"
    style="width:80%;margin:20px 10%;"
    :rules="carRules"
    >
    <el-form-item  label="封面图片" class="redItem" prop="image" style="margin-top: -5px">
      <el-upload
        accept="image/*"
        class="upload-demo"
        ref="upload1"
        action="String"
        :on-change="uploadChange"
        :header="headerType"
        :with-credentials="true"
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        :onSuccess="handleSuccess"
        :auto-upload="false"
        :on-exceed="handleExceed"
        multiple
        :limit="1"
        :file-list="FileList"
      >
        <el-button slot="trigger" class="file_btn" size="mini" type="primary">选取文件</el-button>
        <div>
          <div slot="tip" class="el-upload__tip">*建议图片最佳尺寸为636x184px,其他尺寸可能会引起变形</div>
        </div>

      </el-upload>

    </el-form-item>
    <el-form-item prop="bannerSort" label="排序位置" style="margin-top: -5px;">
      <el-input v-model="form.bannerSort"></el-input>
    </el-form-item>


    <el-form-item prop="title" label="图文标题" style="margin-top: -5px;">
      <el-input v-model="form.title"></el-input>
    </el-form-item>
    <el-form-item label="正文" style="margin-top: -5px;">
      <Tinymce :id = 'tinymceId' :value="form.content" origin="392" class="czm_input"/>
      <!-- <tinymce id="d1" v-model="form.content" :other_options="options" class="czm_input"></tinymce> -->
    </el-form-item>
    <el-form-item  label="原文链接" prop="originalLinked" style="margin-top: -5px;">
      <el-input v-model="form.originalLinked"></el-input>
    </el-form-item>
    <el-form-item style>
      <el-button type="primary" style="height: 32px"  @click="handleCreate" :loading="Publish">发布</el-button>
    </el-form-item>
  </el-form>
</div>
</template>

<script>
  import {
    getRotationData,
    insertCarousel,
    addImageText,
    handDelInterface
  } from "@/api/rotation";
  import { Upload, publish ,pictureUpload } from '@/api/dynamicList.js'
  import Tinymce from '@/components/Tinymce'
  import { typePureSpace } from "@/utils/elValidate"; // 引入自定义校验方法
    export default {
      data(){
        // 验证是否整数
        var isInteger = (rule, value, callback) => {
          if (!value) {
            return callback(new Error("输入不可以为空"));
          }
          debugger;
          setTimeout(() => {
            if (!Number(value)) {
              callback(new Error("请输入正整数"));
            } else {
              const re = /^[0-9]*[1-9][0-9]*$/;
              const rsCheck = re.test(value);
              if (!rsCheck) {
                callback(new Error("请输入正整数"));
              } else {
                callback();
              }
            }
          }, 100);
        };
        var gethttp = (rule, value, callback) =>{
          console.log(value,'shuju')
          if (value!=='') {
            setTimeout(() => {
              const reg = /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/;
              // const rsCheck = re.test(value);
              if (reg.test(value)) {
                callback();
              } else {
                callback(new Error("网址错误"));
              }
            }, 100);
          }else{
            callback();
          }
        }
        return{
          Publish:false,
          tinymceId: 'me',
          headerType: { "Content-Type": "multipart/form_data" },
          tablelist: [],
          dialogVisible: false,
          form: {
            carouselName:'',
            title:'',
            originalLinked:'',
            content:''
          },
          listQuery: {
            carouselName: "",
            pageNumber: 1
          },
          FileList: [],
          total: null,
          state: true,
          subDisabled: false,
          carRules: {
            originalLinked:[
              { required: false,validator: gethttp,message: "网址格式错误", trigger: "blur" }
            ],
            title: [
              { required: true, message: "请输入图文标题", trigger: "blur" },
              { validator: typePureSpace,message: "输入不可以为纯空格", trigger: "blur" }
            ],
            bannerSort: [
              { required: true, message: "请输入排序位置", trigger: "blur" },
              { validator: isInteger,message: "请输入正整数", trigger: "blur" }
            ]
          }
        }
      },
      components: {
        Tinymce
      },
      mounted() {
      },
      filters:{
        getState(value){
          var arr = ['展示','不展示']
          return arr[value-1]
        }
      },
      methods:{
        handleExceed(files, fileList){
          this.$message.error("只允许上传一张图片");
        },
        handleCreate() {
          var _this = this;
          // if (_this.form.carouselUrl == "") {
          //   _this.$message.error("请上传图片");
          //   return false;
          // }
          _this.getContent();

          if(this.form.bannerImg==undefined){
            _this.$message.error("请上传封面图片");
            _this.Publish = false;
            return false;
          }
          else if(this.form.originalLinked == ''){
            if(_this.form.content == undefined || _this.form.content == ''){
              _this.$message.warning("正文与原文链接必须有一项不能为空！");

            }else{
              _this.Uploaddata();
            }
          }else if(_this.form.content == undefined || _this.form.content == ''){
            if(_this.form.originalLinked == ''){
              _this.$message.warning("正文与原文链接必须有一项不能为空！");
            }else{
              _this.Uploaddata();
            }
          }else if(_this.form.originalLinked !== '' && _this.form.content !== undefined){
            _this.$message.warning("原文链接和正文只能填一项");
          }else{
            _this.Uploaddata();
          }

          // else if(this.form.originalLinked==''&&this.form.content==undefined){
          //   console.log(this.form.originalLinked+'------'+this.form.content,'不为空1');
          //   _this.Publish = false;
          //   // if(this.form.content == undefined ){
          //     _this.$message.error("正文与原文链接必须有一项不能为空！");
          //   //   _this.Publish = false;
          //   // }
          // }else if((this.form.originalLinked && !this.form.content) || (!this.form.originalLinked  && this.form.content)){
          //   _this.getContent();
          //   _this.$refs.form.validate(valid => {
          //     if (valid) {
          //       this.Publish = true;
          //       addImageText(_this.form).then(function(res) {
          //         if (res.data.code == 1) {
          //           _this.Publish = false;
          //           _this.$message.success('发布成功');
          //           _this.$router.push({
          //             path:'/notice/newRefresh',
          //             query:{type:3}
          //           })
          //         } else {
          //           _this.$message.error(res.data.msg);
          //           _this.Publish = false;
          //           return false;
          //         }
          //       });
          //     } else {
          //       return false;
          //     }
          //   });
          //
          // }else{
          //   console.log(this.form.originalLinked+'------'+this.form.content,'不为空2');
          //   _this.$message.error("原文链接和正文只能填一项！");
          //   _this.Publish = false;
          // }
        },
        Uploaddata(){
          var _this=this;
            _this.getContent();
            _this.$refs.form.validate(valid => {
              if (valid) {
                this.Publish = true;
                addImageText(_this.form).then(function(res) {
                  console.log(_this.form)
                  if (res.data.code == 1) {
                    _this.Publish = false;
                    _this.$message.success('发布成功');
                    _this.$router.push({
                      path:'/notice/newRefresh',
                      query:{type:3}
                    })
                  } else {
                    _this.Publish = false;
                    _this.$message.error(res.data.msg);
                    return false;
                  }
                });
              } else {
                return false;
              }
            });
        },
         //文件服务器上传
        handleUpload(file) {
          let fd = new FormData();
          console.log(file);
          this.FileList.forEach(item => {
            fd.append("file", item.raw, item.raw.name);
          });
          if (this.FileList.length == 0) return this.$message.warning("请选择上传文件！");
          Upload(fd).then(res => {
            if (res.data.code === 1) {
              this.$message.success('上传成功！')
              let urlList = []
              let nameList = []
              if (res.data.data.fileUrl !== '') {
                urlList = res.data.data.fileUrl.split(',')
              }
              if (res.data.data.fileUrl !== '') {
                nameList = res.data.data.fileName.split(',')
              }
              this.$set(this.form, 'bannerImg', urlList[0])
              // this.$set(this.form, 'fileName', nameList)
              console.log(this.form)
            } else {
              this.$message.error(res.data.msg);
            }
          });
        },
        upload2(response, file, fileList) {
          this.form.bannerImg = response.data.fileUrl;
          if (this.form.bannerImg && response.code == 1) {
            this.$alert("上传成功", "提示", {
              type: "success"
            });
          } else {
            this.$alert("上传失败", "提示", {
              type: "error"
            });
          }
        },
         getContent() {
          let str = window.tinymce.get(this.tinymceId).getContent();
          this.$set(this.form,'content',str);
        },
        uploadChange(file, fileList) {
          let imgSrc = window.URL.createObjectURL(file.raw);
          let img = new Image();
          img.src = imgSrc;
          img.onload = () => {
            // 在这里就可以获取到图片的宽度和高度了 img.width 、img.height
              if (img.width === 636 && img.height === 184) {
                this.FileList = fileList
                this.handleUpload(file);
              // todo
              } else {
                this.FileList = [];
                this.$message.warning("请上传636px X 184px尺寸的图片！");
              }
          };
        },
        handlePreview(file) {
          console.log(file);
        },
        handleRemove(file, fileList) {
          console.log(file, fileList);
        },
        handleSuccess() {},
        handleProgress(event, file, fileList) {
          console.log(event);
        },
        // 状态字段获取值
        getState(parm) {
          if (parm == true) {
            this.form.state = 1;
          } else {
            this.form.state = 0;
          }
        },
      },
    }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .c6{background-color:#009A52;}
</style>
