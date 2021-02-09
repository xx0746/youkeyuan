<template>
  <div>
    <div class="title">标签管理</div>
    <div style="float:left;width:99%;padding:20px">
      <div style="position:relative;z-index:2">
        <el-input v-model="initData.labelName" placeholder="请输入标签名称" style="width:200px"></el-input>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="small"
          @click="handleSearch(1)"
          style="margin-left:10px"
        >查询</el-button>
        <el-button
          type="primary"
          size="small"
          @click="creatLabel"
          style="margin-left:10px"
        >+&nbsp;添加标签</el-button>
        <el-button
          type="primary"
          size="small"
          @click="labelGroupClick"
          style="margin-left:10px"
        >标签分组管理</el-button>
      </div>
      <!-- 新建/修改标签弹窗 -->
      <el-dialog class="dialogTitle" :title="lableTitle" :visible.sync="dialogFormVisible" @close="closeDialog">
        <el-form ref="labelForm" :model="labelForm" label-width="100px"  :rules="carRules">
          <el-form-item label="所属资源库" prop="menuName" style="width:85%;margin-left:5%;">
            <el-select
              v-model="labelForm.menuName"
              placeholder="请选择所属资源库"
              style="width:100%"
              @focus="getLeftTreeData"
              @change="getGroup"
              :disabled="stairDis"
            >
              <el-option
                v-for="(item,key) in menus"
                :key="key"
                :label="item.label"
                :value="item.label"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="所属分组" prop="typeName" style="width:85%;margin-left:5%;">
            <el-select
              v-model="labelForm.typeName"
              @change="handleChangeGroup"
              @focus="handleGetListGroup"
              placeholder="请选择所属分组"
              style="width:100%"
              >
              <el-option
                v-for="(item) in typeList"
                :key="item.id"
                :label="item.typeName"
                :value="item.typeName"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item width="150" prop="labelName" label="标签名称" style="width:85%;margin-left:5%">
            <el-input v-model="labelForm.labelName"></el-input>
          </el-form-item>
          <el-form-item width="150" label="描述" style="width:85%;margin-left:5%">
            <el-input v-model="labelForm.labelDescription"></el-input>
          </el-form-item>
          <el-form-item width="150" label="状态" style="width:85%;margin-left:5%">
            <el-switch
              active-color="#009A52"
              inactive-color="#DCDFE6"
              v-model="state"
              @change="getState(state)"
            ></el-switch>
          </el-form-item>
          <el-form-item >
            <el-button type="primary" size="small" @click="newLabelForm" style="margin-left:20%">提交</el-button>
            <el-button
              type="primary4"
              size="small"
              @click="dialogFormVisible = false"
              style="margin-left:100px"
            >取消</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
      <!-- 标签列表 -->
      <div id="roc1" class="leftPart">
        <el-table
          :data="labelList"
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
          <el-table-column width="60" align="center" label="序号">
            <template slot-scope="scope">
              <span>{{scope.$index+1}}</span>
            </template>
          </el-table-column>

          <el-table-column  align="center" label="标签名称">
            <template slot-scope="scope">
              <span>{{scope.row.LABEL_NAME}}</span>
            </template>
          </el-table-column>

          <el-table-column width="110" align="center" label="所属分组">
            <template slot-scope="scope">
              <span>{{scope.row.TYPE_NAME}}</span>
            </template>
          </el-table-column>

          <el-table-column  align="center" label="描述">
            <template slot-scope="scope">
              <span>{{scope.row.LABEL_DESCRIPTION}}</span>
            </template>
          </el-table-column>

          <el-table-column  align="center" label="所属资源库">
            <template slot-scope="scope">
              <span>{{scope.row.MENU_NAME}}</span>
            </template>
          </el-table-column>

          <el-table-column width="110" align="center" label="创建人">
            <template slot-scope="scope">
              <span>{{scope.row.CREATE_NAME}}</span>
            </template>
          </el-table-column>

          <el-table-column width="180" align="center" label="创建时间">
            <template slot-scope="scope">
              <span>{{scope.row.CREATE_TIME}}</span>
            </template>
          </el-table-column>

          <el-table-column width="91" align="center" label="状态">
            <template slot-scope="scope">
              <span v-if="scope.row.STATE == 1">启用</span>
              <span v-else>禁用</span>
            </template>
          </el-table-column>

          <el-table-column align="center"  label="操作" style>
            <template slot-scope="scope">
              <div style="text-align: center">
                <a href="javascript:void(0)" style="text-align: center" @click="handUpdate(scope.row)" title="修改">
                  <i class="el-icon-edit"></i>
                </a>
                <a href="javascript:void(0)" @click="remove(scope.row)" title="刪除">
                  <i style="color:red;margin-left:10px;cursor:pointer;" class="el-icon-delete"></i>
                </a>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!--分页-->
      <div class="block">
        <el-pagination
          style="text-align: center"
          :page-size="10"
          :current-page="initData.pageNumber"
          @current-change="handleCurrentChange"
          layout="total,  prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
      <!-- 新建分组页面 弹窗 -->
      <el-dialog
        class="dialog2"
        :title="lableTypeTitle"
        :visible.sync="dialogFormVisible2"
        width="60%"
        style="border-bottom:0"
        >
        <!-- <div class="title" style="border-bottom:0"></div> -->
        <div style="position:relative;z-index:2">
          <el-input v-model="newGroupForm.typeName" placeholder="请输入分组名称" style="width:200px"></el-input>
          <el-button
            type="primary"
            icon="el-icon-search"
            size="small"
            @click="labelGroupClick(1)"
            style="margin-left:10px"
          >查询</el-button>
          <el-button
            type="primary"
            size="small"
            @click="creatNewGroup"
            style="margin-left:10px"
          >+&nbsp;添加分组</el-button>
        </div>
        <!-- // 分组列表 -->
        <el-table
          :data="newGroupList"
          row-key="id"
          style="margin-top:20px;"
          
          border
          fit
          highlight-current-row
          >
          <el-table-column align="center" width="60px" label="序号">
            <template slot-scope="scope">
              <span>{{scope.$index+1}}</span>
            </template>
          </el-table-column>
          <el-table-column width="150" align="center" label="分组名称">
            <template slot-scope="scope">
              <div style="text-align:left;">{{scope.row.TYPE_NAME}}</div>
            </template>
          </el-table-column>
          <el-table-column width="150" align="center" label="描述">
            <template slot-scope="scope">
              <span>{{scope.row.TYPE_DESCRIPTION}}</span>
            </template>
          </el-table-column>
          <el-table-column width="150" align="center" label="所属资源库">
            <template slot-scope="scope">
              <span>{{scope.row.MENU_NAME}}</span>
            </template>
          </el-table-column>
          <el-table-column width="150" align="center" label="创建人">
            <template slot-scope="scope">
              <span>{{scope.row.CREATE_NAME}}</span>
            </template>
          </el-table-column>
          <el-table-column width="200" align="center" label="创建时间">
            <template slot-scope="scope">
              <span>{{scope.row.CREATE_TIME}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="状态">
            <template slot-scope="scope">
              <span v-if="scope.row.STATE == 1">启用</span>
              <span v-else>禁用</span>
            </template>
          </el-table-column>

          <el-table-column align="center" width="180" label="操作">
            <template slot-scope="scope">
              <div  style="text-align: center">
                <a href="javascript:void(0)" @click="handUpdateType(scope.row)" title="修改">
                  <i class="el-icon-edit" style="margin-left:10px"></i>
                </a>
                <i
                  style="color:red;margin-left:20px;cursor:pointer;"
                  @click="removeType(scope.row)"
                  class="el-icon-delete"
                ></i>
              </div>

            </template>
          </el-table-column>
        </el-table>

        <!--分页-->
        <div class="block">
          <el-pagination
            style="text-align: center"
            :page-size="10"
            :current-page="newGroupForm.pageNumber"
            @current-change="handleCurrentChange2"
            layout="total,  prev, pager, next, jumper"
            :total="total2"
          ></el-pagination>
        </div>
      </el-dialog>
      <!-- 新建分组弹窗 -->
      <el-dialog class="dialogTitle" :title="labelTypeTitle" :visible.sync="dialogFormVisible3">
        <el-form ref="newGroupForm2" :model="newGroupForm2"   :rules="carRules1" label-width="90px">
          <el-form-item label="所属资源库"  label-width="100px"  prop="menuId"  style="width:85%;margin-left:5%;">
            <el-select
              v-model="newGroupForm2.menuId"
              placeholder="请选择所属资源库"
              @focus="getLeftTreeData"
              style="width:100%"
              >
              <el-option
                v-for="(item,key) in menus"
                :key="key"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item width="150" label-width="100px" prop="typeName" label="分组名称" style="width:85%;margin-left:5%">
            <el-input v-model="newGroupForm2.typeName"></el-input>
          </el-form-item>
          <el-form-item label="描述" label-width="100px" prop="typeDescription" style="width:85%;margin-left:5%">
            <el-input v-model="newGroupForm2.typeDescription"></el-input>
          </el-form-item>
          <el-form-item label="状态" label-width="100px" style="width:85%;margin-left:5%">
            <el-switch
              active-color="#009A52"
              inactive-color="#DCDFE6"
              v-model="state2"
              @change="getState2(state2)"
            ></el-switch>
          </el-form-item>
          <el-form-item style>
            <el-button
              type="primary"
              size="small"
              @click="creatNewGroupAdd"
              style="margin-left:20%"
            >提交</el-button>
            <el-button
              type="primary4"
              size="small"
              @click="dialogFormVisible3 = false"
              style="margin-left:100px"
            >取消</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import {
  getlabelListInterface,
  typeListAllInterface,
  labelInsertInterface,
  typeListInterface,
  NewGroupAddInterface,
  deleteLabelInterface,
  deleteLabelTypeInterface,
  updateLabelInterface,
  updateLabelTypeInterface
} from "@/api/datalable";
import { getlabelListAllData } from "@/api/manualupload";
export default {
  data() {
    return {
      lableTypeTitle: "标签分组管理",
      value: "",
      options: "",
      tabPosition: "",
      total: null,
      total2: null,
      status: true,
      stairDis: false,
      lableTitle: "添加标签",
      labelTypeTitle: "添加标签分组",
      menus: [],
      carRules1: {
        typeDescription: [
          // { required: true, message: "请输入描述", trigger: "blur" }
        ],
        menuId: [
          { required: true, message: '请选择所属资源库', trigger: 'change' }
        ],
        typeName:[
          { required: true, message: '请输入分组名称', trigger: 'blur' }
        ]
      },
      carRules: {
        labelName: [
          { required: true, message: "请输入标签名称", trigger: "blur" }
        ],
        menuName: [
          { required: true, message: '请选择所属资源库', trigger: 'change' }
        ],
        typeName:[
          { required: true, message: '请选择分组', trigger: 'change' }
        ]
      },
      // 弹窗
      dialogFormVisible: false,
      dialogFormVisible2: false,
      dialogFormVisible3: false,
      initData: {
        // limit: 10,
        pageNumber: 1,
        labelName: "",
        // menuType: 2
      },
      labelForm: {
        labelName: "",
        menuId: "",
        labelTypeId: "",
        labelDescription: "",
        state: "",
        typeName:'',
        region:'',
        menuName:''
      },
      state: "",
      state2: "",
      listForm: {
        menuId: 1,
        state: 1
      },
      typeList: [],
      newGroupList: null,
      newGroupForm: {
        typeName: "",
        pageNumber: 1,
        limit: 10
      },
      newGroupForm2: {
        typeName: "",
        menuId: "",
        typeDescription: "",
        state: 1,
        pageNumber: 1
      },
      // 列表
      labelList: null
    };
  },
  mounted() {
    this.getLabelList();
    this.getLeftTreeData();
    this.changecolor();
  },
  filters: {
  },
  methods: {
    handleSearch(val) {
      if(val){
        this.initData.pageNumber = 1;
      }
      this.initData.limit = 10;
      this.initData.pageNumber = 1;
      this.getLabelList();
    },
    changecolor() {
      $(".c2").css("background", "");
      $(".c3").css("background", "#009A52");
      $(".c4").css("background", "");
      $(".c5").css("background", "");
      $(".c6").css("background", "");
      $(".c7").css("background", "");
    },
    handleCurrentChange(val) {
      this.initData.pageNumber = val;
      this.getLabelList();
    },
    handleCurrentChange2(val) {
      this.newGroupForm.pageNumber = val;
      this.labelGroupClick();
    },

    getState(state) {
      if (state == true) {
        this.labelForm.state = 1;
      } else {
        this.labelForm.state = 2;
      }
    },
    getState2(state2) {
      if (state2 == true) {
        this.newGroupForm2.state = 1;
      } else {
        this.newGroupForm2.state = 2;
      }
    },
    getLabelList() {
      getlabelListInterface(this.initData).then(res => {
        if (res.data.code == 1) {
          console.log(res,'sssssc')
          this.labelList = res.data.data.rows;
          this.total = res.data.data.total;
        } else {
          return false;
        }
      });
    },
    // 关闭弹窗回调
    closeDialog() {
      this.resetValidate("labelForm");
    },
    // 格式化数据
    resetTemp() {
      this.labelForm = {
        labelName: "",
        menuId: "",
        labelTypeId: "",
        labelDescription: "",
        state: ""
      };
      this.newGroupForm2 = {
        typeName: "",
        menuId: "",
        typeDescription: "",
        state: 1
      };
    },
    // 点击创建标签
    creatLabel() {
      this.stairDis = false;
      this.resetTemp();
      this.state = "";
      this.dialogFormVisible = true;
    },
    //点击新建标签弹窗的提交
    newLabelForm() {
      this.$refs.labelForm.validate(valid => {
        if (valid) {
          if (!this.labelForm.id) {
            // 有id 走新建
            labelInsertInterface(this.labelForm).then(res => {
              if (res.data.code == 1) {
                this.$confirm("添加成功，是否返回列表", "提示", {
                  type: "success"
                })
                  .then(() => {
                    this.dialogFormVisible = false;
                    this.resetTemp();
                    this.getLabelList();
                  })
                  .catch(() => {
                    this.$message.info("已取消");
                  });
              } else {
                this.$message.error(res.data.msg);
                return false;
              }
            });
          } else {
            // 没id 走编辑
            let obj = JSON.parse(JSON.stringify(this.labelForm));
            delete obj.typeName;
            delete obj.menuName;
            console.log(obj);
            updateLabelInterface(this.labelForm).then(res => {
              if (res.data.code == 1) {
                this.$confirm("修改成功，是否返回列表", "提示", {
                  type: "success"
                })
                  .then(() => {
                    this.dialogFormVisible = false;
                    this.resetTemp();
                    this.getLabelList();
                  })
                  .catch(() => {
                    this.$message.info("已取消");
                  });
              } else {
                this.$message.error(res.data.msg);
                return false;
              }
            });
          }
        }
      });
    },
    remove(row) {
      this.$confirm("是否删除", "提示", {
        distinguishCancelAndClose: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteLabelInterface(row.ID).then(res => {
            if (res.data.code != "1") {
              this.$messge.error(res.data.msg);
              return false;
            } else {
              this.$message.success("删除成功");
              this.getLabelList();
            }
          });
        })
        .catch(() => {
          this.$message.info("已取消删除");
        });
    },
    // 点击修改标签按钮
    handUpdate(row) {
      this.stairDis = true;
      this.$set(this.listForm, "menuId", row.MENU_ID);
      this.labelForm = {};
      this.$set(this.labelForm, "menuId", row.MENU_ID);
      this.$set(this.labelForm, "id", row.ID);
      this.$set(this.labelForm, "menuName", row.MENU_NAME);
      this.$set(this.labelForm, "state", row.STATE);
      this.$set(this.labelForm, "labelName", row.LABEL_NAME);
      this.$set(this.labelForm, "typeName", row.TYPE_NAME);
      this.$set(this.labelForm, "labelDescription", row.LABEL_DESCRIPTION);
      this.$set(this.labelForm, "labelTypeId", row.LABEL_TYPE_ID);
      this.state = row.STATE == 1 ? true : false;
      this.lableTitle = "修改标签";
      this.$nextTick(() => {
        this.dialogFormVisible = true;
      });
    },
    removeType(row) {
      this.$confirm("此操作将删除该标签分组及分组下全部标签，是否确认?", "提示", {
        distinguishCancelAndClose: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteLabelTypeInterface(row.ID).then(res => {
            if (res.data.code != "1") {
              this.$messge.error(res.data.msg);
              return false;
            } else {
              this.$message.success("删除成功");
              this.labelGroupClick();
            }
          });
        })
        .catch(() => {
          this.$message.info("已取消删除");
        });
    },
    // 点击所属资源库，获取所属分组的值
    getGroup() {
      let str = this.menus.find(item => item.label === this.labelForm.menuName).menuId;
      this.$set(this.listForm, "menuId", str);
      this.$set(this.labelForm, "menuId", str);
      this.handleGetListGroup();
    },
    // 获取所属分组列表
    handleGetListGroup() {
      let menuIds = {
        menuIds: this.listForm.menuId,
        state: 1,
      };
      typeListAllInterface(menuIds).then(res => {
        this.typeList = res.data.data.labelType;
      });
    },

    // 分组改变时修改分组Id
    handleChangeGroup() {
      let str = this.typeList.find(
        item => item.typeName === this.labelForm.typeName
      ).id;
      this.$set(this.labelForm, "labelTypeId", str);
    },
    // 点击分组管理查询
    handleSearchGroupTag() {
      this.newGroupForm.pageNumber = 1;
      this.newGroupForm.limit = 10;
      this.labelGroupClick();
    },
    //点击标签分组管理
    labelGroupClick(val) {
      if(val){
        this.newGroupForm.pageNumber = 1;
      }
      this.dialogFormVisible2 = true;
      typeListInterface(this.newGroupForm).then(res => {
        if (res.data.code == 1) {
          this.newGroupList = res.data.data.rows;
          this.total2 = res.data.data.total;
        }
        console.log(this.newGroupList);
      });
    },
    // 点击新建分组按钮
    creatNewGroup() {
      this.dialogFormVisible3 = true;
      this.resetValidate("newGroupForm2");
      this.resetTemp();
    },
    // 新建分组提交
    creatNewGroupAdd() {
      this.$refs.newGroupForm2.validate(valid => {
        if (valid) {
          if (!this.newGroupForm2.id) {
            NewGroupAddInterface(this.newGroupForm2).then(res => {
              if (res.data.code == 1) {
                this.$confirm("添加成功，是否返回列表", "提示", {
                  type: "success"
                })
                  .then(() => {
                    this.dialogFormVisible3 = false;
                    this.resetTemp();
                    this.labelGroupClick();
                  })
                  .catch(() => {
                    this.$message.info("已取消");
                  });
              } else {
                this.$message.error(res.data.msg);
                return false;
              }
            });
          } else {
            updateLabelTypeInterface(this.newGroupForm2).then(res => {
              if (res.data.code == 1) {
                this.$confirm("修改成功，是否返回列表", "提示", {
                  type: "success"
                })
                  .then(() => {
                    this.dialogFormVisible3 = false;
                    this.resetTemp();
                    this.labelGroupClick();
                  })
                  .catch(() => {
                    this.$message.info("已取消");
                  });
              } else {
                this.$message.error(res.data.msg);
                return false;
              }
            });
          }
        }
      });
    },
    // 点击修改标签按钮
    handUpdateType(row) {
      this.labelTypeTitle = "修改标签分组";
      console.log(row);
      this.newGroupForm2 = {};
      this.$set(this.newGroupForm2, "menuId", row.MENU_ID);
      this.$set(this.newGroupForm2, "id", row.ID);
      this.$set(this.newGroupForm2, "menuName", row.MENU_NAME);
      this.$set(this.newGroupForm2, "state", row.STATE);
      this.$set(this.newGroupForm2, "typeName", row.TYPE_NAME);
      this.$set(this.newGroupForm2, "typeDescription", row.TYPE_DESCRIPTION);
      this.state2 = row.STATE == 1 ? true : false;
      this.lableTitleType = "修改标签分组";
      this.$nextTick(() => {
        this.dialogFormVisible3 = true;
      });
    },
    // 获取标签
    getLeftTreeData() {
      getlabelListAllData().then(res => {
        console.log(JSON.parse(JSON.stringify(res.data.data[1].children)),'ssss');
        var arr = JSON.parse(JSON.stringify(res.data.data[1].children));
        this.menus  = arr;

      });
    },
    resetValidate(formName) {
      this.$refs[formName].resetFields();
    },
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

.leftPart {
  display: none;
}
#roc1 {
  display: block;
}
.dialog2 .el-dialog__header {
  border-bottom: 0;
}
</style>
