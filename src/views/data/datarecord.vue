<template>
  <div>
    <div class="title">导入记录</div>
    <div style="margin:20px 0 20px 20px;float:left;width:20%">
      <menu-tree ref="menuTree"
        @nodeClick="handleNodeClick"
        @listenToChildEvent ='showMsgfromChild'
        :menuType="menuType"
        :isNum="false"
        :isRed="false"
        menuClass="title3">
      </menu-tree>
    </div>
    <div class="formbox">
      <el-tabs v-model="tabNameActive" @tab-click="handleClick">
        <!-- tab切换 -->
        <el-tab-pane :label="menuValue" name="first">
          <el-select v-model="recordValue" placeholder="请选择导入状态" @change="dataStateChange">
            <el-option
              v-for="(item) in choiceModelState"
              :key="item.state"
              :label="item.label"
              :value="item.state"
            ></el-option>
          </el-select>
          <el-table
            :data="recordTableData"
            row-key="id"
            style="margin-top:20px;"
            border
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
            <el-table-column align="center" label="数据集名称">
              <template slot-scope="scope">
                <span>{{scope.row.COLLECTNAME}}</span>
              </template>
            </el-table-column>
            <el-table-column width="150" align="center" label="数据模型">
              <template slot-scope="scope">
                <span>{{scope.row.DATANAME}}</span>
              </template>
            </el-table-column>
            <el-table-column width="150" align="center" label="状态">
              <template slot-scope="scope">
                <span>{{scope.row.STATE == '0' ? '导入失败' : scope.row.STATE == '1' ? '待审核' : scope.row.STATE == '2' ? '导入成功' : "审核驳回"}}</span>
              </template>
            </el-table-column>
            <el-table-column width="100" align="center" label="导入条数">
              <template slot-scope="scope">
                <span>{{scope.row.DATACOUNT}}</span>
              </template>
            </el-table-column>
            <el-table-column width="120" align="center" label="创建人">
              <template slot-scope="scope">
                <span>{{scope.row.USERNAME}}</span>
              </template>
            </el-table-column>
            <el-table-column width="160" align="center" label="创建时间">
              <template slot-scope="scope">
                <span>{{scope.row.CREATETIME}}</span>
              </template>
            </el-table-column>
            <el-table-column width="140" align="center" label="操作" fixed="right">
              <template slot-scope="scope">
                <div class="handle-col">
                  <diy-btn styleType="icon" iconType="icon-download" @click="templateDownload(scope.row)"></diy-btn>
                  <diy-btn styleType="icon" iconType="icon-check_reason" @click="seeReason(scope.row)" v-show="scope.row.STATE == 3"></diy-btn>
                </div>
              </template>
            </el-table-column>
          </el-table>
          <!-- 页脚分页 -->
          <div class="block">
            <el-pagination
              style="text-align: center"
              :page-sizes="[10,20,30, 50]"
              :page-size="10"
              layout="total,  prev, pager, next, jumper"
              :current-page="Logisticsdata.pageNumber"
              @current-change="handleCurrentChange"
              :total="total"
            ></el-pagination>
          </div>
        </el-tab-pane>
        <!-- tab切换 -->
        <el-tab-pane label="快递数据导入记录" name="second" v-if="isShowSecond">
          <el-select v-model="LogisticsValue" placeholder="请选择导入状态" @change="expressageStateChange">
            <el-option
              v-for="(item) in choiceWuliuState"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <el-table :data="expressTableData" border style="width: 100%; margin:20px 0;"  :header-cell-style="{
              'background-color': '#f5f7fa',
              'color': 'rgb(103, 194, 58)',
               }">
            <el-table-column prop="ROWNUM_" label="序号" width="60px"></el-table-column>
            <el-table-column prop="FILENAME" label="文件名"></el-table-column>
            <el-table-column width="120" prop="EXPRESSNAME" label="快递公司"></el-table-column>

            <el-table-column width="120" prop="DATACOUNT" label="导入条数"></el-table-column>
            <el-table-column width="120" label="状态">
              <template
                slot-scope="scope"
              >{{scope.row.STATE == '0' ? '导入失败' : scope.row.STATE == '1' ? '正在导入' : scope.row.STATE == '2' ? '导入成功' : "--"}}</template>
            </el-table-column>
            <el-table-column label="操作" width="100" align="center">
              <template slot-scope="scope">
                <el-button
                  type="primary2"
                  size="mini"
                  @click="templateDownload(scope.row)"
                >下载</el-button>
              </template>
            </el-table-column>
          </el-table>
          <!-- 页脚分页 -->
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
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script>
import { getLeftTreeInterface } from "@/api/resource_list";
import { logisticsCollectList, LogisticsFormData } from "@/api/datamanage";
import { downloadFile } from "@/utils/utile";
import menuTree from "@/components/menuTree/menuTree";
import { debounce } from '@/utils/Debounce';
export default {
  components: {
    menuTree
  },
  data() {
    return {
      //用这个判断切换目录
      menuValue: "",
      treeData: [],
      defaultProps: {
        children: "children",
        label: "label"
      },
      listQuery: {
        pageNumber: 1,
        limit: 10,
        state: ""
      },
      Logisticsdata: {
        pageNumber: 1,
        limit: 10,
        dataType: null,
        pageSize: 10,
        menuId: null,
        state: ""
      },
      total: null,
      recordValue: "",
      LogisticsValue: "",
      // 数据集表格
      recordTableData: [],
      // 快递数据表格
      expressTableData: [],
      choiceModelState: [
        { state: "", label: "全部" },
        { state: "0", label: "导入失败" },
        // { state: "1", label: "正在导入" },
        { state: "2", label: "导入成功" },
        { state: "3", label: "审核驳回" },
      ],
      choiceWuliuState: [
        { value: "", label: "全部" },
        { value: "0", label: "导入失败" },
        // { value: "1", label: "正在导入" },
        { value: "2", label: "导入成功" }
      ],
      tabNameActive: "first",
      isShowSecond: false,
      menuType:2
    };
  },
  mounted() {
  },
  methods: {
    //tab切换
    handleClick(tab, event) {
      this.tabNameActive = tab.name;
      if (tab.name == "first") {
        this.Logistics();
      } else {
        this.getCollectList();
      }
    },
    handleNodeClick(data) {
      // 显示当前所对应的表格
      this.tabNameActive = 'first';
      this.Logisticsdata.pageNumber =1;
      this.recordValue = this.choiceModelState[0].state;
      this.Logisticsdata.state = this.choiceModelState[0].state;
      this.listQuery.pageNumber =1;
      if ( data.menuId != this.Logisticsdata.menuId && this.tabNameActive == "first") {
        this.Logisticsdata.menuId = data.menuId;
        this.Logisticsdata.dataType = data.menuId;
        debounce(()=> {
          this.Logistics();
        }, 1000)
        this.menuValue = data.label;
        this.isShowSecond = false;
        if( this.menuValue == "物流数据库") {
          this.isShowSecond = true
        }
      }
    },
    // 获取资源目录左侧菜单栏
    showMsgfromChild(menuId,menuValue){
      this.Logisticsdata.menuId = menuId;
      this.Logisticsdata.dataType = menuId;
      console.log(menuValue);
      if(menuValue == '物流数据库') {
        this.isShowSecond = true;
      } else {
        this.isShowSecond = false;
      }
      this.menuValue = menuValue;
      this.Logistics();
    },
    // 数据状态切换
    dataStateChange(val) {
      this.Logisticsdata.pageNumber = 1;
      this.Logisticsdata.state = val;
      this.Logistics();
    },
    // 快递数据状态切换
    expressageStateChange(val) {
      this.listQuery.state = val;
      this.getCollectList();
    },
    // 获取快递表单表格内容
    getCollectList() {
      this.listLoading = true;
      logisticsCollectList(this.listQuery).then(res => {
        if (res.data.code == 1) {
          this.expressTableData = res.data.data.rows;
          this.total = res.data.data.total;
          this.listLoading = false;
        } else {
          this.$message.error(res.data.msg);
          this.listLoading = false;
        }
      });
    },
    // 获取数据集表格内容
    Logistics() {
      this.Logisticsdata.listType = 1;
      LogisticsFormData(this.Logisticsdata).then(res => {
        if (res.data.code == 1) {
          this.recordTableData = res.data.data.rows;
          console.log(this.recordTableData)
          this.total = res.data.data.total;
          this.listLoading = false;
        } else {
          this.$message.error(res.data.msg);
          this.listLoading = false;
        }
      });
    },
    // 下载文件
    templateDownload(val) {
      let fileNameArr = val.FILENAME.split(',');
      let fileUrlArr = val.FILEURL.split(',');
      for (let i = 0; i < fileNameArr.length; i++) {
        let url;
        if (this.tabNameActive == "first") {
          // if(val.STATE == 2){
          //   let fileName = fileNameArr[i].substring(0,fileNameArr[i].lastIndexOf(".")) + val.DOWNURL.substring(val.DOWNURL.lastIndexOf("."))
          //   url = `${val.DOWNURL}?attname=${fileName}`;
          // } else{
          //   url = `${fileUrlArr[i]}?attname=${fileNameArr[i]}`;
          // }
          url = `${fileUrlArr[i]}?attname=${fileNameArr[i]}`;
        } else {
          url = `${fileUrlArr[i]}?attname=${fileNameArr[i]}`;
        }
        downloadFile(url);
      }
    },
    // 切换分页
    handleCurrentChange(val) {
      if (this.tabNameActive == "first") {
      this.Logisticsdata.pageNumber = val;
        this.Logistics();
      }else {
      this.listQuery.pageNumber = val;
        this.getCollectList();
      }

    },
    //查看驳回原因
    seeReason(row) {
      if(row.REJECTREASON) {
        this.$alert(`${row.REJECTREASON}`, '驳回原因：', {
          confirmButtonText: '确定',
        });
      }
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

</style>
