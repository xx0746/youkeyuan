<template>
  <div>
    <el-form ref="templateForm" :model="templateForm" label-width="120px" :rules="templateFormlist">
      <el-form-item label="选择模板" prop="tableId">
        <el-select v-model="templateForm.tableId" filterable placeholder="请选择数据模板" style="width:218px;" @change="moudleChange">
          <el-option
            v-for="(item) in templateName"
            :key="item.ID"
            :label="item.DATANAME"
            :value="item.ID">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="选择数据集" prop="collectId">
        <el-select v-model="templateForm.collectId" filterable placeholder="请选择数据集" style="width:218px;">
          <el-option
            v-for="(item) in collectList"
            :key="item.ID"
            :label="item.COLLECTNAME"
            :value="item.ID">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="选择文件">
        <el-upload
          class="upload-demo"
          action="#"
          ref="templateFormFile"
          :show-file-list="true"
          :on-change="beforeChange"
          :header="headerType"
          :data="templateForm"
          :http-request="httpRequest"
          :with-credentials="true"
          :disabled="templateFormDisabled"
          :auto-upload="false"
          :on-remove="removeflie"
          >
          <el-button id="templateFormbtn1" slot="trigger" size="small" type="primary">选取文件</el-button>
          <span class="btn-text">支持txt、xls、xlsx、csv文件类型</span>
        </el-upload>
      </el-form-item>
      <el-form-item v-if="isShowInput" label="文件分隔符" placeholder="请输入文件分隔符" prop="splitStr">
        <el-input v-model="templateForm.splitStr" style="width: 218px;"></el-input>
      </el-form-item>
      <el-form-item class="checkbox-style">
        <el-checkbox @change="changeFirstSelect" v-model="checked" style="font-family: 'Avenir', Helvetica, Arial, sans-serif; font-weight: 400; color: #333;">不导入第一行（如果第一行包括标题请勾选此项）</el-checkbox>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" class="data-submit-btn" @click="onSubmitTemplate('templateForm')">导入</el-button>
      </el-form-item>
    </el-form>
    <!-- 预览表格tab -->
    <div v-show="tableShow" style="position: relative">
      <p style="text-align: left;color:#999;margin-bottom:10px;">数据内容只展示新上传数据的前200行数据，原数据集将不做展示。</p>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="数据结构" name="first">
          <el-table :data="modelTableList" :header-cell-style="{
              'background-color': '#f5f7fa',
              'color': 'rgb(103, 194, 58)',
               }" class="template-table" border>
            <el-table-column property="columnComment" label="属性名称" ></el-table-column>
            <el-table-column property="columnType" label="属性类型" ></el-table-column>
            <el-table-column property="columnLength" label="属性长度"></el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="数据内容" name="second">
          <el-table
            height="300"
            :data="tableDataList"
            border
            style="width: 100%"
            :header-cell-style="{
            'background-color': '#f5f7fa',
            'color': 'rgb(103, 194, 58)',
            }"
            >
            <el-table-column
              v-for="item2 in keydataList"
              :key="item2"
              :prop="item2"
              :label="item2"
            >
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import {
  getCollectListSelect,
  getDataModelShow,
  submitAddto
} from "@/api/datamanage";
import readFile from '@/utils/readFiles'
export default {
  components:{},
  props:{
    templateName:{
      type: Array,
      default() {
        return []
      }
    },
    menuId:{
      type: Number,
      default() {
        return ''
      }
    }
  },
  data(){
    return {
      collectList: [],
      // 提交数据集导入表单数据
      templateForm: {
        firstSelect: 1,
        tableId: null,
        collectId: null,
        splitStr: "",
      },
      templateFormlist: {
        tableId: [{required: true, message: '请选择数据模型', trigger: 'blur'}],
        collectId: [{required: true, message: '请填写数据集名称', trigger: 'blur'}],
        splitStr:[{required: true, message: '请填写文件分隔符', trigger: 'blur'}],
      },
      templateFormDisabled: false,
      checked: true,
      isShowInput: false,
      FileList: [],
      headerType: { 'Content-Type': 'multipart/form-data'},
      // 读取文件内容展示
      activeName: 'first',
      tableShow: false,
      modelTableList: [],
      isSubmited: false,
      tableData: [],
      keydataList:[],
    }
  },
  computed:{
    tableDataList: function () {
      return this.tableData.slice(0,200);
    },
  },
  mounted(){
    
  },
  methods:{
    moudleChange() {
      this.getCollectList()
      this.tableShow = true;
      this.templateForm.collectId = null;
      let param = { ID: this.templateForm.tableId };
      getDataModelShow(param).then(res => {
        let { code, data, msg } = res.data;
        if(code == 1) {
          this.modelTableList = data;
        } else {
          this.$message.error(msg);
        }
      })
    },
    // 获取数据集下拉选项
    getCollectList() {
      let param = {
        menuId: this.menuId,
        tableId: this.templateForm.tableId
      }
      getCollectListSelect(param).then(res => {
        let {code, data, msg} = res.data;
        if(code == 1) {
          this.collectList = data;
        } else {
          this.$message.error(msg);
        }
      })
    },
    // 1、添加文件的钩子，可执行对文件的操作
    beforeChange(file, fileList) {
      if(this.templateForm.tableId == null) {
        this.$message.warning('请先选择模板！')
        fileList = fileList.splice(-1, 1);
        return
      } 
      let fileType = file.raw.name.substr(file.raw.name.lastIndexOf('.')+1,file.raw.name.length);
      let testmsg = /\.(xls|xlsx|csv|txt)(\?.*)?$/.test(file.raw.name)
      if(testmsg) {
        let temp = this.isdouble(file, this.FileList)
        if(temp.temp == true) {
          fileList = fileList.splice(-1, 1);
          this.$message.warning('该文件已存在！')
          return;
        }
        let excelHeader = '';
        readFile(file.raw).then(res => {
          let { data, header } = res;
          excelHeader = header.join(',');
          let moudleKey = this.modelTableList.map(item => {
            return item.columnComment
          });
          console.log(excelHeader,moudleKey.join(','))
          if(excelHeader !== moudleKey.join(',')) {
            this.$message.warning('您添加的文件数据和模板数据不一致！')
            fileList = fileList.splice(-1, 1);
          } else {
            this.keydataList = [];
            this.keydataList = header;
            this.tableData.push(...data);
            if(fileType == 'csv') {
              this.isShowInput = true;
              this.templateForm.splitStr = '';
            }
            this.FileList = fileList.map(item => {
              return item
            });
          }
        }).catch(err => {
          fileList = fileList.splice(-1, 1);
          this.$message.error(err.msg)
        })
      } else {
        this.$message.error('请添加正确的文档类型！')
      }
    },
    // 2、点击表单提交按钮，调用upload组件开始上传文件
    onSubmitTemplate(templateForm) {
      if(this.FileList.length == 0) return this.$message.warning('请选择您要导入的文件！');
      this.$refs[templateForm].validate((valid) => {
        if (valid) {
          this.$refs.templateFormFile.submit();
        }
      })
    },
    // 3、最终自定义请求上传文件及表单中数据
    httpRequest(file) {
      if(this.isSubmited === false) {
        this.isSubmited = true;
        let fd = new FormData();
        this.FileList.forEach((item, index) => {
          fd.append('file', item.raw, item.name)
        })
        submitAddto(fd, this.templateForm).then(res => {
          let { code, msg } = res.data;
          if(code == 1) {
            this.templateFormDisabled = true;
            this._clear()
            this.$message.success('追加成功！')
          } else {
            this.$message.error(msg)
          }
        })
      }
    },
    removeflie(file, fileList){
      this.tableData = [];
      if(fileList.length == 0) {
        this.keydataList = [];
        this.FileList = [];
      } else {
        fileList.forEach(item => {
          readFile(file.raw).then(res => {
            let { data } = res;
            this.tableData.push(...data);
          }).catch(err => {
            this.$message.error(err.msg)
          })
          this.isShowInput = false;
          let fileType = item.raw.name.substr(item.raw.name.lastIndexOf('.')+1,item.raw.name.length);
          if( fileType == 'csv') {
            this.isShowInput = true;
          }
        })
        if(this.isShowInput == false) {
          this.templateForm.splitStr = '';
        }
        this.FileList = fileList.map(item => {
          return item
        });
      }
    },
    isdouble(file, filelist) {
      let temp = false;
      let name = '';
      let index = null;
      filelist.forEach((item, index) => {
        if(item.name == file.name) {
          temp = true;
          name = file.name;
          index = index
        }
      })
      return { temp, name , index }
    },
    changeFirstSelect(val) {
      if(val) {
        this.templateForm.firstSelect = 1;
      } else {
        this.templateForm.firstSelect = 0;
      }
    },
    handleClick() {},
    _clear() {
      this.checked = true;
      this.templateForm = {
        firstSelect: 1,
        tableId: null,
        collectId: null,
        splitStr: "",
      },
      this.tableData = [];
      this.keydataList = [];
      this.FileList = []
      this.tableShow = false
      this.modelTableList = []
      this.$refs.templateFormFile.clearFiles()
    }
  },
}
</script>
<style lang="scss" scoped>
.btn-text {
  position: absolute;
  left: 100px;
}
#templateFormbtn1{
  float: left;
}
#templateFormbtn1.el-button--small {
  height:26px !important;
  margin-top: 6px;
}
.upload-demo{
  position: relative;
}
.data-submit-btn{
    width: 90px;
    height: 32px;
    line-height: 11px;
    margin-top: 14px;
}
</style>