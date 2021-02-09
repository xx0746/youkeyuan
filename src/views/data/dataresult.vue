<template>
  <div>
    <div class="title">分析结果查询</div>

    <div style="margin-top:20px;margin-left:20px;float:left;width:20%;display:none">
      <div class="title2">数据目录</div>
      <!--<el-tree :data="treeData" :props="defaultProps" :default-expanded-keys="[2]" class="trr"></el-tree>-->
      <el-col>
        <el-menu default-active="2" class="el-menu-vertical-demo">
          <el-submenu
            v-for="(item,index) in treeData"
            index="item.ID"
            :key="index"
            :disabled="item.disabled"
          >
            <template slot="title">
              <span>{{item.label}}</span>
            </template>
          </el-submenu>
        </el-menu>
      </el-col>
    </div>

    <!-- <h3>物流数据分析结果查询</h3> -->
    <div class="form-box">
      <el-form ref="analyzeForm" :model="analyzeForm" label-width="100px">
        <el-form-item label="分析名称" :span="4">
          <el-select v-model="analyzeForm.analysisId" placeholder="请选择分析" width="218px" @change="selectChange">
            <el-option
              v-for="(item) in analysisData"
              :key="item.ID"
              :label="item.ANALYSIS_NAME"
              :value="item.ID"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="分析时间范围">
          <div style="display:inline-block">
            <el-input
              type="text"
              v-model="analysis.DEPARTURE_TIME"
              disabled
              style="width:218px;background-color:#ffffff"
            ></el-input>
            <span class="line" :span="1">—</span>
            <el-input
              type="text"
              v-model="analysis.DESTINATION_TIME"
              disabled
              style="width:218px;background-color:#ffffff"
            ></el-input>
          </div>
          <div class="search-btn">
            <el-button type="primary" @click="onSubmit" icon="el-icon-search" size="small">查询</el-button>
          </div>
        </el-form-item>
      </el-form>
      <el-table
        :data="tableData"
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
</template>
<script>
import { getLeftTreeInterface } from "@/api/resource_list";
import {
  logisticsAnalysisList,
  logisticsAnalysisResult
} from "@/api/datamanage";
export default {
  data() {
    return {
      showText:false,
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
      analysisResult: []
    };
  },
  mounted() {
    this.getAnalysisList();
    this.getLeftTree();
  },
  methods: {
    renderheader(h, { column, $index }) {
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
      logisticsAnalysisList(_this.listQuery).then(function(res) {
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
    // 获取资源目录
    getLeftTree() {
      var _this = this;
      let s = {
        menuType: 2
      };
      getLeftTreeInterface(s).then(res => {
        console.log(res);
        var arr = res.data.data;
        // _this.treeData = res.data.data;
        arr[0].disabled = true;
        arr[1].disabled = true;
        arr[2].disabled = true;
        console.log(arr[1]);
        _this.treeData = arr;
      });
    },
    // 查询
    onSubmit() {
      var _this = this;
      _this.tableData = [];
      _this.listLoading = true;
      let analysisId = this.analyzeForm.analysisId
      if(analysisId){
        logisticsAnalysisResult(analysisId).then(function(res) {
          if (res.data.code == 1) {
            _this.listLoading = false;
            _this.analysisResult = res.data.data;
            if( _this.analysisResult.length!=0){
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
            _this.tableData.push(sb);
            _this.listLoading = false;
          } else {
            _this.$message.error(res.data.msg);
            _this.listLoading = false;
          }
        });
      }else{
        _this.$message.warning("请选择分析名称");
      }

    }
  }
};
</script>
<style scoped  rel="stylesheet/scss" lang="scss">
.formbox {
  h3 {
    font-size: 16px;
    font-weight: 400;
    color: #009a52;
  }
}

.line {
  text-align: center;
}

.form-box {
  width: 96%;
  margin: 20px auto;
}

.tree-box .el-tree {
  background-color: rgb(242, 242, 242);
}

.search-btn {
  margin-left: 14px;
  display: inline-block;
  el-button {
    width: 30px;
  }
}
</style>
