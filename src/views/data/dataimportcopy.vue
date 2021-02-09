<template>
  <div>
    <div class="title">数据导入</div>

    <div style="margin-top:20px;margin-left:20px;float:left;width:20%;height: 100%;padding-bottom: 300px">
      <div class="title3">
        <p class="title-size">资源目录</p>
      </div>
      <el-row class="tac" style="height: 100%;">
        <el-col>
          <el-tree
            highlight-current
            :data="treeData"
            @node-click="handleNodeClick"
            :props="defaultProps"
            node-key="value"
            accordion
            class="trr"
            empty-text="正在加载中"
          ></el-tree>
        </el-col>
      </el-row>
    </div>

    <!-- 数据集导入 -->
    <div class="formbox" id="roc14">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <!-- 数据导入 -->
        <el-tab-pane :label="menuValue" name="first" class="el-tabs-box">
            <el-tabs v-model="automatic" type="card" @tab-click="handleClick1" class="tabs-box-child">
              <el-tab-pane label="自动识别表头导入" name="first">
                <custom-data :menuId='menuId' v-if="tabDisplay"></custom-data>
              </el-tab-pane>
              <el-tab-pane label="自定义模版导入" name="second">
                <autoDate :templateName ='templateName' :menuId='menuId' v-if="tabDisplay"></autoDate>
              </el-tab-pane>
              <el-tab-pane label="追加导入" name="third">
                <addtoData :templateName ='templateName' :menuId='menuId' v-if="tabDisplay"></addtoData>
              </el-tab-pane>
            </el-tabs>
        </el-tab-pane>
        <!-- 快递数据导入 -->
        <el-tab-pane label="快递数据导入" name="second" v-if="isShowSecond" class="el-tabs-box">
          <el-form ref="logisticForm" :model="logisticForm" label-width="100px" :rules="logisticFormlist">
            <el-form-item label="快递公司" prop="">
              <el-select v-model="logisticForm.expressType" placeholder="请选择快递公司">
                <el-option
                  v-for="(item) in logisticCompany"
                  :key="item.ID"
                  :label="item.COMPANYNAME"
                  :value="item.ID">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="选择文件" label-width="100px">
              <el-upload
                class="upload-demo"
                action="string"
                ref="logisticFormFile"
                :show-file-list="true"
                :on-change="beforeChange"
                :header="headerType"
                :data="logisticForm"
                :before-upload="beforeFileUpload"
                :with-credentials="true"
                :onSuccess="logisticFormFiledSuccess"
                :disabled="logisticFormDisabled"
                :auto-upload="false"
                :on-remove="removeflie"
                >
              <el-button id="logisticFormbtn1" slot="trigger" size="small"  type="primary">选取文件</el-button>
              <span class="btn-text">支持txt、xls、xlsx、csv文件类型</span>
              </el-upload>
            </el-form-item>
            <el-form-item v-if="isShowInput" label="文件分隔符" placeholder="请输入文件分隔符" prop="splitStr">
              <el-input v-model="logisticForm.splitStr" style="width: 36%"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" class="data-submit-btn" @click="onSubmit">导入</el-button>
            </el-form-item>
          </el-form>
            <!-- 读取文件内容表格 -->
            <div v-show="tablelist" style="position: relative; margin-bottom: 14px;">
              <p style="text-align: left;color:#999;margin-bottom:10px;">
                预览区域只列出前200行数据
              </p>
              <el-table
                v-if="showTxt == 'excel'"
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
              <div class="txt-box" v-else-if="showTxt == 'txt'" v-html="txtContent">{{ txtContent }}</div>
            </div>
        </el-tab-pane>
      </el-tabs>

    </div>
  </div>
</template>
<script>
import { getLeftTreeInterface } from "@/api/resource_list";
import {
  getLogisticsList,
  sendUploadFile,
  getTemplateNameSelect,
  addTemplateTableData,
  addAutoTemplate
} from "@/api/datamanage";
import readFile from '@/utils/readFiles'
import customData from '@/components/dataTab/customData'
import autoDate from '@/components/dataTab/autoDate'
import addtoData from '@/components/dataTab/addtoData'

export default {
  components: {
    customData,
    autoDate,
    addtoData
  },
  data() {
    return {
      //用这个判断tab切换
      menuValue: "",
      value: "",
      activeName: 'first',
      automatic:'first',
      // 数据库目录
      treeData: [],
      // 快递数据导入数据
      logisticCompany: [],
      // 数据集导入数据
      templateName: [],
      defaultProps: {
        children: "children",
        label: "label"
      },
      // 提交快递数据导入表单数据
      logisticForm: {
        expressType: '',
        chars: '',
        splitStr: ''
      },
      menuId: null,
      isShowSecond: true,
      isShowInput: false,
      // 读入预览文件内容
      tableData: [],
      keydataList:[],
      tablelist:false,
      showTxt: 'txt',
      txtContent: '',
      // 校验规则
      logisticFormlist: {
        logistics: [{required: true, message: '请选择物流公司', trigger: 'blur'}]
      },
      isFile: true,
      logisticFormDisabled: false,
      headerType: { "Content-Type": "multipart/form_data" },
      checked: false,
      tabDisplay: true,
    }
  },
  computed:{
    tableDataList: function () {
      return this.tableData.slice(0,200);
    },

  },
  created() {
    this.getLeftTree();
    this.getlogisticInfo();
  },
  mounted() {
  },
  methods: {
    removeflie(file, fileList){
      if(fileList.length == 0) {
        this.tablelist = false;
      }
    },
    // tab切换事件
    handleClick(tab, event) {
      this.activeName = tab.name;
      this.isShowInput = false;
      this.logisticForm.splitStr = '';
      this.tabDisplay = false;
      this.$nextTick(_=> {
        this.tabDisplay = true;
      })
    },
    handleClick1(tab, event) {
      this.automatic = tab.name;
      this.tabDisplay = false;
      this.$nextTick(_=> {
        this.tabDisplay = true;
      })
    },
    // 获取物流列表
    async getlogisticInfo() {
      const res = await getLogisticsList()
      const {data:{code, data}} = res;
      this.logisticCompany = data;
    },
    // 提交快递
    onSubmit() {
      this.tablelist = false;
      this.$refs.logisticFormFile.submit();
    },
    // 获取资源库目录
    getLeftTree() {
      let s = {
        menuType: 2
      };
      getLeftTreeInterface(s).then(res => {
        var arr = res.data.data;
        this.treeData = arr;
        // 先默认为第一个数据库
        this.value = arr[0].menuId;
        this.menuValue = arr[0].label;
        this.menuId = arr[0].menuId;
        if(arr[0].label == '物流数据库') {
          this.isShowSecond = true;
        } else {
          this.isShowSecond = false;
        }
        this.getTemplateName()
      });
    },
    // 快递表单添加文件的钩子
    beforeChange(file, fileList) {
      let fileType = file.raw.name.substr(file.raw.name.lastIndexOf('.')+1,file.raw.name.length);
      if (fileList.length > 1) { fileList.splice(0,1) }
      if(fileType == 'csv') {
        this.isShowInput = true;
      } else {
        this.isShowInput = false;
        this.logisticForm.splitStr = '';
      }
      readFile(file.raw).then(res => {
        this.keydataList = [];
        let testmsg = /\.(xls|xlsx|csv)(\?.*)?$/.test(file.raw.name)
        if(testmsg) {
          this.showTxt = 'excel'
          this.tableData = res.data;
          this.keydataList = Object.keys(this.tableData[0]);
        } else {
          this.showTxt = 'txt'
          this.txtContent = res.data.join('<br/>')
        }
        this.isFile = false;
        this.tablelist = true;
      }).catch(err => {
        this.tablelist = false;
        this.$message.error(err.msg) 
      })
    },
    // 快递表单导入上传钩子
    beforeFileUpload(file) {
      let testmsg = /\.(txt|xls|xlsx|csv)(\?.*)?$/.test(file.name)
      if (!testmsg) {
        this.$message.error('请上传正确的文档类型!');
        return
      }
      let fd = new FormData();
      fd.append('file', file);
      sendUploadFile(fd, this.logisticForm).then(res => {
        if(res.data.code == 1) {
          this.$message.success("上传成功！")
        this._clear();
        } else if(res.data.code == 0) {
          this.$message.warning(res.data.msg);
        }
      })
      return false;
    },
    // 上传文件成功处理，获取文件路径
    logisticFormFiledSuccess(response, file, fileList) {
      if (response.code == 1) {
        this.logisticForm.file = response.data.fileUrl;
        this.$alert("上传成功", "提示", {
          type: "success"
        });
        this.labDisabled = true;
        document.getElementById("logisticFormbtn1").classList.add("is-disabled");
        document.getElementById("logisticFormbtn2").classList.add("is-disabled");
      } else {
        this.$alert(response.msg, "提示", {
          type: "error"
        });
        fileList.length = 0;
      }
    },
    // 获取模板名称下拉select
    async getTemplateName() {
      const res = await getTemplateNameSelect(this.menuId)
      if(res.data.code == 1) {
        this.templateName = res.data.data;
      }
    },
    // 点击左边树形菜单
    handleNodeClick(data) {
      this._clear();
      this.activeName = 'first';
      this.automatic = 'first';
      if(data.menuId != this.menuId && this.activeName == "first"){
        this.menuId = data.menuId;
        this.getTemplateName();
        this.value = data.menuId;
        this.menuValue = data.label;
      }
      this.isShowSecond = false;
      if( this.menuValue == '物流数据库') {
        this.isShowSecond = true;
      }
    },
    // 清除数据
    _clear() {
      this.logisticForm = {
        expressType: '',
        chars: '',
        splitStr: '',
      };
      this.checked = false;
      // 表格数据
      this.tableData = [];
      this.tabDisplay = false;
      this.$nextTick(_=> {
        this.tabDisplay = true;
      })
    }
  },
}
</script>
<style scoped  rel="stylesheet/scss" lang="scss">

.el-tabs-box {
  padding-bottom: 20px;
}
.formbox {
  h3 {
    font-size: 16px;
    font-weight: 400;
    color: #009a52;
  }
  .el-tabs {
    font-weight: 400;
    color: #009a52;
  }
}

.btn-box {
  margin-top: 30px;
  text-align: center;
}

.data-submit-btn {
  width: 90px;
  height: 32px;
  line-height: 11px;
  margin-top: 14px;
}
.tree-box .el-tree{
  background-color: rgb(242, 242, 242);
}

.txt-box {
  border: 1px solid #c4c9d0;
  padding: 10px;
}

#roc11,
#roc12,
#roc13,
#roc14 {
  margin-top:20px;
  margin-left:2%;
  float:left;
  width:74%;
  border-top: 1px solid #fff;
}
.el-tag {
  margin-right: 4px;
}
</style>
