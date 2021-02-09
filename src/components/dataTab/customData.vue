<template>
<div>
  <el-form ref="templateForm" :model="templateForm" label-width="120px" :rules="templateFormlist">
    <el-form-item label="选择文件">
      <el-upload
        class="upload-demo"
        action="#"
        ref="templateFormFile"
        :show-file-list="true"
        :on-change="beforeChange1"
        :header="headerType"
        :data="templateForm"
        :http-request="httpRequest"
        :with-credentials="true"
        :disabled="templateFormDisabled"
        :auto-upload="false"
        :on-remove="removeflie"
        >
        <el-button id="templateFormbtn1" slot="trigger" size="small" type="primary" @click="selectUpload(1)">选取文件</el-button>
        <span class="btn-text">支持txt、xls、xlsx、csv文件类型</span>
        <el-button id="templateFormbtn2" slot="trigger" size="small" type="primary" @click="addUpload(2)">追加上传</el-button>
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
    <el-form-item label="数据模板名称" placeholder="请输入模板名称" prop="templateName">
      <el-input v-model="templateForm.templateName"  style="width:218px;"></el-input>
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
    <p style="text-align: left;color:#999;margin-bottom:10px;">预览区域只列出前200行数据</p>
    <el-tabs v-model="activeName2" @tab-click="handleClick2">
      <el-tab-pane label="数据结构" name="first">
        <easy-table :tableData="dataList" :options="options" :isdefault="defaultPlace"></easy-table>
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
  sendUploadFile,
  addAutoTemplate,
} from "@/api/datamanage";
import easyTable from '@/components/easyTable/easyTable.vue'
  import { getDownloadIsAudit } from "@/api/manualupload";
import readFile from '@/utils/readFiles'
// 导入 table 和 分页组件 
export default {
  components: {
    easyTable,
  },
  props:{
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
      // 数据集导入数据
      templateName: [],
      isShowInput: false,
      // 提交数据集导入表单数据
      templateForm: {
        menuType: null,
        firstSelect: 1,
        collectName: "",
        dataA: "",
        dataB: "",
        splitStr: "",
        auditState: "",
        templateName:''
      },
      templateFormDisabled: false,
      //easyTable表格渲染的每一列
      options: [
        {field: 'columnComment', title:'属性名称'},
        {field: 'columnType', title: '属性类型'},
        {field: 'columnLength', title: '属性长度'},
      ],
      defaultPlace: ["",'Varchar',255],
      // 读入预览文件内容
      tableData: [],
      keydataList: [],
      dataList: [],
      tablelist:false,
      templateFormlist: {
        templateName: [{required: true, message: '请填写数据模板名称', trigger: 'blur'}],
        collectName: [{required: true, message: '请填写数据集名称', trigger: 'blur'}],
        splitStr:[{required: true, message: '请填写文件分隔符', trigger: 'blur'}],
      },
      isFile: true,
      headerType: { "Content-Type": "multipart/form-data" },
      checked: true,
      state:'',
      fieldType:'文本',
      flag:false,
      FileList:[],
      isSubmited: false,
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
      this.tableData = [];
      if(fileList.length == 0) {
        this.tablelist = false;
        this.dataList = [];
        this.keydataList = [];
        this.FileList = [];
      } else {
        fileList.forEach(item => {
          readFile(item.raw).then(res => {
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
    // tab切换事件
    handleClick(tab, event) {
      this.tabNameActive = tab.name;
      this.isShowInput = false;
      this.templateForm.splitStr = '';
    },
    handleClick2(tab, event) {
      
    },
    // 点击按钮提交数据集
    onSubmitTemplate(templateForm) {
      this.templateForm.menuId = this.menuId;
      this.templateForm.menuType = this.menuId;
      if(this.isFile) return this.$message.warning('请选择您要导入的文件！');
      // 判断模板表格数据是否有空值，进行提醒
      let temp = false;
      this.dataList.forEach(item => {
        if(item.columnType == "Varchar") {
          for(let key in item) {
            if(item[key] == "") {
              temp = true;
            }
          }
        } else {
          for(let key in item) {
            if(item[key] == null && key != "columnLength") {
              temp = true;
            }
          }
        }
      })
      if(temp) return this.$message.error("请将数据结构表格填写完整！");

      this.$refs[templateForm].validate((valid) => {
        if (valid) {
          this.$refs.templateFormFile.submit();
        }
      })
    },
    //添加文件的钩子
    beforeChange1(file, fileList){
      let fileType = file.raw.name.substr(file.raw.name.lastIndexOf('.')+1,file.raw.name.length);
      var testmsgV = /\.(txt|xls|xlsx|csv)(\?.*)?$/.test(file.raw.name);
      if (!testmsgV) {
        this.$message.error('请上传正确的文档类型!');
        return
      }
      let tempObj = this.isdouble(file, this.FileList)
      if(tempObj.temp == true) {
        fileList = fileList.splice(-1, 1);
        this.$message.warning('该文件已存在！')
        return;
      }
      if(this.state == 1){
        if (fileList.length > 1) { fileList.splice(0,1) }
        this.FileList = fileList.map(item => {
          return item
        })
        readFile(file.raw).then(res => {
          console.log(res);
          this.keydataList = [];
          this.tableData = res.data;
          this.keydataList = res.header;
          this.cellType = res.cellTypes.join(',');
          let obj = {};
          let arr = [];
          this.keydataList.forEach((item, index) => {
            let type = res.cellTypes[index]
            let columnType = 'Varchar';
            obj = {
              columnComment: item,
              columnLength: "255",
              columnType,
            }
            arr.push(obj);
          });
          this.dataList = arr;
          this.isFile = false;
          this.tablelist = true;
          if(fileType == 'csv') {
            this.isShowInput = true;
          } else {
            this.isShowInput = false;
          }
        }).catch(err => {
          fileList = fileList.splice(-1, 1);
          this.FileList = [];
          this.tablelist = false;
          this.$message.error(err.msg) 
        })
      }else{
        if(this.FileList.length == 0) {
          fileList = fileList.splice(-1, 1);
          return this.$message.warning('请先选择作为模板的文件，然后再追加！');
        }
        let newFiles = fileList.slice(1);
        newFiles.forEach((item, index) => {
          readFile(item.raw).then(res => {
            console.log(res);
            let {data, header} = res;
            let oldheadArr = JSON.parse(JSON.stringify(this.keydataList));
            let oldhead = oldheadArr.join(',');
            let newhead = header.join(',');
            if(oldhead === newhead){
              if(fileType == 'csv') {
                this.isShowInput = true;
              }
              this.tableData.push(...data)
              // 需要判断filelist中是否有重复文件，这里不能直接等于，文件类型又不能用JSON，只有用map了
              this.FileList = fileList.map(item => {
                return item
              })
            } else {
              fileList = fileList.splice(-1, 1);
              this.$message.warning("请导入相同字段的文件");
              return;
            }
            this.isFile = false;
            this.tablelist = true;
          }).catch(err => {
            console.log(2132423)
            fileList = fileList.splice(-1, 1);
            this.$message.error(err.msg)
          })
        });
      }
    },
    isdouble(file, filelist) {
      let temp = false;
      let name = '';
      let i = null;
      filelist.forEach((item, index) => {
        if(item.name == file.name) {
          temp = true;
          name = file.name;
          i = index
        }
      })
      return { temp, name , i }
    },
    // 数据集导入上传钩子
    httpRequest(file) {
      if(this.isSubmited == false) {
        this.isSubmited = true;
        let fd = new FormData();
        this.FileList.forEach(item => {
          fd.append("files", item.raw, item.raw.name);
        });
        let autoData = {
          dataA: "",
          dataB: null,
          dataC: null,
          dataD: null,
          dataDesc: "",
          dataTable: "",
          dataType : this.templateForm.menuType,
          dataName:this.templateForm.templateName,
          dataTableColumns: this.dataList,
        }
        fd.append("data", JSON.stringify(autoData))
        console.log(this.templateForm)
        addAutoTemplate(fd, this.templateForm).then(res => {
          console.log(res);
          if(res.data.code == 1) {
            this.tablelist = false;
            this.$message.success("上传成功！")
            this._clear();
          } else {
            this.$message.error(res.data.msg);
          }
          this.isSubmited = false;
        })
      }
    },
    changeFirstSelect(val) {
      if(val) {
        this.templateForm.firstSelect = 1;
      } else {
        this.templateForm.firstSelect = 0;
      }
    },
   //追加上传
    addUpload(val){
      this.state = val
    },
    //选取文件
    selectUpload(val){
      this.state = val
    },
    //属性长度值
    columnValue(columnLength){
      console.log(columnLength)
      let arr = [];
      arr.push(columnLength)
      console.log(arr)
    },
    // 清除数据
    _clear() {
      this.checked = true;
      this.templateForm = {
        menuType: 11,
        firstSelect: 1,
        tableId: null,
        collectName: "",
        dataA: "",
        dataB: "",
        splitStr: "",
        auditState: this.isAudit,
      };
      this.templateFormDisabled = false;
      // 表格数据
      this.tableData = [];
      this.keydataList = [];
      this.dataList = [];
      this.FileList = [];
      this.isFile = false;
      this.$refs.templateFormFile.clearFiles()
    }
  },
}
</script>
<style  rel="stylesheet/scss" lang="scss" scoped>
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
#templateFormbtn2{
  float: left;
  margin-left: 240px;
}
#templateFormbtn2.el-button--small {
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