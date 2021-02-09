<template>
  <div  v-loading="fileLoading"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)">
    <div class="title">动态审核</div>
    <div class="filter-container r-menu" style="margin-top:20px;margin-left:20px;margin-right:20px">
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <!-- 待审核 -->
        <el-tab-pane name="1">
          <el-button class="audit_btn" slot="label">待审核</el-button>
          <el-input class="filter-item czm_input" v-model="listQuery.title" clearable placeholder="标题"></el-input>
          <el-button
            type="primary"
            icon="el-icon-search"
            size="small"
            style="margin-left:10px"
            @click="handleGetList(listQuery,1)"
          >查询</el-button>
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
            <el-table-column  width='300' align="center" label="标题">
              <template slot-scope="scope">
                <a title="点击查看详情" class="table-title" @click="showInfo(scope.row)" >{{scope.row.title}}</a>
              </template>
            </el-table-column>

            <el-table-column  width='300' align="center" label="原文链接">
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
                <i v-if="scope.row.fileCount!=0" class="el-icon-download icon_pointer" @click="handleDownload(scope.row)"></i>
              </template>
            </el-table-column>
            <el-table-column width="120" align="center" label="操作" fixed="right">
              <template slot-scope="scope">
                <div style="text-align: center">
                  <diy-btn styleType="icon" iconType="icon-preview" @click="openView(scope.row)">预览</diy-btn>
                  <diy-btn styleType="icon" iconType="icon-pass" @click="handleAudit(scope.row)">通过</diy-btn>
                  <diy-btn styleType="icon" iconType="icon-unpass" @click="handleTurnDown(scope.row)">驳回</diy-btn>
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
        </el-tab-pane>
        <!-- 审核记录 -->
        <el-tab-pane name="2">
          <el-button class="audit_btn" slot="label">审核记录</el-button>
          <el-input class="filter-item czm_input" v-model="listQuery1.title" clearable placeholder="标题"></el-input>
          <el-button
            type="primary"
            icon="el-icon-search"
            size="small"
            style="margin-left:10px"
            @click="handleGetList(listQuery1, 1)"
          >查询</el-button>
          <el-table
            :data="dynamicList1"
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
            <el-table-column width='300' align="center" label="标题">
              <template slot-scope="scope">
                <a title="点击查看详情" class="table-title" @click="showInfo(scope.row)">{{scope.row.title}}</a>
              </template>
            </el-table-column>

            <el-table-column   width='300'  align="center" label="原文链接">
              <template slot-scope="scope">
                <div v-if="scope.row.originalLinked">
                  <!-- <a :href="scope.row.originalLinked"
                      target="_Blank"
                  >{{ scope.row.originalLinked }}</a> -->
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
                <i v-if="scope.row.fileCount!=0" class="el-icon-download icon_pointer" @click="handleDownload(scope.row)"></i>
              </template>
            </el-table-column>
            <el-table-column width="110" align="center" label="状态">
          <template slot-scope="scope">
            <span>{{scope.row.state | filterState}}</span>
          </template>
        </el-table-column>
            <el-table-column width="80" align="center" label="操作" fixed="right">
              <template slot-scope="scope">
                <div style="text-align: center">
                  <diy-btn
                    styleType="icon" iconType="icon-unpass_reason"
                    v-if="scope.row.state!=1&&scope.row.state!=2"
                    @click="reviewTurnReason(scope.row.id)"
                  >驳回原因
                  </diy-btn>
                </div>
              </template>
            </el-table-column>
          </el-table>
          <div class="block">
            <el-pagination
              style="text-align: center"
              :page-size="10"
              :current-page="listQuery1.pageNumber"
              @current-change="handleCurrentChange"
              layout="total, prev, pager, next, jumper"
              :total="total1"
            ></el-pagination>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <el-dialog title="动态详情" class="info-dialog" :visible.sync="dialogTableVisible">
      <show-info :data="tableInfo.sysDynamic" :list="tableInfo.sysDynamicFiles"  :options="option"></show-info>
    </el-dialog>
  </div>
</template>
<script>
import { getsystemDynamicDetail } from "@/api/search";
import { downloadFile } from "@/utils/utile"
import { getList, deleteItem, audit, turnReason, downLoad } from "@/api/dynamicList";
import { deleteSystemDynamic } from "@/api/noticelist";
import showInfo from "@/views/rotationchart/showInfo.vue";//动态详情的组件
export default {
  components: {
    showInfo
  },
  data() {
    return {
      fileLoading:false,
      dialogTableVisible: false,
      Publish:false,
      Publish1:false,
      activeName: "1",
      dynamicList: [],
      dynamicList1: [],
      total: null,
      total1: null,
      listLoading: false,
      listQuery: {
        pageNumber: 1,
        title: null,
        limit: 10,
        state: 1
      },
      listQuery1: {
        pageNumber: 1,
        title: null,
        limit: 10,
        state: -2
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
    this.handleTabClick();
  },
  mounted(){
  },
  methods: {
    showInfo(val) {
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
    handDel(row) {
      this.$confirm("是否删除", "提示", {
        type: "warning"
      }).then(() => {
        deleteSystemDynamic(row.id).then(res => {
          if (res.data.code != "1") {
            this.$message.error(res.data.msg);
            return false;
          } else {
            this.$message.success("删除成功");
            this.handleGetList();
          }
        }).catch(() => {
          this.$message.info("已取消删除");
        });
      });
    },
    handleTabClick() {
      this.listQuery.title = '';
      this.listQuery1.title = '';
      if (this.activeName === "1") {
        this.handleGetList(this.listQuery);
      } else if (this.activeName === "2") {
        this.handleGetList(this.listQuery1);
      }
    },
    handleDeleteItm(id) {
      this.$confirm("确认删除？", "提示", {
        type: "warning"
      }).then(() => {
        this.handleDoDelete(id);
        this.fileLoading = true;
      }).catch(() => {
          this.$message.info("已取消删除");
      });
    },
    //删除操作
    handleDoDelete(id) {
      deleteItem(id).then(res => {
        if (res.data.code !== 1) {
          this.fileLoading = false;
          this.$message.error(res.data.msg);
          return false;
        } else {
          this.fileLoading = false;
          this.$message.success("删除成功");
          this.handleTabClick();
        }
      });
    },
    handleGetList(params,val) {
      if(val){
        params.pageNumber = 1;
      }
      getList(params).then(res => {
        console.log(res);
        if (res.data.code === 1) {
          if (this.activeName === "1") {
            this.dynamicList = res.data.data.rows;
            this.total = res.data.data.total;
            this.fileLoading = false;
          } else if (this.activeName === "2") {
            this.dynamicList1 = res.data.data.rows;
            this.total1 = res.data.data.total;
            this.fileLoading = false;
          }
        }
      });
    },
    // 预览
    openView(val) {
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
    handleCurrentChange(val) {
      console.log(val);
      if (this.activeName === "1") {
        this.listQuery.pageNumber = val;
        this.handleGetList(this.listQuery);
      } else if (this.activeName === "2") {
        this.listQuery1.pageNumber = val;
        this.handleGetList(this.listQuery1);
      }
    },
    // 执行审核/驳回
    handleDoAudit(params) {
      audit(params).then(res => {
        if (res.data.code === 1) {
          this.$message.success("操作成功！");
          // 更新数据
          this.handleTabClick();
        } else {
          this.fileLoading = false;
          console.log(this.fileLoading )
          this.$message.error(res.data.msg);
        }
      });
    },
    // 驳回
    handleTurnDown(row) {
      this.$prompt("请输入驳回原因：", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputPattern: /\S{5,100}/,
        inputErrorMessage: "驳回原因不能少于5个字！"
      })
        .then(({ value }) => {
          let params = {
            state: 3,
            rejectReason: value,
            sysDynamicId: row.id
          };
          this.fileLoading = true;
          this.handleDoAudit(params);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消输入"
          });
        });
    },
    // 通过
    handleAudit(row) {
      this.$confirm("此操作将执行通过操作, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let params = {
            sysDynamicId: row.id,
            state: 2
          };
          this.fileLoading = true;
          this.handleDoAudit(params);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消通过"
          });
        });

    },
    // 查看驳回原因
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
    // 下载（支持多文件和单文件，前提是后太返回list url）
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
      let str = '';
      if (state === -1) {
          str = '删除'
      } else if (state === 1) {
          str = '待审核'
      } else if (state === 2) {
          str = '审核通过'
      } else if (state === 3) {
          str = '审核驳回'
      }
      return str;
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
.audit_btn {
  border: none;
  position: relative;
  z-index: 22;
  height: 36px;
}
.audit_btn:hover,
.audit_btn:active,
.audit_btn:focus {
  color: #009A52;
  background: transparent;
}
.r-menu >>> .el-tabs__active-bar {
  background-color: #009A52;
}
.r-menu >>> .is-active .audit_btn {
  color: #009A52;
}
.czm_input {
  width: 200px;
}
.icon_pointer {
  cursor: pointer;
}
.el-icon-download{
  font-size: 18px;
}
.table-title {
  cursor: pointer;
}
.table-title:hover {
  color:#009a52;
}
</style>
