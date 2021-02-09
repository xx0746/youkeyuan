<template>
  <div>
    <div class="title">资源目录管理</div>
    <div style="margin:20px 0 20px 20px; float:left;width:20%">
      <menu-tree ref="menuTree" :currentNode="currentId" menuClass="title3" @nodeClick="handleNodeClick" :menuType="menuType" :resourceCountType="resourceCountType" :isNum="false" :isRed="false"></menu-tree>
    </div>
    <div style="margin-top:20px;margin-bottom: 20px; margin-left:2%;float:left;width:74%;border-top: 1px solid #fff;">
      <el-button type="primary" size="small" @click="add()">添加目录</el-button>
      <el-button type="primary" size="small" @click="resetTable()">返回主目录</el-button>
      <!-- <el-button type="primary" size="small" @click="setMenuOrder()">修改目录顺序</el-button> -->
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
          v-if="reset"
          ref="menuForm"
          :model="menuForm"
          label-width="100px"
          :rules="menuRules"
        >
          <el-form-item label="上级目录：">
            <el-cascader
              :disabled = "meuDisabled"
              v-model="libraryName"
              :options="dialogTreeData"
              change-on-select
              @change="handleChange"
              >
            </el-cascader>
          </el-form-item>
          <el-form-item label="目录名称：" prop="menuName">
            <el-input v-model.trim="menuForm.menuName" @change="showMenuName"></el-input>
          </el-form-item>
          <el-form-item label="目录描述：">
            <el-input type="textarea" v-model.trim="menuForm.menuDesc" @change="showMenuDesc"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button
            @click="cancelClose"
            size="small"
            type="primary4"
          >取消</el-button>
          <el-button
            v-if="dialogStatus=='create'"
            type="primary"
            size="small"
            style="margin-left:50px;"
            :disabled="subDisabled"
            @click="addmenuForm()"
          >提交</el-button>
          <el-button v-else type="primary" size="small" :disabled="subDisabled" style="margin-left:50px;" @click="updateData">保存</el-button>
        </span>
      </el-dialog>
      <!-- 修改目录顺序 -->
      <el-dialog :visible.sync="menudialog" title="修改目录顺序">
        <el-tree
        :data="treeData"
        :props="defaultProps"
        node-key="menuId"
        :default-expanded-keys="[defaultExpend]"
        ref="treeMenu"
        draggable
        :allow-drop="allowDrop"
        @node-drop="handleDrop"
        empty-text="正在加载中"
      ></el-tree>
      </el-dialog>
      <!-- 维护属性弹框 -->
      <el-dialog 
        :title="menuName+'目录属性列表'" 
        :visible.sync="dialogTableVisible" 
        :before-close="handleCloseProperty" 
        :close-on-click-modal="false"
        >
        <div style="margin-bottom:20px;"><el-button type="primary" size="small" icon="el-icon-plus" @click="addProperty">新增属性</el-button></div>
        <el-table :data="menuPropertyListShow" :header-cell-style="{
            'background-color': '#f5f7fa',
            'color': 'rgb(103, 194, 58)',
            }">
          <el-table-column label="序号" type="index"></el-table-column>
          <el-table-column label="属性名称" property="columnName"></el-table-column>
          <el-table-column widt="100" label="状态" property="state">
            <template slot-scope="scope">
              <el-switch
                size="small"
                v-model="scope.row.state"
                active-color="#009A52"
                inactive-color="#DCDFE6"
                @change="getPropertyState(scope.row)"
              ></el-switch>
            </template>
          </el-table-column>
          <el-table-column property="columnComment" label="操作" fixed="right">
            <template slot-scope="scope">
              <div>
                <diy-btn
                  styleType="icon" iconType="icon-edit"
                  @click="editProperty(scope.row)"
                ></diy-btn>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>
      <!-- 添加和修改属性弹框 -->
      <el-dialog
        class="dialogTitle"
        :title="menuName+propertyMap[dialogStatus]"
        :visible.sync="dialogFormVisible2"
        :before-close="handleCloseEdit"
        :close-on-click-modal="false"
        >
        <div class="block">
          <div class="block_left">属性名称: </div>
          <div class="block_right" v-for="(item,index) in propertyNameList" :key="index">
            <div class="rightInput">
              <el-input v-model.trim="item.columnName" @change="showPropertyName" ></el-input>
            </div>
            <div class="rightIcon">
              <i
              v-if="dialogStatus=='add'&& index != 0 "
              class="el-icon-close"
              @click="deleteProperty(index)"
              ></i>
            </div>   
          </div>
        </div>
        <div v-if="dialogStatus=='add'"><el-button type="primary" size="small" icon="el-icon-plus" style="margin-left:10%;" @click="addRowName">添加</el-button></div>
        <span slot="footer" class="dialog-footer">
          <el-button class="model-btn" type="primary4" size="small" @click="CloseEdit">取消</el-button>
          <el-button v-if="dialogStatus=='edit'" type="primary"  size="small" @click="editPropertySubmit()">保存</el-button>
          <el-button v-if="dialogStatus=='add'" type="primary" size="small" @click="addPropertySubmit()">提交</el-button>
        </span>
      </el-dialog>
      <!-- 展示列表 -->
      <el-table
        :data="menuList"
        row-key="value"
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
        <el-table-column align="center" label="目录名称">
          <template slot-scope="scope">
            <div style="text-align:center;">{{scope.row.menuName}}</div>
          </template>
        </el-table-column>
        <el-table-column width="200" align="center" label="目录描述">
          <template slot-scope="scope">
            <span>{{scope.row.menuDesc}}</span>
          </template>
        </el-table-column>
        <el-table-column width="120" align="center"  label="上级目录名称">
          <template slot-scope="scope">
            <span>{{scope.row.pidName}}</span>
          </template>
        </el-table-column>

        <el-table-column width="120" align="center" label="状态">
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
        <el-table-column align="center" width="120" label="操作" fixed="right">
          <template slot-scope="scope">
          <div style="text-align:center">
            <diy-btn
              styleType="icon" iconType="icon-edit"
              @click="handUpdate(scope.row)">修改</diy-btn>
            <diy-btn
              styleType="icon" iconType="icon-edit_prop"
              :disabled="stateDisabled" 
              v-if="scope.row.menuPid == 15" 
              @click="setProperty(scope.row)">维护属性</diy-btn>
          </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
  import { getMenuidArr } from "@/api/search";
  import {
    addMenuInterface,
    getMenuInterface,
    handUpdateInterface,
    updateInterface,
    handDelInterface,
    getLeftTreeInterface,
    propertyNameList,
    addPropertyName,
    editPropertyName,
    editPropertyState,
    editMenuState,
    deleteMenuState,
    getSingleResource
  } from "@/api/resource_list";
  import menuTree from "@/components/menuTree/menuTree";
  import { debounce } from '@/utils/Debounce'
  export default {
    components: { menuTree },
    data() {
      return {
        meuDisabled: false,
        stateDisabled:false,
        reset: false,
        me_data: [],
        libraryName: [15],
        treeData: [],
        treeIsShow: true,
        dialogTreeData: [],
        childrenData:[],
        defaultProps: {
          children: "children",
          label: "label"
        },
        listQuery: {
          pageNumber: 1,
          title: "",
          limit: 10,
          menuPid: 15,
          menuName: ""
        },
        // 弹窗为添加或者修改标志
        dialogStatus: "",
        textMap: {
          update: "修改",
          create: "新增"
        },
        dialogFormVisible: false,
        menudialog: false,
        // 角色初始化
        menuForm: {
          menuDesc: "",
          menuName: "",
          menuPid: "",
          menuType: "0",
          state: 1
        },
        state: true,
        subDisabled: false,
        menuList: [],
        menuRules: {
          menuName: [
            { required: true, message: "请输入目录名称", trigger: "blur" }
          ]
        },
        defaultExpend: 15,
        menuName:'',
        propertyMap:{
          edit: "属性修改",
          add: "属性创建"
        },
        dialogFormVisible2: false,
        dialogTableVisible:false,
        //属性列表
        propertyNameList:[],
        //属性列表
        menuPropertyListShow:[],
        menuId:'',
        menuPid: 15,
        resourceMenuColumn:{
          columnName:'',
          id:'',
        },
        menuType:1,
        resourceCountType:1,
        currentId: '',
        isMenu: false,
        isPropertyName: false
      };
    },
    created: function() {},
    mounted() {
      this.getMenuList();
      this.getLeftMenuTree();
    },
    methods: {
      // 获取左侧菜单
      getLeftMenuTree() {
        let s = {
          menuType : 1,
          resourceCountType : 1
        }
        getLeftTreeInterface(s).then(res => {
          this.childrenData = res.data.data;
          this.dialogTreeData = [{
            label: "知识专区",
            menuId:15,
            menuPid:15,
            value:15,
            children:this.childrenData
          }]
        });
      },
      // 点击左边树形菜单
      handleNodeClick(data) {
        this.menuPid = data.menuId;
        this.menuForm.menuPid = data.menuId;
        this.listQuery.menuPid = data.menuId;
        this.currentId = data.menuId;
        // this.me_data = data;
        // console.log(this.me_data)
        // console.log(this.me_data.prentIDs)
        debounce(() => {
          this.getMenuList();
        }, 300);
      },
      handleCurrentChange(val) {
        this.listQuery.pageNumber = val;
        this.getMenuList();
      },
      handleChange(value){
        this.menuForm.menuPid=value[value.length-1]
        this.isMenu = true;
      },
      resetTemp() {
        this.menuForm = {
          menuDesc: "",
          menuName: "",
          menuType: "",
          menuPid: this.menuForm.menuPid,
          state: 1
        };
      },
      // 点击添加目录按钮
      add() {
        this.getLeftMenuTree();
        this.subDisabled = false;
        this.meuDisabled = false;
        this.reset = true;
        this.resetTemp();
        this.dialogStatus = "create";
        this.dialogFormVisible = true;
        this.libraryName = [];
      },
      //检测是否编辑过输入框
      showMenuName(){
        this.isMenu = true;
      },
      showMenuDesc(){
        this.isMenu = true;
      },
      showPropertyName(){
        this.isPropertyName = true;
      },
      handleClose(done) {
        if(this.isMenu){
          this.$confirm('编辑的内容可能没有保存，确定关闭?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.dialogFormVisible = false;
            this.libraryName = [15];
            this.reset = false;
            this.isMenu = false;
          })
        }else{
            this.dialogFormVisible = false;
            this.libraryName = [15];
            this.reset = false;
        }
      },
      cancelClose(){
        this.dialogFormVisible = false;
        this.libraryName = [15];
        this.reset = false;
        this.isMenu = false;
      },
      // 获取所有数据
      resetTable() {
        this.showTree = false;
        this._clear();
        this.listQuery.menuPid = 15;
        this.menuPid = 15;
        this.defaultExpend = 15;
        //this.getLeftMenuTree();
        this.getMenuList();
        this.currentId = 15;
        this.$refs.menuTree.getLeftTree();
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
                  this.subDisabled = true;
                  this.dialogFormVisible = false;
                  this.listLoading = false;
                  this.isMenu = false;
                  this.getMenuList();
                  this.$refs.menuTree.getLeftTree();
                }).catch(() => {
                  this.$message.info("已取消");
                  this.subDisabled = false;
                });
              } else {
                this.isMenu = false;
                this.listLoading = false;
                this.subDisabled = false;
                this.$message.error(res.data.msg);
                return false;
              }
            });
          } else {
            return false;
          }
        });
      },
      //修改目录
      updateData() {
        var _this = this;
        _this.$refs.menuForm.validate(valid => {
          if (valid) {
            let resourceMenu = {
              menuName : _this.menuForm.menuName,
              id : _this.menuForm.id,
              menuDesc : _this.menuForm.menuDesc
            }    
            updateInterface(resourceMenu).then(function(res) {
              if (res.data.code == 1) {
                _this
                  .$confirm("修改成功，是否返回列表", "提示", {
                    type: "success"
                  })
                  .then(function() {
                    _this.dialogFormVisible = false;
                    _this.subDisabled = true;
                    _this.isMenu = false;
                    _this.getMenuList();
                    _this.$refs.menuTree.getLeftTree();
                  })
                  .catch(function() {
                    _this.$message.info("已取消");
                    _this.subDisabled = false;
                  });
              } else {
                _this.isMenu = false;
                _this.subDisabled = false;
                _this.$message.error(res.data.msg);
                return false;
              }
            });
          } else {
            return false;
          }
        });
      },
      // 获取目录列表
      getMenuList() {
        getMenuInterface(this.listQuery).then(res => {
          if (res.data.code == 1) {
            this.menuList = res.data.data;
            console.log(this.menuList);
            if (this.menuList && this.menuList.length > 0) {
              this.menuList.forEach(item => {
                if(item.state == 1){
                  item.state = true;
                }else{
                  item.state = false;
                }
                delete item.children;
              });
            }
            this._clear();
          }
        });
      },
      // 设置目录顺序
      setMenuOrder() {
        this.menudialog = true;
      },
      allowDrop(moveNode,inNode,type){
        if(moveNode.level==1||inNode.level==1){

        }
        if(moveNode.level==2&&inNode.level==2){
          if(moveNode.parent.id == inNode.parent.id){
              return type == 'prev';
          }else{
              //二级分类父级不同不做拖拽
          }
        }
      },
      handleDrop(moveNode,inNode,type) {
        console.log(moveNode, inNode, type);
      },
      // 编辑
      handUpdate(obj) {
        console.log(obj)
        if(obj.menuPid != 15) {
          this.getMenuidArr(obj.menuPid)
        }
        this.getLeftMenuTree();
        this.subDisabled = false;
        this.meuDisabled = true;
        this.reset = true;
        this.dialogStatus = "update";
        this.dialogFormVisible = true;
        this.$nextTick(() => {
          this.menuForm.menuName = obj.menuName;
          this.menuForm.id = obj.menuId;
          this.menuForm.menuType = obj.menuType;
          this.menuForm.state = obj.state;
          this.menuForm.menuPid = obj.menuPid;
          this.menuForm.menuDesc = obj.menuDesc;
          this.listQuery.menuPid = obj.menuPid;
        })
      },
      getMenuidArr(menuPid){
        getMenuidArr(menuPid).then(res => {
          if(res.data.code == 1){
            let arr = res.data.data.menuArray;
            let arrA = arr.split(',').map(item => {
              return Number(item);
            })
            arrA.unshift(15);
            console.log(arrA);
            this.libraryName = arrA;
            console.log(this.libraryName)
          }
        });
      },
      //目录状态
      getMenuState(row){
        this.menuForm.menuPid = this.menuPid;
        this.listQuery.menuPid = this.menuPid;
        this.$confirm('此操作将对目录的状态进行调整,是否确定?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let state;
          if (row.state == true) {
            state = 1;
          } else if(row.state == false){
            state = 0;
          }
          let ss = {
            id : row.menuId,
            state : state
          }
          editMenuState(ss).then(res => {
            if (res.data.code ==1) {
              this.$message.success('调整成功！');
              this.$refs.menuTree.getLeftTree();
            } else {
              this.$message.error(res.data.msg);
            }
            this.getMenuList();
          });
        }).catch(() => {
          this.getMenuList();
          this.$message({
            type: 'info',
            message: '已取消操作'
          });          
        });
      },
      //维护属性
      setProperty(row){
        let state = row.state;
        if(state){
          this.menuName = row.menuName
          this.menuId = row.menuId
          this.dialogTableVisible = true;
          this.showPropertyNameList()
        }else{
          this.$message.warning("未启用目录，不能维护属性!")
        }

      },
      //属性名称列表展示
      showPropertyNameList(){
        propertyNameList(this.menuId).then(res => {
          if (res.data.code == 1) {
              this.menuPropertyListShow = res.data.data;
              this.menuPropertyListShow.forEach(item => {
                if(item.state == 1){
                  item.state = true
                }else{
                  item.state = false;
                }
              });
             
            }else{
              this.$message.error(res.data.msg);
            }
        });
      },
      //关闭属性列表
      handleCloseProperty() {
        this.dialogTableVisible = false;
      },
      //编辑属性
      editProperty(row){
        let state;
        if(row.state == true){
          state = 1
        }else{
          state = 0
        }
        if(row.state){
          this.resourceMenuColumn.id = row.id;
          this.dialogFormVisible2 = true;
          this.dialogStatus = "edit"
          let name={
            columnName: row.columnName,
          }
          this.propertyNameList.push(name)
        }else{
          this.$message.warning("状态已停用,请先开启状态!")
        }

      },
      //关闭属性编辑/添加弹框
      handleCloseEdit(){
        console.log(this.isPropertyName)
        if(this.isPropertyName){
          this.$confirm('编辑的内容可能没有保存，确定关闭?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.dialogFormVisible2 = false;
            this.propertyNameList = [];
            this.isPropertyName = false;
          })
        }else{
            this.dialogFormVisible2 = false;
            this.propertyNameList = [];
        }
      },
      CloseEdit(){
        this.dialogFormVisible2 = false;
        this.propertyNameList = [];
        this.isPropertyName = false;
      },
      //新增属性
      addProperty(){
        this.dialogFormVisible2 = true;
        this.dialogStatus = "add";
        this.addRowName();
      },
      //添加属性名称
      addRowName(){
        let name={
          columnName:''
        }
        this.propertyNameList.push(name)
      },
      //删除属性名称
      deleteProperty(index){
        this.$confirm("是否删除", "提示", {
          distinguishCancelAndClose: true,
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          this.propertyNameList.splice(index,1)
          this.$message.success("删除成功");
        })
        .catch(() => {
          this.$message.info("已取消删除");
        });
      },
      //修改属性名称提交按钮
      editPropertySubmit(){
        this.resourceMenuColumn.columnName = this.propertyNameList[0].columnName;
        let ss = {
          resourceMenuColumn:this.resourceMenuColumn
        }
        editPropertyName(ss).then(res => {
          if (res.data.code ==1) {
            this.dialogFormVisible2 = false;
            this.showPropertyNameList()
            this.$message.success("修改成功");
            this.propertyNameList = [];
            this.isPropertyName = false;
          } else {
            this.isPropertyName = false;
            this.$message.error(res.data.msg);
          }
        });
      },
      //添加属性名称提交按钮
      addPropertySubmit(){
        let verify = this.verify(this.propertyNameList);
        if(!verify) return this.$message.warning('请将表单填写完整再提交！');
        let ss = {
          id:this.menuId,
          list:this.propertyNameList
        }
        addPropertyName(ss).then(res => {
          if (res.data.code ==1) {
            this.dialogFormVisible2 = false;
            this.showPropertyNameList()
            this.$message.success("添加成功");
            this.propertyNameList = [];
            this.isPropertyName = false;
          } else {
            this.isPropertyName = false;
            this.$message.error(res.data.msg);
          }
        });
      },
      //属性状态
      getPropertyState(row){
        this.$confirm('此操作将对目录的状态进行调整,是否确定?', '提示', {
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
            id : row.id,
            state : state
          }
          editPropertyState(ss).then(res => {
            if (res.data.code == 1) {
              this.$message.success('调整成功！');
            } else {
              this.$message.error(res.data.msg);
            }
            this.showPropertyNameList()
          });
        }).catch(() => {
          this.showPropertyNameList()
          this.$message({
            type: 'info',
            message: '已取消调整'
          });          
        });
        
      },
      // 新建表单校验
      verify(arr) {
        let temp = true;
        if(arr.length == 0) return temp = false;
        arr.forEach(item => {
          if(JSON.stringify(item) == '{}') {
            temp = false
          } else {
            for(let key in item) {
              if(item[key] == "" || item[key] == null) {
                temp = false
              }
            }
          }
        });
        return temp;
      },
      _clear() {
        this.listQuery = {
          pageNumber: 1,
          title: "",
          limit: 10,
          menuPid: this.menuPid,
          menuName: ""
        }
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
  .block{
    overflow: hidden;
  }
  .block_left{
    float:left;
    width:10%;
    line-height:32px;
  }
  .block_right{
    float:right;
    width:90%;
    margin-bottom: 20px;
    overflow: hidden;
  }
  .block_right .rightInput {
    width: 90%;
    float: left;
  }
  .block_right .rightIcon {
    width: 10%;
    float: left;
    text-align: right;
    margin-top: 7px;
  }
  .block_right .el-icon-close {
    cursor: pointer;
    font-size: 20px;
  }
  .block_right  .el-icon-close:hover {
    color: red;
    font-size: 20px;
  }
  .model-btn {
    margin-right: 50px;
  }
  #dialogTitle .el-dialog__body{
    padding: 30px 30px 0 !important;
  }
</style>
