<template>
  <div>
    <div class="title">资源下载记录</div>
    <div style="margin-top:20px;margin-left:20px;margin-bottom:20px;float:left;width:20%">
      <menu-tree @nodeClick="handleNodeClick" menuClass="title3" @listenToChildEvent ='showMsgfromChild' :menuType="menuType" :isNum="false" :isRed="false"></menu-tree>
    </div>

    <div style="margin-top:20px;margin-left:2%;float:left;width:74%">
      <div style="position:relative;z-index:2">
        <el-input v-model="auditForm.fileName" placeholder="请输入文件名" style="width:200px"></el-input>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="small"
          @click="getDownHistory(1)"
          style="margin-left:10px"
        >查询</el-button>
      </div>
      <!-- 论文 -->
      <div id="roc1" class="leftPart">
        <el-table
          v-loading="loading"
          :data="auditList"
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
          <el-table-column  align="center" label="序号" width="60px">
            <template slot-scope="scope">
              <span>{{scope.$index+1}}</span>
            </template>
          </el-table-column>

          <el-table-column align="center" label="文件名">
            <template slot-scope="scope">
              <div>{{scope.row.FILE_NAME}}</div>
            </template>
          </el-table-column>

           <el-table-column  align="center" label="上传名称">
                <template slot-scope="scope">
                  <div>{{scope.row.KUNAME}}</div>
                </template>
              </el-table-column>

          <el-table-column  width="150" align="center" label="下载人员">
            <template slot-scope="scope">
              <span>{{scope.row.CREATE_NAME}}</span>
            </template>
          </el-table-column>

          <el-table-column width="200" align="center" label="下载时间">
            <template slot-scope="scope">
              <span>{{scope.row.CREATE_TIME}}</span>
            </template>
          </el-table-column>

          <el-table-column
            align="center"
            width="240"
            label="状态"
            v-if="this.auditForm.applyState == 0"
          >
            <template slot-scope="scope">
              <span>{{scope.row.APPLY_STATE | getState}}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <el-row style="display:none">
        <el-button type="primary">批量通过</el-button>
        <el-button type="danger">批量驳回</el-button>
      </el-row>
      <!--分页-->
      <div class="block">
        <el-pagination
          style="text-align: center"
          :page-size="10"
          :current-page="auditForm.pageNumber"
          @current-change="handleCurrentChange"
          layout="total,  prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import { getLeftTreeInterface, downloadHistory } from "@/api/resource_list";
import menuTree from "@/components/menuTree/menuTree";
import { debounce } from '@/utils/Debounce'
export default {
  components: { menuTree },
  data() {
    return {
      loading: false,
      //  树形菜单默认属性设置
      defaultProps: {
        children: "children",
        label: "label"
      },
      total: null,
      dataTree: [],
      // 待审核数据初始化
      auditList: [],
      auditForm: {
        menuId: null,
        limit: 10,
        pageNumber: 1,
        fileName: ""
      },
      menuType:1
    };
  },
  mounted() {
  },
  created: function() {},
  filters: {
    getState(value) {
      var arr = ["审核通过", "审核驳回", "部门审核通过", "部门审核驳回"];
      return arr[value - 2];
    },
  },
  methods: {
    handleCurrentChange(val) {
      this.loading = true;
      this.auditForm.pageNumber = val;
      this.getDownHistory();
    },
    // 点击左边树形菜单
    handleNodeClick(data) {
      this.loading = true;
      this.auditForm.pageNumber = 1;
      this.auditForm.menuId = data.menuId;
      this.auditForm.fileName = "";
      debounce(() => {
        this.getDownHistory();
      }, 500);
    },
    //左侧菜单组件
    showMsgfromChild(menuId){
      this.auditForm.menuId = menuId;
      this.auditForm.fileName = "";
      this.getDownHistory();
    },
    // 获取待审核数据 // 审核记录
    getDownHistory(val) {
      if(val) {
        this.auditForm.pageNumber = 1;
      }
      downloadHistory(this.auditForm).then(res => {
        console.log(res);
        this.loading = false;
        this.auditList = res.data.data.rows;
        this.total = res.data.data.total;
      });
    }
  }
};
</script>
<style scoped>
/* .el-button:focus, */
.el-button:hover {
  color: #fff;
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
  color: white !important;
  background: #127714 !important;
}

.lv2 {
  font-size: 10px;
  border: none !important;
  background: #009a52 !important;
  color: #fff !important;
}

.lv2:hover {
  color: white;
  background: #127714;
}

.el-checkbox__input.is-checked .el-checkbox__inner,
.el-checkbox__input.is-indeterminate .el-checkbox__inner {
  background-color: #409eff;
  border-color: #409eff;
}
.leftPart {
  display: none;
}
#roc1 {
  display: block;
}
</style>
