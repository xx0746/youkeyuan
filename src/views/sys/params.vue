<template>
  <div>
    <div class="title">参数设置</div>
    <div
      class="filter-container r-menu"
      style="margin-top: 20px; margin-left: 20px; margin-right: 20px"
    >
      <el-table
        :data="logList"
        row-key="id"
        style="margin-top: 20px"
        border
        fit
        highlight-current-row
        :header-cell-style="{
          'background-color': '#f5f7fa',
          color: 'rgb(103, 194, 58)',
        }"
      >
        <el-table-column align="center" width="500px" label="参数说明">
          <template slot-scope="scope">
            <span>{{ scope.row.key | getKeyName }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="参数设置">
          <template slot-scope="scope">
            <span>{{ scope.row.value | setTime(scope) }}</span>
            <el-input
              type="text"
              v-if="
                scope.row.key == 'singleBatchDownLoadCount' ||
                scope.row.key == 'singleDownLoadCycle'
              "
              v-model="scope.row.value"
              class="inputbox"
              v-show="isShowInput"
            ></el-input>
            <el-select
              type="text"
              v-if="
                scope.row.key == 'downloadAuditLevel' ||
                scope.row.key == 'uploadAuditLevel'
              "
              v-model="scope.row.value"
              class="inputbox"
              v-show="isShowInput"
            >
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
            <el-select
              type="text"
              v-if="
                scope.row.key == 'downKnowIsAudit' ||
                scope.row.key == 'downDataIsAudit'
              "
              v-model="scope.row.value"
              class="inputbox"
              v-show="isShowInput"
            >
              <el-option
                v-for="item in auditOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </template>
        </el-table-column>
      </el-table>
      <div id="tableBox">
        <el-table
          :show-header="false"
          :data="logListData"
          row-key="id"
          border
          fit
          highlight-current-row
        >
          <el-table-column
            align="center"
            width="500px"
            label="参数说明"
            prop="name"
          ></el-table-column>
          <el-table-column align="center" label="参数设置">
            <template slot-scope="scope">
              <el-button
                :disabled="setDisabled"
                type="primary2"
                size="mini"
                @click="setMenuOrder(scope.row)"
                >设置</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class="setprama">
        <el-button type="primary" size="small" @click="setParmas">{{
          isShowInput | setBtnInput
        }}</el-button>
      </div>
    </div>
    <!-- 修改目录顺序 -->
    <el-dialog :visible.sync="menudialog" title="目录顺序调整">
      <el-tree
        :data="treeData"
        :props="defaultProps"
        node-key="menuId"
        :default-expanded-keys="[0]"
        ref="treeMenu"
        draggable
        @node-drop="handleDrop"
        highlight-current
        :allow-drop="allowDrop"
        empty-text="正在加载中"
      ></el-tree>
    </el-dialog>
  </div>
</template>
<script>
import { getParamsList, UpdateParamsList, setResmenuSort } from "@/api/login";
import { getLeftTreeInterface } from "@/api/resource_list";
export default {
  data() {
    return {
      url: "/api",
      logList: [],
      total: null,
      listLoading: false,
      // 搜索初始化
      listQuery: {
        pageNumber: 1,
        title: "",
        limit: 10,
        userName: "",
      },
      total: null,
      state: true,
      subDisabled: false,
      authData: [],
      temp: {},
      isShowInput: false,
      auditOptions: [
        {
          value: "1",
          label: "需要",
        },
        {
          value: "2",
          label: "不需要",
        },
      ],
      options: [
        {
          value: "2",
          label: "部门数据管理员-部门数据审核员-数据审核员",
        },
        {
          value: "1",
          label: "部门数据管理员-数据审核员",
        },
      ],
      menudialog: false,
      treeData: [],
      defaultProps: {
        children: "children",
        label: "label",
        disabled: "disabled",
      },
      setDisabled: true,
      logListData: [
        {
          name: "知识专区目录顺序",
          id: 15,
        },
        {
          name: "数据专区目录顺序",
          id: 16,
        },
      ],
    };
  },
  mounted() {
    this.getLogList();
  },
  filters: {
    //读取table表格参数说明的列值
    getKeyName: function (v) {
      if (v == "singleBatchDownLoadCount") {
        return "单次批量下载最大文件数";
      } else if (v == "singleDownLoadCycle") {
        return "单次下载周期";
      } else if (v == "uploadAuditLevel") {
        return "知识管理上传审核流程";
      } else if (v == "downloadAuditLevel") {
        return "知识管理下载审核流程";
      } else if (v == "downKnowIsAudit") {
        return "知识专区下载是否需要审核";
      } else if (v == "downDataIsAudit") {
        return "数据专区下载是否需要审核";
      }
    },
    //读取table表格参数设置的列值
    setTime: function (v, key) {
      if (key.row.key == "singleBatchDownLoadCount") {
        return v;
      }
      if (key.row.key == "singleDownLoadCycle") {
        return v + "小时(h)";
      }
      if (
        key.row.key == "uploadAuditLevel" ||
        key.row.key == "downloadAuditLevel"
      ) {
        if (key.row.value == 1) {
          return "部门数据管理员-数据审核员";
        } else if (key.row.value == 2) {
          return "部门数据管理员-部门数据审核员-数据审核员";
        }
      }
      if (
        key.row.key == "downKnowIsAudit" ||
        key.row.key == "downDataIsAudit"
      ) {
        if (key.row.value == 1) {
          return "需要";
        } else if (key.row.value == 2) {
          return "不需要";
        }
      }
    },
    //确定和参数的切换
    setBtnInput: function (v) {
      if (v) {
        return "确定设置";
      } else {
        return "参数设置";
      }
    },
  },
  methods: {
    handleCurrentChange(val) {
      this.listQuery.pageNumber = val;
      this.getLogList();
    },
    //获取table列表
    getLogList() {
      getParamsList(this.listQuery).then((res) => {
        if (res.data.code == 1) {
          self.listLoading = false;
          this.logList = res.data.data[0];
          this.logList.forEach((item) => {
            if (item.key == "singleDownLoadCycle") {
              item.value = Number(item.value) / 3600;
            }
          });
          this.total = res.data.data;
          this.listLoading = false;
        } else {
          self.listLoading = false;
          this.$message.error(res.data.msg);
        }
      });
    },
    //参数设置
    setParmas() {
      this.isShowInput = !this.isShowInput;
      this.setDisabled = false;
      if (!this.isShowInput) {
        let isNumber = true;
        this.logList.forEach((item) => {
          const re = /^[0-9]*[1-9][0-9]*$/;
          const rsCheck = re.test(item.value);
          if (!rsCheck && item.value != 0) {
            isNumber = false;
          }
        });
        if (!isNumber) {
          this.isShowInput = true;
          return this.$message.warning("请将参数设置为正整数！");
        }
        let arr = this.logList.map((item) => {
          let strs = "";
          if (item.key == "singleDownLoadCycle") {
            strs = `${item.key}:${item.value * 3600}`;
          } else {
            strs = `${item.key}:${item.value}`;
          }
          return strs;
        });
        let str = arr.join(",");
        UpdateParamsList(str).then((res) => {
          // console.log(res);
          if (res.data.code == 1) {
            this.$message.success("设置成功!");
            this.setDisabled = true;
          } else {
            this.$message.warning(res.data.msg);
          }
        });
      }
    },
    getDataTree() {
      let s = {
        menuType: 2,
      };
      getLeftTreeInterface(s).then((res) => {
        this.treeData = res.data.data;
        console.log(this.treeData);
      });
    },
    getScienceTree() {
      let s = {
        menuType: 1,
      };
      getLeftTreeInterface(s).then((res) => {
        this.treeData = res.data.data;
      });
    },
    //设置目录顺序调整的按钮
    setMenuOrder(val) {
      this.menudialog = true;
      if (val.id == 16) {
        this.getDataTree();
      } else {
        this.getScienceTree();
      }
    },
    //目录拖拽调整
    allowDrop(draggingNode, dropNode, type) {
      if (draggingNode.level === dropNode.level) {
        if (draggingNode.parent.id === dropNode.parent.id) {
          return type === "prev";
        }
      } else {
        // 不同级进行处理
      }
    },
    //返回拖拽后的目录
    handleDrop(draggingNode, dropNode, type, event) {
      let obj = {
        aboveId: "",
        arr: [],
      };
      obj.aboveId = dropNode.data.menuId;
      for (let item of dropNode.parent.childNodes) {
        obj.arr.push(item.data.menuId);
      }
      this.setMenu(obj);
    },
    //目录调整后保存按钮
    setMenu(obj) {
      setResmenuSort(obj).then((res) => {
        if (res.data.code == 1) {
          this.$message.success("修改成功!");
        } else {
          this.$message.warning(res.data.msg);
        }
      });
    },
  },
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
.setprama {
  text-align: center;
  margin: 20px 0;
}
.inputbox {
  width: 100px;
}
.el-button.is-disabled {
  background-color: #fff;
}
#tableBox {
  border-bottom: 1px solid #c4c9d0;
}
.el-table--border {
  border: 1px solid #c4c9d0;
  border-bottom: none;
}
</style>
