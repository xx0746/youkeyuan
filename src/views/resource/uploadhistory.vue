<template>
  <div>
    <div class="title">上传记录</div>
    <div style="margin-top:20px;margin-left:20px;margin-bottom:20px;float:left;width:20%">
      <menu-tree
        @nodeClick="handleNodeClick"
        menuClass="title3"
        @listenToChildEvent="showMsgfromChild"
        :menuType="menuType"
        :resourceCountType="resourceCountType"
        :isNum="true"
        :isRed="false"
      ></menu-tree>
    </div>
    <div style="margin-top:20px;margin-left:2%;float:left;width:74%;height:100%">
      <div
        style="position:relative;z-index:2;display: flex;align-items: center; margin-bottom: 20px;"
      >
        <el-select
          v-model="selectState"
          placeholder="请选择状态"
          @change="getUpLoadHistoryState(selectState)"
        >
          <el-option
            v-for="item in shState"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="small"
          @click="getUploadHistoryList('查询')"
          style="margin-left:10px"
        >查询</el-button>
      </div>
      <el-table
        :data="uploadHistoryList"
        row-key="id"
        border
        fit
        highlight-current-row
        :header-cell-style="{
        'background-color': '#f5f7fa',
        'color': 'rgb(103, 194, 58)',
          }"
      >
        <el-table-column align="center" label="序号" width="60px">
          <template slot-scope="scope">
            <span>{{scope.$index+1}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="名称">
          <template slot-scope="scope">
            <div>{{scope.row.TITLE}}</div>
          </template>
        </el-table-column>
        <el-table-column align="center" width="180" label="上传时间">
          <template slot-scope="scope">
            <span>{{scope.row.CREATETIME}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" width="100" label="上传人">
          <template slot-scope="scope">
            <span>{{scope.row.USERNAME}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" width="110" label="状态">
          <template slot-scope="scope">
            <span>{{scope.row.STATE | getState}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" width="210" label="操作" fixed="right">
          <template slot-scope="scope">
            <div class="handle-col">
              <diy-btn styleType="icon" iconType="icon-download" @click="download(scope.row,2)"></diy-btn>
              <diy-btn
                styleType="icon"
                iconType="icon-return"
                @click="withdraw(scope.row)"
                v-show="scope.row.STATE==6 ||scope.row.STATE==1"
              ></diy-btn>
              <diy-btn
                styleType="icon"
                iconType="icon-unpass_reason"
                @click="seeReason(scope.row)"
                v-show="scope.row.STATE==3||scope.row.STATE==5"
              ></diy-btn>
              <diy-btn
                styleType="icon"
                iconType="icon-edit"
                @click="resetForm(scope.row)"
                v-show="scope.row.STATE ==3 || scope.row.STATE ==5 || scope.row.STATE ==7"
              ></diy-btn>
              <diy-btn styleType="icon" iconType="icon-list" @click="showFilesList(scope.row)"></diy-btn>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <el-row style="display:none">
        <el-button type="primary">批量通过</el-button>
        <el-button type="danger">批量驳回</el-button>
      </el-row>
      <!--分页-->
      <div class="block">
        <el-pagination
          style="text-align: center"
          :page-size="10"
          :current-page="uploadHistoryForm.pageNumber"
          @current-change="handleCurrentChange"
          layout="total,  prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
      <!-- 上传修改弹窗 -->
      <el-dialog
        title="上传修改"
        :visible.sync="dialogVisible"
        width="60%"
        :before-close="handleClose"
        :close-on-click-modal="false"
      >
        <div v-if="reset">
          <new-reset-upload
            ref="newReset"
            :datas="datapage"
            @getfileInfo="fileInfo"
            @showHistoryInterface="uploadShowHistory"
            @showUploadFile="showUpload"
          ></new-reset-upload>
        </div>
      </el-dialog>
      <!-- 预览 -->
      <el-dialog class="dialogTitle el-preview" title="文件预览" :visible.sync="isShow">
        <div class="pdf-cont" style="width: 860px;" v-if="isShowPdf">
          <pdf-preview
            :title="fileName"
            :dataFlow="src"
            style="width: 860px; height: 100%; margin-top: -10px; overflow: hidden;"
          ></pdf-preview>
        </div>
      </el-dialog>
      <!-- 文件列表展示弹窗 -->
      <el-dialog title="文件列表" :visible.sync="dialogTableVisible">
        <div style="margin-top: -20px;">
          <file-list
            v-show="passPreviewFiles.length !== 0"
            title="通过文件列表"
            :data="passPreviewFiles"
            @onPreview="review"
            class="file-list"
          ></file-list>
          <file-list
            v-show="unpassPreviewFiles.length !== 0"
            title="驳回文件列表"
            :data="unpassPreviewFiles"
            @onPreview="review"
            class="file-list"
          ></file-list>
          <!-- :title="filesList == 1?'待审核文件列表':'撤回文件列表'" -->
          <file-list
            v-show="waitPreviewFiles.length !== 0"
            :title="filesList == 1?'已有文件列表':'已有文件列表'"
            :data="waitPreviewFiles"
            @onPreview="review"
            class="file-list"
          ></file-list>
        </div>
        <div
          v-show="passPreviewFiles.length == 0 && unpassPreviewFiles.length == 0 && waitPreviewFiles.length == 0"
        >此条数据没有文件</div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import {
  getUploadHistoryInterface,
  rejectInterface,
  fileMoreUpDownLoad,
  withdrawPost,
  getPreviewFiles,
} from "@/api/resource_list";
import { getPreviewBase64 } from "@/api/comment";
import { getOrgListInterface } from "@/api/list";
import { downloadFile } from "@/utils/utile";
import resetUpload from "@/components/resetUpload/resetUpload";
import newResetUpload from "@/components/resetUpload/newResetUpload";
import fileList from "@/components/fileList/fileList";
import pdfPreview from "@/components/pdfPreview/PdfPreview";
import menuTree from "@/components/menuTree/menuTree";
import { Loading } from "element-ui";
import { debounce } from "@/utils/Debounce";
export default {
  components: { newResetUpload, fileList, pdfPreview, menuTree },
  data() {
    return {
      reset: true,
      datapage: [],
      tabPosition: "",
      //  树形菜单默认属性设置
      defaultProps: {
        children: "children",
        label: "label",
        disabled: "disabled",
      },
      total: null,
      // 待审核数据初始化
      uploadHistoryList: [],
      uploadHistoryForm: {
        menuId: "",
        limit: 10,
        pageNumber: 1,
        state: 0,
        basicId: "",
      },
      selectState: "",
      shState: [
        { value: "1", label: "待审核" },
        { value: "2", label: "审核通过" },
        { value: "3", label: "驳回" },
        { value: "0", label: "全部" },
      ],
      orgList: [],
      fileDownList: {
        menuId: 17,
        fileId: "",
        flag: "",
      },
      loginId: window.sessionStorage.getItem("loginId"),
      dialogVisible: false,
      dialogTableVisible: false,
      filesList: 1,
      passPreviewFiles: [],
      unpassPreviewFiles: [],
      waitPreviewFiles: [],
      // 预览
      src: "",
      fileName: "",
      isShow: false,
      isShowPdf: false,
      timer: null,
      menuId: "",
      currentId: "",
      menuType: 1,
      resourceCountType: 3,
      isflag: "",
    };
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
      }
    },
    src(val) {
      if (val) {
        this.isShowPdf = false;
        this.$nextTick((_) => {
          this.isShowPdf = true;
        });
      }
    },
  },
  mounted() {
    this.loginId = window.sessionStorage.getItem("loginId");
  },
  filters: {
    getFileState(value1, value2) {
      var arr = [
        "全部通过",
        "全部驳回",
        "部分通过",
        "部分驳回",
        "待审核",
        "已撤回",
      ];
      if (value1 == 0 && value2 == 1) {
        return arr[4];
      }
      if (value1 == 0 && value2 == 2) {
        return arr[0];
      }
      if (value1 == 0 && value2 == 3) {
        return arr[1];
      }
      if (value1 == 0 && value2 == 4) {
        return arr[0];
      }
      if (value1 == 0 && value2 == 5) {
        return arr[1];
      }
      if (value2 == 7) {
        return arr[5];
      }
      if (value2 == 6) {
        return arr[4];
      }
      if (value1 == 1) {
        return arr[2];
      }
      if (value1 == 2) {
        return arr[3];
      }
      if (value1 == 3) {
        return arr[1];
      }
    },
    getState(value) {
      var arr = [
        "已删除",
        "待审核",
        "审核通过",
        "审核驳回",
        "部门审核通过",
        "部门审核驳回",
        "待审核",
        "已撤回",
      ];
      return arr[value];
    },
    getAchiWard(value) {
      var arr = ["获奖", "未获奖"];
      return arr[value - 1];
    },
  },
  methods: {
    handleClose(done) {
      let isAditInfo = this.$refs.newReset.isAditInfo();
      console.log(isAditInfo.isUpload);
      console.log(isAditInfo);
      if (isAditInfo.isAudit) {
        if (isAditInfo.isUpload) {
          this.$message.warning("正在提交资源,不能关闭该界面!");
        } else {
          this.$confirm("编辑的内容可能没有保存，确定关闭?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }).then(() => {
            this.dialogVisible = false;
            this.reset = false;
            this.$refs.newReset.flag.isAudit = false;
            this.$refs.newReset.flag = {
              isAudit: false,
              isUpload: false,
            };
          });
        }
      } else {
        this.dialogVisible = false;
        this.reset = false;
      }
    },
    // 展示文件列表
    showFilesList(row) {
      //console.log(row);
      this.passPreviewFiles = [];
      this.unpassPreviewFiles = [];
      this.waitPreviewFiles = [];
      let state = row.STATE;
      let param = {
        resourceId: row.ID,
        type: 1,
        state: row.state,
      };
      getPreviewFiles(param).then((res) => {
        if (res.data.code == 1) {
          this.dialogTableVisible = true;
          let arr = res.data.data;
          console.log(state);
          if (state == 6 || state == 1 || state == 7) {
            if (state == 7 || state == 6) {
              if (state == 6) {
                this.filesList = 1;
              } else {
                this.filesList = 0;
              }
              this.waitPreviewFiles = arr.filter((item) => {
                return item.state == 1;
              });
            } else {
              this.filesList = 1;
              this.waitPreviewFiles = arr.filter((item) => {
                return item.state == 1;
              });
              // this.waitPreviewFiles = arr;
            }
          } else {
            arr.forEach((item) => {
              if (item.state == 1) {
                this.passPreviewFiles.push(item);
              }
              if (item.state == -1) {
                this.unpassPreviewFiles.push(item);
              }
            });
          }
        } else {
          this.$message.warning(res.data.msg);
        }
      });
    },
    fileInfo(file) {
      this.review(file);
    },
    // 点击预览
    review(row) {
      this.fileName = row.fileName;
      let file = {
        fileUrl: row.fileUrl,
      };
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
      getPreviewBase64(file).then((resrc) => {
        if (resrc.data.code == 1) {
          this.src = resrc.data.data;
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
    // 撤回
    withdraw(row) {
      let ss = {
        menuId: row.DATATHREE,
        id: row.ID,
      };
      this.$confirm("此操作将执行撤回操作, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          withdrawPost(ss).then((res) => {
            if (res.data.code == 1) {
              this.$message.success("撤回成功!");
              this.getUploadHistoryList();
            } else {
              this.$message.error(res.data.msg);
              return false;
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消撤回",
          });
        });
    },
    getOrgList() {
      getOrgListInterface().then((res) => {
        var arr = [];
        // $.each(res.data.data,function(index,value){
        //    arr.push(value.ORGNAME);
        // })
      });
    },
    handleCurrentChange(val) {
      this.selectState = this.uploadHistoryForm.state.toString();
      console.log(this.selectState);
      this.uploadHistoryForm.pageNumber = val;
      this.getUploadHistoryList();
    },
    getUpLoadHistoryState(state) {
      // this.uploadHistoryForm.state = Number(state);
    },
    // 点击左边树形菜单
    handleNodeClick(data) {
      this.selectState = "";
      this.uploadHistoryForm.state = "";
      this.uploadHistoryForm.pageNumber = 1;
      this.uploadHistoryForm.menuId = data.menuId;
      this.fileDownList.menuId = data.menuId;
      this.currentId = data.menuId;
      debounce(() => {
        this.getUploadHistoryList();
      }, 1000);
    },
    // 获取上传记录
    getUploadHistoryList(type) {
      // this.uploadHistoryList = [];
      if (type && type == "查询") {
        this.uploadHistoryForm.state = Number(this.selectState);
        this.uploadHistoryForm.pageNumber = 1;
      }
      this.uploadHistoryList.menuId = this.menuId;
      getUploadHistoryInterface(this.uploadHistoryForm).then((res) => {
        if (res.data.code == 1) {
          this.uploadHistoryList = res.data.data.rows;
          this.total = res.data.data.total;
        } else {
          return false;
        }
      });
    },
    //查看驳回原因
    seeReason(row) {
      console.log(row);
      let ss = {
        basicId: row.ID,
      };
      rejectInterface(ss).then((res) => {
        if (res.data.code == 1) {
          this.$alert(res.data.msg, "驳回原因", {});
        } else {
          return false;
        }
      });
    },
    // 上传修改重新提交表单
    resetForm(row) {
      console.log(row);
      this.reset = true;
      this.dialogVisible = true;
      this.$store.commit("setDialog", 0);
      this.datapage = {
        menuId: this.uploadHistoryForm.menuId,
        resourceId: row.ID,
        type: 1,
        value: row.DATATHREE,
      };
    },
    // 下载
    download(row, num) {
      console.log(row, num);
      // this.fileDownList.fileId = row.ID;
      // this.fileDownList.flag = num;
      // let fileIds = `${row.DATATHREE}-${this.fileDownList.fileId}`;
      // let page = 0;
      // let type = 1;
      // let params = { fileIds, page, type };
      // console.log(params);
      let params = {
        resourceId: row.ID,
      };
      fileMoreUpDownLoad(params).then((res) => {
        if (res.data.code == 1) {
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
    showMsgfromChild(menuId) {
      this.menuId = menuId;
      this.uploadHistoryForm.menuId = menuId;
      this.fileDownList.menuId = menuId;
      this.getUploadHistoryList();
    },
    uploadShowHistory() {
      this.getUploadHistoryList();
    },
    showUpload(data) {
      this.isflag = data;
      console.log(this.isflag);
    },
  },
};
</script>
<style scoped lang="scss">
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

.file-list {
  margin-top: 10px;
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
</style>
