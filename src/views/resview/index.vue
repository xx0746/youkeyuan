<template>
  <div>
    <div class="title">评论管理</div>
    <div class="filter-container r-menu" style="margin-top:20px;margin-left:20px;margin-right:20px">
      <el-input
        style="width: 200px;"
        class="filter-item"
        placeholder="评论内容"
        v-model="listQuery.commentContent"
      ></el-input>
      <el-button
        type="primary"
        icon="el-icon-search"
        size="small"
        @click="getCommentList(1)"
        style="margin-left:10px"
      >查询</el-button>
      <!-- <button type="button" class="el-button el-button--danger"><span>批量删除</span></button> -->
      <el-table
        :data="commentList"
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
        <el-table-column align="center" width="60px"  label="序号">
          <template slot-scope="scope">
            <span>{{scope.$index+1}}</span>
          </template>
        </el-table-column>

        <el-table-column  width="150" align="center" label="资源名称">
          <template slot-scope="scope">
            <span>{{scope.row.TITLE}}</span>
          </template>
        </el-table-column>

        <el-table-column  align="center" label="评论内容">
          <template slot-scope="scope">
            <div>{{scope.row.COMMENTCONTENT}}</div>
          </template>
        </el-table-column>

        <el-table-column  width="170" align="center" label="评论时间">
          <template slot-scope="scope">
            <span>{{scope.row.CREATETIME}}</span>
          </template>
        </el-table-column>

        <el-table-column  width="90" align="center" label="评论人">
          <template slot-scope="scope">
            <span>{{scope.row.LOGINNAME}}</span>
          </template>
        </el-table-column>

        <el-table-column  width="120" align="center" label="所属资源目录">
          <template slot-scope="scope">
            <span>{{scope.row.MENUNAME}}</span>
          </template>
        </el-table-column>
        <el-table-column  width="100" align="center" label="状态">
          <template slot-scope="scope">
            <span>{{scope.row.STATE == 0 ? '待审核':'审核通过'}}</span>
          </template>
        </el-table-column>
        <el-table-column width="140" align="center" label="操作" fixed="right">
          <template slot-scope="scope">
            <div class="handle-col">
              <diy-btn styleType="icon" iconType="icon-pass" v-if="scope.row.STATE == 0" @click="audit(scope.row)"></diy-btn>
              <diy-btn styleType="icon" iconType="icon-del"  @click="removeComment(scope.row)"></diy-btn>
              <!-- <el-button type="primary2" @click="audit(scope.row)" size="mini" v-if="scope.row.STATE == 0">通过</el-button> 
              <el-button type="primary2" @click="removeComment(scope.row)" size="mini">删除</el-button> -->
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
  </div>
</template>
<script>
import {
  getCommentList,
  handDelInterface,
  auditInterface,
} from "@/api/comment";
export default {
  data() {
    return {
      commentList: null,
      total: null,
      listLoading: false,
      // 搜索初始化
      listQuery: {
        pageNumber: 1,
        title: "",
        limit: 10,
        commentContent: ""
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
    this.getCommentList();
  },
  methods: {
    handleCurrentChange(val) {
      this.listQuery.pageNumber = val;
      this.getCommentList();
    },
    // 获取评论列表
    getCommentList(val) {
      var _this = this;
      if(val){
        _this.listQuery.pageNumber = 1;
      }
      getCommentList(_this.listQuery).then(function(res) {
        console.log(res);
        if (res.data.code == 1) {
          self.listLoading = false;
          _this.commentList = res.data.data.rows;
          _this.total = res.data.data.total;
          _this.listLoading = false;
          if(_this.commentList.length === 0){
            _this.listQuery.pageNumber = 1;
            _this.getCommentList(_this.listQuery);
          }
        } else {
          self.listLoading = false;
        }
      });
    },
    removeComment(row) {
      this.$confirm("确定删除该条评论？", "提示", {
          distinguishCancelAndClose: true,
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          handDelInterface(row.ID)
            .then(res => {
              if (res.data.code != "1") {
                this.$message.error(res.data.msg);
                return false;
              } else {
                this.$message.success("删除成功");
                this.getCommentList();
              }
          }) 
        })
        .catch(() => {
          this.$message.info("已取消删除");
        });
    },
    audit(row){
      var _this = this;
      _this
        .$confirm("此操作将执行通过操作, 是否继续?", "提示", {
          type: "warning"
        })
        .then(function() {
          auditInterface(row.ID)
            .then(res => {
              if (res.data.code != "1") {
                _this.$message.error(res.data.msg);
                return false;
              } else {
                _this.$message.success("操作成功");
                _this.getCommentList();
              }
            })
        })
        .catch(() => {
              _this.$message.info("已取消操作");
            });;
    },
  }
};
</script>
