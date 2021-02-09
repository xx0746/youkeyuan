<template>
  <div>
    <div class="title">数据导入</div>

    <div
      style="
        margin-top: 20px;
        margin-left: 20px;
        float: left;
        width: 20%;
        height: 100%;
        padding-bottom: 300px;
      "
    >
      <div class="title3">
        <p class="title-size">资源目录</p>
      </div>
      <el-row class="tac" style="height: 100%">
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
        <el-tab-pane :label="menuValue" name="first" class="el-tabs-box">
          <el-form
            ref="templateForm"
            :model="templateForm"
            label-width="120px"
            :rules="templateFormlist"
          >
            <el-form-item label="选择模板" prop="tableId">
              <el-select
                v-model="templateForm.tableId"
                placeholder="请选择数据模板"
                style="width: 218px"
              >
                <el-option
                  v-for="item in templateName"
                  :key="item.ID"
                  :label="item.DATANAME"
                  :value="item.ID"
                >
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
                :before-upload="templateBeforeFileUpload"
                :with-credentials="true"
                :disabled="templateFormDisabled"
                :auto-upload="false"
                :on-remove="removeflie"
              >
                <el-button
                  id="templateFormbtn1"
                  slot="trigger"
                  size="small"
                  type="primary"
                  >选取文件</el-button
                >
                <span class="btn-text">支持txt、xls、xlsx、csv文件类型</span>
              </el-upload>
            </el-form-item>
            <el-form-item label="下载是否审核" label-width="120px" prop="">
              <template>
                <el-radio v-model="templateForm.auditState" label="1"
                  >是</el-radio
                >
                <el-radio v-model="templateForm.auditState" label="2"
                  >否</el-radio
                >
              </template>
            </el-form-item>
            <el-form-item
              label="数据集名称"
              placeholder="请输入数据集名称"
              prop="collectName"
            >
              <el-input
                v-model="templateForm.collectName"
                style="width: 218px"
              ></el-input>
            </el-form-item>
            <el-form-item
              v-if="isShowInput"
              label="文件分隔符"
              placeholder="请输入文件分隔符"
              prop="splitStr"
            >
              <el-input
                v-model="templateForm.splitStr"
                style="width: 218px"
              ></el-input>
            </el-form-item>

            <el-form-item class="checkbox-style">
              <el-checkbox
                @change="changeFirstSelect"
                v-model="checked"
                style="
                  font-family: 'Avenir', Helvetica, Arial, sans-serif;
                  font-weight: 400;
                  color: #333;
                "
                >不导入第一行（如果第一行包括标题请勾选此项）</el-checkbox
              >
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                class="data-submit-btn"
                @click="onSubmitTemplate('templateForm')"
                >导入</el-button
              >
              <!-- <el-button type="primary2" class="data-submit-btn" @click="onSubmit">预览</el-button> -->
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane
          label="快递数据导入"
          name="second"
          v-if="isShowSecond"
          class="el-tabs-box"
        >
          <el-form
            ref="logisticForm"
            :model="logisticForm"
            label-width="100px"
            :rules="logisticFormlist"
          >
            <el-form-item label="快递公司" prop="">
              <el-select
                v-model="logisticForm.expressType"
                placeholder="请选择快递公司"
              >
                <el-option
                  v-for="item in logisticCompany"
                  :key="item.ID"
                  :label="item.COMPANYNAME"
                  :value="item.ID"
                >
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
                <el-button
                  id="logisticFormbtn1"
                  slot="trigger"
                  size="small"
                  type="primary"
                  >选取文件</el-button
                >
                <!-- <el-button
                id="logisticFormbtn2"
                style="margin-left: 10px;"
                size="small"
                type="primary"
                @click="logisticFormFileUp"
              >上传到服务器</el-button> -->
                <span class="btn-text">支持txt、xls、xlsx、csv文件类型</span>
              </el-upload>
            </el-form-item>
            <el-form-item
              v-if="isShowInput"
              label="文件分隔符"
              placeholder="请输入文件分隔符"
              prop="splitStr"
            >
              <el-input
                v-model="logisticForm.splitStr"
                style="width: 36%"
              ></el-input>
            </el-form-item>
            <!-- <el-form-item label="原始字符集">
              <el-select v-model="logisticForm.chars" placeholder="请选择字符集">
                <el-option
                  v-for="(item,key) in charList"
                  :key="key"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item> -->
            <el-form-item>
              <el-button
                type="primary"
                class="data-submit-btn"
                @click="onSubmit"
                >导入</el-button
              >
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
      <!-- 读取文件内容表格 -->
      <div v-show="tablelist" style="position: relative; margin-bottom: 14px">
        <el-table
          v-if="showTxt == 'excel'"
          height="300"
          :data="tableDataList"
          border
          style="width: 100%"
          :header-cell-style="{
            'background-color': '#f5f7fa',
            color: 'rgb(103, 194, 58)',
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
        <div class="txt-box" v-else-if="showTxt == 'txt'" v-html="txtContent">
          {{ txtContent }}
        </div>
        <p style="text-align: center; color: red; margin-top: 10px">
          * 数据仅供展示，只抽取部分数据...
        </p>
      </div>
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
} from "@/api/datamanage";
import { getDownloadIsAudit } from "@/api/manualupload";
import readFile from "@/utils/readFiles";
export default {
  data() {
    return {
      //用这个判断tab切换
      menuValue: "",
      value: "",
      activeName: "first",
      // 数据库目录
      treeData: [],
      // 快递数据导入数据
      logisticCompany: [],
      // 数据集导入数据
      templateName: [],
      // 字符集
      charList: [
        {
          value: "UTF-8",
          label: "UTF-8",
        },
        {
          value: "GB2312",
          label: "GB2312",
        },
        {
          value: "GBK",
          label: "GBK",
        },
      ],
      defaultProps: {
        children: "children",
        label: "label",
      },
      // 数据集信息
      form: {},
      // 提交快递数据导入表单数据
      logisticForm: {
        expressType: "",
        chars: "",
        splitStr: "",
      },
      menuId: null,
      isShowSecond: true,
      isShowInput: false,
      // 提交数据集导入表单数据
      templateForm: {
        menuType: null,
        firstSelect: 0,
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
      keydataList: [],
      tablelist: false,
      showTxt: "txt",
      txtContent: "",
      // 校验规则
      logisticFormlist: {
        logistics: [
          { required: true, message: "请选择物流公司", trigger: "blur" },
        ],
      },
      templateFormlist: {
        tableId: [
          { required: true, message: "请选择数据模型", trigger: "blur" },
        ],
        collectName: [
          { required: true, message: "请填写数据集名称", trigger: "blur" },
        ],
        splitStr: [
          { required: true, message: "请填写文件分隔符", trigger: "blur" },
        ],
      },
      isFile: true,
      logisticFormDisabled: false,
      headerType: { "Content-Type": "multipart/form_data" },
      checked: false,
      isAudit: "",
    };
  },
  computed: {
    tableDataList: function () {
      return this.tableData.slice(0, 5);
    },
  },
  created() {
    this.getLeftTree();
    this.getlogisticInfo();
    this.getDownloadAudit();
  },
  mounted() {},
  methods: {
    getDownloadAudit() {
      let params = {
        type: 2,
      };
      getDownloadIsAudit(params).then((res) => {
        this.isAudit = res.data.data;
        this.form.auditState = res.data.data;
      });
    },
    removeflie(file, fileList) {
      this.tablelist = false;
    },
    // tab切换事件
    handleClick(tab, event) {
      this.activeName = tab.name;
      this.isShowInput = false;
      this.logisticForm.splitStr = "";
      this.templateForm.splitStr = "";
    },
    // 获取物流列表
    async getlogisticInfo() {
      const res = await getLogisticsList();
      const {
        data: { code, data },
      } = res;
      this.logisticCompany = data;
    },
    // 提交快递
    onSubmit() {
      this.tablelist = false;
      this.$refs.logisticFormFile.submit();
    },
    // 提交数据集
    onSubmitTemplate(templateForm) {
      console.log(this.templateForm);
      if (this.isFile) return this.$message.warning("请选择您要导入的文件！");
      this.$refs[templateForm].validate((valid) => {
        if (valid) {
          this.tablelist = false;
          this.$refs.templateFormFile.submit();
        }
      });
    },
    // 获取资源库目录
    getLeftTree() {
      let s = {
        menuType: 2,
      };
      getLeftTreeInterface(s).then((res) => {
        var arr = res.data.data;
        this.treeData = arr;
        // 先默认为第一个数据库
        this.value = arr[0].menuId;
        this.menuValue = arr[0].label;
        this.menuId = arr[0].menuId;
        this.templateForm.menuId = arr[0].menuId;
        this.templateForm.menuType = arr[0].menuId;
        if (arr[0].label == "物流数据库") {
          this.isShowSecond = true;
        } else {
          this.isShowSecond = false;
        }
        this.getTemplateName();
      });
    },
    // 上传
    // 添加文件的钩子
    beforeChange(file, fileList) {
      let fileType = file.raw.name.substr(
        file.raw.name.lastIndexOf(".") + 1,
        file.raw.name.length
      );
      if (fileList.length > 1) {
        fileList.splice(0, 1);
      }
      if (fileType == "csv") {
        this.isShowInput = true;
      } else {
        this.isShowInput = false;
        this.templateForm.splitStr = "";
        this.logisticForm.splitStr = "";
      }
      readFile(file.raw)
        .then((res) => {
          console.log(res);
          this.keydataList = [];
          let testmsg = /\.(xls|xlsx|csv)(\?.*)?$/.test(file.raw.name);
          if (testmsg) {
            this.showTxt = "excel";
            this.tableData = res.data;
            this.keydataList = Object.keys(this.tableData[0]);
          } else {
            this.showTxt = "txt";
            this.txtContent = res.data.join("<br/>");
          }
          this.isFile = false;
          this.tablelist = true;
        })
        .catch((err) => {
          this.tablelist = false;
          this.$message.error(err.msg);
          if (this.activeName == "first") {
            this.$refs.templateFormFile.clearFiles();
          } else {
            this.$refs.logisticFormFile.clearFiles();
          }
        });
    },
    // 快递表单导入上传钩子
    beforeFileUpload(file) {
      let testmsg = /\.(txt|xls|xlsx|csv)(\?.*)?$/.test(file.name);
      if (!testmsg) {
        this.$message.error("请上传正确的文档类型!");
        return;
      }
      let fd = new FormData();
      fd.append("file", file);
      sendUploadFile(fd, this.logisticForm).then((res) => {
        if (res.data.code == 1) {
          this.$message.success("上传成功！");
          this._clear();
        } else if (res.data.code == 0) {
          this.$message.warning(res.data.msg);
        }
      });
      return false;
    },
    // 上传文件成功处理，获取文件路径
    logisticFormFiledSuccess(response, file, fileList) {
      if (response.code == 1) {
        this.logisticForm.file = response.data.fileUrl;
        this.$alert("上传成功", "提示", {
          type: "success",
        });
        this.labDisabled = true;
        document
          .getElementById("logisticFormbtn1")
          .classList.add("is-disabled");
        document
          .getElementById("logisticFormbtn2")
          .classList.add("is-disabled");
      } else {
        this.$alert(response.msg, "提示", {
          type: "error",
        });
        fileList.length = 0;
      }
    },
    // 数据集导入上传钩子
    templateBeforeFileUpload(file) {
      console.log(file);
      var testmsg = /\.(txt|xls|xlsx|csv)(\?.*)?$/.test(file.name);
      if (!testmsg) {
        this.$message.error("请上传正确的文档类型!");
        return;
      }
      let fd = new FormData();
      fd.append("file", file);
      console.log(fd);
      //debugger
      addTemplateTableData(fd, this.templateForm).then((res) => {
        if (res.data.code == 1) {
          this.tablelist = false;
          this.$message.success("上传成功！");
          this._clear();
        } else if (res.data.code == 0) {
          this.tablelist = true;
          this.$message.warning(res.data.msg);
          this.templateForm.collectName = "";
          this.isFile = true;
        }
      });
      return false;
    },
    changeFirstSelect(val) {
      if (val) {
        this.templateForm.firstSelect = 1;
      } else {
        this.templateForm.firstSelect = 0;
      }
    },
    // 获取模板名称下拉select
    async getTemplateName() {
      const res = await getTemplateNameSelect(this.menuId);
      if (res.data.code == 1) {
        this.templateName = res.data.data;
      }
    },
    // 点击左边树形菜单
    handleNodeClick(data) {
      console.log(data);
      this._clear();
      this.activeName = "first";
      if (data.menuId != this.menuId && this.activeName == "first") {
        this.menuId = data.menuId;
        this.templateForm.tableId = null;
        this.templateForm.menuId = data.menuId;
        this.templateForm.menuType = data.menuId;
        this.getTemplateName();
        this.value = data.menuId;
        this.menuValue = data.label;
      }
      this.isShowSecond = false;
      if (this.menuValue == "物流数据库") {
        this.isShowSecond = true;
      }
    },
    // 清除数据
    _clear() {
      this.logisticForm = {
        expressType: "",
        chars: "",
        splitStr: "",
      };
      this.checked = false;
      this.templateForm = {
        menuType: 11,
        firstSelect: 0,
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
    },
  },
};
</script>
<style scoped  rel="stylesheet/scss" lang="scss">
.el-tabs-box {
  padding: 20px;
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

.btn-text {
  margin-left: 30px;
}
.tree-box .el-tree {
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
  margin-top: 20px;
  margin-left: 2%;
  float: left;
  width: 74%;
  border-top: 1px solid #fff;
}
.el-tag {
  margin-right: 4px;
}

#templateFormbtn1.el-button--small {
  height: 26px !important;
  margin-top: 6px;
}
#logisticFormbtn1.el-button--small {
  height: 26px !important;
  margin-top: 6px;
}
</style>
