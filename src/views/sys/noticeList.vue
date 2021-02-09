<template>
  <div v-loading="fileLoading"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)">
    <div class="title">公告列表</div>

    <div class="filter-container r-menu" style="margin-top:20px;margin-left:20px;margin-right:20px">
      <el-row style="overflow: hidden;">
        <div style="float: left;width:200px">
          <el-input class="filter-item" v-model="listQuery.title" clearable placeholder="标题"></el-input>
        </div>
        <div style="margin-left:14px;float: left;">
          <el-button
          type="primary"
          icon="el-icon-search"
          size="small"
          @click="handleGetList(1)"
        >查询</el-button>
        </div>
      </el-row>

      <el-table
        :data="dynamicList"
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
        <el-table-column align="center" width="300" label="标题">
          <template slot-scope="scope">
            <div>{{scope.row.title}}</div>
          </template>
        </el-table-column>

        <el-table-column align="center" width="300" label="原文链接">
          <template slot-scope="scope">
            <div v-if="scope.row.originalLinked">
                  {{ scope.row.originalLinked }}
                </div>
          </template>
        </el-table-column>

        <el-table-column align="center" width="120" label="发布人">
          <template slot-scope="scope">
            <span>{{scope.row.userName}}</span>
          </template>
        </el-table-column>
        <el-table-column  width="160" align="center" label="发布时间">
          <template slot-scope="scope">
            <span>{{scope.row.createTime}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="附件">
          <template slot-scope="scope">
            <i v-if="scope.row.fileCount!=0" style="cursor:pointer" class="el-icon-download" @click="handleDownload(scope.row)"></i>
          </template>
        </el-table-column>
        <el-table-column width="80" align="center" label="操作" fixed="right">
          <template slot-scope="scope">
            <div style="text-align: center">
              <diy-btn styleType="icon" iconType="icon-del" @click="handleDeleteItm(scope.row.id)">删除</diy-btn>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="block">
        <el-pagination
          style="text-align: center"
          :page-size="10"
          :current-page="listQuery.pageNumber"
          @current-change="handleCurrentChange"
          layout="total, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import { downloadFile } from "@/utils/utile"
import { getList, deleteItem ,downLoad} from "@/api/noticelist";
export default {
  data() {
    return {
      fileLoading:false,
      dynamicList: [],
      total: null,
      listLoading: false,
      listQuery: {
        pageNumber: 1,
        title: null,
        limit: 10,
        state: 2
      }
    };
  },
  created() {
    this.handleGetList();
  },
  mounted(){
  },
  methods: {
    handleDoDelete(id) {
      deleteItem(id).then(res => {
        if (res.data.code !== 1) {
          this.fileLoading = false;
          this.$message.error(res.data.msg);
          return false;
        } else {
          this.$message.success("删除成功");
          this.handleGetList();
          this.fileLoading = false;
        }
      });
    },
    handleDeleteItm(id) {
      this.$confirm("确认删除？", "提示", {
        type: "warning"
      }).then(() => {
        this.handleDoDelete(id);
        this.fileLoading = true;
      });
    },
    handleGetList(val) {
      if(val){
        this.listQuery.pageNumber = 1;
      }
      let params = this.listQuery;
      getList(params).then(res => {
        console.log(res);
        if (res.data.code === 1) {
          this.dynamicList = res.data.data.rows;
          this.total = res.data.data.total;
        }
      });
    },
    handleCurrentChange(val) {
      this.listQuery.pageNumber = val;
      this.handleGetList();
    },
     handleDownload(row) {
      downLoad(row.id).then(res => {
        if (res.data.code <= 0) {
          this.$message.error(res.data.msg);
        } else {
          for (let i = 0; i < res.data.data.length; i++) {
            downloadFile(res.data.data[i]);
          }
        }
      });
    }
  }
};
</script>
<style scoped>

.device-table {
  overflow-x: scroll;
}
.icon_sub {
  display: block;
  margin-top: 6px;
}
.line_date {
  text-align: center;
}

.lv {
  border: none;
  background: #009a52;
  color: white;
}

.lv:hover {
  color: white;
  background: #127714;
}
.czm_input {
  width: 200px;
}
.icon_pointer{
  cursor: pointer;
}
.el-icon-download{
  font-size: 18px;
}
</style>
