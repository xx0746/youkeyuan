<template>
  <div>
    <div class="title">日志列表</div>
    <div class="filter-container r-menu" style="margin-top:20px;margin-left:20px;margin-right:20px">
      <!-- <el-input  style="width: 200px;" class="filter-item"  placeholder="日志名称"  v-model="listQuery.roleName"></el-input>
      <el-button type="primary" icon="el-icon-search" size="small" @click="getLogList" style="margin-left:10px">搜日志</el-button>-->
      <!-- <button type="button" class="el-button el-button--danger"><span>批量删除</span></button> -->
      <el-table
        :data="logList"
        row-key="id"
        style="margin-top:20px;"

        border
        fit
        highlight-current-row
        :header-cell-style="{
              'background-color': '#f5f7fa',
              'color': 'rgb(103, 194, 58)',
               }"
      >
        <el-table-column align="center" width="60px" label="序号">
          <template slot-scope="scope">
            <span>{{scope.$index+1}}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="请求方法">
          <template slot-scope="scope">
            <span>{{scope.row.REQUESTURI}}</span>
          </template>
        </el-table-column>

        <!-- <el-table-column align="center" label="请求参数">
          <template slot-scope="scope">
            <span>{{scope.row.REQUESTPARAM}}</span>
          </template>
        </el-table-column> -->

        <el-table-column  width="150" align="center" label="请求功能">
          <template slot-scope="scope">
            <span>{{scope.row.METHODNAME}}</span>
          </template>
        </el-table-column>

        <el-table-column  width="140" align="center" label="请求人">
          <template slot-scope="scope">
            <span>{{scope.row.USERNAME}}</span>
          </template>
        </el-table-column>

        <el-table-column  width="200" align="center" label="请求时间">
          <template slot-scope="scope">
            <span>{{scope.row.OPERTIME}}</span>
          </template>
        </el-table-column>

        <el-table-column  width="96" align="center" label="等待时间">
          <template slot-scope="scope">
            <span>{{scope.row.REQUESTMILLIS}}</span>
          </template>
        </el-table-column>

        <!-- <el-table-column width="180" align="center"  label="操作">
          <template slot-scope="scope">
            <a href="javasscript:void(0)"
               style="color:red;margin-left:12px"
               title="删除"
               @click="handDel(scope.row)"
               >
               <i  class="el-icon-delete"></i>
            </a>
          </template>
        </el-table-column>-->
      </el-table>
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
</template>
<script>
import { getLogList } from "@/api/login";
export default {
  data() {
    return {
      url: "/api",
      logList: null,
      total: null,
      listLoading: false,
      // 搜索初始化
      listQuery: {
        pageNumber: 1,
        title: "",
        limit: 10,
        userName: ""
      },
      total: null,
      state: true,
      subDisabled: false,
      authData: [],
      temp: {}
    };
  },
  created: function() {},
  mounted() {
    this.getLogList();
  },
  methods: {
    handleCurrentChange(val) {
      this.listQuery.pageNumber = val;
      this.getLogList();
    },
    // 获取日志列表
    getLogList() {
      var _this = this;
      getLogList(_this.listQuery).then(function(res) {
        console.log(res);
        if (res.data.code == 1) {
          self.listLoading = false;
          _this.logList = res.data.data.rows;
          _this.total = res.data.data.total;
          _this.listLoading = false;
        } else {
          self.listLoading = false;
        }
      });
    }
  }
};
</script>
