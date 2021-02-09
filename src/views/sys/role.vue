<template>
  <div>
    <div class="title">角色列表</div>
    <div class="filter-container r-menu" style="margin-top:20px;margin-left:20px;margin-right:20px">
      <el-input
        style="width: 200px;"
        class="filter-item"
        placeholder="角色名称"
        v-model="listQuery.roleName"
      ></el-input>
      <el-button
        type="primary"
        icon="el-icon-search"
        size="small"
        @click="getRoleList(1)"
        style="margin-left:10px"
      >查询角色</el-button>
      <el-button type="primary" size="small" @click="handCreate">添加角色</el-button>
      <!-- <button type="button" class="el-button el-button--danger"><span>批量删除</span></button> -->
      <el-table
        :data="roleList"
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

        <el-table-column align="center" label="角色名">
          <template slot-scope="scope">
            <span>{{scope.row.ROLENAME}}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="描述">
          <template slot-scope="scope">
            <span>{{scope.row.ROLEDESC}}</span>
          </template>
        </el-table-column>

        <el-table-column width="160" align="center" label="操作" fixed="right">
          <template slot-scope="scope">
            <div class="handle-col">
             
              <diy-btn styleType="icon" iconType="icon-control_author" @click="handleRoleConfig(scope.$index, scope.row)"></diy-btn>
              <diy-btn styleType="icon" iconType="icon-edit_role" @click="handUpdate(scope.row)"></diy-btn>
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

      <!-- 权限配置弹窗 -->
      <el-dialog class="dialogTitle" title="配置权限" :visible.sync="dialogFormVisible1" width="760px">
        <el-form
          ref="roleForm"
          :model="roleForm"
          label-width="100px"
          style="width:85%;margin-left:5%"
          :rules="roleRules"
          >
          <el-form-item>
            <el-tree
              ref="authTree"
              :data="authData"
              show-checkbox
              node-key="id"
              :default-checked-keys="roleDefalChecked"
              default-expand-all
              :props="defaultProps"
              empty-text="正在加载中"
            ></el-tree>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button
            @click="dialogFormVisible1 = false"
            type="primary4"
            size="small"
          >取消</el-button>
          <el-button
            type="primary"
            size="small"
            style="margin-left:50px"
            @click="configUserRoles"
          >提交</el-button>
        </span>
      </el-dialog>
      <!-- 添加/修改角色弹窗 -->
      <el-dialog class="dialogTitle" :title="dialogTitle" :visible.sync="dialogFormVisible" :before-close="closeDialog">
        <el-form
          ref="roleForm"
          :model="roleForm"
          label-width="100px"
          :rules="roleRules"
          >
          <el-form-item prop="roleName" label="角色名称：">
            <el-input v-model="roleForm.roleName" @change="showValue"></el-input>
          </el-form-item>
          <el-form-item label="描述：">
            <el-input type="textarea" v-model="roleForm.roleDesc" @change="showValue"></el-input>
          </el-form-item>
          <el-form-item label="状态：">
            <el-switch v-model="state" @change="getState(state)"></el-switch>
          </el-form-item>

        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button
            @click="cancelClose()"
            type="primary4"
            size="small"
          >取消</el-button>
          <el-button
            v-if="dialogStatus=='create'"
            type="primary"
            size="small"
            style="margin-left:50px;"
            :disabled="subDisabled"
            @click="addRoleForm"
          >提交</el-button>
          <el-button v-else type="primary" size="small" style="margin-left:50px;" :disabled="subDisabled" @click="updateData">保存</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import {
  addRoleInterface,
  getRoleInterface,
  handUpdateInterface,
  updateInterface,
  handDelInterface,
  getAuthorityInterface,
  updateRoleInterface
} from "@/api/role";
export default {
  data() {
    return {
      url: "/api",
      roleList: null,
      defaultProps: {
        label: "name",
        id: "id"
      },
      dialogTitle: "",
      roleDefalChecked: [],
      dialogFormVisible: false,
      dialogFormVisible1: false,
      total: null,
      listLoading: false,
      // 搜索初始化
      listQuery: {
        pageNumber: 1,
        title: "",
        limit: 10,
        roleName: ""
      },
      total: null,
      // 弹窗为添加或者修改标志
      dialogStatus: "",
      textMap: {
        update: "修改",
        create: "新增"
      },
      // 角色初始化
      roleForm: {
        roleName: "",
        roleDesc: "",
        state: 1
      },
      state: true,
      subDisabled: false,
      roleRules: {
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" }
        ]
      },
      authData: [],
      temp: {},
      isAudit: false
    };
  },
  created: function() {
  },
  mounted() {
    this.getRoleList();
  },
  methods: {
    resetTemp() {
      this.roleForm = {
        roleName: "",
        roleDesc: "",
        state: 1
      };
    },
    handleCurrentChange(val) {
      this.listQuery.pageNumber = val;
      this.getRoleList();
    },
    // 状态
    getState(state) {
      this.state = state;
    },
    // 打开添加角色弹窗
    handCreate() {
      this.resetTemp();
      this.dialogTitle = "添加角色";
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
    },
    // 状态字段获取值
    getState(parm) {
      this.isAudit = true;
      if (parm == true) {
        this.roleForm.state = 1;
      } else {
        this.roleForm.state = 0;
      }
    },
    // 获取角色列表
    getRoleList(val) {
      var _this = this;
      if(val){
        _this.listQuery.pageNumber = 1;
      }
      _this.listLoading = true;
      getRoleInterface(_this.listQuery).then(function(res) {
        if (res.data.code == 1) {
          _this.listLoading = false;
          _this.roleList = res.data.data.rows;
          _this.total = res.data.data.total;
          _this.listLoading = false;
        } else {
          _this.$message.error(res.data.msg);
          _this.listLoading = false;
        }
      });
    },
    // 角色添加
    addRoleForm() {
      var _this = this;
      _this.$refs.roleForm.validate(valid => {
        _this.subDisabled = false;
        if (valid) {
          _this.listLoading = true;
          addRoleInterface(_this.roleForm).then(function(res) {
            if (res.data.code == 1) {
              _this
                .$confirm("添加成功,是否返回列表", "提示", {
                  type: "success"
                })
                .then(() => {
                  _this.subDisabled = false;
                  _this.dialogFormVisible = false;
                  _this.listLoading = false;
                  _this.isAudit = false;
                  _this.getRoleList();
                })
                .catch(() => {
                  _this.$message.info("已取消");
                  _this.subDisabled = false;
                });
            } else {
              _this.listLoading = false;
              _this.$message.error(res.data.msg);
              return false;
            }
          });
        } else {
          return false;
        }
      });
    },
    // 点击修改按钮
    handUpdate(row) {
      console.log(row);
      this.dialogTitle = "修改角色";
      if(row.STATE == 1) {
        this.state = true;
      } else {
        this.state = false;
      }
      var _this = this;
      _this.listLoading = true;
      _this.dialogStatus = "update";
      handUpdateInterface(row.ROLEID).then(function(res) {
        if (res.data.code == 1) {
          _this.dialogFormVisible = true;
          _this.listLoading = false;
          _this.roleForm = res.data.data;
        }
      });
    },
    // 点击弹窗的确定后修改某一条数据
    updateData() {
      var _this = this;
      _this.$refs.roleForm.validate(valid => {
        if (valid) {
          _this.subDisabled = true;
          updateInterface(_this.roleForm).then(function(res) {
            console.log(res);
            if (res.data.code == 1) {
              _this
                .$confirm("修改成功，是否返回列表", "提示", {
                  type: "success"
                })
                .then(function() {
                  _this.dialogFormVisible = false;
                  _this.subDisabled = false;
                  _this.isAudit = false;
                  _this.getRoleList();
                })
                .catch(function() {
                  _this.$message.info("已取消");
                  _this.subDisabled = false;
                });
            }
          });
        } else {
          return false;
        }
      });
    },
    //删除某条数据
    handDel(row) {
      var _this = this;
      _this
        .$confirm("是否删除?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          handDelInterface(row.ROLEID).then(res => {
            if (res.data.code != "1") {
              _this.$message.error(res.data.msg);
              return false;
            } else {
              _this.$message.success("删除成功");
              _this.getRoleList();
            }
          });
        })
        .catch(() => {
          _this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 点击配置权限按钮
    handleRoleConfig(index, row) {
      console.log(row);
      this.currentRow = row;
      this.dialogFormVisible1 = true;
      this.temp.id = row.ROLEID;
      var _this = this;
      getAuthorityInterface(row.ROLEID).then(res => {
        _this.authData = res.data.data.authList;
        this.roleDefalChecked = res.data.data.checkId;
        var s = this.roleDefalChecked.length;
        if (s == 0) {
          this.roleDefalChecked = [1];
        } else {
          this.roleDefalChecked[s] = 1;
        }
      });
    },
    // 配置权限
    configUserRoles() {
      let checkedKeys = this.$refs.authTree.getCheckedKeys();
      console.log(this.temp.id);
      this.temp.authIds = checkedKeys;
      updateRoleInterface(this.temp).then(res => {
        if (res.data.code == "1") {
          this.$confirm("修改成功, 是否返回列表?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "success"
          }).then(() => {
            this.dialogFormVisible1 = false;
            this.getRoleList();
          });
        } else {
          console.log(res);
          alert("请选择正确的权限");
        }
      });
    },
    showValue() {
      this.isAudit = true;
    },
    closeDialog(){
      if(this.isAudit) {
        this.$confirm('编辑的内容可能没有保存，确定关闭?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$refs.roleForm.resetFields();
          this.dialogFormVisible = false;
          this.isAudit = false;
        })
      } else {
        this.$refs.roleForm.resetFields();
        this.dialogFormVisible = false;
      }
    },
    cancelClose(){
      this.$refs.roleForm.resetFields();
      this.dialogFormVisible = false;
      this.isAudit = false;
    }
  }
};
</script>
<style>

</style>

