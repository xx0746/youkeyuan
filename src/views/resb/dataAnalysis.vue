<template>
  <div class="comment">
    <div class="top">
      <div class="sys_nav" style="border:none;background:transparent;">
        <a href="#/resbsearch" class="sysname">
          <img src="/static/index/logo.png" style="width:250px;margin-top:10px;margin-left:30px">
          <span>•&nbsp;科研资源数据平台</span>
        </a>
        <div class="topbar-account topbar-btn" style="margin-right:40px;position:relative;float:right;cursor: pointer;">
          <login-out></login-out>
        </div>
      </div>

      <!--<div class="searchline">-->
      <!--<el-input class="search" v-model="searchList.searchName" placeholder="请输入内容"></el-input>-->
      <!--<el-button class="button lv" type="primary" @click="search">检索</el-button>-->
      <!--</div>-->
    </div>
    <div class="content">
      <div class="article">
        <el-tabs v-model="activeName2" type="card" @tab-click="handleClick" style="width: 100%;height: 100%;"
                 id="box_title">
          <el-tab-pane label="物流数据导入" name="first" class="el-tabs-box">
            <div class="dataImport">
              <el-form ref="logisticForm" :model="logisticForm" :rules="logisticFormlist">
                <el-form-item label="快递公司">
                  <el-select v-model="logisticForm.expressType" style="width: 310px;" @change="onchange" placeholder="请选择快递公司">
                    <el-option
                      v-for="(item) in logisticCompany"
                      :key="item.ID"
                      :label="item.COMPANYNAME"
                      :value="item.ID">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="选择文件" >
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
                    <el-button id="logisticFormbtn1" slot="trigger" size="small"   class="file_btn" type="primary">选取文件</el-button>
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
                <el-form-item v-if="isShowInput" label="文件分隔符" placeholder="请输入文件分隔符" prop="splitStr">
                  <el-input v-model="logisticForm.splitStr" style="width: 36%"></el-input>
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
                <el-form-item style="text-align: center;">
                  <el-button type="primary" size="small" style="width:90px;" class="data-submit-btn" @click="onSubmitdata">导入</el-button>
                </el-form-item>
              </el-form>
            </div>
            <!--tableData-->
            <div class="tablelist">
              <div v-if="tablelist">
                <el-table
                  :data="logisticsDataList"
                  border
                  height="300px"
                  style="width: 100%">
                  <el-table-column
                    v-for="item1 in keyList"
                    :key="item1"
                    :prop="item1"
                    :label="item1"
                  >
                  </el-table-column>
                </el-table>
                <p style="text-align: center; color: red">
                  *数据仅供展示，只抽取部分数据...
                </p>
              </div>
              <div v-if="txtIsshow" style="text-align: center; color: red">
                *.txt文件不支持预览。
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="导入记录查询" name="second">
            <div style="padding:0 20px 20px 20px">
              <el-select v-model="LogisticsValue" placeholder="请选择导入状态" @change="expressageStateChange">
                <el-option
                  v-for="(item) in choiceWuliuState"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
              <el-table :data="expressTableData" border style="width: 100%; margin:20px 0;" :header-cell-style="{
              'background-color': '#f5f7fa',
              'color': 'rgb(103, 194, 58)',
               }">
                <el-table-column prop="ROWNUM_" label="序号" width="60px"></el-table-column>
                <el-table-column prop="FILENAME" label="文件名"></el-table-column>
                <el-table-column width="150" prop="EXPRESSNAME" label="快递公司"></el-table-column>
                <el-table-column width="150" prop="DATACOUNT" label="导入条数"></el-table-column>
                <el-table-column label="状态" width="150px">
                  <template slot-scope="scope">
                    {{scope.row.STATE == '0' ? '导入失败' : scope.row.STATE == '1' ? '正在导入' : scope.row.STATE == '2' ? '导入成功' : "--"}}
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="80" fixed="right">
                  <template slot-scope="scope">
                    <diy-btn
                      styleType="icon" iconType="icon-download"
                      @click="templateDownload(scope.row)"
                    >下载
                    </diy-btn>
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
          </el-tab-pane>
          <el-tab-pane label="数据分析" name="third">
            <div class="formbox" id="roc14">
              <div class="filter-container r-menu" style="margin-left:20px;margin-right:20px">
                <el-dialog class="dialogTitle" title="添加分析" :visible.sync="dialogFormVisible" :before-close="closeDialog" width="800px">
                  <el-form
                    ref="logisticsForm"
                    :model="logisticsForm"
                    label-width="120px"
                    :rules="rules"
                    class="dialogform"
                    >
                    <el-form-item label="本次分析名称" prop="analysisName" >
                      <el-input v-model="logisticsForm.analysisName"  placeholder="请输入分析名称" class="fenxiname" @change="showValue('analysisName')"></el-input>
                    </el-form-item>

                    <el-form-item label="快递公司" prop="expressType">
                        <el-select v-model="logisticsForm.expressType" placeholder="请选择快递公司" @change="showValue('logisticCompany')">
                          <el-option
                            v-for="(item) in logisticCompany"
                            :key="item.ID"
                            :label="item.COMPANYNAME"
                            :value="item.ID"
                          ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="出发地" required>
                      <el-col :span="10">
                        <el-form-item prop="startP">
                          <el-select filterable default-first-option v-model="logisticsForm.startP" placeholder="省份"
                                     @change="getStartTown">
                            <el-option
                              v-for="(area) in departureData"
                              :key="area.ID"
                              :label="area.NAME"
                              :value="area.ID"
                            ></el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col :span="3"><span>&nbsp;&nbsp; — </span></el-col>
                      <el-col :span="11">
                        <el-form-item prop="startTown">
                          <el-select v-model="logisticsForm.startTown" filterable default-first-option placeholder="市"
                                     @change="changeStarTown">
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
                      <el-col :span="10">
                        <el-form-item prop="endP">
                          <el-select v-model="logisticsForm.endP" filterable default-first-option placeholder="省份"
                                     @change="getEndTown">
                            <el-option
                              v-for="(area) in destinationData"
                              :key="area.ID"
                              :label="area.NAME"
                              :value="area.ID"
                            ></el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col :span="3"><span>&nbsp;&nbsp; — </span></el-col>
                      <el-col :span="11">
                        <el-form-item prop="endTown">
                          <el-select v-model="logisticsForm.endTown" filterable default-first-option placeholder="市"
                                     @change="changeEndTown">
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
                        <el-col :span="10">
                          <el-form-item prop="departureTime">
                            <el-date-picker
                              format="yyyy-MM-dd"
                              value-format="yyyy-MM-dd"
                              type="date"
                              v-model="logisticsForm.departureTime"
                              placeholder="出发时间"
                              :picker-options="startDatePicker"
                              style="width: 218px;"
                            ></el-date-picker>
                          </el-form-item>
                        </el-col>

                        <el-col :span="3"><span>&nbsp;&nbsp; — </span></el-col>
                        <el-col :span="11">
                          <el-form-item prop="destinationTime">
                            <el-date-picker
                              format="yyyy-MM-dd"
                              value-format="yyyy-MM-dd"
                              type="date"
                              v-model="logisticsForm.destinationTime"
                              placeholder="到达时间"
                              :picker-options="endDatePicker"
                              style="width: 218px;"
                            ></el-date-picker>
                          </el-form-item>
                        </el-col>

                      </div>
                    </el-form-item>
                  </el-form>
                  <div class="btn-box" style="text-align: center;">
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
                  style="margin-left:14px"
                >查询
                </el-button>
                <el-button type="primary" size="small" icon="el-icon-plus" @click="handCreate">添加</el-button>
                <!-- <button type="button" class="el-button el-button--danger"><span>批量删除</span></button> -->
                <el-table
                  :data="analysisList"
                  row-key="id"
                  style="margin-top:20px;margin-bottom: 20px;"
                  border
                  highlight-current-row
                  :header-cell-style="{
                  'background-color': '#f5f7fa',
                  'color': 'rgb(103, 194, 58)',
                  }"
                >
                  <el-table-column align="center" width="60px" label="序号">
                    <template slot-scope="scope">
                      <span>{{scope.$index + 1}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column align="center" label="分析名称">
                    <template slot-scope="scope">
                      <span>{{scope.row.ANALYSIS_NAME}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column width="110" align="center" label="快递公司">
                    <template slot-scope="scope">
                      <span>{{scope.row.EXPRESSNAME}}</span>
                    </template>
                  </el-table-column>

                  <el-table-column width="110" align="center" label="状态">
                    <template slot-scope="scope">
                      <span>{{scope.row.STATE | getState}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column width="110" align="center" label="出发地">
                    <template slot-scope="scope">
                      <span>{{scope.row.DEPARTURE_NAME}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column width="110" align="center" label="目的地">
                    <template slot-scope="scope">
                      <span>{{scope.row.DESTINATION_NAME}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column width="110" align="center" label="分析条数">
                    <template slot-scope="scope">
                      <span>{{scope.row.DATACOUNT}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column width="220" align="center" label="时间范围">
                    <template slot-scope="scope">
                      <span>{{scope.row | getDate}}</span>
                    </template>
                  </el-table-column>
                </el-table>
                <!-- 页脚分页 -->
                <div class="block" style="padding-bottom: 30px;">
                  <el-pagination
                    style="text-align: center"
                    :page-sizes="[10,20,30, 50]"
                    :page-size="10"
                    layout="total,  prev, pager, next, jumper"
                    :current-page="listQuery.pageNumber"
                    @current-change="handleCurrentChange1"
                    :total="total1"
                  ></el-pagination>
                </div>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="分析结果查询" name="fourth">
            <div>
              <div class="form-box">
                <el-form ref="analyzeForm" :model="analyzeForm" label-width="100px">
                  <el-form-item label="分析名称">
                    <el-select v-model="analyzeForm.analysisId" placeholder="请选择分析" @change="selectChange">
                      <el-option
                        v-for="(item) in analysisData"
                        :key="item.ID"
                        :label="item.ANALYSIS_NAME"
                        :value="item.ID"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="分析时间范围">
                    <div style="display: inline-block">
                      <el-input
                        type="text"
                        v-model="analysis.DEPARTURE_TIME"
                        disabled
                        style="width:218px;background-color:#ffffff"
                      ></el-input>
                      <span class="line">—</span>
                      <el-input
                        type="text"
                        v-model="analysis.DESTINATION_TIME"
                        disabled
                        style="width:218px;background-color:#ffffff"
                      ></el-input>
                    </div>
                    <div class="div_box" style="margin-left: 14px;display:inline-block">
                      <el-button type="primary" @click="onSubmit" icon="el-icon-search" size="small">查询</el-button>
                    </div>
                  </el-form-item>
                </el-form>
                <el-table
                  :data="tableDatalist"
                  border
                  style="width: 100%"
                  :header-cell-style="{
              'background-color': '#f5f7fa',
              'color': 'rgb(103, 194, 58)',
               }"
                >
                  <el-table-column prop="data1" label="总单数"></el-table-column>
                  <el-table-column prop="data4" label="有效单数"></el-table-column>
                  <el-table-column prop="data2" label="出发地"></el-table-column>
                  <el-table-column prop="data3" label="目的地"></el-table-column>
                  <el-table-column :render-header="renderheader" prop="data5" label="全程/平均时长(h)"></el-table-column>
                  <el-table-column :render-header="renderheader" prop="data6" label="收寄环节/平均时长(h)"></el-table-column>
                  <el-table-column :render-header="renderheader" prop="data7" label="网运环节/平均时长(h)"></el-table-column>
                  <el-table-column :render-header="renderheader" prop="data8" label="投递环节/平均时长(h)"></el-table-column>
                  <!-- <el-table-column label="操作">
                          <template>查看明细/下载图表</template>
                  </el-table-column>-->
                </el-table>
                 <p v-show="showText" style="margin-top: 20px;color:#009A52">当前物流分析范围内，有效单数为0</p>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <footer class="footer_style">
      <footer-view></footer-view>
    </footer>

  </div>
</template>

<script>
  import loginOut from "@/components/loginOut"
  import {
    getLogisticsList,
    sendUploadFile,
    getTemplateNameSelect,
    addTemplateTableData,
    logisticsCollectList,
    LogisticsFormData,
    getDistrictList,
    logisticsAnalysis,
    logisticsAnalysisPage,
    logisticsAnalysisList,
    logisticsAnalysisResult
  } from "@/api/datamanage";
  import XLSX from 'xlsx'
  import {downloadFile} from "@/utils/utile";
  import * as elValidate from '@/utils/elValidate';
  import footerView from '@/views/home/footerView';

  export default {
    components: { loginOut , footerView },
    data() {
      var isInteger = (rule, value, callback) => {
        if (!value) {
          return callback(new Error("输入不可以为空"));
        }
        //debugger;
        setTimeout(() => {
          if (value < this.logisticsForm.departureTime) {
            return callback(new Error("到达时间应大于出发时间"));
          }
        }, 100);
      };
      return {
        showText:false,
        // 导入记录总数
        total: null,
        // 数据分析总数
        total1: null,
        // 物流省市信息
        pid: 1,
        tableDatalist: [],
        activeName2: 'first',
        isShowSecond: false,
        isShowInput: false,
        // 快递数据导入数据
        logisticCompany: [],
        tablelist: false,
        txtIsshow: false,
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
          startP: '',
          analysisName: '',
        },
        // 上传数据校验
        rules: {
          analysisName: [
            {required: true, message: "请输入分析名称", trigger: "blur"}
          ],
          expressType: [
            {required: true, message: "请选择快递公司", trigger: ["change", "blur"]}
          ],
          startP: [
            {required: true, message: "请选择省份", trigger: "change"}
          ],
          startTown: [
            {required: true, message: "请选择市", trigger: "change"}
          ],
          endP: [
            {required: true, message: "请选择省份", trigger: "change"}
          ],
          endTown: [
            {required: true, message: "请选择市", trigger: "change"}
          ],
          departureTime: [
            {required: true, message: "请输入出发时间", trigger: "change"},

          ],
          destinationTime: [
            {required: true, message: "请输入到达时间", trigger: "change"},
          ]

        },
        choiceWuliuState: [
          {value: "", label: "全部"},
          {value: "0", label: "导入失败"},
          {value: "1", label: "正在导入"},
          {value: "2", label: "导入成功"}
        ],
        listQuery: {
          pageNumber: 1,
          limit: 10,
          state: "",
          analysisName: ""
        },
        LogisticsValue: "",
        // 快递数据表格
        expressTableData: [],
        recordValue: "",
        // 提交快递数据导入表单数据
        logisticForm: {
          expressType: '',
          chars: '',
          splitStr: ''
        },
        dialogFormVisible: false,
        // 表格内容
        tableData: [],
        keyList: [],
        handleOpen: "",
        handleClose: "",
        departureData: [],
        destinationData: [],
        startTownData: [],
        endTownData: [],
        startTown: "",
        endTown: "",
        analysisList: [],
        total: 0,
        dialogFormVisible: false,
        startDatePicker: this.beginDate(),
        endDatePicker: this.processDate(),
        tabPosition: "",
        treeData: [],
        defaultProps: {
          children: "children",
          label: "label"
        },
        analysis: "",
        analyzeForm: {
          analysisId: ""
        },
        analysisData: [],
        tableData: [],
        analysisResult: [],
        // 校验规则
        logisticFormlist: {
          logistics: [{required: true, message: '请选择物流公司', trigger: 'blur'}]
        },
        logisticFormDisabled: false,
        headerType: {"Content-Type": "multipart/form_data"},
        islogisticsForm: false,
      }
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
    computed: {
      // 显示物流数据导入展示表格
      logisticsDataList: function () {
        return this.tableData.slice(0, 5);
      },
      tableState() {
        return this.$store.state.tableState;
      }
    },
    created() {
      this.getlogisticInfo();
      this.getDistrict();
    },
    mounted() {
      console.log(this.tableState)
      this.activeName2 = this.tableState
      this.getCollectList();
      this.getAnalysisPage()
      this.getAnalysisList();
    },
    methods: {
      // 物流数据导入
      // 提交物流数据导入
      onSubmitdata() {
        if(!this.tablelist && !this.txtIsshow) {
          this.$message.warning('请选择上传文件！')
        }
        this.tablelist = false;
        this.txtIsshow = false;
        this.$refs.logisticFormFile.submit();
      },
      onchange(val) {
        console.log(this.logisticForm);
      },
      // 快递公司导入数据
      async getlogisticInfo() {
        const res = await getLogisticsList();
        const {
          data: {code, data}
        } = res;
        this.logisticCompany = data;
      },
      // 上传
      // 快递数据
      beforeChange(file, fileList) {
        if (fileList.length > 1) {
          fileList.splice(0, 1)
        }
        let testmsg = /\.csv(\?.*)?$/.test(file.raw.name)
        if (testmsg) {
          this.isShowInput = true;
        } else {
          this.isShowInput = false;
          this.logisticForm.splitStr = '';
        }
        console.log(fileList);
        if(fileList.length != 0) {
          this.readerData(file.raw);
        }
      },
      // 快递表单导入钩子
      beforeFileUpload(file) {
        let testmsg = /\.(txt|xls|xlsx|csv)(\?.*)?$/.test(file.name)
        if (!testmsg) {
          this.$message.error('请上传正确的文档类型!');
          return
        }
        if(this.logisticForm.expressType == '') {
          this.txtIsshow = false;
          this.$message.error('请选择快递公司！');
        } else {

          let fd = new FormData();
          fd.append('file', file);
          sendUploadFile(fd, this.logisticForm).then(res => {
            if (res.data.code == 1) {
              this.tablelist = false;
              this.txtIsshow = false;
              this.$message.success("上传成功！")
              this._clear();
            } else if (res.data.code == 0) {
              this.$message.warning(res.data.msg);
            }
          })
        }
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
      removeflie(file, fileList) {
        this.tablelist = false;
        this.txtIsshow = false;
      },
      // 获取表格数据
      generateDate({tableTitle, results}) {
        this.tableData = results;
        var tableData = this.tableData[0];
        this.keyList = Object.keys(tableData);
        this.logisticstableData = results;
        var tableDatalist = this.logisticstableData[0];
        this.keydataList = Object.keys(tableDatalist);
      },
      // 清除数据
      _clear() {
        this.logisticForm = {
          expressType: '',
          chars: '',
          splitStr: '',
        };
        // 表格数据
        this.tablelist = false;
        this.txtIsshow = false;
        this.tableData = [];
      },
      handleClick(tab, event) {
        this.$store.commit("setTableState", tab.name);
        if (tab.name == 'second') {
          this.getCollectList();
        } else if (tab.name == 'third') {
          this.getAnalysisPage();
        } else if (tab.name == 'fourth') {
          this.getAnalysisList();
        }
      },
      // 读取表格内容
      readerData(itemFile) {
        let testmsg = /\.(txt|xls|xlsx|csv)(\?.*)?$/.test(itemFile.name)
        let txtmsg = /\.(txt)(\?.*)?$/.test(itemFile.name)
        if (!testmsg) {
          this.$message.warning('请上传符合格式要求的文件！')
        } else if(!txtmsg){
          this.tablelist = true;
          this.txtIsshow = false;
          const reader = new FileReader()
          reader.onload = e => {
            const data = e.target.result
            const fixedData = this.fixdata(data)
            const workbook = XLSX.read(btoa(fixedData), {type: 'base64'})
            const firstSheetName = workbook.SheetNames[0] // 第一张表 sheet1
            const worksheet = workbook.Sheets[firstSheetName] // 读取sheet1表中的数据
            // delete worksheet['!merges']let A_l = worksheet['!ref'].split(':')[1] //当excel存在标题行时
            const tableTitle = firstSheetName
            const results = XLSX.utils.sheet_to_json(worksheet)
            this.generateDate({tableTitle, results})
          }
          reader.readAsArrayBuffer(itemFile)
        } else {
          this.tablelist = false;
          this.txtIsshow = true;
        }
      },
      // 处理表格数据
      fixdata(data) {
        let o = ''
        let l = 0
        const w = 10240
        for (; l < data.byteLength / w; ++l)
          o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w, l * w + w)))
        o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w)))
        return o
      },

      // 分析结果查询
      onSubmit() {
        var _this = this;
        _this.tableDatalist = [];
        _this.listLoading = true;
        let analysisId = this.analyzeForm.analysisId
        if(analysisId){
          logisticsAnalysisResult(analysisId).then(function (res) {
            if (res.data.code == 1) {
              _this.listLoading = false;
              _this.analysisResult = res.data.data;  
              if(_this.analysisResult.length!=0){
                  var sb = {
                  data1: _this.analysisResult[0],
                  data2: _this.analysis.DEPARTURE_NAME,
                  data3: _this.analysis.DESTINATION_NAME,
                  data4: _this.analysisResult[1],
                  data5: _this.analysisResult[2],
                  data6: _this.analysisResult[3],
                  data7: _this.analysisResult[4],
                  data8: _this.analysisResult[5]
                };
                  _this.showText = false;
                }else{
                  var sb = {
                  data1: 0,
                  data2: _this.analysis.DEPARTURE_NAME,
                  data3: _this.analysis.DESTINATION_NAME,
                  data4: 0,
                  data5:'/',
                  data6: '/',
                  data7: '/',
                  data8:'/'
                };
                _this.showText = true;
              }        
              
              _this.tableDatalist.push(sb);
              _this.listLoading = false;
            } else {
              _this.$message.error(res.data.msg);
              _this.listLoading = false;
            }
          });
        }else{
          _this.$message.warning("请选择分析名称");
        }
      },
      renderheader(h, {column, $index}) {
        return h("span", {}, [
          h("span", {}, column.label.split("/")[0]),
          h("br"),
          h("span", {}, column.label.split("/")[1])
        ]);
      },
      selectChange() {
        this.analysisData.forEach(item => {
          if (item.ID == this.analyzeForm.analysisId) {
            this.analysis = item;
          }
        });
      },
      getAnalysisList() {
        var _this = this;
        _this.listLoading = true;
        logisticsAnalysisList(_this.listQuery).then(function (res) {
          if (res.data.code == 1) {
            _this.listLoading = false;
            _this.analysisData = res.data.data;
            _this.listLoading = false;
          } else {
            _this.$message.error(res.data.msg);
            _this.listLoading = false;
          }
        });
      },
      beginDate() {
        const self = this
        return {
          disabledDate(time) {
            if (self.logisticsForm.destinationTime) {  //如果结束时间不为空，则小于结束时间
              return new Date(self.logisticsForm.destinationTime).getTime() < time.getTime()
            } else {
              // return time.getTime() > Date.now()//开始时间不选时，结束时间最大值小于等于当天
            }
          }
        }
      },
      processDate() {
        const self = this
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
      handCreate() {
        this.dialogFormVisible = true;
        this.resetTemp
      },
      // 启动全环节分析
      submitLogisticForm(logisticsForm) {
        var _this = this;
        _this.$refs.logisticsForm.validate(valid => {
          if (valid) {
            logisticsAnalysis(_this.logisticsForm).then(res => {
              if (res.data.code == 1) {
                _this.resetTemp();
                _this.$message.success("数据分析提交成功。");
                _this.dialogFormVisible = false;
                _this.getAnalysisPage();
                _this.$refs.logisticsForm.resetFields();
                _this.islogisticsForm = false;
              } else {
                _this.$message.error(res.data.msg);
                return false;
              }
            });
          } else {
          }
        });
      },
      // 导入记录查询
      // 切换分页
      handleCurrentChange(val) {
        this.listQuery.pageNumber = val;
        this.getCollectList();
      },
      // 快递数据状态切换
      expressageStateChange(val) {
        this.listQuery.state = val;
        this.getCollectList();
      },
      // 获取快递表单表格内容
      getCollectList() {
        this.listLoading = true;
        logisticsCollectList(this.listQuery).then(res => {
          if (res.data.code == 1) {
            this.expressTableData = res.data.data.rows;
            this.total = res.data.data.total;
            this.listLoading = false;
          } else {
            this.$message.error(res.data.msg);
            this.listLoading = false;
          }
        });
      },

      // 数据分析
      // 分页
      handleCurrentChange1(val) {
        // 切换分页
        this.listQuery.pageNumber = val;
        this.getAnalysisPage();
      },
      //数据分析列表
      getAnalysisPage(val) {
        if (val) {
          this.listQuery.pageNumber = 1;
        }
        logisticsAnalysisPage(this.listQuery).then(res => {
          this.analysisList = res.data.data.rows;
          this.total1 = res.data.data.total;
        });
      },
      //数据分析清空
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
      // 下载文件
      templateDownload(val) {
        let url;
        if (this.tabNameActive == "first") {
          if (val.STATE == 2) {
            let fileName = val.FILENAME.substring(0, val.FILENAME.lastIndexOf(".")) + val.DOWNURL.substring(val.DOWNURL.lastIndexOf("."))
            url = `${val.DOWNURL}?attname=${fileName}`;
          } else {
            url = `${val.FILEURL}?attname=${val.FILENAME}`;
          }
        } else {
          url = `${val.FILEURL}?attname=${val.FILENAME}`;
        }
        downloadFile(url);
      },
      showValue(val){
        this.islogisticsForm = true;
      },
    // 点击x号关闭弹窗
      closeDialog() {
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

<style rel="stylesheet/scss" lang="scss" scoped>
  .originalLinked {
    color: blue;
    font-size: 18px
  }

  .el-tabs__nav .is-top {
    width: 100% !important;
  }

  .articletitle {
    text-align: center;
    font-family: "微软雅黑 Light";
    color: #333;
  }

  .form-box {
    width: 100%;
    padding: 0 20px 20px;
  }

  .dataImport {
    width: 400px;
    margin: 0 auto;
    padding: 20px 0;
    .el-form {
      width: 100%;
    }
  }

  .line {
    text-align: center;
  }

  .formbox {
    margin: 0 auto;
    h3 {
      font-size: 16px;
      font-weight: 400;
      color: #009a52;
    }
    .fenxiname {
      width: 218px;
    }
  }

  .tablelist {
    width: 100%;
    background: url("../../assets/databackground.png") no-repeat;
    height: 300px;
    background-size: 100% 304px;
  }

  .el-tabs__nav {
    width: 100% !important;
  }

  .enclosurelist > li:hover {
    color: blue;
  }

  .el-form-item__content {
    width: 100%;
    display: flex;
  }

  .enclosurelist > li {
    color: grey;
    cursor: pointer;
  }
  .comment {
    overflow: hidden;
    position: relative;
    background-color: #F2F2F2;
  }
  .el-tabs {
    width: 100%;
  }

  .el-tabs__item is-top {
    width: 25% !important;
  }

  [v-cloak] {
    display: none !important;
  }

  .btn-text {
    margin-left: 20px;
  }

  .top {
    background-image: url("/static/index/s1.png");
    background-repeat: no-repeat;
    background-size: 100% 100%;
    -moz-background-size: 100% 100%;
    height: 106px;
    width: 100%;
    padding-top: 20px;
    overflow: hidden;
  }

  .searchline {
    margin-top: 3.5%;
    .search {
      margin-left: 15%;
      border-radius: 0;
      border: none;
      width: 60%;
    }
    .button {
      font-size: 18px;
      border: none;
      height: 40px;
      width: 10%;
      margin-left: -6px;
      border-radius: 0;
      vertical-align: top;
    }

    .lv {
      background: #009a52;
      color: white;
    }

    .lv:hover {
      color: white;
      background: #127714;
    }
  }

  .content {
    width: 100%;
    display: flex;
    margin: 20px 0;
    padding-bottom: 140px;
    justify-content: space-between;
  }

  .recommend {
    width: 25%;
    border: 1px solid #e4e5e6;
    border-top: 3px solid #009a52;
    background: white;
    float: left;
    box-sizing: border-box;
    .recommend-list {
      padding: 20px 30px;
      border-top: 1px solid #D4DBE4;
    }
    h2 {
      padding: 20px 0 20px 20px;
      color: #009a52;
      font-size: 18px;
    }
    ul, li {
      padding: 0;
      margin: 0;
    }
    li {
      margin: 10px 0 10px 10px;
      list-style: disc;
      a {
        color: #333;
      }
    }
  }

  // 右侧文章内容样式
  .article {
    width: 85%;
    background-color: #fff;
    margin: 0 auto;
    border: 1px solid #c4c9d0;
    border-top: 3px solid #009a52;
    min-height: 586px;
    /*display: inline-block;*/

    .el-icon-arrow-left {
      font-size: 20px;
      font-weight: bold;
    }
    h1 {
      text-align: center;
      font-family: "微软雅黑 Light";
      color: #333;
    }
    .author {
      text-align: center;
      margin: 14px 0;
    }

    .article-load {
      width: 100%;
      display: block;
      justify-content: space-around;
      text-align: right;
      margin-bottom: 10px;
      span {
        display: inline-block;
        cursor: pointer;
        width: 15%;
        text-align: center;
      }
      .el-icon-edit-outline {
        margin-left: 10px;
      }
    }
    .article-content {
      padding: 30px 50px;
      div:nth-of-type(1) {
        overflow-y: scroll;
      }
      .art-text {
        width: 100%;
        text-align: center;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 3;
        overflow: hidden;
      }
      .pageimage-box {
        height: 600px;
        overflow: hidden;
      }
      .pageimage {
        padding-top: 20px;
        width: 100%;
        overflow-y: visible !important;
        p {
          width: 100%;
          img {
            display: block;
            width: 800px;
            // height: 100%;
          }
        }
      }
      .active {
        display: inline-block;
      }
      span {
        cursor: pointer;
        &.not {
          cursor: not-allowed;
        }
      }
    }
    .article-enclosure {
      div:nth-of-type(1) {
        padding: 20px 0px;
        font-size: 18px;
      }
      div:nth-of-type(2) {
        padding: 20px;
        .enclosurelist {
          width: 100%;
          /*display: flex;*/
          padding-left: 30px;
          /*justify-content: flex-start;*/
          li {
            /*width: 10%;*/
            font-size: 16px;
            padding-bottom: 5px;
            a {
              color: blue;
              &:hover {
                color: #009a52;
              }
            }
          }
        }
      }
    }
    .publish-review {
      h4 {
        font-size: 16px;
        margin-bottom: 16px;
      }
    }
  }

  // 评论内容
  .review-cont {
    padding: 20px 0;
    border-top: 1px solid rgb(203, 50, 50);
    display: flex;
    justify-content: space-around;
    .icon-user {
      flex: 1;
      width: 30px;
      height: 30px;
      background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAxFJREFUeNrkVz2IE0EY3c3PJdHkoiKRU2KMdjZBkPNAsAtXiHpwKGLnXaegrWDjgQjXqiCICgo2whVqayNeIQaFXBTtJBFiIEVC/v/je8tO2CQ7YdeLXOHAMJPd2e/N9733fTNR+/2+shPNoexQc1lZ1Gw2lUQiofh8vqMOh2Ol1+udxeM5VVVbGH+43e7nrVbrJX4rLpdLkUUxFovZA6Yhp9O5CsOPMQe2Y2AcYxigcYw3sOYiHmVse5xMJmWgK16v94kBbPCeXurjPJ5/RjSOYV6yBVyr1czW7IWHT2dmZqxEZj/6C4Av2RIXPTF2GFDA322C2lD/BXh8SETD2KUeh0KhMSuVSuVct9sd+1DWuFmI8DxE9shyqDudjtmaWVv5CeFBbPva7bZ1jkulkpmhFsRlOdQEhlbqANfmloCDweDYAux8E3l8xWqo9Sx4B21MpGcImFyacHYXxiwDo33zeDxbSD/roYaQxhYA8DuEcp8FwgoqNn/ZmN8yioaAyYto2LXGEVWKj2/C0G4YXeU7I+ccdZAG+hKo+Uo7onRKBKuoxh2l0+nBvFgskl/NgKDA7/cvg+/reH4SYAGdzwxGcnoHgL8EKAEZ7mg0aqqhIY8jkchQFaO3XJzP57VnKCQbANloNBp7YDyGDRUCgcAWDxE9MlrnN8wQFh4zwU48JGjIOGd4GQU2eMfJe3pWr9e192I9gRkhUflsH4uCO3ZwfQKdh8Bh9F2Y94WAdA4xVcnxb7z7gvnmX5/H9AbhPgWlr8HbRcMpZHo6icbwgopPTEO8e2v7BgLj1xCyjwjloo0cFkVnHsMbgK8zIqJLVS3Um8lkruZyuWdMqe00nar1QqFwi8DxeNwcOJVKcTiCUP1kDtv11KxRfFD2GfQP4XDYPNTlcpm83iPopAJvp5FzaOTBaDkeso6EP4BUWR4V0LZukxBptVqNZbPZBSkwdnaam5zmNVavbsz9hUlXn7l/cYfWwQ9KgSGq5rRENapupFZbWkDAxyssOI4dXsLi2SmBVmHzNaYPpXn8X/x3+iPAACsjx2wEOsJ7AAAAAElFTkSuQmCC") no-repeat;
      -webkit-box-flex: 10;
      &::before {
        border: none;
        display: none;
      }
    }
    .review-form {
      flex: 15;
      -webkit-box-flex: 10;
      width: 600px;
      height: 200px;
      border: 1px solid #999;
      border-radius: 4px;
    }
  }

  // 评论表单
  .formbotm {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 4px;
    .formplugs {
      flex: 2;
    }
    .publishbtn {
      flex: 8;
      text-align: right;
    }
    .btnback {
      background-color: rgb(203, 50, 50);
    }
  }

  // 评论信息
  .reviewinfo {
    margin: 10px 0;
    p {
      font-size: 18px;
      display: inline-block;
      margin-bottom: 10px;
    }
    .review-title {
      width: 100%;
      border-bottom: 1px solid #999;
      padding-bottom: 20px;
    }
    .review {
      padding: 24px 0;
      border-bottom: 1px solid #999;
    }
    .review-name {
      span {
        margin-left: 10px;
      }
    }
  }

  .morebtn {
    text-align: center;
    .button {
      margin-top: 10px;
    }
  }

  .dialogTitle {
    iframe {
      width: 100%;
      height: 500px;
    }
  }

  // 本页公共样式
  .red {
    color: rgb(203, 50, 50);
  }

  .blue {
    font-weight: 500;
  }

  .border {
    border-bottom: 1px solid #999;
  }

  .pdf {
    width: 100%;
  }

  .footer_style {
    width: 100%;
    position: absolute;
    z-index: 3000;
    bottom: 0;
  }

</style>
