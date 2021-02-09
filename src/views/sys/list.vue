<template>
  <div>
    <div class="title">机构列表</div>
    <div class="filter-container r-menu" style="margin-top:20px;margin-left:20px;margin-right:20px">
      <el-button type="primary" class="lv" size="small" @click="add()">添加机构</el-button>
      <el-table
        :data="orgList"
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
        <el-table-column align="center" width="60px"  label="序号">
          <template slot-scope="scope">
            <span>{{scope.$index+1}}</span>
          </template>
        </el-table-column>
        <el-table-column  align="center" label="机构名称">
          <template slot-scope="scope">
            <span>{{scope.row.ORGNAME}}</span>
          </template>
        </el-table-column>
        <el-table-column  width="100" align="center" label="机构级别">
          <template slot-scope="scope">
            <span>{{scope.row.ORGTYPE | orgTypeFilter}}</span>
          </template>
        </el-table-column>
        <el-table-column  width="150" align="center" label="隶属机构" v-show="true">
          <template slot-scope="scope">
            <span>{{typeof(scope.row.PIDNAME) === 'undefined' ? "中国邮政集团公司" : scope.row.PIDNAME}}</span>
          </template>
        </el-table-column>
        <el-table-column  width="200" align="center" label="成立日期">
          <template slot-scope="scope">
            <span>{{scope.row.ESTABLISHDATE|timeData}}</span>
          </template>
        </el-table-column>
        <el-table-column width="140" align="center" label="操作" fixed="right">
          <template slot-scope="scope">
            <div class="handle-col">
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
          layout="total,  prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>

      <!-- 增加和修改机构 弹窗 -->
      <el-dialog
        :title="textMap[dialogStatus]"
        class="dialogTitle"
        :visible.sync="dialogFormVisible"
        :before-close="closeDialog"
      >
        <el-form ref="orgForm" :model="orgForm" :rules="orgRules">
          <el-form-item
            label="机构名称："
            prop="orgName"
            label-width="100px"
          >
            <el-input v-model="orgForm.orgName" @change="showValue('orgName')"></el-input>
          </el-form-item>

          <el-form-item
            label="机构级别："
            prop="orgType"
            label-width="100px"
            >
            <el-select
              v-model="orgForm.orgType"
              placeholder="请选择机构级别"
              :disabled="dialogStatus == 'update'"
              style="width:100%"
              @change="getCategory(orgForm.orgType,true)"
              >
              <el-option
                v-for="item in categorys"
                :key="item.key"
                :label="item.value"
                :value="item.key"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="隶属机构："
            prop="orgPid"
            label-width="100px"
            >
            <el-select
              v-model="orgForm.orgPid "
              placeholder="请选择隶属机构"
              style="width:100%"
              @change="getAffCategory(orgForm.orgPid)"
              >
              <el-option
                v-for="item in affCategorys"
                :key="item.ORGID"
                :label="item.ORGNAME"
                :value="item.ORGID"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item
            label="成立日期："
            label-width="100px"
            prop="establishDate"
          >
            <div class="block">
              <el-date-picker v-model="orgForm.establishDate" type="date" placeholder="选择日期" @change="showValue('establishDate')"></el-date-picker>
            </div>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
             <el-button
              type="primary4"
              size="small"
              @click="cancelClose"
            >取消</el-button>
            <el-button
              size="small"
              style="margin-left:50px;"
              v-if="dialogStatus=='create'"
              type="primary"
              :disabled="subDisabled"
              @click="addOrgForm"
            >提交</el-button>
            <el-button size="small"
            v-else type="primary" style="margin-left:50px;" :disabled="subDisabled" @click="updateData">提交</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import {
  addOrgInterface,
  getOrgInterface,
  handUpdateInterface,
  updateInterface,
  handDelInterface,
  getAffOrgInterface
} from "@/api/list";
export default {
  data() {
    return {
      disabledDate(time) {
        return time.getTime() > Date.now();
      },
      orgRules: {
        orgName: [
          { required: true, message: "请输入机构名称", trigger: "blur" }
        ],
        orgType: [
          { required: true, message: "请选择机构类型", trigger: "blur" }
        ],
        orgPid: [
          { required: true, message: "请选择隶属机构", trigger: "blur" }
        ]
      },
      value1: "",
      value2: "",
      form: {
        name: "",
        region: "",
        date1: "",
        date2: "",
        delivery: false,
        type: [],
        resource: "",
        desc: ""
      },

      data: [
        {
          label: "邮政科学研究规划院",
          children: [
            {
              label: "二级 1-1",
              children: [
                {
                  label: "三级 1-1-1"
                }
              ]
            }
          ]
        }
      ],
      defaultProps: {
        children: "children",
        label: "label"
      },
      // ------------
      dialogFormVisible: false,
      // 查询字段
      listQuery: {
        pageNumber: 1,
        title: "",
        limit: 10,
        orgName: ""
      },
      total: null,
      // 弹窗为添加或者修改标志
      dialogStatus: "",
      textMap: {
        update: "修改机构",
        create: "新建机构"
      },
      subDisabled: false,
      // 机构类别
      categorys: [
        { key: 0, value: "一级" },
        { key: 1, value: "二级" },
        { key: 2, value: "三级" },
      ],
      affCategorys: [],
      // 机构表初始化
      orgList: null,
      // 新增数据初始化
      orgForm: {
        orgName: "",
        orgType: "",
        state: 1,
        orgPid: "", //隶属机构
        establishDate: "" //成立时间
      },
      isOrgForm: false
    };
  },

  created: function() {},
  mounted() {
    this.getOrgList();
  },
  computed:{

  },
  filters: {
    timeData:function (val) {
      if(val!==undefined){
        let date = new Date(val);
        let y = date.getFullYear();
        let MM = date.getMonth()+1;
        MM = MM<10 ? "0" +MM : MM;
        let d = date.getDate();
        d = d<10 ? "0" +d : d;
        return y+'-'+MM+'-'+d;
      }
    },
    orgTypeFilter(status) {
      const statusMap = {
        0: '一级',
        1: "二级",
        2: "三级"
      };
      return statusMap[status];
    }
  },
  methods: {
    // 格式化数据
    resetTemp() {
      this.orgForm = {
        orgName: "",
        orgType: "",
        state: 1,
        orgPid: "", //隶属机构
        establishDate: "" //成立时间
      };
    },
    handleNodeClick(data) {
      console.log(data);
    },
    add() {
      this.resetTemp();
      this.dialogFormVisible = true;
      this.subDisabled = false;
      this.dialogStatus = "create";
    },
    // 机构类别
    getCategory(parm,b) {
      this.orgType = parm;
      console.log(parm,b)
      if(b){
        this.orgForm.orgPid = '';
        this.isOrgForm = true
      }
      if (this.orgType != 0) {
        this.getaffCategorys(parm);
      } else{
        this.affCategorys = [{
          ORGID:0,
          ORGNAME:'中国邮政集团公司'
        }]
      }
      console.log(this.isOrgForm)
    },
    handleCurrentChange(val) {
      this.listQuery.pageNumber = val;
      this.getOrgList();
    },
    // 组织机构列表添加
    addOrgForm() {
      var _this = this;
      _this.$refs.orgForm.validate(valid => {
        _this.subDisabled = false;
        if (valid) {
          addOrgInterface(_this.orgForm).then(function(res) {
            if (res.data.code == 1) {
              _this
                .$confirm("添加成功,是否返回列表", "提示", {
                  type: "success"
                })
                .then(() => {
                  _this.dialogFormVisible = false;
                  _this.getOrgList();
                  _this.isOrgForm = false;
                })
                .catch(() => {
                  _this.$message.info("已取消");
                  _this.subDisabled = false;
                });
            } else {
              _this.isOrgForm = false;
              _this.$message.error(res.data.msg);
              return false;
            }
          });
        } else {
          return false;
        }
      });
    },
    // 获取隶属机构
    getaffCategorys(parm) {
      var _this = this;
      let s = { type : parm == 1 ? 0 : 1}
      getAffOrgInterface(s).then(function(res) {
        if (res.data.code == 1) {
          _this.affCategorys = res.data.data;
        }
        console.log(res);
      });
    },
    getAffCategory(parm) {
      this.orgForm.orgPid = parm;
      this.isOrgForm = true;
      console.log(this.isOrgForm)
    },
    // 组织结构列表展示
    getOrgList() {
      var _this = this;
      getOrgInterface(_this.listQuery).then(function(res) {
        if (res.data.code == 1) {
          _this.listLoading = false;
          _this.orgList = res.data.data.rows;

          // console.log(time.slice(1,10))
          console.log(_this.orgList);
          _this.total = res.data.data.total;
          _this.listLoading = false;
        } else {
          _this.listLoading = false;
        }
      });
    },
    // 点击修改按钮
    handUpdate(row) {
      console.log(row);
      var _this = this;
      _this.listLoading = true;
      _this.subDisabled = false;
      _this.dialogStatus = "update";
      handUpdateInterface(row.ORGID).then(function(res) {
        if (res.data.code == 1) {
          _this.dialogFormVisible = true;
          _this.listLoading = false;
          _this.orgForm = res.data.data;
          _this.getCategory(_this.orgForm.orgType,false)
        }
      });
    },
    // 点击弹窗的确定后修改某一条数据
    updateData() {
      var _this = this;
      _this.$refs.orgForm.validate(valid => {
        if (valid) {
          _this.subDisabled = true;
          updateInterface(_this.orgForm).then(function(res) {
            if (res.data.code == 1) {
              _this.$confirm("修改成功，是否返回列表", "提示", {
                type: "success"
              })
              .then(function() {
                _this.dialogFormVisible = false;
                _this.subDisabled = false;
                _this.isOrgForm = false;
                console.log(_this.isOrgForm)
                _this.getOrgList();
              })
              .catch(function() {
                _this.subDisabled = false;
              });
            } else {
              _this.isOrgForm = false;
              _this.$message.error(res.data.msg);
              return false;
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
        .$confirm("是否删除", "提示", {
          type: "warning"
        })
        .then(function() {
          handDelInterface(row.ORGID)
            .then(res => {
              if (res.data.code != "1") {
                _this.$message.error(res.data.msg);
                return false;
              } else {
                _this.$message.success("删除成功");
                _this.getOrgList();
              }
            })
            .catch(() => {
              _this.$message.info("已取消删除");
            });
        });
    },
    showValue(val){
      this.isOrgForm = true;
      console.log(this.isOrgForm)
    },
    closeDialog() {
      console.log(this.isOrgForm)
      if(this.isOrgForm){
        this.$confirm('编辑的内容可能没有保存，确定关闭?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.isOrgForm = false;
          this.$refs.orgForm.resetFields();
          this.dialogFormVisible = false;
        })
      }else{
        this.$refs.orgForm.resetFields();
        this.dialogFormVisible = false;
      }
      console.log(this.isOrgForm)
    },
    cancelClose(){
      this.isOrgForm = false;
      this.$refs.orgForm.resetFields();
      this.dialogFormVisible = false;
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

.lv2 {
  font-size: 10px;
  border: none;
  background: #009a52;
  color: white;
}

.lv2:hover {
  color: white;
  background: #127714;
}
</style>
