<template>
  <div>
    <div class="title">资源订阅管理</div>
    <div
      class="filter-container r-menu"
      style="padding-left:20px;padding-right:20px;background:white;padding-top:20px;"
    >
      <el-table
        :data="list"
        row-key="id"
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

        <el-table-column align="center" label="订阅目录名称">
          <template slot-scope="scope">
            <span>{{scope.row.MENU_NAME}}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="订阅人账号">
          <template slot-scope="scope">
            <span>{{scope.row.LOGIN_NAME}}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="订阅时间">
          <template slot-scope="scope">
            <span>{{scope.row.SUBSCRIBE_TIME}}</span>
          </template>
        </el-table-column>

        <el-table-column width="100" align="center" label="操作" fixed="right">
          <template slot-scope="scope">
            <div class="handle-col">
              <diy-btn styleType="icon" iconType="icon-del" @click="deleteInfo(scope.row)"></diy-btn>
              <!-- <el-button type="primary2" @click="deleteInfo(scope.row)" size="mini">删除</el-button> -->
            </div>
          </template>
        </el-table-column>
      </el-table>

      <div class="block">
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-size="10"
          layout="total, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import { getSubscribeList, delSubscribeInfo } from "@/api/ressubscribe";
export default {
  data() {
    return {
      list: [],
      listQuery: {
        pageSize: 10,
        pageNumber: 1,
        state: 1
      },
      total: null,
      currentPage: 1
    };
  },
  created() {
    this.getSubscribe();
  },
  mounted() {
  },
  methods: {
    getSubscribe() {
      getSubscribeList(this.listQuery).then(res => {
        if (res.data.code === 1) {
          this.list = res.data.data.rows;
          this.total = res.data.data.total;
        }
      });
    },
    deleteInfo(val) {
      this.$confirm("是否删除订阅", "提示", {
        distinguishCancelAndClose: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let ss = {
            menuId:val.MENU_ID,
            userId:val.USER_ID
          }
          delSubscribeInfo(ss).then(res => {
            if (res.data.code != "1") {
              this.$message.error(res.data.msg);
              return false;
            } else {
              this.$message.success("删除成功");
              this.listQuery.pageSize = 10;
              this.listQuery.pageNumber = 1;
              this.currentPage = 1;
              this.getSubscribe();
            }
          });
        })
        .catch(() => {
          this.$message.info("已取消删除");
        });
    },
    handleCurrentChange(val) {
      this.listQuery.pageNumber = val;
      this.getSubscribe();
      this.currentPage = val;
      console.log(this.currentPage);
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

.container {
  background: #f2f2f2;
  position: absolute;
  top: 0px;
  bottom: 0px;
  width: 100%;
}
</style>
