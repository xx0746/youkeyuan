<template>
  <div>
    <div class="title">用户列表</div>
      <div class="filter-container r-menu" style="margin-top:20px;margin-left:20px;margin-right:20px">
        <el-input
          style="width: 200px;margin-right:10px;"
          class="filter-item"
          v-model="listQuery.userName"
          placeholder="姓名"
        ></el-input>
        <el-select v-model="searchValue" clearable placeholder="请选择组织机构" style="margin-right:10px;">
          <el-option
            v-for="item in searchOrgList"
            :key="item.ORGID"
            :label="item.ORGNAME"
            :value="item.ORGID">
          </el-option>
        </el-select>
        <el-select v-model="roleName" clearable placeholder="请选择角色">
          <el-option
            v-for="item in roleList"
            label-width="100px"
            :key="item.ROLEID"
            :label="item.ROLENAME"
            :value="item.ROLEID"
          ></el-option>
        </el-select>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="small"
          @click="getUserList(1)"
          style="margin-left:10px"
        >查询</el-button>
        <el-button type="primary" size="small" icon="el-icon-plus" @click="handCreate">添加</el-button>
        <el-table
          :data="userList"  row-key="id"  style="margin-top:20px;"  border  fit  highlight-current-row  :header-cell-style="{ 'background-color': '#f5f7fa',  'color': 'rgb(103, 194, 58)',}" >
          <el-table-column align="center" width="60px" label="序号">
            <template slot-scope="scope">
              <span>{{scope.$index+1}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="登录名">
            <template slot-scope="scope">
              <span>{{scope.row.LOGINNAME}}</span>
            </template>
          </el-table-column>
          <el-table-column width="150" align="center" label="姓名">
            <template slot-scope="scope">
              <span>{{scope.row.USERNAME}}</span>
            </template>
          </el-table-column>
          <el-table-column width="150" align="center" label="组织机构">
            <template slot-scope="scope">
              <span>{{scope.row.ORGNAME}}</span>
            </template>
          </el-table-column>
          <el-table-column width="140" align="center" label="角色">
            <template slot-scope="scope">
              <span>{{scope.row.ROLENAME}}</span>
            </template>
          </el-table-column>
          <el-table-column width="200" align="center" label="邮箱">
            <template slot-scope="scope">
              <span>{{scope.row.USEREMAIL}}</span>
            </template>
          </el-table-column>
          <el-table-column width="150" align="center" label="电话">
            <template slot-scope="scope">
              <span>{{scope.row.USERPHONE}}</span>
            </template>
          </el-table-column>
          <el-table-column width="150" align="center" label="手机号">
            <template slot-scope="scope">
              <span>{{scope.row.USERMOBILE}}</span>
            </template>
          </el-table-column>
          <el-table-column width="100" align="center" label="状态">
            <template slot-scope="scope">
              <el-switch
                size="small"
                v-model="scope.row.STATE"
                active-color="#009A52"
                inactive-color="#DCDFE6"
                @change="getUserState(scope.row)"
              ></el-switch>
            </template>
          </el-table-column>
          <el-table-column width="160" align="center" label="操作" fixed="right">
            <template slot-scope="scope">
              <div class="handle-col">
                <diy-btn styleType="icon" iconType="icon-reset_password" @click="resetPassword(scope.row)"></diy-btn>
                <diy-btn styleType="icon" iconType="icon-edit" @click="handUpdate(scope.row)"></diy-btn>
                <diy-btn styleType="icon" iconType="icon-del" @click="handDel(scope.row)"></diy-btn>
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
        <!-- 用户列表添加 和修改 -->
        <el-dialog  class="dialogTitle"  :title="textMap[dialogStatus]"  :visible.sync="dialogFormVisible"  :before-close="cancelData"  >
          <div v-if="reset">
            <el-form ref="userForm" :model="userForm" label-width="100px" :rules="userRules">
              <el-form-item prop="userName" label="姓名：">
                <el-input autocomplete="new-password" v-model="userForm.userName" @change="showValue('userName')"></el-input>
              </el-form-item>
              <el-form-item prop="loginName" label="登录名：">
                <el-input v-model="userForm.loginName" @change="showValue('loginName')"></el-input>
              </el-form-item>
              <el-form-item prop="password" label="密码：" v-if="dialogStatus == 'create'">
                <el-input
                  @change="showValue('password')"
                  autocomplete="new-password"
                  type="password"
                  v-model="userForm.password"
                  onkeyup="value=value.replace(/[\u4E00-\u9FA5]/g,'')"
                  onbeforepaste="clipboardData.setData('text',clipboardData.getData('text').replace(/[\u4E00-\u9FA5]/g,''))"
                ></el-input>
              </el-form-item>
              <el-form-item prop="orgId" label="组织机构：" label-width="100px">
                <el-select v-model="userForm.orgId" filterable placeholder="请选择组织机构" @change="showValue('item')">
                  <el-option
                    v-for="item in orgList"
                    :key="item.ORGID"
                    :label="item.ORGNAME"
                    :value="item.ORGID"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item prop="roleId" ref="roleId" label="角色：" label-width="100px">
                <el-select
                  v-model="userForm.roleId"
                  placeholder="请选择角色"
                  label-width="100px"
                  @change="getUserRoleType(userForm.roleId)"
                >
                  <el-option
                    v-for="item in roleList"
                    label-width="100px"
                    :key="item.ROLEID"
                    :label="item.ROLENAME"
                    :value="item.ROLEID"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item prop="userEmail" label="邮箱：">
                <el-input v-model="userForm.userEmail" @change="showValue('userEmail')"></el-input>
              </el-form-item>
              <el-form-item prop="userMobile" label="手机号：">
                <el-input v-model="userForm.userMobile" @change="showValue('userMobile')"></el-input>
              </el-form-item>
              <el-form-item prop="userPhone" label="电话：">
                <el-input v-model="userForm.userPhone" @change="showValue('userPhone')"></el-input>
              </el-form-item>

              <el-form-item ref="state" label="状态：">
                <el-switch v-model="state" @change="getState(state)"></el-switch>
              </el-form-item>
            </el-form>
          </div>
          <span slot="footer" class="el-dialog__footer">
            <el-button
              size="small"
              type="primary4"
              @click="cancelClose"
            >取消</el-button>
            <el-button
              size="small"
              v-if="dialogStatus=='create'"
              type="primary"
              @click="addUserForm"
              style="margin-left:50px;"
            >提交</el-button>
            <el-button
              v-else-if="dialogStatus=='update'"
              type="primary"
              size="small"
              @click="updateData"
              style="margin-left:50px;"
            >保存</el-button>
          </span>  
        </el-dialog>
        <!-- 赋予角色弹窗 -->
        <el-dialog :close-on-click-modal="false" class="dialogTitle" title="赋予角色" :visible.sync="dialogFormVisible2">
          <el-form ref="form" :model="form" label-width="80px">
            <el-form-item label="姓名:">
              <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="用户类型">
              <el-select v-model="form.orgId" placeholder="请选择活动区域" style="width:100%">
                <el-option label="区域一" value="shanghai"></el-option>
                <el-option label="区域二" value="beijing"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="角色">
              <el-select v-model="form.orgId" placeholder="请选择活动区域" style="width:100%">
                <el-option label="区域一" value="shanghai"></el-option>
                <el-option label="区域二" value="beijing"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
              <el-button @click="dialogFormVisible = false">取消</el-button>
              <el-button type="primary" style="margin-left:50px;">提交</el-button>
          </span>  
        </el-dialog>
      </div>
  </div>
</template>
<script>
import {
  addUserInterface,
  getUserInterface,
  handUpdateInterface,
  updateInterface,
  handDelInterface,
  resetPassword
} from "@/api/userList";
import { getAffOrgInterface } from "@/api/list";
import { getRoleListInterface, editUserState } from "@/api/role";
import { typeNamenbsp, typePasswordLength } from '@/utils/elValidate'
export default {
  data() {
    return {
      reset:false,
      url: "/api",
      form: {
        name: ""
      },
      dialogFormVisible: false,
      dialogFormVisible2: false,
      userList: null,
      total: null,
      listLoading: false,
      listQuery: {
        pageNumber: 1,
        title: "",
        limit: 10,
        userName: "",
        orgId: "",
        roleId: ''
      },
      total: null,
      // 用户添加数据初始化
      userForm: {
        userName: "",
        userSex: null,
        userEmail: "",
        userPhone: "", // 手机号
        userMobile: "", // 电话
        loginName: "",
        password: "123456",
        orgId: 8,
        userType: null,
        roleId: "",
        state: "1"
      },
      state: true,
      userRules: {
        userName: [{ required: true, message: "请输入姓名", trigger: "blur" }],
        loginName: [
          { required: true, message: "请输入登录名", trigger: "blur" }
        ],
        orgId: [
          { required: true, message: "请选择组织机构", trigger: 'change' }
        ],
        roleId: [
          { required: true, message: "请选择角色名", trigger: 'change' }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { validator: typeNamenbsp, message: "不能含有空格", trigger: ["blur", "change"] },
          { validator: typePasswordLength, message: "密码不得小于六位", trigger: "blur"}
        ]
      },
      // 弹窗为添加或者修改标志
      dialogStatus: "",
      textMap: {
        update: "编辑",
        create: "添加用户"
      },
      // 密码标志
      isUpdate: true,
      //角色列表
      roleList: [],
      // 组织机构
      orgList: [],
      searchOrgList: [],
      searchValue: "",
      selectedOptions: [],
      roleName:'',
      isUserForm: false
    };
  },
  filters: {
    getUser: function(value) {
      return value == 1 ? "管理员" : "系统用户";
    }
  },
  created: function() {},
  mounted() {
    this.getUserList();
    this.getOrgList();
    this.getRoleList();
  },
  methods: {
    showValue(){
      this.isUserForm = true;
    },
    cancelData(){
      if(this.isUserForm){
        this.$confirm('编辑的内容可能没有保存，确定关闭?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.reset = false;
          this.isUserForm = false;
          this.dialogFormVisible = false;
        })
      }else{
          this.reset = false;
          this.dialogFormVisible = false;
      }
      console.log(this.isUserForm)
    },
    cancelClose(){
      this.reset = false;
      this.isUserForm = false;
      this.dialogFormVisible = false;
    },
    // 格式化数据
    resetTemp() {
      this.userForm = {
        userName: "",
        userSex: null,
        userEmail: "",
        userPhone: "",
        userMobile: "",
        loginName: "",
        password: "123456",
        orgId: "",
        userType: null,
        roleId: null,
        state: "1"
      };
      this.selectedOptions = [];
    },
    //密码重置
    resetPassword(row) {
      var _this = this;
      _this
        .$confirm("确定重置密码为123456？", "提示", {
          type: "warning"
        })
        .then(function() {
          resetPassword(row.ID)
            .then(res => {
              if (res.data.code != "1") {
                _this.$message.error(res.data.msg);
                return false;
              } else {
                _this.$message.success("操作成功");
                _this.getUserList();
              }
            })
            .catch(() => {
              _this.$message.info("已取消操作");
            });
        });
    },
    //打开添加pop
    handCreate() {
      this.resetTemp();
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
      this.reset = true;
      this.isUpdate = true;
    },
    handUpdate2() {
      this.dialogFormVisible2 = true;
    },
    // 角色类型获取值
    getUserRoleType(parm) {
      this.userForm.roleId = parm;
      this.isUserForm = true;
    },
    // 组织机构获取值
    getOrg(parm) {
      console.log(parm);
      let id = parm.ORGID;
      this.userForm.orgId = id;
    },
    // 状态字段获取值
    getState(parm) {
      this.isUserForm = true;
      if (parm == true) {
        this.userForm.state = 1;
      } else {
        this.userForm.state = 0;
      }
    },
    // 表格用户状态改变
    async getUserState(val) {
      let data = { userId: val.ID, state: Number(val.STATE) };
      console.log(data);
      const res = await editUserState(data);
      console.log(res);
    },
    // 角色初始化
    getRoleList() {
      getRoleListInterface().then(res => {
        this.roleList = res.data.data;
      });
    },
    // 组织结构初始化
    getOrgList() {
      getAffOrgInterface().then(res => {
        console.log(res);
        this.orgList = res.data.data;
        this.searchOrgList = JSON.parse(JSON.stringify(res.data.data));
        // this.orgList.forEach(item => {
        //   item.children = item.list;
        // })
      });
    },
    // 用户列表添加
    addUserForm() {
      var _this = this;
      _this.$refs.userForm.validate(valid => {
        if (valid) {
          _this.listLoading = true;
          addUserInterface(_this.userForm).then(function(res) {
            if (res.data.code == 1) {
              _this.$refs.userForm.resetFields();
              _this
                .$confirm("添加成功,是否返回列表", "提示", {
                  type: "success"
                })
                .then(() => {
                  _this.dialogFormVisible = false;
                  _this.reset = false;
                  _this.listLoading = false;
                  _this.getUserList();
                  _this.isUserForm = false;
                })
                .catch(() => {
                  _this.getUserList();
                  _this.$message.info("已取消");
                });
            } else {
              _this.isUserForm = false;
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
    // 点击弹窗的确定后修改某一条数据
    updateData() {
      var _this = this;
      _this.$refs.userForm.validate(valid => {
        if (valid) {
          updateInterface(_this.userForm).then(function(res) {
            if (res.data.code == 1) {
              _this.$refs.userForm.resetFields();
              _this
                .$confirm("修改成功，是否返回列表", "提示", {
                  type: "success"
                })
                .then(function() {
                  _this.dialogFormVisible = false;
                  _this.reset = false;
                  _this.getUserList();
                  _this.isUserForm = false;
                })
                .catch(function() {
                  _this.getUserList();
                  _this.$message.info("已取消");
                });
            } else{
              _this.isUserForm = false;
              _this.$message.error(res.data.msg);
              return false;
            }
          });
        } else {
          return false;
        }
      });
    },
    // 用户列表展示
    getUserList(val) {
      var _this = this;
      if (val) {
        _this.listQuery.pageNumber = 1;
        _this.listQuery.orgId = this.searchValue;
        _this.listQuery.roleId = this.roleName;
      }
      if(_this.listQuery.orgId == null) {
        _this.listQuery.orgId = "";
      }
      if(_this.listQuery.roleId == null){
        _this.listQuery.roleId = "";
      }
      getUserInterface(_this.listQuery).then(function(res) {
        if (res.data.code == 1) {
          _this.userList = res.data.data.rows;
          _this.userList.forEach(item => {
            if (item.STATE == 1) {
              item.STATE = true;
            } else {
              item.STATE = false;
            }
          });
          console.log(_this.userList.length)
          if(_this.userList.length === 0){
            let val = 1;
            _this.getUserList(val)
          }
          _this.total = res.data.data.total;
        } else {
          _this.$message.error(res.data.msg);
        }
      });
    },
    // 点击修改按钮
    handUpdate(row) {
      var _this = this;
      _this.listLoading = true;
      _this.dialogStatus = "update";
      _this.isUpdate = true;
      handUpdateInterface(row.ID).then(function(res) {
        if (res.data.code == 1) {
          _this.dialogFormVisible = true;
          _this.reset = true;
          _this.listLoading = false;
          _this.userForm = res.data.data;
          if(_this.userForm.state==0){
            _this.state = false
          }else{
            _this.state = true
          }
        }
      });
    },
    //删除某条数据
    handDel(row) {
      var _this = this;
      _this
        .$confirm("是否删除", "提示", {
          type: "warning"
        })
        .then(function() {
          handDelInterface(row.ID)
            .then(res => {
              if (res.data.code != "1") {
                _this.$message.error(res.data.msg);
                return false;
              } else {
                _this.$message.success("删除成功");
                _this.getUserList();
              }
            })
        })
        .catch(() => {
            _this.$message.info("已取消删除");
        });;
    },
    handleCurrentChange(val) {
      var _this = this;
      _this.listQuery.pageNumber = val;
      _this.getUserList();
    },
    _clear(){
      this.userList = [];
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

.el-cas {
  width: 100%;
}
</style>
