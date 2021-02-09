<template>
  <div>
    <div class="title">数据模板管理</div>
    <div style="margin:20px 0 20px 20px;float:left;width:20%">
      <div class="title3">
        <p class="title-size">资源目录</p>
      </div>
      <el-row class="tac">
        <el-col>
          <el-tree
            :data="treeData"
            @node-click="handleNodeClick"
            :props="defaultProps"
            node-key="value"
            accordion
            class="trr"
            highlight-current
            empty-text="正在加载中"
          ></el-tree>
        </el-col>
      </el-row>
    </div>
    <!-- 物流数据模板 -->
    <div class="formbox" id="roc14">
      <el-tabs>
        <el-tab-pane :label="menuValue">
          <div class="input-box">
            <el-input v-model="modelName" placeholder="数据模板名称" style="width:200px"></el-input>
            <el-button
              type="primary"
              icon="el-icon-search"
              size="small"
              @click="getDataModelTable(1)"
              style="margin-left:10px"
            >查询</el-button>
            <el-button type="primary" size="small" @click="creatModel" icon="el-icon-plus">添加</el-button>
          </div>
          <!-- 数据模板表格 -->
          <el-table :data="dataModelTable" border style="width: 100%"  :header-cell-style="{
              'background-color': '#f5f7fa',
              'color': 'rgb(103, 194, 58)',
               }">
            <el-table-column prop="ROWNUM_" label="序号" width="60px"></el-table-column>
            <el-table-column prop="DATANAME" label="数据模板名称"></el-table-column>
            <el-table-column prop="DATADESC" label="描述" width="100px"></el-table-column>
            <el-table-column prop="CREATEUSER" label="创建人" width="100"></el-table-column>
            <el-table-column width="160" prop="CREATETIME" label="创建时间"></el-table-column>

            <el-table-column prop="address" label="操作" width="160" fixed="right">
              <template slot-scope="scope">
                <div class="handle-col">
                  <diy-btn styleType="icon" iconType="icon-download" @click="templateDownload(scope.row)"></diy-btn>
                  <diy-btn styleType="icon" iconType="icon-del" @click="remove(scope.row)"></diy-btn>
                  <diy-btn styleType="icon" iconType="icon-preview" @click="getShow(scope.row)"></diy-btn>
                </div>
              </template>
            </el-table-column>
          </el-table>
          <!-- 页脚分页 -->
          <div class="block">
            <el-pagination
              style="text-align: center"
              :page-sizes="[10,20,30, 50]"
              :page-size="10"
              layout="total,  prev, pager, next, jumper"
              :current-page="dataModelForm.pageNumber"
              @current-change="handleCurrentChange"
              :total="total"
            ></el-pagination>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <!-- 添加自定义弹窗 -->
    <el-dialog
      class="dialogTitle difinedialog"
      title="添加数据模板自定义"
      :visible.sync="userDefinedShow"
      :before-close="handleClose"
      :close-on-click-modal="false"
      >
      <div class="model-box">
        <el-form
          :model="dataModelForm"
          :inline="true"
          :rules="rules"
          ref="dataModelForm"
          label-width="120px"
          class="demo-dataModelForm"
          >
          <div class="input-line">
            <el-col :span="12">
              <el-form-item label="数据模板名称" width="100px" prop="dataName">
                <el-input v-model="dataModelForm.dataName" @change="showValue"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="数据模板描述" prop="dataDesc">
                <el-input v-model="dataModelForm.dataDesc" @change="showValue"></el-input>
              </el-form-item>
            </el-col>
          </div>
          <div class="input-line3">
            <!-- 自定义模型表格 -->
            <easy-table 
              :tableData="tableData" 
              :options="options"
              @celledit="cellEditDone"
              @removecell="removeTemple"
            ></easy-table>
            <el-button class="add-btn" type="primary" size="small" icon="el-icon-plus" @click="addRowInfo">添加</el-button>
          </div>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button class="btn-width" type="primary4" size="small" @click="back">取消</el-button>
        <el-button class="btn-width" type="primary"  size="small" style="margin-left:50px;"  @click="completeClose('dataModelForm')">完成</el-button>
      </span>
    </el-dialog>
    <!--添加预览详情的弹框-->
    <el-dialog :title="modelNameShow+'详情'" :visible.sync="dialogTableVisible">
      <el-table :data="ModelTableDataShow" :header-cell-style="{
              'background-color': '#f5f7fa',
              'color': 'rgb(103, 194, 58)',
               }" class="template-table">
        <el-table-column label="序号" type="index"></el-table-column>
        <el-table-column property="columnComment" label="属性名称" ></el-table-column>
        <el-table-column property="columnType" label="属性类型" ></el-table-column>
        <el-table-column property="columnLength" label="属性长度"></el-table-column>
        <el-table-column property="columnDesc" label="属性描述" ></el-table-column>
        <!--<el-table-column property="columnComment" label="属性注释" ></el-table-column>-->
      </el-table>
    </el-dialog>
  </div>
</template>
<script>
import Vue from 'vue'
import easyTable from '@/components/easyTable/easyTable.vue'
import { getLeftTreeInterface } from "@/api/resource_list";
import {
  getLogisticsList,
  getDataModelTypeList,
  setDataModelTypeForm,
  getDataModelTablelist,
  getDataModelRemove,
  downloadModelForm,
  getDataModelShow
} from "@/api/datamanage";
// 引入样式
import 'vue-easytable/libs/themes-base/index.css'
// 导入 table 和 分页组件
import { VTable } from 'vue-easytable';
export default {
  components: {
    VTable, easyTable,
  },
  data() {
    return {
      tabPosition: "",
      // 数据库目录
      treeData: [],
      defaultProps: {
        children: "children",
        label: "label"
      },
      // 属性类型
      dataTypeList: [],
      attrType: "",
      modelName: "",
      // 表格内容
      // 数据模板表格
      dataModelTable: [],
      //easyTable表格渲染数据
      tableData: [],
      //easyTable表格渲染的每一列
      options: [
        {field: 'columnComment', title:'属性名称'},
        {field: 'columnType', title: '属性类型'},
        {field: 'columnLength', title: '属性长度'},
        {field: 'columnDesc', title: '属性描述'},
        {field: 'adit', title: '操作'},
      ],
      TempObject : {
        columnName: "",
        columnComment: "",
        columnLength: "",
        columnType: "",
        columnDesc: "",
        state: 1
      },
      total: null,
      index: null,
      userDefinedShow: false,
      // 表单内容
      dataModelForm: {
        pageNumber: 1,
        dataA: "",
        dataB: null,
        dataC: null,
        dataD: null,
        dataDesc: "",
        dataName: "",
        dataTable: "",
        dataTableColumns: [
          // 注释的为完整数据
          // {
          //   columnComment: "",
          //   columnDesc: "",
          //   columnLength: null,
          //   columnName: "",
          //   columnType: "",
          //   dataA: "",
          //   dataB: null,
          //   dataC: null,
          //   dataD: null,
          //   dataId: null,
          //   id: null,
          //   state: 1
          // }
        ],
        dataType: null,
        id: null,
        state: 1,
      },
      ModelTableDataShow:[],
      dialogTableVisible:false,
      modelNameShow:'',
      rules: {
        dataName: [
          { required: true, message: "请输入数据模板名称", trigger: "blur" }
        ],
        dataDesc: [
          { required: true, message: "请填写数据模板描述", trigger: "blur" }
        ],
        columnLength: [
          {
            required: false,
            type: "number",
            message: "必须为数字",
            trigger: ["blur", "change"]
          }
        ]
      },
      menuId: null,
      //用这个判断目录切换
      menuValue: null,
      isAdit: false
    };
  },
  created() {
    this.getLeftTree();
  },
  mounted() {
  },
  methods: {
    addRowInfo() {
      let obj = {
        columnComment: "",
        columnLength: "",
        columnType: "",
        columnDesc: "",
        state: 1
      };
      this.tableData.push(obj);
    },
    // 单元格编辑回调
    cellEditDone(newValue,oldValue,rowIndex,rowData,field){
      this.isAdit = true;
    },
    // 删除一条模板数据
    removeTemple(row) {
      // 可以不写此步骤，但是为了防止客户点击表单提交后，名称重复时，又想删除模板数据
      this.dataModelForm.dataTableColumns.splice(row.index, 1);
    },
    remove(row) {
      var _this = this;
      _this
        .$confirm("如果删除该数据模板，则对应的模板下面的数据集也将被删除，是否删除？", "提示", {
          type: "warning"
        })
        .then(function() {
          getDataModelRemove(row)
            .then(res => {
              if (res.data.code != "1") {
                _this.$message.error(res.data.msg);
                return false;
              } else {
                _this.$message.success("删除成功");
                _this.getDataModelTable();
              }
            })
        })
        .catch(() => {
          _this.$message.info("已取消删除");
        });
    },
    showValue() {
      this.isAdit = true;
    },
    //预览
    getShow(row) {
      var _this = this;
      _this.dialogTableVisible = true;
      console.log(row)
      getDataModelShow(row)
        .then(res => {
          if(res.data.code == 1) {
            this.modelNameShow = row.DATANAME;
            console.log(this.modelNameShow)
            _this.ModelTableDataShow = res.data.data;
            console.log(res.data)
          }
        })
        .catch(() => {
          _this.$message.info("已取消删除");
        });
    },
    // 获取资源库目录
    getLeftTree() {
      let s = {
        menuType: 2
      };
      getLeftTreeInterface(s).then(res => {
        var arr = res.data.data;
        this.treeData = arr;
        this.menuValue = arr[0].label;
        this.menuId = arr[0].menuId;
        this.dataModelForm.dataType = arr[0].menuId;
        this.getDataModelTable();
      });
    },
    // 点击当前节点
    handleNodeClick(data) {
      this.menuId = data.menuId;
      if (data.menuId != this.dataModelForm.dataType) {
        this.dataModelForm.dataType = data.menuId;
        this.getDataModelTable();
      }
      this.menuValue = data.label;
    },
    // 获取数据模板默认表格数据
    async getDataModelTable(val) {
      if(val){
        var ss = {
          dataType: this.dataModelForm.dataType,
          dataName: this.modelName,
          pageNumber: 1
        }
      }else{
        var ss = {
          dataType: this.dataModelForm.dataType,
          dataName: this.modelName,
          pageNumber:  this.dataModelForm.pageNumber
        }
      }
      console.log(ss);
      const res = await getDataModelTablelist(ss);
      if (res.data.code == 1) {
        this.total = res.data.data.total;
        this.dataModelTable = res.data.data.rows;
      } else {
        this.$message.error(res.data.msg);
      }
    },
    // 查询数据模板表格数据
    getModelList() {},
    // 获取属性类型
    async getDataModelType() {
      const res = await getDataModelTypeList();
      const {
        data: { data, code, msg }
      } = res;
      if (code == 1) {
        this.dataTypeList = data;
        console.log(this.dataTypeList)
      } else {
        this.$message.warning(msg);
      }
    },
    // 切换分页
    handleCurrentChange(val) {
      this.dataModelForm.pageNumber = val;
      this.getDataModelTable();
    },
    // 新增模型
    creatModel() {
      this.userDefinedShow = true;
    },
    attrTypeChange(val) {
      this.TempObject.columnLength = "";
      this.TempObject.columnType = val;
    },

    // 返回
    back() {
      this.isAdit = false;
      this.userDefinedShow = false;
      this.$refs.dataModelForm.resetFields();
      this._clear();
    },
    // 完成按钮
    completeClose(dataModelForm) {
      this.$refs.dataModelForm.validate(valid => {
        if (valid) {
          let temp = false;
          if(this.tableData.length == 0) return this.$message.error("请添加表格数据！");
          this.tableData.forEach(item => {
            if(item.columnType == "Varchar") {
              for(let key in item) {
                if(item[key] == "") {
                  temp = true;
                }
              }
            } else {
              for(let key in item) {
                if(item[key] == "" && key != "columnLength") {
                  temp = true;
                }
              }
            }
          })
          if(temp) return this.$message.error("请将表格数据填写完整！");
          this.dataModelForm.dataTableColumns = this.tableData;
          console.log(this.dataModelForm);
          setDataModelTypeForm(this.dataModelForm).then(res => {
            const {
              data: { code, msg }
            } = res;
            if (code == 1) {
              this.$message.success("数据模板添加成功！");
              this.isData = false;
              this._clear();
              this.$refs.dataModelForm.resetFields();
              this.userDefinedShow = false;
              this.isAdit = false;
              this.getDataModelTable();
            } else {
              return this.$message.error(msg);
            }
          });
        }
      });
    },
    // 点击x号关闭弹窗
    handleClose() {
      if(this.isAdit) {
        this.$confirm('编辑的内容可能没有保存，确定关闭?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.isAdit = false;
          this.userDefinedShow = false;
          this.resetValidate("dataModelForm");
          this._clear();
        })
      } else {
        this.userDefinedShow = false;
        this.resetValidate("dataModelForm");
        this._clear();
      }
    },
    // 下载模板
    templateDownload(row) {
      let param = { tableId: row.ID, fileName: row.DATANAME };
      downloadModelForm(param).then(res => {
        window.location = `${res.config.url}`;
      });
    },
    // 清除数据
    _clear() {
      this.dataModelForm = {
        pageNumber: 1,
        dataA: "",
        dataB: null,
        dataC: null,
        dataD: null,
        dataDesc: "",
        dataName: "",
        dataTable: "",
        dataTableColumns: [],
        dataType: this.menuId,
        id: null,
        state: 1
      };
      this.attrType = "";
      this.TempObject = {
        columnName: "",
        columnComment: "",
        columnLength: "",
        columnType: "",
        columnDesc: ""
      };
      this.tableData = [];
    },
    resetValidate(formName) {
      this.$refs[formName].resetFields();
    },
  }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>

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

.input-box {
  margin-bottom: 20px;
}

.el-input__inner.number {
  -moz-appearance: textfield;
}
.el-input__inner.number:hover {
  -moz-appearance: textfield;
}
.el-input__inner.number::-webkit-inner-spin-button,
.el-input__inner.number::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
.el-input__inner.number::-webkit-inner-spin-button:hover,
.el-input__inner.number::-webkit-outer-spin-button:hover {
  -webkit-appearance: none;
  margin: 0;
}
.model-box {
  padding: 0 20px;
}
.add-btn {
  margin-top: 20px;
}
.tree-box .el-tree {
  background-color: rgb(242, 242, 242);
}

.input-line,
.input-line2 {
  width: 100%;
  height: 60px;
  border-bottom: 1px solid #d5dce5;
  margin-top: 20px;
}

.input-line2 {
  height: 190px;
}

.input-line3 {
  margin: 20px;
}

#roc14 {
  margin-top: 20px;
  margin-left: 2%;
  float: left;
  width: 74%;
  border-top: 1px solid #fff;
}
.el-dialog__header{
  border: none!important;
}

.el-table th.is-leaf{
  border: none!important;
}
</style>
