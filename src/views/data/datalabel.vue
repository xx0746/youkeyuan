<template>
  <div>
    <div class="title">标签管理</div>
    <div style="float:left;width:99%;padding:2%;min-height: 500px;">
      <div style="position:relative;z-index:2;margin-bottom:20px">
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
      <el-dialog
        class="dialogTitle"
        :title="lableTitle"
        :visible.sync="dialogFormVisible"
        :before-close="handleClose"
        :close-on-click-modal="false">
        <el-form label-width="100px">
          <creat-tag :editState="lableTitle" :list="typeList" :formdata="labelForm" @add="addTagItem" @labelName="labelNameItem"></creat-tag>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button class="model-btn" size="small"  type="primary4" @click="cancelClose()">取消</el-button>
          <el-button class="model-btn" size="small"  style="margin-left:50px;" type="primary"  @click="newLabelForm()">提交</el-button>
        </span>
      </el-dialog>

      <!-- 标签列表 -->
      <div id="roc1" class="leftPart">
        <el-table
          :data="labelList"
          row-key="id"
          style="margin-top:10px;"
          border
          fit
          highlight-current-row
          :header-cell-style="{
          'background-color': '#f5f7fa',
          'color': 'rgb(103, 194, 58)',
            }">
          <el-table-column align="center"  width="60px" label="序号">
            <template slot-scope="scope">
              <span>{{scope.$index+1}}</span>
            </template>
          </el-table-column>

          <el-table-column  align="center" label="标签名称">
            <template slot-scope="scope">
              <span>{{scope.row.LABEL_NAME}}</span>
            </template>
          </el-table-column>

          <el-table-column width="160" align="center" label="所属分组">
            <template slot-scope="scope">
              <span>{{scope.row.TYPE_NAME}}</span>
            </template>
          </el-table-column>

          <el-table-column width="120" align="center" label="创建人">
            <template slot-scope="scope">
              <span>{{scope.row.CREATE_NAME}}</span>
            </template>
          </el-table-column>

          <el-table-column width="180" align="center" label="创建时间">
            <template slot-scope="scope">
              <span>{{scope.row.CREATE_TIME}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" width="140" fixed="right">
            <template slot-scope="scope">
              <div class="handle-col">
                <diy-btn styleType="icon" iconType="icon-edit"  @click="handUpdate(scope.row)">修改</diy-btn>
                <diy-btn styleType="icon" iconType="icon-del" @click="remove(scope.row)">删除</diy-btn>
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
      <!-- 新建分组页面弹窗 -->
      <el-dialog
        class="dialog2"
        :title="lableTypeTitle"
        :visible.sync="dialogFormVisible2"
        :before-close="groupDialogClose"
        width="64%"
        style="border-bottom:0"
        >
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
        <!--  标签分组列表 -->
        <el-table
          :data="newGroupList"
          row-key="id"
          style="margin-top:10px;"
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
          <el-table-column align="center" label="分组名称">
            <template slot-scope="scope">
              <div style="text-align:center;">{{scope.row.TYPE_NAME}}</div>
            </template>
          </el-table-column>
          <el-table-column width="120" align="center" label="创建人">
            <template slot-scope="scope">
              <span>{{scope.row.CREATE_NAME}}</span>
            </template>
          </el-table-column>
          <el-table-column width="160" align="center" label="创建时间">
            <template slot-scope="scope">
              <span>{{scope.row.CREATE_TIME}}</span>
            </template>
          </el-table-column>

          <el-table-column align="center" width="160" label="操作" class="label-show" fixed="right">
            <template slot-scope="scope">
              <div class="handle-col">
                <diy-btn styleType="icon" iconType="icon-edit"
                  @click="handUpdateType(scope.row)"
                >修改</diy-btn>
                <diy-btn styleType="icon" iconType="icon-del"               
                  @click="removeType(scope.row)"
                >删除</diy-btn>
                <diy-btn styleType="icon" iconType="icon-check"                  
                  @click="showLabel(scope.row)"
                >查看</diy-btn>
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
      <el-dialog class="dialogTitle" :before-close="groupDiaClose" :title="labelTypeTitle" :visible.sync="dialogFormVisible3">
        <dyn-input
          title="分组名称: "
          value="typeName"
          :namelist="newTagGroup"
          :dialogStatus="state2"
          @add="addItem"
          @del="delItem"
          @RowName="RowItem">
        </dyn-input>
        <span slot="footer" class="dialog-footer">
          <el-button class="model-btn" type="primary4" size="small" @click="groupClose()">取消</el-button>
          <el-button class="model-btn" type="primary" size="small" style="margin-left:50px;"  @click="creatNewGroupAdd()">提交</el-button>
        </span>
      </el-dialog>
      <!-- 展示标签内容弹窗 -->
      <el-dialog class="dialogTitle" title="该分组下所有标签" :visible.sync="dialogFormVisible4">
        <el-table
          border
          :data="labelFormData"
          style="width: 100%"
          :header-cell-style="{
            'background-color': '#f5f7fa',
            'color': 'rgb(103, 194, 58)',
            }"
          >
          <el-table-column
            type="index"
            label="序号"
            width="60px"
            >
          </el-table-column>
          <el-table-column
            prop="labelName"
            label="标签名称"
            >
          </el-table-column>
        </el-table>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import {
  getLeftTreeInterface,
  getlabelListInterface,
  typeListAllInterface,
  labelInsertInterface,
  typeListInterface,
  newGroupAddInterface,
  deleteLabelInterface,
  deleteLabelTypeInterface,
  updateLabelInterface,
  updateLabelTypeInterface,
} from "@/api/resource_list";
import {
  getlabelListAllData,
  getTagcontentData,
} from "@/api/manualupload";
import dynInput from '@/components/dynamic/dynInput'
import creatTag from '@/components/tagSelection/creatTag'
import { typeNamenbsp } from '@/utils/elValidate'
export default {
  components: {
    creatTag,
    dynInput
  },
  data() {
    return {
      menus: [],
      lableTypeTitle: "标签分组管理",
      value: "",
      options: "",
      tabPosition: "",
      total: null,
      total2: null,
      status: true,
      lableTitle: "添加标签",
      labelTypeTitle: "添加标签分组",
      labelFormData: [],
      // 弹窗为添加或者修改标志
      dialogStatus: "add",
      textMap: {
        update: "修改",
        create: "新增"
      },
      dialogFormVisible: false,
      menudialog: false,
      // 弹窗
      dialogFormVisible: false,
      dialogFormVisible2: false,
      dialogFormVisible3: false,
      dialogFormVisible4: false,
      initData: {
        limit: 10,
        pageNumber: 1,
        labelName: "",
        menuType: 1,
      },
      labelForm: [{
        labelName: "",
        labelTypeId: null
      }],
      state: "",
      state2: "add",
      listForm: {
        menuId: 1,
        state: 1
      },
      typeList: null,
      newGroupList: null,
      newGroupForm: {
        typeName: "",
        pageNumber: 1,
        limit: 10
      },
      newTagGroup: [{
        typeName: "",
      }],
      // 列表
      labelList: null,
      isLabelNameItem: false,
      isRowItem: false
    };
  },
  mounted() {
    this.getLabelList();
    this.getLeftTreeData();
  },
  filters: {
    getAchiWard(value) {
      var arr = ["获奖", "未获奖"];
      return arr[value - 1];
    }
  },
  methods: {
    handleSearch() {
      this.initData.limit = 10;
      this.initData.pageNumber = 1;
      this.getLabelList();
    },
    handleCurrentChange(val) {
      this.initData.pageNumber = val;
      this.getLabelList();
    },
    handleCurrentChange2(val) {
      this.newGroupForm.pageNumber = val;
      this.labelGroupClick();
    },
    getLabelList() {
      getlabelListInterface(this.initData).then(res => {
        if (res.data.code == 1) {
          this.labelList = res.data.data.rows;
          this.total = res.data.data.total;
        } else {
          return false;
        }
      });
    },
    // 点击创建标签
    creatLabel() {
      this.resetTemp();
      this.lableTitle = "添加标签";
      this.dialogFormVisible = true;
      this.handleGetListGroup();
    },
    addTagItem() {
      this.labelForm.push({
        labelName: "",
        labelTypeId: null
      })
      console.log(this.labelForm);
    },
    //点击新建标签弹窗的提交
    newLabelForm() {
      let verify = this.verify(this.labelForm);
      if(!verify) return this.$message.warning('请将表单填写完整再提交！');
      if (this.lableTitle == "添加标签") {
        // 有id 走新建
        labelInsertInterface(this.labelForm).then(res => {
          if (res.data.code == 1) {
            this.$confirm("添加成功，是否返回列表", "提示", {
              type: "success"
            })
            .then(() => {
              this.dialogFormVisible = false;
              this.isLabelNameItem = false;
              this.resetTemp();
              this.getLabelList();
            })
            .catch(() => {
              this.$message.info("已取消");
            });
          } else {
            this.isLabelNameItem = false;
            this.$message.error(res.data.msg);
            return false;
          }
        });
      } else {
        updateLabelInterface(this.labelForm[0]).then(res => {
          if (res.data.code == 1) {
            this.$confirm("修改成功，是否返回列表", "提示", {
              type: "success"
            })
            .then(() => {
              this.dialogFormVisible = false;
              this.isLabelNameItem = false;
              this.resetTemp();
              this.getLabelList();
            })
            .catch(() => {
              this.$message.info("已取消");
            });
          } else {
            this.isLabelNameItem = false;
            this.$message.error(res.data.msg);
            return false;
          }
        });
      }
    },
    // 删除标签
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
            this.$message.error(res.data.msg);
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
    labelNameItem(data){
      this.isLabelNameItem = data;
    },
    //标签弹框关闭按钮
    handleClose(){
      if(this.isLabelNameItem){
        this.$confirm('编辑的内容可能没有保存，确定关闭?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.dialogFormVisible = false;
          this.isLabelNameItem = false;
        })
      }else{
          this.dialogFormVisible = false;
      }
      console.log(this.isLabelNameItem)
    },
    cancelClose(){
      this.isLabelNameItem = false;
      this.dialogFormVisible = false;
    },
    // 点击修改标签按钮
    handUpdate(row) {
      this.handleGetListGroup();
      this.labelForm = [{
        id: row.ID,
        labelName: row.LABEL_NAME,
        labelTypeId: row.LABEL_TYPE_ID
      }]
      this.lableTitle = "修改标签";
      this.dialogFormVisible = true;
    },
    // 删除标签分组
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
              this.$message.error(res.data.msg);
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
    RowItem(data){
      this.isRowItem =data
    },
    //分组弹框的关闭
    groupDiaClose() {
      if(this.isRowItem){
        this.$confirm('编辑的内容可能没有保存，确定关闭?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.dialogFormVisible3 = false;
          this.isRowItem = false;
          this.newTagGroup = [{
            typeName: ""
          }];
        })
      }else{
        this.dialogFormVisible3 = false
        this.newTagGroup = [{
          typeName: ""
        }];
      }
    },
    groupClose(){
      this.isRowItem = false;
      this.dialogFormVisible3 = false
      this.newTagGroup = [{
        typeName: ""
      }];
    },
    // 新建标签组单元回调
    addItem() {
      this.newTagGroup.push({
        typeName: ""
      });
    },
    // 删除标签组单元回调
    delItem(index, arr) {
      this.$confirm("是否删除", "提示", {
        distinguishCancelAndClose: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
      .then(() => {
        this.newTagGroup.splice(index, 1);
        this.$message.success("删除成功");
      })
      .catch(() => {
        this.$message.info("已取消删除");
      });
    },
    // 获取所属分组列表
    handleGetListGroup() {
      let menuIds = {
        menuIds: this.listForm.menuId,
        state: 1,
      };
      typeListAllInterface(menuIds).then(res => {
        this.typeList = res.data.data;
      });
    },

    // 点击分组管理查询
    handleSearchGroupTag() {
      this.newGroupForm.pageNumber = 1;
      this.newGroupForm.limit = 10;
      this.labelGroupClick();
    },
    //点击标签分组管理
    labelGroupClick(val) {
      if(val) {
        this.newGroupForm.pageNumber = 1;
      }
      this.dialogFormVisible2 = true;
      typeListInterface(this.newGroupForm).then(res => {
        if (res.data.code == 1) {
          this.newGroupList = res.data.data.rows;
          this.total2 = res.data.data.total;
          // if(this.newGroupList.length === 0){
          //   let val = 1;
          //   this.labelGroupClick(val)
          // }
        }
        console.log(this.newGroupList);
      });
    },
    // 点击新建分组按钮
    creatNewGroup() {
      this.state2 = 'add';
      this.dialogFormVisible3 = true;
    },
    // 点击标签查看
    showLabel(val) {
      console.log(val);
      let data = {labelTypeId: val.ID, menuId: val.MENU_ID}
      getTagcontentData(data).then(res => {
        console.log(res);
        if(res.data.code == 1) {
          this.labelFormData = res.data.data;
          console.log(this.labelFormData)
        } else {
          this.$$message.warning(res.data.msg);
        }
      })
      this.dialogFormVisible4 = true;
    },
    // 新建分组提交
    creatNewGroupAdd() {
      let verify = this.verify(this.newTagGroup);
      if(!verify) return this.$message.warning('请将表单填写完整再提交！');
      if (this.state2 == 'add') {
        newGroupAddInterface(this.newTagGroup).then(res => {
          if (res.data.code == 1) {
            this.$confirm("添加成功，是否返回列表", "提示", {
              type: "success"
            })
            .then(() => {
              this.dialogFormVisible3 = false;
              this.isRowItem = false;
              this.resetTemp();
              this.labelGroupClick();
            })
            .catch(() => {
              this.$message.info("已取消");
            });
          } else {
            this.isRowItem = false;
            this.$message.error(res.data.msg);
            return false;
          }
        });
      } else {
        updateLabelTypeInterface(this.newTagGroup[0]).then(res => {
          if (res.data.code == 1) {
            this.$confirm("修改成功，是否返回列表", "提示", {
              type: "success"
            })
              .then(() => {
                this.isRowItem = false;
                this.dialogFormVisible3 = false;
                this.resetTemp();
                this.labelGroupClick();
              })
              .catch(() => {
                this.$message.info("已取消");
              });
          } else {
            this.isRowItem = false;
            this.$message.error(res.data.msg);
            return false;
          }
        });
      }
    },
    // 点击修改标签按钮
    handUpdateType(row) {
      this.labelTypeTitle = "修改标签分组";
      this.state2 = 'edit';
      this.newTagGroup = [{
        id: row.ID,
        typeName: row.TYPE_NAME
      }]
      this.$nextTick(() => {
        this.dialogFormVisible3 = true;
      });
    },
    // 获取标签
    getLeftTreeData() {
      getlabelListAllData().then(res => {

      });
    },
    // 分组弹窗关闭
    groupDialogClose() {
      this.newGroupForm.typeName = "";
      this.dialogFormVisible2 = false;
    },
    // 新建表单校验
    verify(arr) {
      let temp = true;
      if(arr.length == 0) return temp = false;
      arr.forEach(item => {
        console.log(item);
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
    // 格式化数据
    resetTemp() {
      this.labelForm = [{}];
      this.newTagGroup = [{}]
    },
  }
};
</script>
<style scoped>

.label-show .el-button--primary.is-plain {
  border: 1px solid #409EFF;
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
.dialog2 .el-dialog__header {
  border-bottom: 0;
}
</style>

