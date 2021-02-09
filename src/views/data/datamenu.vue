<template>
  <div>
    <div class="title">数据目录管理</div>

    <div style="margin-top:20px; margin-bottom: 20px; margin-left:20px;float:left;width:20%">
      <div class="title3">
        <p class="title-size">资源目录</p>
      </div>
      <el-row>
        <el-col>
          <el-tree
            :data="treeData"
            :props="defaultProps"
            @node-click="handleNodeClick"
            class="trr"
            accordion
            node-key="value"
            :default-expanded-keys="[expanded]"
            highlight-current
            empty-text="正在加载中"
          ></el-tree>
        </el-col>
      </el-row>
    </div>
    <div style="margin-top:20px; margin-bottom: 20px; margin-left:2%;float:left;width:74%;border-top: 1px solid #fff;">
      <el-button type="primary" size="small" @click="add">添加目录</el-button>
      <el-button type="primary" size="small" @click="handleGetAll">返回主目录</el-button>
      <!-- 添加和修改目录弹窗 -->
      <el-dialog
        id="dialogNameValue"
        class="dialogTitle"
        :title="textMap[dialogStatus]"
        :visible.sync="dialogFormVisible"
        :before-close="handleClose"
        :close-on-click-modal="false"
        >
        <el-form
          ref="menuForm"
          :model="menuForm"
          label-width="100px"
          :rules="menuRules"
          >
          <el-form-item label="上级目录：">
            <el-cascader
              v-model="libraryName"
              :options="dialogTreeData"
              change-on-select
              @change="handleChange"
              :disabled="firstIsDis"
            >
            </el-cascader>
          </el-form-item>
          <el-form-item label="目录名称：" prop="menuName">
            <el-input v-model="menuForm.menuName" @change="showMenuName()"></el-input>
          </el-form-item>
          <el-form-item label="目录描述：">
            <el-input type="textarea" v-model="menuForm.menuDesc" @change="showMenuDesc()"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button
              @click="cancelClose"
              type="primary4"
              size="small"
            >取消</el-button>
            <el-button
              v-if="dialogStatus=='create'"
              type="primary"
              size="small"
              style="margin-left:50px;"
              @click="addmenuForm"
            >提交</el-button>
            <el-button v-else type="primary" size="small" style="margin-left:50px" @click="updateData">保存</el-button>
        </span>  
      </el-dialog>
      <!-- 展示列表 -->
      <el-table
        :data="menuList"
        style="margin-top:20px;"
        row-key="value"
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
        <el-table-column align="center" label="目录名称">
          <template slot-scope="scope">
            <span>{{scope.row.menuName}}</span>
          </template>
        </el-table-column>
        <el-table-column width="200" align="center" label="目录描述">
          <template slot-scope="scope">
            <span>{{scope.row.menuDesc}}</span>
          </template>
        </el-table-column>
        <el-table-column width="150" align="center" v-if="this.listQuery.menuPid != 0"  label="上级目录名称">
          <template slot-scope="scope">
            <span>{{ scope.row.pidName }}</span>
          </template>
        </el-table-column>
        <el-table-column width="150" align="center" label="状态">
          <template slot-scope="scope">
            <el-switch
              size="small"
              v-model="scope.row.state"
              active-color="#009A52"
              inactive-color="#DCDFE6"
              @change="getMenuState(scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
         <el-table-column align="center" width="100" label="操作" fixed="right">
          <template slot-scope="scope">
            <div class="handle-col"> 
              <!-- <el-button
                  type="primary2"
                  size="mini"
                  @click="handUpdate(scope.row)"
                >修改</el-button> -->
                <diy-btn styleType="icon" iconType="icon-edit" @click="handUpdate(scope.row)"></diy-btn>
              <!-- <a href="javascript:void(0)" @click="handUpdate(scope.row)"  title="修改"><i class="el-icon-edit"></i> </a> -->
              <!-- <a href="javascript:void(0)" @click="handUpdate1(scope.row)"  title="修改1"><i class="el-icon-edit"></i> </a> -->
            </div>
          </template>
        </el-table-column>
      </el-table>

      <div class="block">
      </div>
    </div>
  </div>
</template>
<script>
import {
  addMenuInterface,
  getMenuInterface,
  handUpdateInterface,
  updateInterface,
  handDelInterface,
  getLeftTreeInterface,
  editMenuState
} from "@/api/resource_list"
import infoAdit from "@/components/resetUpload/infoAdit";
import { debounce } from '@/utils/Debounce'
export default {
  components: {
    infoAdit,
  },
  data() {
    return {
      me_data: [],
      libraryName: [],
      dialogTreeData: [],
      treeData: [],
      defaultProps: {
        children: "children",
        label: "label",
        disabled:'disabled'
      },
      // ------------------v
      listQuery: {
        pageNumber: 1,
        title: "",
        limit: 10,
        menuPid: 16,
        menuName: ""
      },
      expanded: 16,
      total: null,
      treeIsShow: true,
      // 弹窗为添加或者修改标志
      dialogStatus: "",
      textMap: {
        update: "修改",
        create: "新增"
      },
      dialogFormVisible: false,
      // 角色初始化
      menuForm: {
        menuDesc: "",
        menuName: "",
        menuType: "",
        state: 1
      },
      state: true,
      menuList: null,
      firstIsDis: true,
      menuRules: {
        menuName: [
          { required: true, message: "请输入目录名称", trigger: "blur" }
        ],
        menuDesc: [
          { required: true, message: "请输入目录描述", trigger: "blur" }
        ],
        menuType: [
          { required: true, message: "请输入目录类型", trigger: "blur" }
        ]
      },
      isMenu: false,
    };
  },
  created: function() {},
  mounted() {
    this.getLeftMenuTree();
    this.getMenuList();
  },
  methods: {
    handleChange() {
      if (this.libraryName.length > 0) {
        this.$set(this.menuForm, 'menuPid',this.libraryName[this.libraryName.length - 1])
      }
      this.isMenu = true;
    },
    handleGetAll() {
      this.listQuery.menuPid = 16;
      this.expanded = 16;
      this.getLeftMenuTree();
      this.getMenuList();
    },
    // 点击左边菜单
    handleNodeClick(data) {
      this.listQuery.menuPid = data.menuId;
      this.expanded = data.menuId;
      // this.treeIsShow = false;
      // this.$nextTick(_=> {
      //   this.treeIsShow = true;
      // })
      this.handleGetData(this.treeData,data.menuId); //获得此目录所属层级prentIDs
      this.getMenuList();
    },
    handleCurrentChange(val) {
      this.listQuery.pageNumber = val;
      this.getMenuList();
    },
    // 获取左侧菜单
    getLeftMenuTree() {
      getLeftTreeInterface({
        menuType : 2
      }).then(res => {
        let arr = res.data.data;
        this.treeData = JSON.parse(JSON.stringify(arr));
        let dialogTreeData =[{
            label: "数据专区",
            menuId:16,
            menuPid:16,
            value:16,
            children:arr 
        }]
        this.dialogTreeData =  JSON.parse(JSON.stringify(dialogTreeData));
        this.doFormate(this.treeData,[]);
      });
    },
    // 点击添加目录按钮
    add(obj) {
      this.firstIsDis = false;
      this.resetTemp();
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
      this.libraryName = this.me_data.prentIDs; // 添加获取下拉所属目录
    },
    // 编辑
    handUpdate(obj) {
      // if(obj.menuId > 10 && obj.menuId < 15) {
      //   this.firstIsDis = true;
      // } else {
      //   this.firstIsDis = false;
      // }
      this.firstIsDis = true;
      this.resetTemp();
      this.dialogStatus = "update";
      this.dialogFormVisible = true;
      this.handleGetData(this.treeData,obj.menuId);
      this.$nextTick(() => {
        this.libraryName = this.me_data.prentIDs;
        this.menuForm.menuName = obj.menuName;
        this.menuForm.id = obj.menuId;
        this.menuForm.menuType = obj.menuType;
        this.menuForm.state = obj.state;
        this.menuForm.menuPid = obj.menuPid;
        this.menuForm.menuDesc = obj.menuDesc;
      })
    },
    // 递归整理数据
    doFormate(obj, prentIDs) {
      for(let i = 0; i < obj.length;i++) {
        obj[i].prentIDs = JSON.parse(JSON.stringify(prentIDs));
        obj[i].prentIDs.push(obj[i].menuPid);
        if (obj[i].children) {
          this.doFormate(obj[i].children,JSON.parse(JSON.stringify(obj[i].prentIDs)))
        }
      }
    },
    // 递归取值
    handleGetData(arr,id) {
      for (let i = 0 ;i < arr.length; i++) {
        if (arr[i].menuId == id) {
          this.me_data = arr[i];
          break
        } else {
          if(arr[i].children) {
            this.handleGetData(arr[i].children,id)
          }
        }
      }
    },
    // 目录添加
    addmenuForm() {
      this.$refs.menuForm.validate(valid => {
        if (valid) {
          this.listLoading = true;
          addMenuInterface(this.menuForm).then(res => {
            if (res.data.code == 1) {
              this.$confirm("添加成功,是否返回列表", "提示", {
                  type: "success"
                }).then(() => {
                  this.dialogFormVisible = false;
                  this.listLoading = false;
                  this.isMenu = false;
                  this.getLeftMenuTree();
                  this.getMenuList();
                }).catch(() => {
                  this.$message.info("已取消");
                });
            } else {
              this.isMenu = false;
              this.listLoading = false;
              this.$message.error(res.data.msg);
              return false;
            }
          });
        } else {
          return false;
        }
      });
    },
    // 获取表格数据列表
    getMenuList() {
      getMenuInterface(this.listQuery).then(res => {
        if (res.data.code === 1) {
          let resultArr = [];
          let arr = JSON.parse(JSON.stringify(res.data.data));
          if(arr && arr.length > 0) {
            for(let i = 0; i < arr.length; i++) {
              let obj = {};
              obj.menuDesc = arr[i].menuDesc;
              obj.menuId = arr[i].menuId;
              obj.menuName = arr[i].menuName;
              obj.menuPid = arr[i].menuPid;
              obj.menuType = arr[i].menuType;
              obj.pidName = arr[i].pidName;
              obj.state = arr[i].state;
              resultArr.push(obj);
            }
          }
          this.menuList = resultArr;
          if (this.menuList && this.menuList.length > 0) {
              this.menuList.forEach(item => {
                if(item.state == 1){
                  item.state = true
                }else{
                  item.state = false
                }
              });
            }
        }
        this.listLoading = false;
      });
    },
    // 点击弹窗的确定后修改某一条数据
    updateData() {
      this.$refs.menuForm.validate(valid => {
        if (valid) {
           let resourceMenu = {
              menuName : this.menuForm.menuName,
              id : this.menuForm.id,
              menuDesc : this.menuForm.menuDesc
            }   
          updateInterface(resourceMenu).then(res => {
            if (res.data.code == 1) {
              this.$confirm("修改成功，是否返回列表", "提示", {
                  type: "success"
                }).then(() => {
                this.isMenu = false;
                this.dialogFormVisible = false;
                this.getLeftMenuTree();
                this.getMenuList();
                }).catch(() => {
                  this.$message.info("已取消");
                });
            } else {
              this.isMenu = false;
              this.$message.error(res.data.msg);

            }
          });
        }
      });
    },
    //删除某条数据
    handDel(row) {
      console.log(row);
      this.$confirm("该目录下存在数据集资源，如果删除则相应的数据集也将被删除，是否删除？", "提示", {
          type: "warning"
        }).then(() => {
        handDelInterface(row.menuId).then(res => {
          if (res.data.code != "1") {
            this.$message.error(res.data.msg);
          } else {
            this.$message.success("删除成功");
            this.getLeftMenuTree();
            this.getMenuList();
          }
        })
      });
    },
    resetTemp() {
      this.menuForm = {
        menuDesc: "",
        menuName: "",
        menuType: "",
        state: 1
      }
    },
    showMenuName(){
      this.isMenu = true;
    },
    showMenuDesc(){
      this.isMenu = true;
    },
    handleClose(done) {
      if(this.isMenu){      
        this.$confirm('编辑的内容可能没有保存，确定关闭?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$refs.menuForm.resetFields();
          this.dialogFormVisible = false;
          this.isMenu = false;
        })
      }else{
          this.$refs.menuForm.resetFields();
          this.dialogFormVisible = false;
      }

    },
    cancelClose(){
      this.isMenu = false;
      this.$refs.menuForm.resetFields();
      this.dialogFormVisible = false;
    },
    //目录状态
    getMenuState(row) {
      this.$confirm('此操作将改变目录的显示功能，确定调整?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let state;
        if (row.state == true) {
          state = 1;
        } else {
          state = 0;
        }
        let ss = {
          id : row.menuId,
          state : state
        }
        editMenuState(ss).then(res => {
          if (res.data.code ==1) {
            this.$message.success('调整成功！')
            this.getMenuList();
            this.getLeftMenuTree();
          } else {
            this.getMenuList();
            this.$message.error(res.data.msg);
          }
        });
      }).catch(() => {
        this.getMenuList();
        this.$message({
          type: 'info',
          message: '已取消操作'
        });          
      });
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
</style>
