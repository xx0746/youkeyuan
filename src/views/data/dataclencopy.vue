<template>
  <div>
    <div class="title">数据清洗</div>

    <div style="margin-top:20px;margin-left:20px;float:left;width:20%">
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
      <el-tabs :tab-position="tabPosition" v-model="tabNameActive" class="el-tabs-box">
        <el-tab-pane :label="menuValue" name="first">
          <div class="input-box">
            <el-form
              :model="cleanCollect"
              :inline="true"
              :rules="cleanCollectRuls"
              label-position="right"
              ref="cleanCollect"
              label-width="120px"
              class="demo-cleanForm"
            >
              <div class="input-line2 el-select-size">
                <el-col :span="24">
                  <el-form-item label="数据集" prop="collectId">
                    <el-select
                      v-model="cleanCollect.collectId"
                      placeholder="请选择数据集"
                      @change="cleanChange"
                    >
                      <el-option
                        v-for="item in cleanFromNameList"
                        :key="item.ID"
                        :label="item.COLLECTNAME"
                        :value="item.ID"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="清洗规则" prop="rulesValue">
                    <el-select v-model="cleanCollect.rulesValue" placeholder="请选择清洗规则" @change="getRulesValue(cleanCollect.rulesValue)">
                      <el-option
                        v-for="item in cleanRulesList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                    <el-button size="small"  type="primary" @click="setReplace()" v-if="rulesValue == '4'">设置替换规则</el-button>
                  </el-form-item>
                </el-col>
                <el-col :span="24" >
                  <el-form-item label="清洗属性" prop="cleanPropeName">
                    <el-select v-model="cleanCollect.cleanPropeName" @change="propChange" multiple placeholder="请选择清洗属性">
                      <el-option
                        v-for="item in cleanPropeList"
                        :key="item.id"
                        :label="item.columnComment"
                        :value="item.id"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                  <div class="clean-item">
                    <el-tag
                      v-for="tag in cleanTags"
                      :key="tag.id"
                      closable
                      size="small"
                      :type="tag.type"
                      @close="closeCleanTag(tag.id)">
                      {{tag.columnComment}}
                    </el-tag>
                  </div>
                </el-col>
                <el-col :span="24">
                  <el-form-item prop="tally" label="选择所属标签" label-width="120px" class="collectId" id="collectId">
                    <el-select v-model="tallyValue1" placeholder="请选择标签分组" @change="tabs">
                      <el-option
                        v-for="item in tallyData.classify1"
                        :key="item.id"
                        :label="item.typeName"
                        :value="item.id"
                      ></el-option>
                    </el-select>
                    <el-select v-model="tallyValue2" placeholder="请选择标签内容" @change="tabsTwo">
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
                      >{{tag.name}}</el-tag>
                    </div>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="清洗后数据集" prop="collectName">
                    <el-input v-model="cleanCollect.collectName"  placeholder="请输入数据集名称"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="下载是否审核" label-width="120px" prop>
                    <template>
                      <el-radio v-model="cleanCollect.auditState" label="1">是</el-radio>
                      <el-radio v-model="cleanCollect.auditState" label="2">否</el-radio>
                    </template>
                  </el-form-item>
                </el-col>
              </div>
              <div class="clear-btn">
                <el-button size="small"  type="primary" @click="clearData('cleanCollect')">开始清洗</el-button>
              </div>
            </el-form>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <el-dialog
      title="设置替换规则"
      :visible.sync="dialogVisible"
      width="40%"
      :before-close="canClose">
      <el-form ref="charsForm" :model="charsForm" label-width="100px" class=chars-main>
        <el-col :span='24' style="margin-bottom:10px;">
          <el-button size="small" type="primary" icon="el-icon-plus" @click=addChars()>添加规则</el-button>
        </el-col>
        <el-col :span='24' class="chars-box">
          <span class="chars">替换原有字符</span><el-input v-model="charsForm.originalchar1"  placeholder="请输入内容"/><span class="chars-replace">为</span><el-input v-model="charsForm.replacechar1" placeholder="请输入内容"/>
        </el-col>
        <el-col :span='24' class="chars-box">
          <span class="chars">替换原有字符</span><el-input v-model="charsForm.originalchar2"  placeholder="请输入内容"/><span class="chars-replace">为</span><el-input v-model="charsForm.replacechar2" placeholder="请输入内容"/>
        </el-col>
        <!-- <el-col :span='24' class="chars-box" v-for="(item,index) in charsList" :key="index">
          <span class="chars">替换原有字符</span><el-input v-model="item.originalchar"  placeholder="请输入内容"/><span class="chars-replace">为</span><el-input v-model="item.replacechar" placeholder="请输入内容"/> <i class="el-icon-close"  @click="deleteChars(item, index)"></i>
        </el-col> -->
        <add-date-set :charsList='charsList' @deleteChars="deleteChars" styleType="chars"></add-date-set>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="dialogVisible = false">完成</el-button>
      </span>
  </el-dialog>
  </div>
</template>
<script>
import { getLeftTreeInterface } from "@/api/resource_list";
import {
  getLogisticsList,
  getCleanDataList,
  getCleanFormPropList,
  getCleanDataResult,
  getTypeListAll,
  getLabellistall
} from "@/api/datamanage";
import addDateSet from '@/components/createData/addDateSet'
export default {
  components: {
    addDateSet
  },
  data() {
    return {
      tabNameActive: 'first',
      fatherAndSonCompany:'<el-checkbox v-model="checked">此为子公司</el-checkbox>',
      treeData: [],
      tabPosition: "",
      defaultProps: {
        children: "children",
        label: "label"
      },
      // 表格内容
      tableData: [],
      value: null,
      // 标签选择级联下拉数据
      tallyData: {
        classify1: [],
        classify2: []
      },
      tallyValue1: "",
      tallyValue2: "",
      tallyValueArr: [],
      tallyName1: "",
      tallyName2: "",
      tallyNameArr: [],
      tags: [],
      cleanTags: [],
      tagsType: "success",
      // 日期
      starDate: "",
      endDate: "",
      // 清洗数据集下拉
      cleanFromNameList: [],
      // 清洗属性
      cleanPropeList: [],
      // 清洗规则
      cleanRulesList: [
        { value: 1, label: "去除首尾空格" },
        { value: 2, label: "大写数字转换小写" },
        { value: 3, label: "中文数字转阿拉伯数字" },
        { value: 4, label: "文本替换" },
        ],
      // 开始清洗传参
      cleanCollect: {
        rulesValue: "",
        cleanPropeName: [],
        collectId: null,
        collectName: "",
        menuType: null,
        operDesc: "",
        operStr: "",
        dataA: "",
        dataB: "",
        auditState: "2"
      },
      // 表单规则
      cleanCollectRuls: {
        collectId: [
          { required: true, message: "请选择清洗数据集", trigger: "change" }
        ],
        cleanPropeName: [
          { required: true, message: "请选择清洗属性", trigger: "change" }
        ],
        rulesValue: [
          { required: true, message: "请选择清洗规则", trigger: "change" }
        ],
        collectName: [
          { required: true, message: "请输入表单名称", trigger: "blur" }
        ]
      },
      // tag标签
      dynamicTags: ["标签一", "标签二", "标签三"],
      //用这个tab切换
      menuValue: "",
      dialogVisible:false,
      rulesValue:'',
      charsForm:{
        originalchar1:'',
        originalchar2:'',
        replacechar1:'',
        replacechar2:''
      },
      charsList:[]
    };
  },
  created() {
    this.getLeftTree();
  },
  mounted() {
    $('.el-input>.el-input__inner').removeAttr("style");
  },
  methods: {
    // 获取资源库目录
    getLeftTree() {
      let s = {
        menuType: 2
      };
      getLeftTreeInterface(s).then(res => {
        var arr = res.data.data;
        this.treeData = arr;
        this.value = arr[0].menuId;
        this.menuValue = arr[0].label;
        getTypeListAll().then(res => {
          if (res.data.code == 1) {
            this.tallyData.classify1 = res.data.data;
          }
        });
        this.getCleanData();
      });
    },
    // 点击当前节点
    handleNodeClick(data) {
      // 初始化表单及验证
      this._clear();
      this.resetValidate('cleanCollect');
      if (data.menuId != this.value) {
        this.value = data.menuId;
        this.menuValue = data.label;
        this.getCleanData();
        this.cleanCollect.collectId = ""
        this.cleanCollect.cleanPropeName = []
        getTypeListAll().then(res => {
          if (res.data.code == 1) {
            this.tallyData.classify1 = res.data.data;
          }
        });
      }
    },
    // 获取清洗数据集数据内容
    getCleanData() {
      getCleanDataList(this.value).then(res => {
        if (res.data.code == 1) {
          this.cleanFromNameList = res.data.data;
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    // 标签选择
    tabs(id) {
      let data = { labelTypeId: id };
      getLabellistall(data).then(res => {
        let obj = {};
        obj = this.tallyData.classify1.find(item => {
          return item.id === id;
        });

        this.tallyName1 = obj.typeName;
        this.tallyData.classify2 = res.data.data;
        if (id == 176) {
          this.tagsType = "success";
        } else if (id == 177) {
          this.tagsType = "info";
        }
      });
      this.tallyValue2 = "";
      this.tallyName2 = "";
    },
    //标签内容发生选择
    tabsTwo(id) {
      let obj2 = {};
      obj2 = this.tallyData.classify2.find(item => {
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
          id: id
        });
        const arr = this.tags.map(item => {
          return item.name;
        });
        this.cleanCollect.dataA = this.tallyValueArr.join(",");
        this.cleanCollect.dataB = arr.join(",");
      } else {
        this.$message.warning("不可以重复提交");
        this.tallyName2 = "";
        this.tallyValue2 = "";
      }
    },
    //清除选择后的标签
    handleCloseTag(tag) {
      let tagName = tag.name.match(/\s(\S*)/)[1];
      this.tallyNameArr.splice(this.tallyNameArr.indexOf(tagName), 1);
      this.tallyValueArr.splice(this.tallyValueArr.indexOf(tag.id), 1);
      this.tags.splice(this.tags.indexOf(tag), 1);
      const arr = this.tags.map(item => {
        return item.name;
      });
      this.cleanCollect.dataA = this.tallyValueArr.join(",");
      this.cleanCollect.dataB = arr.join(",");
    },
    // 获取清洗属性
    cleanChange(item) {
      if(item != null){
      this.cleanCollect.cleanPropeName = [];
      let tableId = this.cleanFromNameList.filter(element => {
        if (element.ID == item) return element;
      });
      getCleanFormPropList(tableId[0].TABLEID).then(res => {
        if (res.data.code == 1) {
          this.cleanPropeList = res.data.data;
        }
      });
      }
    },
    //属性发生改变
    propChange() {
      this.cleanTags = [];
      for (let i = 0; i < this.cleanCollect.cleanPropeName.length; i++) {
        let obj = {};
        obj = this.cleanPropeList.find(item => {
          return item.id === this.cleanCollect.cleanPropeName[i];
        });
        obj.type = 'success'
        this.cleanTags.push(obj);
      }
    },
    closeCleanTag(id) {
      this.cleanCollect.cleanPropeName.splice(this.cleanCollect.cleanPropeName.indexOf(id), 1);
      this.propChange();
    },
    // 提交表单数据
    clearData(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // 通过value获取清洗属性名称lable
          let arr = [];
          for (let i = 0; i < this.cleanCollect.cleanPropeName.length; i++) {
            let obj = {};
            obj = this.cleanPropeList.find(item => {
              return item.id === this.cleanCollect.cleanPropeName[i];
            });
            arr.push(obj.columnName);
          }
          let columnName = arr.join(",");
          // 通过value获取清洗规则名称lable
          let obj2 = {};
          obj2 = this.cleanRulesList.find(item => {
            return item.value === this.cleanCollect.rulesValue;
          });
          let label = obj2.label;
          let cleanCollect = {
            collectName: this.cleanCollect.collectName,
            collectId: this.cleanCollect.collectId,
            menuType: this.value,
            operDesc: `${label}:${columnName}`,
            operStr: `${this.cleanCollect.rulesValue}_${this.cleanCollect.cleanPropeName.join(",")}`,
            dataA: this.cleanCollect.dataA,
            dataB: this.cleanCollect.dataB,
            auditState: this.cleanCollect.auditState
          };
          getCleanDataResult(cleanCollect).then(res => {
            if (res.data.code == 1) {
              this.$message.success("提交成功！");
              this._clear();
              this.resetValidate(formName);
            } else {
              this.$message.error(res.data.msg);
            }
          });
        } else {
          return false;
        }
      });
    },
    // 增加清洗规则
    addClearRules() {},
    // 删除标签
    handleClose() {
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
    },
    // 重置校验规则
    resetValidate(formName) {
      this.$refs[formName].resetFields();
    },
    //获取规则值
    getRulesValue(rulesValue){
      this.rulesValue = rulesValue;
      console.log(this.rulesValue)
    },
    //设置替换规则
    setReplace(){
      this.dialogVisible = true;
    },
    canClose(){
      this.dialogVisible = false;
    },
    //添加规则
    addChars(){
      this.charsList.push({
        originalchar: '',
        replacechar:''
      })
    },
    //删除替换字符
    deleteChars(value,index){
      this.charsList.splice(index,1)
      this.$message.success("删除成功");
    },
    // 清除数据
    _clear() {
      // 清除清洗传参
      this.cleanCollect = {
        rulesValue: "",
        cleanPropeName: [],
        collectId: null,
        collectName: "",
        menuType: null,
        operDesc: "",
        operStr: "",
        dataA: "",
        dataB: "",
        auditState: "2"
      };
      // 标签
      this.tallyValue1 = "";
      this.tallyValue2 = "";
      this.tallyValueArr = [];
      this.tallyName1 = "";
      this.tallyName2 = "";
      this.tallyNameArr = [];
      this.tags = [];
      this.cleanTags = [];
      // this.tallyData.classify1 = [];
      this.tallyData.classify2 = [];
    }
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
  margin-left: 120px;
  margin-top: 20px;
  .el-button {
    &:hover {
      color: #fff;
      background-color: #127714;
    }
  }
}

.model-btn {
  height: 30px;
  line-height: 8px;
}

.checkbox-style {
  margin-left: 120px;
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
  height: 136px;
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
.el-input__inner{
  height: 32px !important;
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
.chars-main{
  overflow: hidden;
  .chars-box{
    margin: 10px 0;
    .chars{
      padding: 0 10px 0 0;
      line-height: 32px;
    }
    .chars-replace{
      padding: 0 10px;
      line-height: 32px;
    }
  }
}


</style>
