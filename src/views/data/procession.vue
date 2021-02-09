<template>
  <div>
    <div class="title">物流数据分析</div>
    <div class="formbox" id="roc14">
      <div class="filter-container r-menu" style="margin-top:20px;margin-left:20px;margin-right:20px">
      <el-dialog class="dialogTitle" title="添加分析" :visible.sync="dialogFormVisible" :before-close="handleClose" width="700px" :close-on-click-modal="false">
        <el-form
            ref="logisticsForm"
            :model="logisticsForm"
            label-width="120px"
            :rules="rules"
            class="dialogform"
          >
            <el-form-item label="本次分析名称" prop="analysisName">
              <el-input v-model="logisticsForm.analysisName" placeholder="请输入分析名称" style="width: 238px;" @change="showValue('analysisName')"></el-input>
            </el-form-item>

            <el-form-item label="快递公司" prop="expressType">
              <el-select v-model="logisticsForm.expressType" style="width: 238px;" placeholder="请选择快递公司" @change="showValue('logisticCompany')">
                <el-option
                  v-for="(item) in logisticCompany"
                  :key="item.ID"
                  :label="item.COMPANYNAME"
                  :value="item.ID"
                ></el-option>
              </el-select>
            </el-form-item>
          <el-form-item label="出发地" required>
            <el-col :span="11">
              <el-form-item  prop="startP">
              <el-select filterable default-first-option v-model="logisticsForm.startP" style="width: 100%" placeholder="省份" @change="getStartTown">
                <el-option
                  v-for="(area) in departureData"
                  :key="area.ID"
                  :label="area.NAME"
                  :value="area.ID"
                ></el-option>
              </el-select>
              </el-form-item>
            </el-col>
            <el-col class="line" :span="2">—</el-col>
            <el-col :span="11">
              <el-form-item  prop="startTown">
              <el-select v-model="logisticsForm.startTown" style="width: 100%" filterable default-first-option placeholder="市" @change="changeStarTown">
                <el-option
                  v-for="(item) in startTownData"
                  :key="item.ID"
                  :label="item.NAME"
                  :value="item.ID"
                ></el-option>
              </el-select>
              </el-form-item>
            </el-col>
          </el-form-item>
            <el-form-item label="目的地" required>
              <el-col :span="11">
              <el-form-item prop="endP">
              <el-select v-model="logisticsForm.endP" style="width: 100%" filterable default-first-option placeholder="省份" @change="getEndTown">
                <el-option
                  v-for="(area) in destinationData"
                  :key="area.ID"
                  :label="area.NAME"
                  :value="area.ID"
                ></el-option>
              </el-select>
                </el-form-item>
                </el-col>
              <el-col :span="2" class="line">—</el-col>
              <el-col :span="11">
              <el-form-item prop="endTown">
              <el-select v-model="logisticsForm.endTown" style="width: 100%" filterable default-first-option placeholder="市" @change="changeEndTown">
                <el-option
                  v-for="(area) in endTownData"
                  :key="area.ID"
                  :label="area.NAME"
                  :value="area.ID"
                ></el-option>
              </el-select>
                </el-form-item>
                </el-col>
            </el-form-item>

            <el-form-item label="时间范围" label-width="120px" required>
              <div class="block">
                <el-col :span="11">
                  <el-form-item prop="departureTime">
                    <el-date-picker
                      format="yyyy-MM-dd"
                      value-format="yyyy-MM-dd"
                      type="date"
                      v-model="logisticsForm.departureTime"
                      placeholder="出发时间"
                      :picker-options="startDatePicker"
                      style="width: 100%"
                    ></el-date-picker>
                  </el-form-item>
                </el-col>

                <el-col :span="2" class="line">—</el-col>
                <el-col :span="11">
                  <el-form-item prop="destinationTime">
                    <el-date-picker
                      format="yyyy-MM-dd"
                      value-format="yyyy-MM-dd"
                      type="date"
                      v-model="logisticsForm.destinationTime"
                      placeholder="到达时间"
                      :picker-options="endDatePicker"
                      style="width: 100%"
                    ></el-date-picker>
                  </el-form-item>
                </el-col>

              </div>
            </el-form-item>
        </el-form>
        <div class="btn-box">
          <el-button type="primary" size="small" @click="submitLogisticForm('logisticsForm')">启动全环节分析</el-button>
        </div>
      </el-dialog>
      <el-input
        style="width: 200px;"
        class="filter-item"
        placeholder="分析名称"
        v-model="listQuery.analysisName"
      ></el-input>
      <el-button
        type="primary"
        icon="el-icon-search"
        size="small"
        @click="getAnalysisPage(1)"
        style="margin-left:10px"
      >查询</el-button>
       <el-button type="primary" size="small" icon="el-icon-plus" @click="handCreate">添加</el-button>
      <!-- <button type="button" class="el-button el-button--danger"><span>批量删除</span></button> -->
      <el-table
            :data="analysisList"
            row-key="id"
            style="margin-top:20px;"
            border
            highlight-current-row
            :header-cell-style="{
              'background-color': '#f5f7fa',
              'color': 'rgb(103, 194, 58)',
               }"
          >
            <el-table-column align="center" width="60px" label="序号">
              <template slot-scope="scope" >
                <span>{{scope.$index+1}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="分析名称">
              <template slot-scope="scope">
                <span>{{scope.row.ANALYSIS_NAME}}</span>
              </template>
            </el-table-column>
            <el-table-column width="80" align="center" label="快递公司">
              <template slot-scope="scope">
                <span>{{scope.row.EXPRESSNAME}}</span>
              </template>
            </el-table-column>

            <el-table-column width="100" align="center" label="状态">
              <template slot-scope="scope">
                <span>{{scope.row.STATE | getState}}</span>
              </template>
            </el-table-column>
            <el-table-column width="100" align="center" label="出发地">
              <template slot-scope="scope">
                <span>{{scope.row.DEPARTURE_NAME}}</span>
              </template>
            </el-table-column>
            <el-table-column width="100" align="center" label="目的地">
              <template slot-scope="scope">
                <span>{{scope.row.DESTINATION_NAME}}</span>
              </template>
            </el-table-column>
            <el-table-column width="120" align="center" label="分析条数">
              <template slot-scope="scope">
                <span>{{scope.row.DATACOUNT}}</span>
              </template>
            </el-table-column>
            <el-table-column  align="center" label="时间范围">
              <template slot-scope="scope">
                <span>{{scope.row | getDate}}</span>
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
              :current-page="listQuery.pageNumber"
              @current-change="handleCurrentChange"
              :total="total"
            ></el-pagination>
          </div>
    </div>
  </div>
  </div>
</template>
<script>
import { getLeftTreeInterface } from "@/api/resource_list";
import {
  getLogisticsList,
  getDistrictList,
  logisticsAnalysis,
  logisticsAnalysisPage
} from "@/api/datamanage";
export default {
  data() {
    // 验证是否整数
    var isInteger = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("输入不可以为空"));
      }
      //debugger;
      setTimeout(() => {
       if(value<this.logisticsForm.departureTime){
         return callback(new Error("到达时间应大于出发时间"));
       }
      }, 100);
    };
    return {
      tabPosition: "",
      treeData: [],
      activeName:'first',
      defaultProps: {
        children: "children",
        label: "label"
      },
      form: {},
      // 物流数据
      logisticCompany: [],
      // 物流省市信息
      pid: 1,
      departureData: [],
      destinationData: [],
      startTownData: [],
      endTownData: [],
      startTown: "",
      endTown: "",
      // 物流表单信息
      logisticsForm: {
        expressType: "",
        departure: null,
        destination: null,
        analysisName: "",
        departureName: "",
        destinationName: "",
        departureTime: "",
        destinationTime: "",
        endTown: "",
        startTown: "",
        endP: null,
        startP:'',
        analysisName:'',
      },
      // 上传数据校验
      rules: {
        analysisName: [
          { required: true, message: "请输入分析名称", trigger: "blur" }
        ],
        expressType:[
          { required: true, message: "请选择快递公司", trigger: "change" }
        ],
        startP:[
          { required: true, message: "请选择省份", trigger: "change" }
        ],
        startTown:[
          { required: true, message: "请选择市", trigger: "change" }
        ],
        endP:[
          { required: true, message: "请选择省份", trigger: "change" }
        ],
        endTown:[
          { required: true, message: "请选择市", trigger: "change" }
        ],
        departureTime:[
          { required: true, message: "请输入出发时间", trigger: "change" },

        ],
        destinationTime:[
          { required: true, message: "请输入到达时间", trigger: "change" },
        ]
      },
      listQuery: {
        pageNumber: 1,
        analysisName: ""
      },
      analysisList: [],
      total: 0,
      dialogFormVisible:false,
      startDatePicker: this.beginDate(),
      endDatePicker: this.processDate(),
      islogisticsForm: false,
    };
  },
  created() {
    this.getLeftTree();
    this.getlogisticInfo();
    this.getDistrict();
  },
  filters: {
    getState(value) {
      var arr = ["正在分析", "分析成功", "分析失败"];
      return arr[value - 1];
    },
    getDate(value) {
      let s = value.DESTINATION_TIME;
      let b = value.DEPARTURE_TIME;
      if (typeof s !== "undefined" && typeof b !== "undefined") {
        if (s.length == 10 && b.length == 10) {
          return b + " 至 " + s;
        } else {
          return "数据错误";
        }
      }
    }
  },
  mounted() {
    this.getAnalysisPage();
  },
  methods: {
    beginDate(){
      const self = this
      return {
        disabledDate(time){
          if (self.logisticsForm.destinationTime) {  //如果结束时间不为空，则小于结束时间
            return new Date(self.logisticsForm.destinationTime).getTime() < time.getTime()
          } else {
            // return time.getTime() > Date.now()//开始时间不选时，结束时间最大值小于等于当天
          }
        }
      }
    },
    processDate() {
      const  self = this
      return {
        disabledDate(time) {
          if (self.logisticsForm.departureTime) {  //如果开始时间不为空，则结束时间大于开始时间
            return new Date(self.logisticsForm.departureTime).getTime() > time.getTime()
          } else {
            // return time.getTime() > Date.now()//开始时间不选时，结束时间最大值小于等于当天
          }
        }
      }
    },
    handCreate(){
      this.dialogFormVisible = true
    },
    handleClick(tab, event) {
      this.tabNameActive = tab.name;
      if (tab.name == "first") {
      } else {
        this.getAnalysisPage();
      }
    },
    handleCurrentChange(val) {
      // 切换分页
      this.listQuery.pageNumber = val;
      this.getAnalysisPage();
    },
    getAnalysisPage(val) {
      if(val){
        this.listQuery.pageNumber = 1;
      }
      logisticsAnalysisPage(this.listQuery).then(res => {
        this.analysisList = res.data.data.rows;
        this.total = res.data.data.total;
      });
    },
    // 获取资源目录
    getLeftTree() {
      var _this = this;
      let s = {
        menuType: 2
      };
      getLeftTreeInterface(s).then(res => {
        var arr = res.data.data;
        arr[0].disabled = true;
        arr[1].disabled = true;
        arr[2].disabled = true;
        _this.treeData = arr;
      });
    },
    resetTemp() {
      this.logisticsForm = {
        expressType: "",
        departure: null,
        destination: null,
        analysisName: "",
        departureName: "",
        destinationName: "",
        departureTime: "",
        destinationTime: "",
        startP: null,
        endP: null
      };
    },
    async getlogisticInfo() {
      const res = await getLogisticsList();
      const {
        data: { code, data }
      } = res;
      this.logisticCompany = data;
    },
    // 获取行政省市区
    async getDistrict() {
      const res = await getDistrictList(this.pid);
      this.departureData = res.data.data;
      this.destinationData = res.data.data;
    },
    // 获取出发地数据
    async getStartTown(val) {
      const res = await getDistrictList(val);
      this.startTownData = res.data.data;
      this.logisticsForm.startTown = "";
      this.islogisticsForm = true;
    },
    // 获取出发地value和lable
    changeStarTown(val) {
      this.logisticsForm.departure = val;
      let obj = {};
      obj = this.startTownData.find(item => {
        return item.ID === val;
      });
      this.logisticsForm.departureName = obj.NAME;
      this.islogisticsForm = true;
    },
    // 获取目的地数据
    async getEndTown(val) {
      const res = await getDistrictList(val);
      this.endTownData = res.data.data;
      this.endTown = "";
      this.islogisticsForm = true;
    },
    // 获取目的地value和lable
    changeEndTown(val) {
      this.logisticsForm.destination = val;
      let obj = {};
      obj = this.endTownData.find(item => {
        return item.ID === val;
      });
      this.logisticsForm.destinationName = obj.NAME;
      this.islogisticsForm = true;
    },
    submitLogisticForm(logisticsForm) {
      var _this = this;
      _this.$refs.logisticsForm.validate(valid => {
        if (valid) {
          logisticsAnalysis(_this.logisticsForm).then(res => {
            if (res.data.code == 1) {
              _this.resetTemp();
              _this.$message.success("数据分析提交成功。");
              _this.dialogFormVisible = false
              _this.getAnalysisPage(1);
              _this.$refs.logisticsForm.resetFields();
              _this.islogisticsForm = false;
            } else {
              _this.$message.error(res.data.msg);
              return false;
            }
          });
        } else{
        }
      });
    },
    showValue(val){
      this.islogisticsForm = true;
    },
    // 点击x号关闭弹窗
    handleClose() {
      if(this.islogisticsForm || this.logisticsForm.destinationTime || this.logisticsForm.departureTime){
        this.$confirm('编辑的内容可能没有保存，确定关闭?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$refs.logisticsForm.resetFields();
          this.dialogFormVisible = false;
          this.islogisticsForm = false;
        })
      }else{
          this.$refs.logisticsForm.resetFields();
          this.dialogFormVisible = false;
      }

    },
  }
};
</script>
<style scoped  rel="stylesheet/scss" lang="scss">

.formbox {
  margin: 0 auto;
  h3 {
    font-size: 16px;
    font-weight: 400;
    color: #009a52;
  }
}

.line {
  text-align: center;
}

.btn-box {
  margin-top: 30px;
  text-align: center;
}

.btn-text {
  margin-left: 30px;
}
.el-form-item__label{text-align: right;}
#roc11,
#roc12,
#roc13,
#roc14 {
  // margin-top: 20px;
  // margin-left: 2%;
  //margin: 40px auto;
  //width: 74%;
  border-top: 1px solid #fff;
}
.el-input {
  width: 220px;
}
</style>
