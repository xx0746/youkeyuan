<template>
  <div>
    <el-form ref="templateForm" :model="templateForm" label-width="120px" :rules="templateFormlist">
      <el-form-item label="选择模板" prop="tableId">
        <el-select v-model="templateForm.tableId" filterable placeholder="请选择数据模板" style="width:218px;">
          <el-option
            v-for="(item) in templateName"
            :key="item.ID"
            :label="item.DATANAME"
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
          :with-credentials="true"
          :disabled="templateFormDisabled"
          :auto-upload="false"
          :on-remove="removeflie"
          >
          <!-- :before-upload="templateBeforeFileUpload" -->
          <el-button id="templateFormbtn1" slot="trigger" size="small" type="primary"  @click="selectUpload(1)">选取文件</el-button>
          <span class="btn-text">支持txt、xls、xlsx、csv文件类型</span>
        </el-upload>
      </el-form-item>
      <el-form-item label="下载是否审核" label-width="120px" prop="">
        <template>
          <el-radio v-model="templateForm.auditState" label="1">是</el-radio>
          <el-radio v-model="templateForm.auditState" label="2">否</el-radio>
        </template>
      </el-form-item>
      <el-form-item label="数据集名称" placeholder="请输入数据集名称" prop="collectName">
        <el-input v-model="templateForm.collectName" style="width: 218px;"></el-input>
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
    <div v-show="tablelist" style="position: relative">
      <p style="text-align: left;color:#999;margin-bottom:10px;">
        预览区域只列出前200行数据
      </p>
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
    </div>
  </div>
</template>
<script>
import {
  getTemplateNameSelect,
  addTemplateTableData,
} from "@/api/datamanage";
import readFile from '@/utils/readFiles'
  import { getDownloadIsAudit } from "@/api/manualupload";

export default {
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
  data() {
    return {
      activeName2:'first',
      //用这个判断tab切换
      menuValue: "",
      value: "",
      isShowInput: false,
      // 提交数据集导入表单数据
      templateForm: {
        menuId:'',
        menuType: null,
        firstSelect: 1,
        tableId: null,
        collectName: "",
        dataA: "",
        dataB: "",
        splitStr: "",
        auditState: "",
      },
      templateFormDisabled: false,
      // 读入预览文件内容
      tableData: [],
      keydataList:[],
      tablelist:false,
      templateFormlist: {
        tableId: [{required: true, message: '请选择数据模型', trigger: 'blur'}],
        collectName: [{required: true, message: '请填写数据集名称', trigger: 'blur'}],
        splitStr:[{required: true, message: '请填写文件分隔符', trigger: 'blur'}],
      },
      isFile: true,
      headerType: { "Content-Type": "multipart/form_data" },
      checked: true,
      dataList:[],
      
      isAudit: "",
    }
  },
  computed:{
    tableDataList: function () {
      return this.tableData.slice(0,200);
    },
  },
  mounted() {
    this.getDownloadAudit();
  },
  methods: {
    getDownloadAudit() {
      let params = {
        type: 2,
      };
      getDownloadIsAudit(params).then((res) => {
        this.isAudit = res.data.data;
        this.templateForm.auditState = res.data.data;
      });
    },
    removeflie(file, fileList){
      this.tablelist = false;
      this.FileList = fileList.map(item => {
        return item
      });
    },
    handleClick2(tab, event) {
      console.log(tab, event);
    },
    // 提交数据集
    onSubmitTemplate(templateForm) {
      this.templateForm.menuId = this.menuId;
      this.templateForm.menuType = this.menuId;
      if(this.isFile) return this.$message.warning('请选择您要导入的文件！');
      this.$refs[templateForm].validate((valid) => {
        if (valid) {
          this.tablelist = false;
          this.templateUpload()
          // this.$refs.templateFormFile.submit();
        }
      })
    },
    // 添加文件的钩子
    beforeChange(file, fileList) {
      let fileType = file.raw.name.substr(file.raw.name.lastIndexOf('.')+1,file.raw.name.length);
      let keydataList= [];
      if(this.state ==1){
        if (fileList.length > 1) { fileList.splice(0,1) }
        readFile(file.raw).then(res => {
          console.log(res)
          this.keydataList = [];
          this.tableData = res.data;
          this.keydataList = Object.keys(this.tableData[0]);
          let obj = {};
          let arr = [];
          this.keydataList.forEach((item, index) => {
            obj = {
              columnComment: item,
              id:'1',
              options: [{
                id: '1',
                fieldType: '文本'
                }, {
                id: '2',
                fieldType: '日期'
                }, {
                id: '3',
                fieldType: '数字'
                }, {
                id: '4',
                fieldType: '货币'
              }]
            }
            arr.push(obj);
          });
          this.dataList = arr;
          if(fileType == 'csv') {
            this.isShowInput = true;
            this.templateForm.splitStr = '';
          }
          this.FileList = fileList.map(item => {
            return item
          });
          this.isFile = false;
          this.tablelist = true;
        }).catch(err => {
          this.tablelist = false;
          fileList = fileList.splice(-1, 1);
          this.$message.error(err.msg) 
        })
      }
    },
    //判断表头是否相同
    isTrue(arr, arr1) {
      if (arr.length !== arr1.length) {
          this.$message.warning("请导入相同字段的文件")
          this.flag = false;
          return false
      }
      let temp = true;
      for (let i = 0; i < arr.length; i++) {
          const item = arr[i];
          const item1 = arr1[i];
          if (item == item1) {

          } else {
            this.$message.warning("请导入相同字段的文件")
            temp = false;
          }
      }
      if(temp) {
        this.flag = true;
      }
    },
    // 数据集导入上传钩子
    templateUpload() {
      // console.log(file);
      // var testmsg = /\.(txt|xls|xlsx|csv)(\?.*)?$/.test(file.name)
      // if (!testmsg) {
      //   this.$message.error('请上传正确的文档类型!');
      //   return
      // }
      let fd = new FormData();
      this.FileList.forEach(item => {
        fd.append("file", item.raw, item.raw.name);
      });
      //debugger
      addTemplateTableData(fd, this.templateForm).then(res => {
        if(res.data.code == 1) {
          this.tablelist = false;
          this.$message.success("上传成功！")
          this._clear();
        } else if(res.data.code == 0) {
          this.tablelist = true;
          this.$message.warning(res.data.msg);
          this.templateForm.collectName = "";
        }
      })
      return false;

    },
    changeFirstSelect(val) {
      if(val) {
        this.templateForm.firstSelect = 1;
      } else {
        this.templateForm.firstSelect = 0;
      }
    },
    //选取文件
    selectUpload(val){
      this.state = val
    },
    // 清除数据
    _clear() {
      this.checked = true;
      this.isFile = true;
      this.templateForm = {
        menuType: 11,
        firstSelect: 1,
        tableId: null,
        collectName: "",
        dataA: "",
        dataB: "",
        splitStr: "",
        auditState: this.isAudit
      };
      this.templateFormDisabled = false;
      // 表格数据
      this.tableData = [];
      this.FileList = [];
      this.$refs.templateFormFile.clearFiles();
      this.isShowInput = false;
    }
  },
}
</script>
<style  rel="stylesheet/scss" lang="scss" scoped>
.data-submit-btn{
    width: 90px;
    height: 32px;
    line-height: 11px;
    margin-top: 14px;
}
#templateFormbtn1{
  float: left;
}
#templateFormbtn1.el-button--small {
  height:26px !important;
  margin-top: 6px;
}
#logisticFormbtn2.el-button--small {
  height:26px !important;
  margin-top: 6px;
}
.btn-text {
  position: absolute;
  left: 100px;
}
#templateFormbtn2{
  float: left;
  margin-left: 240px;
}
.upload-demo{
  position: relative;
}
.checkbox-style .is-checked .el-checkbox__label {
    color: #009a52;
}
</style>    