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
          <div>
            <el-form
              :model="cleanCollect"
              :inline="true"
              label-position="right"
              ref="cleanCollect"
              label-width="80px"
              class="demo-cleanForm"
            >
              <div class="el-select-size">
                <el-col :span="24" style="display: flex;flex-wrap:nowrap;">
                  <el-form-item label="处理类别" prop="collectId">
                    <el-select  v-model="cleanCollect.collectId">
                      <el-option
                        v-for="item in options"
                        :key="item.id"
                        :label="item.label"
                        :value="item.id"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="时间范围">
                    <el-date-picker
                      v-model="value1"
                      type="date"
                      id="value1"
                      :picker-options="startDatePicker"
                      placeholder="开始日期">
                    </el-date-picker>
                    <span style="color:#333">—</span>
                    <el-date-picker
                      v-model="value2"
                      type="date"
                      id="value2"
                      :picker-options="endDatePicker"
                      placeholder="结束日期">
                    </el-date-picker>
                  </el-form-item>
                  <el-form-item>
                    <el-button size="small" type="primary" @click="onSubmitData()">搜索</el-button>
                  </el-form-item>
                </el-col>
              </div>
              <el-table
                :data="tableData"
                border        
                style="margin-top:20px;"
                row-key="value"
                fit
                highlight-current-row
                :header-cell-style="{
                      'background-color': '#f5f7fa',
                      'color': 'rgb(103, 194, 58)',
                      }"
                >
                <el-table-column  type="index"  label="序号"  width="60px"></el-table-column>
                <el-table-column  prop="ysjj"  label="原数据集"></el-table-column>
                <el-table-column  prop="mbsjj"  label="目标数据集"></el-table-column>
                <el-table-column  prop="clgz"  label="处理规则"></el-table-column>
                <el-table-column  prop="zzr"  label="操作人"></el-table-column>  
                <el-table-column  prop="date"  label="操作时间"></el-table-column>
              </el-table>
            </el-form>
            <!--分页-->
            <div class="block">
              <el-pagination
                style="text-align: center"
                :page-size="10"
                :current-page="cleanCollect.pageNumber"
                @current-change="handleCurrentChange"
                layout="total,  prev, pager, next, jumper"
                :total="10"
              ></el-pagination>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script>
import { getLeftTreeInterface } from "@/api/resource_list";
import {
  getTypeListAll,
} from "@/api/datamanage";
export default {
  data() {
    return {
      tabNameActive: 'first',
      treeData: [],
      tabPosition: "",
      defaultProps: {
        children: "children",
        label: "label"
      },
      // 表格内容
      tableData: [],
      value: null,
      // 开始清洗传参
      cleanCollect: {
        collectId: null,
        beginDate:'',
        endDate:'',
        pageNumber:1,
        limit: 10,
      },
        value1: '',
        value2: '',
      // // 表单规则
      // cleanCollectRuls: {
      //   collectId: [
      //     { required: true, message: "请选择类别", trigger: "change" }
      //   ]
      // },
      //用这个tab切换
      menuValue: "",
       options: [{
          id:'1',
          label: '数据清洗'
        }, {
          id:'2',
          label: '数据排重'
        }, {
          id:'3',
          label: '数据拆分'
        }, {
          id:'4',
          label: '数据整合'
        }],
        tableData: [{
          ysjj:'数据集A',
          mbsjj:'清洗_数据集A',
          clgz:'去除收尾空格',
          zzr:'数据管理员',
          date: '2016-05-02 10:56:03',
        }, {
          ysjj:'数据集B',
          mbsjj:'清洗_数据集B',
          clgz:'去除收尾空格',
          zzr:'数据管理员',
          date: '2016-05-02 10:56:03',
        }, {
          ysjj:'数据集C',
          mbsjj:'清洗_数据集C',
          clgz:'去除收尾空格',
          zzr:'数据管理员',
          date: '2016-05-02 10:56:03',
        }, {
          ysjj:'数据集D',
          mbsjj:'清洗_数据集D',
          clgz:'去除收尾空格',
          zzr:'数据管理员',
          date: '2016-05-02 10:56:03',
        }],
        total:'10',
        startDatePicker: this.beginDate(), //开始时间
        endDatePicker: this.processDate(), //结束时间
    };
  },
  created() {
    this.getLeftTree();
  },
  mounted() {
    $('.el-input>.el-input__inner').removeAttr("style");
  },
  methods: {
    //定义时间范围
    beginDate(){
      const self = this
      return {
        disabledDate(time){
          if (self.value2) {  //如果结束时间不为空，则小于结束时间
            return new Date(self.value2).getTime() < time.getTime()
          } else {
            // return time.getTime() > Date.now()//开始时间不选时，结束时间最大值小于等于当天
          }
        }
      }
    },
    //定义时间范围
    processDate() {
      const  self = this
      return {
        disabledDate(time) {
          if (self.value1) {  //如果开始时间不为空，则结束时间大于开始时间
            return new Date(self.value1).getTime() > time.getTime()
          } else {
            // return time.getTime() > Date.now()//开始时间不选时，结束时间最大值小于等于当天
          }
        }
      }
    },
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
        this.cleanCollect.collectId = ""
        this.cleanCollect.cleanPropeName = []
      }
    },
    getModelList() {},
    // 增加清洗规则
    addClearRules() {},
    // 重置校验规则
    resetValidate(formName) {
      this.$refs[formName].resetFields();
    },
    handleCurrentChange(val) {
      // this.cleanCollect.pageNumber = val;
    },
    onSubmitData(){
        this.cleanCollect.endDate = $('#value2').val();
        this.cleanCollect.beginDate =$('#value1').val();
      console.log(this.cleanCollect)
    },
    // 清除数据
    _clear() {
      // 清除清洗传参
      this.cleanCollect = {
        collectId: null,
        time:''
      };
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
  width: 160px;
}
.el-date-editor.el-input, .el-date-editor.el-input__inner {
  width: 150px;
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
</style>
