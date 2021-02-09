<template>
  <div>
    <div class="title">数据整合</div>

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
    <!-- 数据整合 -->
    <div class="formbox" id="roc14">
      <el-tabs :tab-position="tabPosition" v-model="tabNameActive" class="el-tabs-box">
        <el-tab-pane :label="menuValue" name="first">
          <div style="margin-bottom:20px;">
             <el-tabs v-model="activeName">
               <!-- 按数据集整合 -->
              <el-tab-pane label="按数据集整合" name="first">
                <el-form  :model="dataSetForm"  :inline="true"  :rules="dataSetFormRuls"  label-position="right"  ref="dataSetForm"  label-width="150px"  class="demo-cleanForm">
                  <div class="input-line2 el-select-size">
                    <el-col :span="24">
                      <el-form-item label="选择数据模板" prop="mode">
                        <el-autocomplete
                          class="inline-input"
                          v-model="dataSetForm.mode"
                          :fetch-suggestions="querySearchMode"
                          placeholder="请输入或选择模板名称"
                          @select="handleSelect"
                          clearable
                        ></el-autocomplete>
                      </el-form-item>
                    </el-col>
                    <el-col :span="24">
                      <el-form-item label="选择要整合的数据集" prop="dataSet1">
                        <el-autocomplete
                          class="inline-input"
                          v-model="dataSetForm.dataSet1"
                          :fetch-suggestions="querySearchData"
                          placeholder="请输入或选择数据集"
                          @select="handleSelect"
                          clearable
                        ></el-autocomplete>
                        <el-button size="small"  type="primary" @click="addMode()">增加数据集</el-button>
                      </el-form-item>
                    </el-col>
                    <el-col :span="24">
                      <el-form-item label="选择要整合的数据集" prop="dataSet2">
                         <el-autocomplete
                          class="inline-input"
                          v-model="dataSetForm.dataSet2"
                          :fetch-suggestions="querySearchData"
                          placeholder="请输入或选择数据集"
                          @select="handleSelect"
                          clearable
                        ></el-autocomplete>
                      </el-form-item>
                    </el-col>
                    <add-date-set :formdataSet='formdataSet' :dataSetfield ='dataSetfield' @deleteDataSet="deleteDataSet" styleType="dataSet"></add-date-set>
                    <el-col :span="24">
                      <el-form-item label="整合后数据集名称" prop="dataSetName">
                        <el-input v-model="dataSetForm.dataSetName"  placeholder="请输入数据集名称"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="24">
                      <el-form-item>
                        <el-button size="small" type="primary" @click="onSubmitData()">开始整合</el-button>
                      </el-form-item>
                    </el-col>
                  </div>
                </el-form>
                  <div v-show="tablelist1">
                        <p style="text-align: left;color:#999;margin-bottom:10px;">
                        预览区域只列出前200行数据
                        </p>
                        <el-table
                          :data="logisticsDataList"
                          border
                          height="290px"
                          style="width: 100%"
                          highlight-current-row
                        :header-cell-style="{
                        'background-color': '#f5f7fa',
                        'color': 'rgb(103, 194, 58)',
                          }">
                      <el-table-column
                        v-for="item1 in keyList"
                        :key="item1"
                        :prop="item1"
                        :label="item1"
                        >
                      </el-table-column>
                    </el-table>
                    <!-- <p v-show="showText2">.txt格式的文件不支持预览!</p> -->
                  </div>
              </el-tab-pane>
              <!-- 按字段整合 -->
              <el-tab-pane label="按字段整合" name="second">
                <el-form  :model="fieldForm"  :inline="true"  :rules="fieldFormRuls"  label-position="right"  ref="fieldForm"  label-width="150px"  class="demo-cleanForm">
                  <div class="input-line2 el-select-size">
                    <el-col :span="24">
                      <el-form-item label="选择数据模板" prop="mode">
                        <el-autocomplete
                          class="inline-input"
                          v-model="fieldForm.mode"
                          :fetch-suggestions="querySearchMode"
                          placeholder="请输入或选择模板名称"
                          @select="handleSelect"
                          clearable
                        ></el-autocomplete>
                      </el-form-item>
                    </el-col>
                    <el-col :span="24">
                      <el-form-item label="选择数据集字段" prop="field1">
                          <el-select v-model="fieldForm.field1" placeholder="请选择数据集字段">
                            <el-option-group
                              v-for="group in fields"
                              :key="group.label"
                              :label="group.label">
                              <el-option
                                v-for="item in group.options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                              </el-option>
                            </el-option-group>
                          </el-select>
                        <el-button size="small"  type="primary" @click="addField()">增加整合字段</el-button>
                      </el-form-item>
                    </el-col>
                    <el-col :span="24" >
                      <el-form-item label="选择数据集字段" prop="field2">
                        <el-select v-model="fieldForm.field2" placeholder="请选择数据集字段">
                            <el-option-group
                              v-for="group in fields"
                              :key="group.label"
                              :label="group.label">
                              <el-option
                                v-for="item in group.options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                              </el-option>
                            </el-option-group>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <add-date-set :formdata='formdata' :fields='fields' @deleteField="deleteField" styleType="field"></add-date-set>
                    <el-col :span="24">
                      <el-form-item label="整合后数据集名称" prop="fieldName">
                        <el-input v-model="fieldForm.fieldName"  placeholder="请输入数据集名称"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="24">
                      <el-form-item>
                        <el-button size="small" type="primary" @click="onSubmitfield()">开始整合</el-button>
                      </el-form-item>
                    </el-col>
                  </div>
                </el-form>
                <div v-show="tablelist2">
                  <p style="text-align: left;color:#999;margin-bottom:10px;">
                   预览区域只列出前200行数据
                  </p>
                  <el-table
                    :data="logisticsDataList"
                    border
                    height="290px"
                    style="width: 100%"
                     highlight-current-row
                  :header-cell-style="{
                  'background-color': '#f5f7fa',
                  'color': 'rgb(103, 194, 58)',
                    }">
                    <el-table-column
                      v-for="item1 in keyList"
                      :key="item1"
                      :prop="item1"
                      :label="item1"
                      >
                    </el-table-column>
                  </el-table>
                  <!-- <p v-show="showText2">.txt格式的文件不支持预览!</p> -->
                </div>
              </el-tab-pane>
            </el-tabs>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script>
import XLSX from 'xlsx'
import { getLeftTreeInterface } from "@/api/resource_list";
import addDateSet from '@/components/createData/addDateSet'
import {
  getDataModelTablelist,
} from "@/api/datamanage";
export default {
  components: {
    addDateSet
  },
  data() {
    return {
      tabNameActive: 'first',
      activeName:'first',
      tablelist1:false,
      tablelist2:false,
      dataModelTable:[],
      treeData: [],
      keyList:["ID", "经度", "纬度", "名称", "数据", "填充色"],
      dataType:null,
      tabPosition: "",
      defaultProps: {
        children: "children",
        label: "label"
      },
      // 表格内容
      tableData: [],
      value: null,
      // 开始清洗传参
      dataSetForm: {
        mode: "",
        dataSet1:'',
        dataSet2:'',
        dataSetName:''
      },
      fieldForm:{
        mode:'',
        field1:'',
        field2:'',
        fieldName:''
      },
      // 表单规则
      dataSetFormRuls: {
        mode: [
          { required: true, message: "请输入或选择数据模板名称", trigger: "change" }
        ],
        dataSet1: [
          { required: true, message: "请输入或选择数据集", trigger: "change" }
        ],
        dataSet2: [
          { required: true, message: "请输入或选择数据集", trigger: "change" }
        ],
        dataSetName: [
          { required: true, message: "整合后数据集名称", trigger: "blur" }
        ]
      },
      fieldFormRuls:{
        mode: [
          { required: true, message: "请输入数据模板名称", trigger: "change" }
        ],
        field1: [
          { required: true, message: "请输入或选择数据集字段", trigger: "change" }
        ],
        field2: [
          { required: true, message: "请输入或选择数据集字段", trigger: "change" }
        ],
        fieldName: [
          { required: true, message: "整合后数据集名称", trigger: "blur" }
        ]
      },
      logisticsDataList:[
        {
          ID: "8",
          名称: "circle",
          填充色: "#F00000",
          数据: "顶顶顶顶",
          点宽度: "5",
          点高度: "5",
          纬度: "28.133583",
          经度: "106.825644",
        },{
          ID: "7",
          名称: "circle",
          填充色: "#F00000",
          数据: "大发发发发",
          点宽度: "5",
          点高度: "5",
          纬度: "28.321586",
          经度: "106.852057",
        },{
          ID: "5",
          名称: "circle",
          填充色: "#F00000",
          数据: "哒哒哒",
          点宽度: "5",
          点高度: "5",
          纬度: "28.206346",
          经度: "106.843592",
        },{
          ID: "2",
          名称: "circle",
          填充色: "#F00000",
          数据: "看了看来看",
          点宽度: "5",
          点高度: "5",
          纬度: "26.556079",
          经度: "106.470715",
        },{
          ID: "1",
          名称: "circle",
          填充色: "#F00000",
          数据: "你们那没那么",
          点宽度: "5",
          点高度: "5",
          纬度: "26.556079",
          经度: "106.470715",
        },{
          ID: "3",
          名称: "circle",
          填充色: "#F00000",
          数据: "回家后就回家",
          点宽度: "5",
          点高度: "5",
          纬度: "26.556079",
          经度: "106.470715",
        }
      ],
      //用这个tab切换
      menuValue: "",
      restaurantsData:[],
      restaurantsMode:[],
      formdata:[],
      formdataSet:[],
      fields:  [{
          label: '热门城市',
          options: [{
            value: 'Shanghai',
            label: '上海'
          }, {
            value: 'Beijing',
            label: '北京'
          }]
        }, {
          label: '城市名',
          options: [{
            value: 'Chengdu',
            label: '成都'
          }, {
            value: 'Shenzhen',
            label: '深圳'
          }, {
            value: 'Guangzhou',
            label: '广州'
          }, {
            value: 'Dalian',
            label: '大连'
          }]
        }],
      dataSetfield:[{
            value: '数据1',
          }, {
            value: '数据2',
          }, {
            value: '数据3', 
          }, {
            value: '数据4',
          }, {
            value: '数据5',
          }]
    };

  },
  created() {
    this.getLeftTree();
  },
  mounted() {
    // this.restaurantsMode = this.dataSet();
    this.restaurantsData = this.dataSetfield;
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
        this.dataType = arr[0].menuId;
        this.getDataModelTable();
      });
    },
    // 获取数据模板
    async getDataModelTable() {
        var ss = {
          dataType: this.dataType,
          dataName: '',
          pageNumber: 1
        }
      console.log(ss);
      const res = await getDataModelTablelist(ss);
      if (res.data.code == 1) {
        this.total = res.data.data.total;
        let arr = [];
        let obj = {};
        res.data.data.rows.forEach((item, index) => {
          obj = {
            value: item.DATANAME,
            id : item.ID,
            }
          arr.push(obj);
        });
        this.restaurantsMode = arr;
      } else {
        this.$message.error(res.data.msg);
      }
    },
    // 点击当前节点
    handleNodeClick(data) {
      // 初始化表单及验证
      this.$refs.fieldForm.resetFields();
      this.$refs.dataSetForm.resetFields();
  
      console.log(data)
      this.value = data.menuId;
      if (data.menuId != this.dataType) {
        this.dataType = data.menuId;
        this.getDataModelTable();
      }
      this.menuValue = data.label;
    },
    //获取数据模板名称
    querySearchMode(queryString, cb) {
      var restaurantsMode = this.restaurantsMode;
      var results = queryString ? restaurantsMode.filter(this.createFilter(queryString)) : restaurantsMode;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    //获取数据集的名称
    querySearchData(queryString, cb) {
      var restaurantsData = this.restaurantsData;
      var results = queryString ? restaurantsData.filter(this.createFilter(queryString)) : restaurantsData;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createFilter(queryString) {
      return (restaurant) => {
        return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
      };
    },
    //添加数据集
    addMode(){
      this.formdataSet.push({
        dataSet: ""
      })
    },
    //添加数据集字段
    addField(){
      this.formdata.push({
        field: ""
      })
    },
    handleSelect(item) {
      console.log(item);
    },
    //删除数据集字段
    deleteField(val, index){
        this.formdata.splice(index,1)
        this.$message.success("删除成功");
    },
    //整合数据集
    onSubmitData(){
      this.$refs.dataSetForm.validate((valid) => {
        if (valid) {
          this.tablelist1 = true;
          console.log('ddd')
        }
      })
    },
    //整合数据集字段
    onSubmitfield(){
      this.$refs.fieldForm.validate((valid) => {
        if (valid) {
          this.tablelist2 = true;
          console.log('ccc')
        }
      })
    },
    readerData(itemFile) {
      let testmsg = /\.(xls|xlsx|csv)(\?.*)?$/.test(itemFile.name)
      if (!testmsg) {
        console.log('数据格式不对！')
      } else {
        const reader = new FileReader()
        reader.onload = e => {
          const data = e.target.result
          const fixedData = this.fixdata(data)
          const workbook = XLSX.read(btoa(fixedData), { type: 'base64' })
          const firstSheetName = workbook.SheetNames[0] // 第一张表 sheet1
          const worksheet = workbook.Sheets[firstSheetName] // 读取sheet1表中的数据
          // delete worksheet['!merges']let A_l = worksheet['!ref'].split(':')[1] //当excel存在标题行时
          const tableTitle = firstSheetName
          const results = XLSX.utils.sheet_to_json(worksheet)
          this.generateDate({ tableTitle, results })
        }
        reader.readAsArrayBuffer(itemFile)
      }
    },
    //删除数据集
    deleteDataSet(val, index){
      this.formdataSet.splice(index,1)
      this.$message.success("删除成功");
      this.$emit('deleteDataSet', index, this.formdata);
    },
    // 获取表格数据
    generateDate({ tableTitle, results }) {
        this.tableData = results;
        var tableData = this.tableData[0];
        this.keyList = Object.keys(tableData);

        this.logisticstableData = results;
        var tableDatalist = this.logisticstableData[0];
        this.keydataList = Object.keys(tableDatalist);
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
.el-icon-close{
  font-size: 20px;
  color:red;
}
</style>
