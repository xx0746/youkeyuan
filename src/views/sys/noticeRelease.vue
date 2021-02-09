<template>
  <div>
    <div class="title">公告发布</div>
    <div class="filter-container r-menu" style="margin-top:20px;margin-left:20px;margin-right:20px">
      <el-form ref="form" :model="form"  :rules="myRule" label-width="100px"
               style="width:80%;margin:20px 10%;">
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" class="czm_input"></el-input>
        </el-form-item>

        <el-form-item label="正文">
          <Tinymce :id = 'tinymceId' :value="form.content" class="czm_input"/>
          <!-- <tinymce id="d1" v-model="form.content" :other_options="options" class="czm_input"></tinymce> -->
        </el-form-item>

        <el-form-item label="原文链接" prop="originalLinked">
          <el-input v-model="form.originalLinked" class="czm_input"></el-input>
        </el-form-item>
        <el-form-item label="上传附件">
          <el-upload
            class="upload-demo"
            ref="upload1"
            action="String"
            :on-change="uploadChange"
            :header="headerType"
            :with-credentials="true"
            :on-remove="handleRemove"
            :onSuccess="handleSuccess"
            :auto-upload="false"
            multiple
            :limit="15"
            :on-exceed="handleExceed"
            :file-list="FileList"
          >
            <el-button class="file_btn" slot="trigger" size="small" type="primary">选取文件</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="Publish" :disabled="isfileSuccess" style="height:32px" @click.prevent="handlePublish">发布</el-button>
          <!--<el-button>预览</el-button>-->
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import Tinymce from '@/components/Tinymce'
import { Upload, publish } from '@/api/noticelist'
import { typePureSpace } from "@/utils/elValidate"; // 引入自定义校验方法
import { debounce } from '@/utils/Debounce'
export default {
  data() {
    var gethttp = (rule, value, callback) =>{
      console.log(value,'shuju');
      if (value !== undefined && value !== '') {
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
    return {
      Publish:false,
      isfileSuccess: false,
      tinymceId: 'me1',
      headerType: { "Content-Type": "multipart/form-data" },
      content: "",
      form: {
        link: ''
      },
      options: {
        language_url: "/static/lang/zh_CN.js" //This url points to location of persian language file.
      },
      FileList: [],
      myRule: {
        title: [{ required: true, message: '标题不能为空', trigger: 'blur'},
                { validator: typePureSpace,message: "输入不可以为纯空格", trigger: 'blur' }],
        originalLinked:[
          { required: false,  trigger: "blur" },
          { validator: gethttp,message: "网址格式错误", trigger: "blur" }
        ],
      }
    };
  },
  mounted(){
  },
  methods: {
    getContent() {
      let str = window.tinymce.get(this.tinymceId).getContent();
      this.$set(this.form,'content',str);
    },
    handleUpload() {
      console.log(this.FileList);
      let fd = new FormData();
      this.FileList.forEach(item => {
        fd.append("file", item.raw, item.raw.name);
      });
      console.log(fd)
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
          this.$set(this.form, 'fileUrl', urlList)
          this.$set(this.form, 'fileName', nameList)
        }else{
          this.$message.error(res.data.msg);
        }
        this.isfileSuccess = false;
      });
    },
    uploadChange(file, fileList) {
      this.isfileSuccess = true;
      debounce(() => {
        this.FileList = fileList
        if(this.isfileSuccess){
          this.$message.warning("正在上传附件")
          setTimeout(() => {
            this.handleUpload();
          }, 3000);
        }
      }, 300)
    },
    handleRemove(file, fileList) {
      this.FileList = fileList;
      console.log(this.FileList)
    },
    handleSuccess() {
      console.log(1)
    },
    // 上传限制文件数
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 15 个文件，本次选择了 ${
          files.length
        } 个文件，共选择了 ${files.length + fileList.length} 个文件`

      );
    },
      // 上传限制文件数
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 15 个文件，本次选择了 ${
          files.length
        } 个文件，共选择了 ${files.length + fileList.length} 个文件`

      );
    },
    handlePublish() {
      this.getContent();
      console.log(this.FileList.length)
      if (this.form.originalLinked && !this.form.content) {
        if(this.FileList.length === 0){
          this.handlePublishResult()
          delete this.form.fileName;
          delete this.form.fileUrl;
        }else {
          this.$message.warning("原文链接与附件不能同时上传，且正文与原文链接只能填一项");
        }
      } else if(!this.form.originalLinked  && this.form.content){
        this.handlePublishResult()
      }else {
        this.$message.warning("原文链接与附件不能同时上传，且正文与原文链接只能填一项");
      }
    },
    handlePublishResult(){
      this.getContent();
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.Publish = true;
          publish(this.form).then(res => {
            if (res.data.code === 1) {
              this.$message.success("发布成功");
              this.Publish = false;
              this.form.title =='';
              this.$router.push({
                path:'/notice/newRefresh',
                query:{type:2}
              })
            } else {
              this.Publish = false;
              this.$message.error(res.data.msg);
            }
          })
        }
      })
    }
  },
  components: {
    Tinymce
  }
};
</script>
<style scoped>
</style>
