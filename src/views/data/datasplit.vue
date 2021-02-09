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
              label-width="148px"
              class="demo-cleanForm"
            >
            <!-- @change="cleanChange" -->
              <el-col :span="24" class="el-select-size">
                <el-form-item label="选择要拆分的数据集" prop="collectId">
                <el-autocomplete
                    class="inline-input"
                    v-model="cleanCollect.collectId"
                    :fetch-suggestions="querySearchMode"
                    placeholder="请输入或选择数据集"
                    @select="handleSelect"
                    clearable
                  ></el-autocomplete>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <div class="clear-span"><span>拆分规则</span></div>
                <div class="clear-btn"><el-button type="primary" @click="addsplit()">增加拆分规则</el-button></div>
              </el-col>
              <el-col :span="24">
                <el-table
                  :data="tableData"
                  row-key="index" 
                  fit
                  border
                  style="margin-top:20px;"
                  highlight-current-row
                  :header-cell-style="{
                        'background-color': '#f5f7fa',
                        'color': 'rgb(103, 194, 58)',
                        }"
                >
                  <el-table-column  prop="name"  align="left" label="拆分名称自定义">
                    <template slot-scope="scope">
                      <el-input
                        type="text" 
                        v-model="scope.row.name"
                        class="inputbox"
                        placeholder="拆分名称"
                      ></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column  prop="size"  align="left" label="拆分比例">
                    <template slot-scope="scope">
                      <el-input
                        type="text" 
                        v-model="scope.row.size"
                        class="inputbox"
                        placeholder="拆分比例"
                      ></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column  prop="size"  align="left" label="操作" width="140">
                    <template slot-scope="scope">
                      <el-button  v-if="scope.row.index !=1 &&scope.row.index !=2"    type="primary" size="mini"  class="handle-edit" @click="deleteSplit(scope.row.index)">删除</el-button>
                      <el-button  v-else type="primary" :disabled="disabled" size="mini"  class="handle-edit" @click="deleteSplit(scope.row.index)">删除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-col>
              <el-col :span="24" style="text-align:center">
                <el-form-item>
                  <el-button size="small" type="primary" class="data-submit-btn" @click="onSubmit">开始拆分</el-button>
                </el-form-item>
              </el-col>  
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
      // 清洗数据集下拉
      cleanFromNameList: [],
      // 清洗属性
      cleanPropeList: [],
      // 开始清洗传参
      cleanCollect: {
        rulesValue: "",
        cleanPropeName: [],
        collectId: null,
        auditState: "2"
      },
      // 表单规则
      cleanCollectRuls: {
        collectId: [
          { required: true, message: "请选择清洗数据集", trigger: "change" }
        ]
      },
      //用这个tab切换
      menuValue: "",
      tableData: [
        {
          name:'拆分名称',
          size:"拆分比列",
          index:'1'
        },{
          name:'拆分名称',
          size:"拆分比列",
          index:'2'
        }
      ],
      disabled:true,
      restaurantsData:[]
    };
  },
  created() {
    this.getLeftTree();
  },
  mounted() {
    console.log(this.cleanFromNameList)
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
      }
    },
    // 获取清洗数据集数据内容
    getCleanData() {
      getCleanDataList(this.value).then(res => {
        if (res.data.code == 1) {
          // this.cleanFromNameList = res.data.data;
          let arr = [];
          let obj = {};
          res.data.data.forEach((item, index) => {
            obj = {
              value: item.COLLECTNAME,
              id : item.ID,
              }
            arr.push(obj);
          });
          this.cleanFromNameList = arr;
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },

    // // 获取清洗属性
    // cleanChange(item) {
    //   if(item != null){
    //   this.cleanCollect.cleanPropeName = [];
    //   let tableId = this.cleanFromNameList.filter(element => {
    //     if (element.ID == item) return element;
    //   });
    //   getCleanFormPropList(tableId[0].TABLEID).then(res => {
    //     if (res.data.code == 1) {
    //       this.cleanPropeList = res.data.data;
    //     }
    //   });
    //   }
    // },
    // 重置校验规则
    resetValidate(formName) {
      this.$refs[formName].resetFields();
    },
    onSubmit(){},
    addsplit(){
      this.tableData.push({
          name:'拆分名称',
          size:"拆分比例",
          index: Math.random(),
      })
    },
    deleteSplit(index){
      this.tableData.splice(this.tableData.indexOf(index), 1);
      this.$message.success("删除成功");
    },
    querySearchMode(queryString, cb){
      var restaurantsMode = this.cleanFromNameList;
      console.log(restaurantsMode)
      var results = queryString ? restaurantsMode.filter(this.createFilter(queryString)) : restaurantsMode;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createFilter(queryString) {
      return (restaurant) => {
        return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
      };
    },
    handleSelect(item) {
      console.log(item);
    },
    // 清除数据
    _clear() {
      // 清除清洗传参
      this.cleanCollect = {
        rulesValue: "",
        collectId: null,
        auditState: "2"
      }
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
  padding: 0 20% 0 14%;
  margin-bottom: 20px;
  overflow: hidden;
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
.clear-span{
  float: left;
  color: #333;
}
.clear-btn {
  float: right;
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
.el-table td, .el-table th.is-leaf {
  border-bottom: 1px solid #c4c9d0;
}
.inputbox {
  width: 120px;
}
.data-submit-btn {
  width: 90px;
  height: 32px;
  line-height: 11px;
  margin-top: 14px;
}
</style>
