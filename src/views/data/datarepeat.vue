<template>
  <div>
    <div class="title">数据排重</div>
    <div style="margin: 20px 0px 20px 20px; float: left; width: 20%">
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
    <!-- 数据模型 -->
    <div class="formbox" id="roc14">
      <el-tabs :tab-position="tabPosition" class="el-tabs-box">
        <el-tab-pane :label="menuValue">
          <div class="input-box">
            <el-form
              :model="repeatDataModelForm"
              :inline="true"
              :rules="rules"
              ref="repeatDataModelForm"
              label-width="120px"
              class="demo-repeatDataModelForm"
            >
              <div class="input-line2 el-select-size">
                <el-col :span="24">
                  <el-form-item label="数据集" prop="collectId">
                    <el-select
                      v-model="repeatDataModelForm.collectId"
                      placeholder="请选择数据集"
                      @change="repeatChange"
                    >
                      <el-option
                        v-for="item in repeatFromNameList"
                        :key="item.ID"
                        :label="item.COLLECTNAME"
                        :value="item.ID"
                      >
                      </el-option>
                    </el-select>
                    <!-- <el-button icon="el-icon-search" circle size="small" @click="searchData"></el-button> -->
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="排重属性" prop="repeatPropeName">
                    <el-select
                      v-model="repeatDataModelForm.repeatPropeName"
                      @change="propChange"
                      multiple
                      placeholder="请选择排重属性"
                    >
                      <el-option
                        v-for="item in repeatPropeList"
                        :key="item.id"
                        :label="item.columnComment"
                        :value="item.id"
                      >
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <div class="clean-item">
                    <el-tag
                      v-for="tag in repeatTags"
                      :key="tag.id"
                      closable
                      size="small"
                      :type="tag.type"
                      @close="closeCleanTag(tag.id)"
                    >
                      {{ tag.columnComment }}
                    </el-tag>
                  </div>
                </el-col>
                <el-col :span="24">
                  <el-form-item
                    prop="tally"
                    label="选择所属标签"
                    label-width="120px"
                    class="collectId"
                    id="collectId"
                  >
                    <el-select
                      v-model="tallyValue1"
                      placeholder="请选择标签分组"
                      @change="tabs"
                    >
                      <el-option
                        v-for="item in tallyData.classify1"
                        :key="item.id"
                        :label="item.typeName"
                        :value="item.id"
                      ></el-option>
                    </el-select>

                    <el-select
                      v-model="tallyValue2"
                      placeholder="请选择标签内容"
                      @change="tabsTwo"
                    >
                      <el-option
                        v-for="item in tallyData.classify2"
                        :key="item.id"
                        :label="item.labelName"
                        :value="item.id"
                      ></el-option>
                    </el-select>
                    <div class="tag-box">
                      <el-tag
                        v-for="tag in tags"
                        :key="tag.index"
                        closable
                        size="small"
                        :type="tag.type"
                        @close="handleCloseTag(tag)"
                        >{{ tag.name }}</el-tag
                      >
                    </div>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="排重后数据集" prop="collectName">
                    <el-input
                      v-model="repeatDataModelForm.collectName"
                      placeholder="请输入数据集名称"
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="下载是否审核" prop="">
                    <template>
                      <el-radio
                        v-model="repeatDataModelForm.auditState"
                        label="1"
                        >是</el-radio
                      >
                      <el-radio
                        v-model="repeatDataModelForm.auditState"
                        label="2"
                        >否</el-radio
                      >
                    </template>
                  </el-form-item>
                </el-col>
                <!-- <el-col :span="10" class="btn-col">
                  <el-button class="model-btn" type="primary2" @click="addClearRules">查询</el-button>
                </el-col> -->
              </div>
              <!-- 数据模型表格 -->
              <!-- <el-table
                border
                ref="multipleTable"
                :data="tableData"
                tooltip-effect="dark"
                style="width: 100%"
                @selection-change="handleSelectionChange">
                <el-table-column
                  type="selection"
                  width="55">
                </el-table-column>
                <el-table-column
                  label="数据集名称"
                  width="200">
                  <template slot-scope="scope">{{ scope.row.modelName }}</template>
                </el-table-column>
                <el-table-column
                  prop="name"
                  label="数据模型"
                  width="120">
                </el-table-column>
                <el-table-column
                  prop="address"
                  label="创建人"
                  show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                  prop="date"
                  label="创建时间"
                  show-overflow-tooltip>
                </el-table-column>
              </el-table> -->
              <div class="clear-btn">
                <!-- <el-button type="primary" @click="delData('repeatDataModelForm')">删除</el-button> -->
                <el-button
                  type="primary"
                  size="small"
                  @click="deWeightData('repeatDataModelForm')"
                  >开始排重</el-button
                >
                <!-- <el-button type="primary" @click="achieveData('repeatDataModelForm')">完成</el-button> -->
              </div>
            </el-form>
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
  getCleanDataList,
  getCleanFormPropList,
  getRepeatDataResult,
  getTypeListAll,
  getLabellistall,
} from "@/api/datamanage";
import { getDownloadIsAudit } from "@/api/manualupload";
//  这里排重与清洗公用获取表单名和属性名接口
export default {
  data() {
    return {
      treeData: [],
      tabPosition: "",
      defaultProps: {
        children: "children",
        label: "label",
      },
      modelName: "",
      // 表格内容
      tableData: [],
      value: null,
      // 标签选择级联下拉数据
      tallyData: {
        classify1: [],
        classify2: [],
      },
      tallyValue1: "",
      tallyValue2: "",
      tallyValueArr: [],
      tallyName1: "",
      tallyName2: "",
      tallyNameArr: [],
      tags: [],
      repeatTags: [],
      tagsType: "success",
      // 表单内容
      repeatDataModelForm: {
        repeatPropeName: [],
        collectId: null,
        collectName: "",
        menuType: null,
        operDesc: "",
        operStr: "",
        dataA: "",
        dataB: "",
        auditState: "",
      },
      // 排重数据集下拉
      repeatFromNameList: [],
      // 排重属性
      repeatPropeList: [],
      clearDataShow: false,
      // 弹出框表格
      tableData: [
        {
          modelName: "2019年1月份中通投递数据",
          address: "test1",
          name: "小明",
          date: "2019.4.14",
        },
      ],
      multipleSelection: [],
      rules: {
        collectId: [
          { required: true, message: "请选择排重数据集", trigger: "change" },
        ],
        repeatPropeName: [
          { required: true, message: "请选择排重属性", trigger: "change" },
        ],
        collectName: [
          { required: true, message: "请输入表单名称", trigger: "blur" },
        ],
      },
      // tag标签
      dynamicTags: ["标签一", "标签二", "标签三"],
      //用这个判断目录切换
      menuValue: "",
      isAudit: "",
    };
  },
  created() {
    this.getLeftTree();
    this.getDownloadAudit();
  },
  methods: {
    getDownloadAudit() {
      let params = {
        type: 2,
      };
      getDownloadIsAudit(params).then((res) => {
        this.isAudit = res.data.data;
        this.repeatDataModelForm.auditState = res.data.data;
      });
    },
    // 获取资源库目录
    getLeftTree() {
      let s = {
        menuType: 2,
      };
      getLeftTreeInterface(s).then((res) => {
        console.log(res);
        var arr = res.data.data;
        this.treeData = arr;
        this.value = arr[0].menuId;
        this.menuValue = arr[0].label;
        this.getRepeatData();
        getTypeListAll().then((res) => {
          if (res.data.code == 1) {
            this.tallyData.classify1 = res.data.data;
          }
        });
      });
    },
    // 点击当前节点
    handleNodeClick(data) {
      // 初始化表单及验证
      this._clear();
      this.resetValidate("repeatDataModelForm");

      if (data.menuId != this.value) {
        this.value = data.menuId;
        this.menuValue = data.label;
        this.getRepeatData();
        this.repeatDataModelForm.collectId = "";
        this.repeatDataModelForm.repeatPropeName = [];
        getTypeListAll().then((res) => {
          if (res.data.code == 1) {
            this.tallyData.classify1 = res.data.data;
          }
        });
      }
    },
    // 获取排重数据集数据内容
    getRepeatData() {
      getCleanDataList(this.value).then((res) => {
        console.log(res.data);
        if (res.data.code == 1) {
          this.repeatFromNameList = res.data.data;
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    propChange() {
      this.repeatTags = [];
      for (
        let i = 0;
        i < this.repeatDataModelForm.repeatPropeName.length;
        i++
      ) {
        let obj = {};
        obj = this.repeatPropeList.find((item) => {
          return item.id === this.repeatDataModelForm.repeatPropeName[i];
        });
        obj.type = "success";
        this.repeatTags.push(obj);
      }
    },
    closeCleanTag(id) {
      this.repeatDataModelForm.repeatPropeName.splice(
        this.repeatDataModelForm.repeatPropeName.indexOf(id),
        1
      );
      this.propChange();
    },
    // 标签选择
    tabs(id) {
      let data = { labelTypeId: id };
      getLabellistall(data).then((res) => {
        let obj = {};
        obj = this.tallyData.classify1.find((item) => {
          return item.id === id;
        });

        this.tallyName1 = obj.typeName;
        this.tallyData.classify2 = res.data.data;
        this.tagsType = "success";
      });
      this.tallyValue2 = "";
      this.tallyName2 = "";
    },
    tabsTwo(id) {
      let obj2 = {};
      obj2 = this.tallyData.classify2.find((item) => {
        return item.id === id;
      });
      this.tallyName2 = obj2.labelName;
      // 判断添加的标签是否重复
      let temp = true;
      for (let i = 0; i < this.tallyNameArr.length; i++) {
        if (this.tallyName2 === this.tallyNameArr[i]) {
          temp = false;
        }
      }
      if (temp) {
        this.tallyValueArr.push(this.tallyValue2);
        this.tallyNameArr.push(this.tallyName2);
        this.tags.push({
          name: this.tallyName1 + ": " + this.tallyName2,
          type: this.tagsType,
          id: id,
        });
        const arr = this.tags.map((item) => {
          return item.name;
        });
        this.repeatDataModelForm.dataA = this.tallyValueArr.join(",");
        this.repeatDataModelForm.dataB = arr.join(",");
      } else {
        console.log("有重复");
        this.$message.warning("不可以重复提交");
        this.tallyName2 = "";
        this.tallyValue2 = "";
      }
    },
    handleCloseTag(tag) {
      // console.log(tag);
      let tagName = tag.name.match(/\s(\S*)/)[1];
      console.log(this.tallyNameArr.indexOf(tagName));
      this.tallyNameArr.splice(this.tallyNameArr.indexOf(tagName), 1);
      this.tallyValueArr.splice(this.tallyValueArr.indexOf(tag.id), 1);
      this.tags.splice(this.tags.indexOf(tag), 1);
      const arr = this.tags.map((item) => {
        return item.name;
      });
      this.repeatDataModelForm.dataA = this.tallyValueArr.join(",");
      this.repeatDataModelForm.dataB = arr.join(",");
    },

    // 获取排重属性
    repeatChange(item) {
      this.repeatDataModelForm.repeatPropeName = [];
      let tableId = this.repeatFromNameList.filter((element) => {
        if (element.ID == item) return element;
      });
      getCleanFormPropList(tableId[0].TABLEID).then((res) => {
        console.log(res);
        if (res.data.code == 1) {
          this.repeatPropeList = res.data.data;
        }
      });
    },
    getModelList() {},
    // 删除
    delData() {},
    // 开始排重
    deWeightData(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 通过value获取清洗属性名称lable
          let arr = [];
          for (
            let i = 0;
            i < this.repeatDataModelForm.repeatPropeName.length;
            i++
          ) {
            let obj = {};
            obj = this.repeatPropeList.find((item) => {
              return item.id === this.repeatDataModelForm.repeatPropeName[i];
            });
            arr.push(obj.columnName);
          }
          let columnName = arr.join(",");
          let repeatDataModelForm = {
            collectName: this.repeatDataModelForm.collectName,
            collectId: this.repeatDataModelForm.collectId,
            menuType: this.value,
            operDesc: `${columnName}`,
            operStr: `${this.repeatDataModelForm.repeatPropeName.join(",")}`,
            dataA: this.repeatDataModelForm.dataA,
            dataB: this.repeatDataModelForm.dataB,
            auditState: this.repeatDataModelForm.auditState,
          };
          console.log(repeatDataModelForm);
          getRepeatDataResult(repeatDataModelForm).then((res) => {
            console.log(res.data);
            if (res.data.code == 1) {
              this.$message.success("提交成功！");
              this._clear();
              this.resetValidate(formName);
            } else {
              this.$message.error(res.data.msg);
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 完成
    achieveData() {},
    // 点击搜索按钮
    searchData() {
      this.clearDataShow = true;
    },

    // 增加排重规则
    addClearRules() {},
    // 表格选择
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 重置校验规则
    resetValidate(formName) {
      this.$refs[formName].resetFields();
    },
    // 清除数据
    _clear() {
      // 清除排重传参
      this.repeatDataModelForm = {
        repeatPropeName: [],
        collectId: null,
        collectName: "",
        menuType: 14,
        operDesc: "",
        operStr: "",
        dataA: "",
        dataB: "",
        auditState: this.isAudit,
      };
      // 标签
      this.tallyValue1 = "";
      this.tallyValue2 = "";
      this.tallyValueArr = [];
      this.tallyName1 = "";
      this.tallyName2 = "";
      this.tallyNameArr = [];
      this.tags = [];
      this.repeatTags = [];
      // this.tallyData.classify1 = [];
      this.tallyData.classify2 = [];
    },
  },
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
  padding: 0 14%;
  margin-bottom: 20px;
}

.el-select-size .el-select {
  width: 200px;
}

.model-btn:hover,
.model-btn:focus {
  color: #fff;
}

.btn-col {
  text-align: right;
}
.creat-btn {
  width: 70px;
  color: #009a52;
  border: 1px solid #009a52;
  background-color: #fff;
  &:hover {
    color: #fff;
    background-color: #009a52;
  }
}

.date-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-left: 10px;
}

.tag-box {
  margin-top: 10px;
  .el-tag {
    margin-right: 4px;
  }
}
.clean-item {
  margin: -10px 0 10px 120px;
  .el-tag {
    margin-right: 4px;
    margin-bottom: 4px;
  }
}
.add-btn {
  padding-left: 20px;
}

.clear-btn {
  margin-left: 140px;
  margin-top: 20px;
  .el-button {
    &:hover {
      color: #fff;
      background-color: #127714;
    }
  }
}

.search-btn {
  .el-button {
    &:hover {
      color: #fff;
      background-color: #127714;
    }
  }
}

.input-style {
  width: 140px;
}

.model-btn {
  height: 30px;
  line-height: 8px;
}

.tree-box .el-tree {
  background-color: rgb(242, 242, 242);
}

.input-line,
.input-line2,
.input-line3 {
  width: 100%;
  height: 60px;
  margin-top: 10px;
}

.input-line2 {
  height: 120px;
}

.input-line3 {
  height: 80px;
  padding-left: 20px;
}

#roc14 {
  margin-top: 20px;
  margin-left: 2%;
  float: left;
  width: 74%;
  border-top: 1px solid #fff;
}

.checkbox-style {
  margin-left: 60px;
}
#collectId {
  display: flex;
  justify-content: flex-start;
  flex-wrap: nowrap;
  .el-form-item__label {
    width: 120px !important;
  }
}
#collectId /deep/ .tag-box {
  width: 400px;
}
</style>
