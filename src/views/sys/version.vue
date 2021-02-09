<template>
  <div>
    <div class="title">版本列表</div>
    <div class="filter-container r-menu" style="margin-top:20px;margin-left:20px;margin-right:20px">
      <el-input
        style="width: 200px;"
        class="filter-item"
        placeholder="版本号"
        v-model="listQuery.versionNumber"
      ></el-input>
      <el-button
        type="primary"
        icon="el-icon-search"
        size="small"
        @click="getVersionList(1)"
        style="margin-left:10px"
      >查询</el-button>
      <el-button @click="bannerPublish" type="primary" size="small">发布</el-button>
      <el-table
        :data="versionList"
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

        <el-table-column align="center" width="150px" label="版本号">
          <template slot-scope="scope">
            <span>{{scope.row.VERSION_NUMBER}}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" width="150px" label="版本主题">
          <template slot-scope="scope">
            <span>{{scope.row.VERSION_TITLE}}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="版本信息">
          <template slot-scope="scope">
            <span>{{scope.row.VERSION_INFO}}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" width="150px" label="版本更新时间">
          <template slot-scope="scope">
            <span>{{scope.row.VERSION_UPDATE_TIME | momentsTime}}</span>
          </template>
        </el-table-column>

        <el-table-column width="100px" align="center"  label="操作" fixed="right">
          <template slot-scope="scope">
              <div class="handle-col">
                <diy-btn styleType="icon" iconType="icon-del" @click="handDel(scope.row)"></diy-btn>
              </div>
          </template>
        </el-table-column>
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
    <el-dialog title="版本发布" :visible.sync="dialogVisible" width="50%" center @close="handleClose">
        <el-form
          ref="form"
          :model="form"
          label-width="100px"
          style=""
          :rules="carRules"
        >
          <el-form-item prop="versionNumber" label="版本号" style="margin-top: -5px">
            <el-input v-model="form.versionNumber"></el-input>
          </el-form-item>

          <el-form-item label="版本主题" prop="versionTitle" style="margin-top: -5px">
            <el-input v-model="form.versionTitle"></el-input>
          </el-form-item>

          <el-form-item label="版本信息" style="margin-top: -5px">
            <el-input type="textarea" v-model="form.versionInfo"></el-input>
          </el-form-item>

          <el-form-item prop="versionUpdateTime" label="更新时间" style="margin-top: -5px">
            <el-date-picker v-model="form.versionUpdateTime" type="date" placeholder="选择日期"></el-date-picker>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button
              @click="handleClose"
              type="primary4"
              size="small"
            >取消</el-button>
            <el-button type="primary" size="small" style="margin-left:50px;" :disabled="subDisabled" @click="handleCreate">确定</el-button>
        </span>  
    </el-dialog>
  </div>
</template>
<script>
import { getVersionList, insertVersion,delVersion } from "@/api/login";
export default {
  data() {
    return {
      url: "/api",
      versionList: null,
      total: null,
      listLoading: false,
      // 搜索初始化
      listQuery: {
        pageNumber: 1,
        title: "",
        limit: 10,
        versionNumber: ""
      },
      form: {
        versionNumber: "",
        versionTitle: "",
        versionInfo: "",
        versionUpdateTime: "",
        state: 1
      },
      total: null,
      state: true,
      subDisabled: false,
      authData: [],
      dialogVisible: false,
      temp: {},
      carRules: {
        versionTitle:[
          { required: true, message: "请输入版本主题", trigger: "blur" }
        ],
        versionInfo: [
          { required: true, message: "请输入版本信息", trigger: "blur" }
        ],
        versionNumber: [
          { required: true, message: "请输入版本号", trigger: "blur" }
        ],
        versionUpdateTime: [
          { required: true, message: "请选择版本更新时间", trigger: "blur" }
        ]
      },
      textarea:''
    };
  },
  mounted() {
    this.getVersionList();
  },
  methods: {
    //版本删除
    handDel(row){
      this.$confirm("确定删除?", "提示", {
        distinguishCancelAndClose: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          delVersion(row.ID).then(res => {
            if (res.data.code != "1") {
              this.$messge.error(res.data.msg);
              return false;
            } else {
              this.$message.success("删除成功");
              this.getVersionList();
            }
          });
        })
        .catch(() => {
          this.$message.info("已取消删除");
        });
    },
    //版本的添加
    handleCreate() {
      var _this = this;
      _this.$refs.form.validate(valid => {
        _this.subDisabled = true;
        if (valid) {
          _this.listLoading = true;
          insertVersion(_this.form).then(function(res) {
            if (res.data.code == 1) {
              _this
                .$confirm("添加成功,是否返回列表", "提示", {
                  type: "success"
                })
                .then(() => {
                  _this.subDisabled = false;
                  _this.dialogVisible = false;
                  _this.listLoading = false;
                  _this.getVersionList();
                })
                .catch(() => {
                  _this.$message.info("已取消");
                  _this.subDisabled = false;
                });
            } else {
              _this.listLoading = false;
              _this.subDisabled = false;
              _this.$message.error(res.data.msg);
              return false;
            }
          });
        } else {
          _this.subDisabled = false;
          return false;
        }
      });
    },
    handleClose(){
      this.dialogVisible = false;
      this.$refs.form.resetFields();
    },
    handleCurrentChange(val) {
      this.listQuery.pageNumber = val;
      this.getVersionList();
    },
    resetTemp(){
      this.form = {
         versionNumber: "",
        versionTitle: "",
        versionInfo: "",
        versionUpdateTime: "",
        state: 1
      }
    },
    // 轮播列表
    bannerPublish() {
      this.resetTemp();
      this.dialogVisible = true;
    },
    // 获取版本列表
    getVersionList(val) {
      var _this = this;
      if(val){
        _this.listQuery.pageNumber = 1;
      }
      getVersionList(_this.listQuery).then(function(res) {
        if (res.data.code == 1) {
          self.listLoading = false;
          _this.versionList = res.data.data.rows;
          _this.total = res.data.data.total;
          _this.listLoading = false;
        } else {
          self.listLoading = false;
          _this.$message.error(res.data.msg);
        }
      });
    }
  }
};
</script>
<style scoped>
</style>