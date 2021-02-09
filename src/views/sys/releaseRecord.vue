<template>
  <div  v-loading="fileLoading"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)">
    <div class="title">动态记录</div>
    <div class="filter-container r-menu" style="margin-top:20px;margin-left:20px;margin-right:20px">
      <el-row style="overflow: hidden">
        <div style="float: left;width:200px">
          <el-input  v-model="listQuery.title" clearable placeholder="标题"></el-input>
        </div>
        <div class="serch-btn">
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
        <el-table-column align="center"  width="60px" label="序号">
          <template slot-scope="scope">
            <span>{{scope.$index+1}}</span>
          </template>
        </el-table-column>
        <el-table-column width="300" align="center" label="标题">
          <template slot-scope="scope">
            <a title="点击查看详情" class="table-title" @click="showInfo(scope.row)" >{{scope.row.title}}</a>
            <!-- <div>{{scope.row.title}}</div> -->
          </template>
        </el-table-column>

        <el-table-column align="center" width='300' label="原文链接">
          <template slot-scope="scope">
            <div v-if="scope.row.originalLinked">
              {{ scope.row.originalLinked }}
              <!-- <a :href="scope.row.originalLinked" target="_Blank">{{ scope.row.originalLinked }}</a> -->
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
            <i v-if="scope.row.fileCount!=0" class="el-icon-download icon_pointer" @click="handleDownload(scope.row)"></i>
          </template>
        </el-table-column>
        <el-table-column width="100" align="center" label="状态">
          <template slot-scope="scope">
            <span>{{scope.row.state | filterState}}</span>
          </template>
        </el-table-column>
        <el-table-column width="200" align="center" label="操作" fixed="right">
          <template slot-scope="scope">
            <div style="text-align: center">
              <diy-btn styleType="icon" iconType="icon-unpass_reason" v-if="scope.row.state === 3" @click="handleCheckReason(scope.row.id)">驳回原因</diy-btn>
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
    <el-dialog title="动态详情" class="info-dialog" :visible.sync="dialogTableVisible">
      <show-info :data="tableInfo.sysDynamic" :options="option"></show-info>
    </el-dialog>
  </div>
</template>
<script>
import { getsystemDynamicDetail } from "@/api/search";
import { getList, deleteItem, downLoad,turnReason } from "@/api/dynamicList";
// import { deleteSystemDynamic } from "@/api/noticelist";
import { downloadFile } from "@/utils/utile";
import showInfo from "@/views/rotationchart/showInfo.vue";
export default {
  components: {
    showInfo
  },
  data() {
    return {
      fileLoading:false,
      dialogTableVisible: false,
      dynamicList: [],
      total: null,
      listLoading: false,
      listQuery: {
        pageNumber: 1,
        title: null,
        limit: 10
      },
      tableInfo: {},
      option: {
        title: "title",
        content: "content",
        originalLink: "originalLinked",
        banner: "",
        sort: ""
      },
    };
  },
  created() {
    this.handleGetList();
  },
  mounted(){
  },
  methods: {
    showInfo(val) {
      console.log(val);
      getsystemDynamicDetail(val.id).then(res => {
        console.log(res.data.data);
        if(res.data.code == 1) {
          this.dialogTableVisible = true;
          this.tableInfo = res.data.data
        } else {
          this.$message.warning(res.data.msg);
        }
      })
    },
    handDel(id) {
      this.$confirm("是否删除", "提示", {
        type: "warning"
      }).then(() => {
        this.fileLoading = true;
        deleteSystemDynamic(id).then(res => {
          if (res.data.code != "1") {
            this.fileLoading = false;
            this.$message.error(res.data.msg);
            return false;
          } else {
            this.$message.success("删除成功");
            this.handleGetList();
            this.fileLoading = false;
          }
        }).catch(() => {
          this.$message.info("已取消删除");
        });
      });
    },

    reviewTurnReason(id) {
      turnReason(id).then(res => {
        console.log(res);
        if (res.data.code === 1) {
          this.$alert(`${res.data.data}`, '驳回原因',{
            confirmButtonText: '确定',
            callback: action => {
            }
          });
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },


    handleCheckReason(id) {
      turnReason(id).then(res => {
        console.log(res);
        if (res.data.code === 1) {
          this.$alert(`${res.data.data}`, '驳回原因',{
            confirmButtonText: '确定',
            callback: action => {
            }
          });
        } else {
          this.$message.error(res.data.msg);
        }
      });
//       this.$alert(row.auditReason, '驳回原因', {
//          confirmButtonText: '关闭'
//        });
    },
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
  },
  filters: {
    filterState(state) {
      let str = "";
      if (state === -1) {
        str = "删除";
      } else if (state === 1) {
        str = "待审核";
      } else if (state === 2) {
        str = "审核通过";
      } else if (state === 3) {
        str = "审核驳回";
      }
      return str;
    }
  }
};
</script>
<style scoped>
.icon_pointer {
  cursor: pointer;
}

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
.el-icon-download{
  font-size: 18px;
}
.serch-btn{
  margin-left: 14px;
  float: left;
}
.table-title {
  cursor: pointer;
}
.table-title:hover {
  color:#009a52;
}
</style>
