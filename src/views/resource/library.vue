<template>
  <div>
    <div class="title">资源管理</div>
    <div style="margin-top:20px;margin-left:20px;margin-bottom:20px;float:left;width:20%">
      <menu-tree
        ref="menuTree"
        @nodeClick="handleNodeClick"
        @listenToChildEvent="showMsgfromChild"
        :menuType="menuType"
        :resourceCountType="resourceCountType"
        menuClass="title3"
        :isNum="true"
        :isRed="false"
        :currentNode="currentId"
      ></menu-tree>
    </div>

    <div style="margin-top:20px;margin-left:2%;float:left;width:74%">
      <div style="position:relative;z-index:2;margin-bottom:20px">
        <el-input
          v-model="libraryForm.searchName"
          placeholder="请输入题目"
          style="width:200px;margin-right:10px;"
        ></el-input>
        <el-select v-model="searchValue" clearable placeholder="请选择上传部门">
          <el-option
            v-for="item in searchOrgList"
            :key="item.ORGID"
            :label="item.ORGNAME"
            :value="item.ORGID"
          ></el-option>
        </el-select>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="small"
          @click="getLibraryList(17)"
          style="margin-left:10px"
        >查询</el-button>
        <el-button
          type="primary"
          icon="el-icon-share"
          size="small"
          @click="exportResourceList(17)"
          style="margin-left:10px"
        >导出</el-button>
      </div>

      <!--论文-->
      <div id="roc1">
        <el-table
          :data="libraryList"
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

          <el-table-column align="center" label="题目">
            <template slot-scope="scope">
              <div>{{scope.row.TITLE}}</div>
            </template>
          </el-table-column>

          <el-table-column width="200" align="center" label="创建时间">
            <template slot-scope="scope">
              <span>{{scope.row.CREATETIME}}</span>
            </template>
          </el-table-column>

          <el-table-column width="200" align="center" label="上传部门">
            <template slot-scope="scope">
              <span>{{scope.row.ORGNAME}}</span>
            </template>
          </el-table-column>

          <el-table-column align="center" width="180" label="操作" fixed="right">
            <template slot-scope="scope">
              <div style="text-align: center;">
                <diy-btn styleType="icon" iconType="icon-download" @click="download(scope.row,2)"></diy-btn>
                <diy-btn styleType="icon" iconType="icon-edit" @click="resetForm(scope.row)"></diy-btn>
                <diy-btn styleType="icon" iconType="icon-del" @click="remove(scope.row)"></diy-btn>
                <diy-btn styleType="icon" iconType="icon-list" @click="showFilesList(scope.row)"></diy-btn>
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
          :current-page="libraryForm.pageNumber"
          @current-change="handleCurrentChange"
          layout="total,  prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
      <!-- 资源编辑弹窗 -->
      <el-dialog
        title="资源修改"
        :visible.sync="dialogVisible"
        width="60%"
        :before-close="handleClose"
        :close-on-click-modal="false"
      >
        <div v-if="reset">
          <!-- <resetre-upload :datas="datapage"  @getfileInfo="fileInfo"></resetre-upload> -->
          <info-adit
            ref="info"
            :datas="datapage"
            @aditFile="showFiles"
            @onPreview="review"
            @complete="aditComplete"
          ></info-adit>
        </div>
      </el-dialog>
      <!-- 预览 -->
      <el-dialog class="dialogTitle el-preview" title="文件预览" :visible.sync="isShow">
        <div class="pdf-cont" style="width: 860px;" v-if="isShowPdf">
          <pdf-preview
            :title="fileName"
            :dataFlow="dataFlow"
            style="width: 860px; height: 100%; margin-top: -10px; overflow: hidden;"
          ></pdf-preview>
        </div>
      </el-dialog>
      <!-- 文件列表展示弹窗 -->
      <el-dialog title="文件列表" :visible.sync="dialogTableVisible">
        <div style="margin-top: -20px;">
          <file-list
            v-show="passPreviewFiles.length !== 0"
            title="文件列表"
            :name="uploadName"
            :data="passPreviewFiles"
            @onPreview="review"
            class="file-list"
          ></file-list>
        </div>
        <div v-show="passPreviewFiles.length == 0">此条数据没有文件</div>
      </el-dialog>
      <!-- 单文件维护弹窗 -->
      <el-dialog
        title="文件维护"
        :visible.sync="dialogFileList"
        :before-close="handlefileClose"
        class="el-filedilog"
      >
        <div v-if="fileReset">
          <adit-files
            ref="aditFiles"
            :treeData="treeData"
            :fileList="fileList"
            :expandData="datapage"
            @onPreview="review"
            @complete="fileAditComplete"
          ></adit-files>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import { Loading } from "element-ui";
import {
  getLeftTreeInterface,
  getLibraryListInterface,
  resourceRemove,
  fileMoreDownLoad,
  getreSourceFiles,
} from "@/api/resource_list";
import { getCommentFileMenu, getPreviewBase64 } from "@/api/comment";
import { downloadFile } from "@/utils/utile";
import { debounce } from "@/utils/Debounce";
import resetreUpload from "@/components/resetUpload/resetreUpload";
import infoAdit from "@/components/resetUpload/infoAdit";
import aditFiles from "@/components/resetUpload/aditFiles";
import pdfPreview from "@/components/pdfPreview/PdfPreview";
import fileList from "@/components/fileList/fileList";
import menuTree from "@/components/menuTree/menuTree";
import $ from "jquery";
import { getAffOrgInterface, exportResource } from "@/api/list";
export default {
  components: {
    infoAdit,
    resetreUpload,
    pdfPreview,
    fileList,
    aditFiles,
    menuTree,
  },
  data() {
    return {
      // 预览
      dataFlow: "",
      fileName: "",
      isShow: false,
      isShowPdf: false,
      value: "",
      options: "",
      tabPosition: "",
      dataTree: [],
      defaultProps: {
        children: "children",
        label: "label",
      },
      fileList: [],
      uploadName: "",
      // 资源库数据初始化
      libraryList: [],
      libraryForm: {
        menuId: null,
        limit: 10,
        pageNumber: 1,
        searchName: "",
        orgId: "",
      },
      fileDownList: {
        menuId: null,
        fileId: "",
        flag: "",
      },
      total: null,
      // 上传重新提交
      datapage: {},
      dialogVisible: false,
      dialogTableVisible: false,
      passPreviewFiles: [],
      reset: false,
      fileReset: false,
      // 文件维护
      dialogFileList: false,
      treeData: {
        treeList: [],
        count: 0,
        menuId: null,
      },
      menuType: 1,
      currentId: "",
      resourceCountType: 1,
      searchValue: "",
      searchOrgList: [],
      exportParams: [],
    };
  },
  mounted() {
    //this.getLeftTree();
    this.getOrgList();
  },
  filters: {
    getState(value) {
      var arr = ["审核通过", "审核驳回", "部门审核通过", "部门审核驳回"];
      return arr[value - 2];
    },
    getAchiWard(value) {
      var arr = ["获奖", "未获奖"];
      return arr[value - 1];
    },
    getType(value) {
      var arr = ["专利", "软件著作权"];
      return arr[value - 1];
    },
    getMainType(value, value1) {
      let arr = ["发明专利", "外观专利", "实用新型"];
      if (value1 == 2 || value1 == "") {
        return "";
      } else {
        return arr[value - 1];
      }
    },
  },
  computed: {
    isShowDialog() {
      return this.$store.state.isShowDialog;
    },
  },
  watch: {
    isShowDialog(newval, oldval) {
      if (newval == 1) {
        this.reset = false;
        this.dialogVisible = false;
        this.getLibraryList();
      }
    },
    dataFlow(val) {
      if (val) {
        this.isShowPdf = false;
        this.$nextTick((_) => {
          this.isShowPdf = true;
        });
      }
    },
  },
  methods: {
    exportResourceList() {
      // this.$alert('<select style="" class="el-select" id="confimId"><option>当前目录资源</option><option>全部资源</option> </select>',
      //  '导出选项', {
      //   dangerouslyUseHTMLString: true,
      //   showCancelButton:true,
      //   center:true
      // });
      const h = this.$createElement;
      this.$msgbox({
        title: "消息",
        message: h("p", { style: "text-align: center;" }, [
          h(
            "select",
            {
              attrs: { id: "confimId" },
              style:
                "height: 40px;border-radius: 7px;border-color:#c4c9d0;width: 40%;padding:0px 10px;",
            },
            [
              h("option", { attrs: { value: 1 } }, "当前目录资源"),
              h("option", { attrs: { value: 2 } }, "全部资源"),
            ]
          ),
        ]),
        showCancelButton: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        beforeClose: (action, instance, done) => {
          if (action === "confirm") {
            this.exportParams = {
              type: $("#confimId").val(),
              dataThree: this.libraryForm.menuId,
            };
            done();
          } else {
            done();
          }
        },
      }).then((action) => {
        // exportResource(this.exportParams).then((res) => {
        this.downloadFileA();

        // });
      });
    },
    downloadFileA() {
      let url =
        "http://132.10.10.42:8765/yzyjy/export/resource?type=" +
        this.exportParams.type +
        "&dataThree=" +
        this.exportParams.dataThree;
      let link = document.createElement("a");
      link.style.display = "none";
      link.href = url;
      document.body.appendChild(link);
      link.click();
    },
    // 展示文件列表
    showFilesList(row) {
      (this.passPreviewFiles = []), (this.dialogTableVisible = true);
      console.log(row);
      this.uploadName = row.USERNAME;
      let param = {
        menuId: row.DATATHREE,
        resourceId: row.ID,
        type: 2,
      };
      getreSourceFiles(param).then((res) => {
        if (res.data.code == 1) {
          this.passPreviewFiles = res.data.data;
        } else {
          this.$message.warning(res.data.msg);
        }
      });
    },
    showFiles(data, fileList, menuId) {
      // 文件树获取
      this.fileReset = true;
      this.fileList = fileList;
      let param = {
        menuId: data.value,
        fileId: data.resourceId,
        type: 1,
      };
      getCommentFileMenu(param).then((res) => {
        console.log(res);
        if (res.data.code == 1) {
          this.treeData.treeList = res.data.data.fileLists;
          this.treeData.count = res.data.data.count;
          this.treeData.menuId = menuId;
          this.dialogFileList = true;
        } else {
          this.$message.warning(res.data.msg);
        }
      });
    },
    // 修改编辑弹窗关闭回调
    handleClose(done) {
      let isAitInfo = this.$refs.info.isAditInfo();
      if (isAitInfo) {
        this.$confirm("编辑的内容可能没有保存，确定关闭?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }).then(() => {
          this.dialogVisible = false;
          this.reset = false;
          this.$refs.info.isAdit = false;
          this.$refs.info.isChangeMenu = false;
        });
      } else {
        this.dialogVisible = false;
        this.reset = false;
      }
    },
    // 单文件编辑弹窗关闭回调
    handlefileClose() {
      let isSave = this.$refs.aditFiles.isAudit();
      if (!isSave) {
        this.$confirm("修改的内容可能没有保存，确定关闭?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }).then(() => {
          this.dialogFileList = false;
          this.fileReset = false;
          this.$refs.aditFiles.isSave = true;
        });
      } else {
        this.dialogFileList = false;
        this.fileReset = false;
      }
    },
    handleCurrentChange(val) {
      this.libraryForm.pageNumber = val;
      this.getLibraryList();
    },
    // 点击左边树形菜单
    handleNodeClick(data) {
      this.libraryForm.pageNumber = 1;
      this.libraryForm.menuId = data.menuId;
      this.libraryForm.searchName = "";
      this.fileDownList.menuId = data.menuId;
      this.currentId = data.menuId;
      debounce(() => {
        this.getLibraryList();
      }, 1000);
    },
    showMsgfromChild(menuId) {
      this.libraryForm.menuId = menuId;
      this.fileDownList.menuId = menuId;
      this.getLibraryList();
    },
    // 获取资源数据列表
    getLibraryList(val) {
      if (val) {
        this.libraryForm.pageNumber = 1;
        this.libraryForm.orgId = this.searchValue;
      }
      console.log(this.libraryForm);
      getLibraryListInterface(this.libraryForm).then((res) => {
        if (res.data.code == 1) {
          let libraryList = res.data.data.rows;
          this.$nextTick((_) => {
            this.libraryList = libraryList;
          });
          this.total = res.data.data.total;
        } else {
          this.$message({
            type: "warning",
            message: res.data.msg,
          });
        }
      });
    },
    // 下载
    download(row, num) {
      console.log(row, num);
      this.fileDownList.fileId = row.ID;
      this.fileDownList.flag = num;
      let fileIds = `${row.DATATHREE}-${this.fileDownList.fileId}`;
      let page = 0;
      let type = 2;
      let params = { fileIds, page, type };
      console.log(params);
      fileMoreDownLoad(params).then((res) => {
        console.log(res);
        if (res.data.code == 4) {
          for (let i = 0; i < res.data.data.length; i++) {
            downloadFile(res.data.data[i]);
          }
        } else {
          this.$message({
            type: "info",
            message: res.data.msg,
          });
        }
      });
    },
    // 重新修改按钮
    resetForm(row) {
      this.reset = true;
      this.dialogVisible = true;
      this.datapage = {
        menuId: this.libraryForm.menuId,
        resourceId: row.ID,
        type: 2,
        value: row.DATATHREE,
      };
    },
    // 记录编辑完成回调
    aditComplete(val) {
      if (val) {
        this.reset = false;
        this.dialogVisible = false;
        this.getLibraryList();
        this.$refs.menuTree.getLeftTree();
      } else {
        this.reset = false;
        this.dialogVisible = false;
      }
    },
    // 文件编辑完成回调
    fileAditComplete(val) {},
    remove(row) {
      console.log(row);
      var _this = this;
      _this
        .$confirm("是否删除", "提示", {
          type: "warning",
        })
        .then(function () {
          resourceRemove(row.DATATHREE, row.ID).then((res) => {
            if (res.data.code == "1") {
              _this.$message.success("删除成功");
              _this.libraryForm.menuId = _this.currentId;
              console.log(_this.libraryForm);
              _this.$refs.menuTree.getLeftTree();
            } else {
              _this.$message.error(res.data.msg);
            }
          });
        })
        .catch(() => {
          _this.$message.info("已取消删除");
        });
    },
    // 点击预览
    review(row) {
      console.log(row);
      this.fileName = row.fileName;
      // 后端只可转化这些doc,docx,xls,xlsx,ppt,pptx,txt,pdf
      let value = row.fileName.toLocaleLowerCase();
      let fileType = /\.(doc|docx|xls|xlsx|csv|ppt|pptx|pdf|txt|tif|tiff|db|zip|rar|psd|wps|et|ett|jpg|png)(\?.*)?$/.test(
        value
      );
      if (!fileType) {
        let fileExtension = row.fileName.substring(
          row.fileName.lastIndexOf(".") + 1
        );
        return this.$message.warning(
          `以.${fileExtension}结尾的文件类型不支持预览`
        );
      }
      let loadingInstance = Loading.service({
        text: "正在努力加载中...",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      let file = {
        fileUrl: row.fileUrl,
      };
      getPreviewBase64(file).then((resrc) => {
        if (resrc.data.code == 1) {
          this.dataFlow = resrc.data.data;
          this.isShow = true;
        } else {
          this.$message.warning(resrc.data.msg);
        }
        this.$nextTick(() => {
          // 以服务的方式调用的 Loading 需要异步关闭
          loadingInstance.close();
        });
      });
    },
    // 递归设置数字
    setCountNumber(arr, name) {
      arr.forEach((item) => {
        if (item.resourceCount != null) {
          item[name] = `${item[name]}(${item.resourceCount})`;
        }
        if (item.children != null) {
          this.setCountNumber(item.children, name);
        }
      });
    },
    // 组织结构初始化
    getOrgList() {
      getAffOrgInterface().then((res) => {
        console.log(res);
        this.orgList = res.data.data;
        this.searchOrgList = JSON.parse(JSON.stringify(res.data.data));
        // this.orgList.forEach(item => {
        //   item.children = item.list;
        // })
      });
    },
  },
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

.el-checkbox__input.is-checked .el-checkbox__inner,
.el-checkbox__input.is-indeterminate .el-checkbox__inner {
  background-color: #409eff;
  border-color: #409eff;
}
.leftPart {
  display: none;
}
#roc17 {
  display: block;
}
</style>
