<template>
  <div>
    <div class="title">数据下载审核</div>

    <div style="margin: 20px 0 20px 20px;float:left;width:20%">
      <div class="title2">
        <p class="title-size">资源目录</p>
        <p>(切换查看各目录的待审核记录)</p>
      </div>
      <el-row class="tac">
        <el-col>
          <el-tree
            :data="treeData"
            @node-click="handleNodeClick"
            :render-content="treeRender"
            :props="defaultProps"
            node-key="value"
            accordion
            :default-expanded-keys="[expanded]"
            class="trr"
            highlight-current
            empty-text="正在加载中"
          ></el-tree>
        </el-col>
      </el-row>
    </div>

    <div class="formbox">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane name="first">
          <el-button class="audit_btn" slot="label">待审核</el-button>
          <el-table
            v-loading="loading"
            :data="recordTableData"
            row-key="id"
            style="margin-bottom:20px;"
            border
            fit
            highlight-current-row
            :header-cell-style="{
              'background-color': '#f5f7fa',
              'color': 'rgb(103, 194, 58)',
               }"
            >
            <el-table-column  align="center" width="60px" label="序号">
              <template slot-scope="scope">
                <span>{{scope.$index+1}}</span>
              </template>
            </el-table-column>
            <el-table-column  align="center" label="数据集名称">
              <template slot-scope="scope">
                <span>{{scope.row.COLLECTNAME}}</span>
              </template>
            </el-table-column>
            <el-table-column width="100" align="center" label="申请人">
              <template slot-scope="scope">
                <span>{{scope.row.USERNAME}}</span>
              </template>
            </el-table-column>

            <el-table-column width="180" align="center" label="申请时间">
              <template slot-scope="scope">
                <span>{{scope.row.CREATETIME}}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="140" fixed="right">
              <template slot-scope="scope">
                <!-- <el-button type="primary2" @click="pass(scope.row,2)" size="mini">通过</el-button>
                <el-button type="primary2" @click="pass(scope.row,3)" size="mini">驳回</el-button> -->
                <div class="handle-col">
                  <diy-btn styleType="icon" iconType="icon-pass" @click="pass(scope.row,2)"></diy-btn>
                  <diy-btn styleType="icon" iconType="icon-unpass" @click="pass(scope.row,3)"></diy-btn>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <el-tab-pane name="second">
          <el-button class="audit_btn" slot="label">审核记录</el-button>
          <el-select v-model="LogisticsValue" placeholder="请选择导入状态" @change="expressageStateChange">
            <el-option
              v-for="(item) in choiceWuliuState"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <el-table  v-loading="loading" :data="expressTableData" border style="width: 100%; margin: 16px 0;"  :header-cell-style="{
              'background-color': '#f5f7fa',
              'color': 'rgb(103, 194, 58)',
               }">
            <el-table-column label="序号" width="60px">
              <template slot-scope="scope">
                <div>{{scope.$index+1}}</div>
              </template>
            </el-table-column>
            <el-table-column align="center" label="数据集名称">
              <template slot-scope="scope">
                <div>{{scope.row.COLLECTNAME}}</div>
              </template>
            </el-table-column>
            <el-table-column width="100" align="center" label="申请人">
              <template slot-scope="scope">
                <span>{{scope.row.USERNAME}}</span>
              </template>
            </el-table-column>
            <el-table-column width="180" align="center" label="申请时间">
              <template slot-scope="scope">
                <span>{{scope.row.CREATETIME}}</span>
              </template>
            </el-table-column>
            <el-table-column  width="100" label="状态">
              <template
                slot-scope="scope"
              >{{scope.row.STATE == '1' ? '待审核' : scope.row.STATE == '2' ? '审核通过' : scope.row.STATE == '3' ? '审核驳回' : "--"}}</template>
            </el-table-column>
            <el-table-column label="操作" width="100" fixed="right">
              <template slot-scope="scope">
                <!-- <el-button
                  type="primary2"
                  @click="ABC(scope.row)"
                  v-show="scope.row.STATE == 3"
                  size="mini"
                >查看原因</el-button> -->
                <div class="handle-col">
                  <diy-btn styleType="icon" iconType="icon-check_reason" @click="ABC(scope.row)" v-show="scope.row.STATE == 3"></diy-btn>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
      <!--分页-->
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
import { getLeftTreeInterface } from "@/api/resource_list";
import { getDataDownList, auditDataDown } from "@/api/datamanage";
export default {
  data() {
    return {
      expanded: '',
      loading:true,
      activeName: "first",
      treeData: [],
      defaultProps: {
        children: "children",
        label: "label"
      },
      listQuery: {
        pageNumber: 1,
        limit: 10,
        menuId: null,
        dataType: null,
        state: 1
      },
      recordValue: "",
      LogisticsValue: "",
      // 待审核表格
      recordTableData: [],
      // 审核表格
      expressTableData: [],

      choiceWuliuState: [
        { value: "", label: "全部" },
        //{ value: "1", label: "待审核" },
        { value: "2", label: "审核通过" },
        { value: "3", label: "审核驳回" }
      ],
      currentId: '',
      pageNumber: 1,
      total: null
    };
  },
  mounted() {
    this.getLeftTree();
  },
  methods: {
    // 获取资源目录
    getLeftTree() {
      let s = {
        menuType: 2,
        resourceCountType: 1
      };
      getLeftTreeInterface(s).then(res => {
        var arr = res.data.data;
        this.treeData = arr;
        this.listQuery.menuId = arr[0].menuId;
        this.listQuery.dataType = arr[0].menuId;
        this.getDataDownList();
      });
    },
    handleClick(tab, event) {
      this.activeName = tab.name;
      this.listQuery.pageNumber = 1;
      if (this.activeName == "first") {
        this.listQuery.state = 1;
      }
      if(this.activeName == "second") {
        this.listQuery.state = "";
        this.LogisticsValue = "";
      }
      this.getDataDownList();
    },
    // 点击左边菜单
    handleNodeClick(data) {
      this.activeName = "first";
      this.listQuery.state = 1;
      this.listQuery.pageNumber = 1;
      this.currentId = data.menuId;
      this.expanded = data.menuId;
      if(data.menuId != this.listQuery.dataType) {
        this.listQuery.menuId = data.menuId;
        this.listQuery.dataType = data.menuId;
      }
      this.getDataDownList();
    },
    ABC(row) {
      this.$alert(row.REJECTREASON, "驳回原因", {
        confirmButtonText: "确定",
        callback: action => {}
      });
    },
    // 快递数据状态切换
    expressageStateChange(val) {
      this.listQuery.state = val;
      this.listQuery.pageNumber = 1;
      this.loading = true;
      this.getDataDownList();
    },
    // 获取表格内容
    getDataDownList() {
      this.listLoading = true;
      if(this.currentId){
        this.listQuery.menuId = this.currentId;
        this.listQuery.dataType = this.currentId;
      }
      getDataDownList(this.listQuery).then(res => {
        this.loading = true;
        if (res.data.code == 1) {
          if(this.activeName == "first") {
            this.recordTableData = res.data.data.rows;
            this.loading = false;
          } else {
            this.expressTableData = res.data.data.rows;
            this.loading = false;
          }
          this.listLoading = false;
          this.total = res.data.data.total;
        } else {
          this.$message.error(res.data.msg);
          this.listLoading = false;
          this.loading = false;
        }
      });
    },
    pass(row, state) {
      if (state == 2) {
        this.$confirm("此操作将执行通过操作, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            let s = {
              auditId: row.ID,
              state: state,
              dataType: row.DATATYPE
            };
            auditDataDown(s).then(res => {
              if (res.data.code == 1) {
                this.$message({
                  type: "success",
                  message: "通过!"
                });
                this.listQuery.menuId = this.currentId;
                this.listQuery.dataType = this.currentId;
                console.log(this.listQuery.menuId)
                this.getLeftTree();
              } else {
                this.$message.error(res.data.msg);
                return false;
              }
            });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消通过"
            });
          });
      } else {
        this.$prompt("请输入驳回原因：", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          inputPattern: /\S{5,100}/,
          inputErrorMessage: "驳回原因不能少于5个字！"
        })
          .then(({ value }) => {
            let s = {
              auditId: row.ID,
              state: state,
              rejectReason: value,
              dataType: row.DATATYPE
            };
            auditDataDown(s).then(res => {
              if (res.data.code == 1) {
                this.$message({
                  type: "success",
                  message: "已提交驳回原因"
                });
                this.listQuery.menuId = this.currentId;
                this.listQuery.dataType = this.currentId;
                console.log(this.listQuery.menuId)
                this.getLeftTree();
              } else {
                this.$message.error(res.data.msg);
                return false;
              }
            });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "取消输入"
            });
          });
      }
    },
    handleCurrentChange(val) {
      this.listQuery.pageNumber = val;
      this.getDataDownList();
    },
    treeRender(h, { node, data, store }) {
      return (
        <span class="custom-tree-node">
          <span>{node.label}</span>
          (<span style="color: #ff7c7c;">{data.resourceCount}</span>)
        </span>);
    },
  }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>

.formbox {
  margin-top: 20px;
  margin-left: 2%;
  float: left;
  width: 74%;
  border-top: 1px solid #fff;
  h3 {
    font-size: 16px;
    font-weight: 400;
    color: #009a52;
  }
}

.audit_btn {
  height: 36px;
}
</style>
