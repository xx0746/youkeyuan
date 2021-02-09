<template>
  <div>
    <div class="title">数据入库审核</div>
    <div style="margin-top:20px;margin-left:20px;margin-bottom:20px;float:left;width:20%">
      <!-- <div class="title2">数据目录</div>
      <el-tree
        :data="dataTree"
        :props="defaultProps"
        @node-click="handleNodeClick"
        :render-content="treeRender"
        class="trr"
        accordion
        ref="treeBox"
        node-key="value"
        :default-expanded-keys="[0]"
        highlight-current
        empty-text="正在加载中"
      ></el-tree>-->
      <menu-tree
        ref="menuTree"
        menuClass="title2"
        :currentNode="currentId"
        @nodeClick="handleNodeClick"
        @listenToChildEvent="showMsgfromChild"
        :menuType="menuType"
        :resourceCountType="resourceCountType"
        :isNum="true"
        :isRed="true"
      ></menu-tree>
    </div>

    <div style="margin-top:20px;margin-left:2%;float:left;width:74%">
      <div style="border-bottom: 2px solid #c4c9d0">
        <el-button class="audit_btn" @click="auditWait" :class="{'nowStyle':auditWaitStyle}">
          待审核 (
          <span>{{total1}}</span>)
        </el-button>
        <el-button class="audit_btn" @click="auditSucc" :class="{'nowStyle':auditSuccStyle}">
          审核通过
          <span>({{total2}})</span>
        </el-button>
        <el-button class="audit_btn" @click="auditLog" :class="{'nowStyle':auditLogStyle}">
          审核记录
          <span>({{total3}})</span>
        </el-button>
      </div>
      <div>
        <el-table
          width="100%"
          v-loading="loading"
          :data="auditList"
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

          <el-table-column align="center" label="数据集名" prop="COLLECTNAME"></el-table-column>

          <el-table-column width="150" align="center" label="文件名" prop="FILENAME"></el-table-column>

          <el-table-column width="100" align="center" label="状态" v-if="stateIsShow==1">
            <template slot-scope="scope">
              <span>{{scope.row.STATE | getState}}</span>
            </template>
          </el-table-column>

          <el-table-column align="center" width="140" label="下载是否需要审核" v-if="stateIsShow!= 1">
            <template slot-scope="scope">
              <span>{{scope.row.AUDITSTATE | getDataOne}}</span>
              <el-button
                type="primary5"
                @click="AuditDataOne(scope.row)"
                size="mini"
                v-if="isRoleName"
              >调整</el-button>
            </template>
          </el-table-column>

          <el-table-column align="center" width="160" label="操作" fixed="right">
            <template slot-scope="scope">
              <div class="handle-col">
                <diy-btn styleType="icon" iconType="icon-download" @click="isDownLoad(scope.row)"></diy-btn>
                <diy-btn
                  styleType="icon"
                  iconType="icon-list"
                  @click="showFilelist(scope.row)"
                  v-if="stateIsShow==0"
                ></diy-btn>
                <diy-btn
                  styleType="icon"
                  iconType="icon-pass"
                  @click="pass(scope.row)"
                  v-if="stateIsShow==0"
                ></diy-btn>
                <diy-btn
                  styleType="icon"
                  iconType="icon-unpass"
                  @click="unpass(scope.row)"
                  v-if="stateIsShow==0"
                ></diy-btn>
                <diy-btn
                  styleType="icon"
                  iconType="icon-check_reason"
                  @click="seeReason(scope.row)"
                  v-if="stateIsShow==1&&scope.row.STATE==3"
                ></diy-btn>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-row style="display:none">
        <el-button type="primary">批量通过</el-button>
        <el-button type="danger">批量驳回</el-button>
      </el-row>
      <!--分页-->
      <div class="block">
        <el-pagination
          style="text-align: center"
          :page-size="10"
          :current-page="auditForm.pageNumber"
          @current-change="handleCurrentChange"
          layout="total,prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
    </div>
    <!-- 预览 -->
    <el-dialog class="dialogTitle el-preview" title="文件预览" :visible.sync="isShowFiles">
      <div class="pdf-cont" style="width: 860px;">
        <file-list
          v-show="fileList.length !== 0"
          title="通过文件列表"
          :data="fileList"
          @onPreview="handPreview"
          class="file-list"
        ></file-list>
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
  </div>
</template>
<script>
import { Loading } from "element-ui";
import {
  getLeftTreeInterface,
  dataAuditTableList,
  setAuditInterface,
  dataAuditAdjustDown,
  rejectInterface,
} from "@/api/dataAudit";
import { getCommentPreview } from "@/api/comment";
import { downloadFile } from "@/utils/utile";
import menuTree from "@/components/menuTree/menuTree";
import fileList from "@/components/fileList/fileList";
import pdfPreview from "@/components/pdfPreview/PdfPreview";
import { debounce } from "@/utils/Debounce";
import { getPreviewBase64 } from "@/api/comment";
export default {
  components: {
    menuTree,
    pdfPreview,
    fileList,
  },
  data() {
    return {
      showPdfSrc: false,
      loading: true,
      total1: "",
      total2: "",
      total3: "",
      artic: {
        flag: 2,
        menuId: 1,
        fileId: "",
        ZYK: "暂无数据",
        CREATETIME: "暂无数据",
        idx: 0,
        id: null,
        fileState: 0,
      },
      tabPosition: "",
      //  树形菜单默认属性设置
      defaultProps: {
        children: "children",
        label: "label",
        // label:function(data){
        //   return data.label +  '(  待审核:'+data.menuId+')';
        // }
      },
      total: null,
      dataTree: [],
      // 待审核数据初始化
      auditList: [],
      auditForm: {
        menuId: null,
        menuPid: 16,
        fileId: "",
        listType: 1,
        dataType: null,
        ids: "",
        rejectReason: "",
        searchName: "",
        limit: 10,
        pageNumber: 1,
        basicId: "",
        state: "1",
      },
      // 预览相关数据
      src: "",
      showPdf: false,
      // 状态是否展示
      stateIsShow: 0,
      isRoleName: false,
      auditWaitStyle: true,
      auditLogStyle: false,
      auditSuccStyle: false,
      fileDownList: {
        menuId: 1,
        fileId: "",
        flag: "",
      },
      menuType: 2,
      resourceCountType: 2,
      currentId: "",
      // 预览
      dataFlow: "",
      fileName: "",
      isShow: false,
      isShowPdf: false,
      fileList: [],
      isShowFiles: false,
    };
  },
  watch: {
    dataFlow(val) {
      if (val) {
        this.isShowPdf = false;
        this.$nextTick((_) => {
          this.isShowPdf = true;
        });
      }
    },
  },
  filters: {
    patentType(value) {
      var arr = ["专利", "软件著作权"];
      return arr[value - 1];
    },
    patentMainType(value) {
      var arr = ["发明专利", "外观专利", "实用新型"];
      return arr[value - 1];
    },
    getState(value) {
      var arr = ["导入失败", "待审核", "审核通过", "审核驳回"];
      return arr[value];
    },
    getDataOne(value) {
      // console.log(value);
      if (typeof value === "undefined") {
        value = 2;
      }
      var arr = ["需要", "不需要"];
      return arr[value - 1];
    },
    getAchiWard(value) {
      var arr = ["获奖", "未获奖"];
      return arr[value - 1];
    },
  },
  mounted() {
    //this.getLeftTree();
  },
  created: function () {},
  methods: {
    // 点击左边树形菜单
    handleNodeClick(data) {
      this.auditList = [];
      this.auditWaitStyle = true;
      this.auditLogStyle = false;
      this.auditSuccStyle = false;
      this.auditForm.pageNumber = 1;
      this.auditForm.menuId = data.menuId;
      this.auditForm.dataType = data.menuId;
      this.fileDownList.menuId = data.menuId;
      this.artic.menuId = data.menuId;
      this.stateIsShow = "0";
      this.currentId = data.menuId;
      debounce(() => {
        this.list(1, true).then((res) => {
          this.list(1, false).then((res) => {
            this.list(2, false).then((res) => {
              this.list(3, false);
            });
          });
        });
      }, 500);
    },
    showMsgfromChild(menuId, menuValue) {
      this.auditForm.menuId = menuId;
      this.auditForm.dataType = menuId;
      this.list(1, true).then((res) => {
        this.list(1, false).then((res) => {
          this.list(2, false).then((res) => {
            this.list(3, false);
          });
        });
      });
    },
    review(val) {
      this.artic.id = val.id;
      if (this.stateIsShow != "2") {
        this.artic.fileState = 0;
      } else {
        this.artic.fileState = 1;
      }
      console.log(this.artic);
      getCommentPreview(this.artic).then((res) => {
        console.log(res.data);
        if (res.data.code == 1) {
          this.src = res.data.data;
          this.showPdfSrc = true;

          let fileName = this.src.lastIndexOf("."); //取到文件名开始到最后一个点的长度
          let fileNameLength = this.src.length; //取到文件名长度
          let fileFormat = this.src.substring(fileName + 1, fileNameLength); //后缀名
          // 后端只可转化这些doc,docx,xls,xlsx,ppt,pptx,txt,pdf
          fileFormat = fileFormat.replace(/<[^>]+>/g, "");
          let fileType = /\.(doc|docx|xls|xlsx|csv|ppt|pptx|pdf|txt|tif|tiff|db|zip|rar|psd|wps|et|ett|jpg|png)(\?.*)?$/.test(
            fileFormat
          );
          if (!fileType) {
            return this.$message.warning(
              `以.${fileFormat}结尾的文件类型不支持预览`
            );
          } else {
            this.showPdf = true;
          }
        } else {
          this.$message.warning(res.data.msg);
        }
      });
    },
    //查看驳回原因
    seeReason(row) {
      if (row.REJECTREASON) {
        this.$alert(`${row.REJECTREASON}`, "驳回原因：", {
          confirmButtonText: "确定",
        });
      }
    },
    handleCurrentChange(val) {
      this.auditForm.pageNumber = val;
      if (this.stateIsShow == "0") {
        this.list(1, true);
      } else if (this.stateIsShow == "1") {
        this.list(3, true); //审核记录
      } else {
        this.list(2, true); //审核通过
      }
    },
    // treeRender(h, { node, data, store }) {
    //   return (
    //     <span class="custom-tree-node">
    //       <span>{node.label}</span>
    //       (<span style="color: #ff7c7c;">{data.resourceCount}</span>)
    //     </span>);
    // },
    // 调整下载审核状态
    AuditDataOne(row) {
      let auditState = row.AUDITSTATE;
      if (typeof auditState === "undefined") {
        auditState = "2";
      }
      let s = 0;
      let a = "";
      console.log(auditState);
      if (auditState == 2) {
        s = 1;
        a = "调整为下载需要审核";
      } else {
        s = 2;
        a = "调整为下载不需要审核";
      }
      let aa;
      if (this.stateIsShow == "0") {
        aa = 1;
      } else {
        aa = 2;
      }
      let sb = {
        dataType: this.auditForm.menuId,
        collectId: row.ID,
        state: s,
      };
      this.$confirm(a, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          dataAuditAdjustDown(sb).then((res) => {
            if (res.data.code == 1) {
              this.$message({
                type: "success",
                message: "调整成功!",
              });
              this.stateIsShow == "0" ? this.list(1, true) : this.list(2, true);
            } else {
              this.$message.error(res.data.msg);
              return false;
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消调整",
          });
        });
    },

    list(value, data) {
      // 第一个参数为请求的第几个   第二个参数为状态 1.true为列表赋值  2.false为获取总条数
      // 待审核;
      return new Promise((resolve, reject) => {
        if (value == 1) {
          this.auditForm.state = 1;
          dataAuditTableList(this.auditForm).then((res) => {
            console.log(res.data.data.rows);
            if (res.data.code != 1) {
              return this.$message.warning(res.data.msg);
            } else {
              if (data) {
                this.loading = false;
                this.auditList = res.data.data.rows;
                this.total = res.data.data.total;
                return resolve(true);
                console.log(this.loading);
              } else {
                this.total1 = res.data.data.total;
                return resolve(true);
              }
              this.loading = false;
            }
          });
        } else if (value == 2) {
          //审核通过
          this.auditForm.state = 2;
          dataAuditTableList(this.auditForm).then((res) => {
            console.log(res);
            if (res.data.code == 1) {
              let roleName = window.sessionStorage.getItem("roleName");
              if (roleName === "数据审核员" || roleName === "部门数据审核员") {
                this.isRoleName = true;
              } else {
                this.isRoleName = false;
              }
              if (data) {
                this.auditList = res.data.data.rows;
                this.total = res.data.data.total;
                this.loading = false;
                return resolve(true);
              } else {
                this.total2 = res.data.data.total;
                return resolve(true);
              }
            }
          });
        } else {
          //审核记录
          this.auditForm.state = 4;
          dataAuditTableList(this.auditForm).then((res) => {
            if (res.data.code == 1) {
              if (data) {
                this.auditList = res.data.data.rows;
                this.loading = false;
                this.total = res.data.data.total;
                return resolve(true);
              } else {
                this.total3 = res.data.data.total;
                return resolve(true);
              }
            }
          });
        }
      });
    },
    // 获取待审核数据
    getAuditList() {
      dataAuditTableList(this.auditForm).then((res) => {
        console.log(res);
        if (res.data.code != 1) {
          return this.$message.warning(res.data.msg);
        }
        this.auditList = res.data.data.rows;
        this.total = res.data.data.total;
        this.total1 = res.data.data.total;
      });
    },
    // 通过
    pass(row) {
      this.auditForm.collectId = row.ID;
      this.auditForm.state = 2;
      this.$confirm("此操作将执行通过操作, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.loading = true;
          setAuditInterface(this.auditForm).then((res) => {
            console.log(res);
            if (res.data.code == 1) {
              this.$message({
                type: "success",
                message: "通过!",
              });
              this.$refs.menuTree.getLeftTree();
            } else {
              this.$message.error(res.data.msg);
              return false;
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消通过",
          });
        });
    },
    // 驳回
    unpass(row) {
      this.auditForm.collectId = row.ID;
      this.auditForm.state = 3;
      this.$prompt("请输入驳回原因：", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputPattern: /\S{5,100}/,
        inputErrorMessage: "驳回原因不能少于5个字！",
      })
        .then(({ value }) => {
          this.loading = true;
          this.auditForm.rejectReason = value;
          let param = {
            dataType: this.auditForm.dataType,
            collectId: this.auditForm.collectId,
            state: this.auditForm.state,
            rejectReason: this.auditForm.rejectReason,
          };
          setAuditInterface(param).then((res) => {
            console.log(res.data.code);
            if (res.data.code == 1) {
              this.$message({
                type: "success",
                message: "已提交驳回原因",
              });
              this.$refs.menuTree.getLeftTree();
            } else {
              this.$message.error(res.data.msg);
              return false;
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消输入",
          });
        });
    },
    // 点击待审核按钮
    auditWait() {
      this.auditList = [];
      this.stateIsShow = "0";
      this.auditForm.pageNumber = 1;
      this.list(1, true);
      this.auditWaitStyle = true;
      this.auditLogStyle = false;
      this.auditSuccStyle = false;
    },
    // 点击审核记录按钮
    auditLog() {
      this.auditList = [];
      this.stateIsShow = "1";
      console.log(this.stateIsShow);
      this.auditForm.pageNumber = 1;
      this.list(3, true);
      this.auditWaitStyle = false;
      this.auditLogStyle = true;
      this.auditSuccStyle = false;
    },
    // 点击审核通过按钮
    auditSucc() {
      this.auditList = [];
      this.stateIsShow = "2";
      this.auditForm.pageNumber = 1;
      console.log(this.stateIsShow);
      this.list(2, true);
      this.auditWaitStyle = false;
      this.auditLogStyle = false;
      this.auditSuccStyle = true;
    },
    //审核通过列表
    getLibraryList() {
      this.auditForm.state = 2;
      console.log(this.auditForm);
      dataAuditTableList(this.auditForm).then((res) => {
        console.log(res);
        if (res.data.code == 1) {
          let roleName = window.sessionStorage.getItem("roleName");
          console.log(roleName);
          if (roleName === "数据审核员" || roleName === "部门数据审核员") {
            this.isRoleName = true;
          } else {
            this.isRoleName = false;
          }
          this.auditList = res.data.data.rows;
          this.total = res.data.data.total;
          this.total2 = res.data.data.total;
        }
      });
    },
    // 审核记录
    getAuditLogList() {
      this.auditForm.state = 3;
      dataAuditTableList(this.auditForm).then((res) => {
        this.auditList = res.data.data.rows;
        this.total = res.data.data.total;
        this.total3 = res.data.data.total;
      });
    },
    // 下载文件列表
    isDownLoad(val) {
      if (val.STATE != 2) {
        let fileNameArr = val.FILENAME.split(",");
        let fileUrlArr = val.FILEURL.split(",");
        for (let i = 0; i < fileNameArr.length; i++) {
          let url;
          let fileName11 = fileUrlArr[i].lastIndexOf(".");
          let fileName =
            fileNameArr[i].split(".")[0] + fileUrlArr[i].substring(fileName11);
          url = `${fileUrlArr[i]}?attname=${fileName}`;
          downloadFile(url);
        }
      } else {
        let url;
        let fileName =
          val.COLLECTNAME + val.DOWNURL.substring(val.DOWNURL.lastIndexOf("."));
        url = `${val.DOWNURL}?attname=${fileName}`;
        downloadFile(url);
      }
    },
    showFilelist(row) {
      this.fileList = [];
      let fileUrls = row.FILEURL.split(",");
      let fileNames = row.FILENAME.split(",");
      fileUrls.forEach((item, index) => {
        this.fileList.push({
          fileUrl: item,
          fileName: fileNames[index],
          fileDir: fileNames[index],
        });
      });
      this.isShowFiles = true;
    },
    //预览
    handPreview(row) {
      // 后端只可转化这些doc,docx,xls,xlsx,ppt,pptx,txt,pdf
      let value = row.fileName.toLocaleLowerCase();
      let fileName = value.replace(/<[^>]+>/g, "");
      let fileType = /\.(doc|docx|xls|xlsx|csv|ppt|pptx|pdf|txt|tif|tiff|db|zip|rar|psd|wps|et|ett|jpg|png)(\?.*)?$/.test(
        fileName
      );
      if (!fileType) {
        let fileExtension = fileName.substring(fileName.lastIndexOf(".") + 1);
        return this.$message.warning(
          `以.${fileExtension}结尾的文件类型不支持预览`
        );
      }
      this.fileName = fileName;
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
  },
};
</script>
<style scoped>
.pdf {
  width: 100%;
}
iframe {
  width: 638px;
  height: 500px;
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
  color: white !important;
  background: #127714 !important;
}

.lv2 {
  font-size: 10px;
  border: none !important;
  background: #009a52 !important;
  color: #fff !important;
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
/* tab切换样式 */
.audit_btn {
  border: none;
  position: relative;
  z-index: 22;
}
.audit_btn:hover,
.audit_btn:active,
.audit_btn:focus {
  color: #009955;
  background: transparent;
}
.nowStyle {
  color: #009955;
  border-radius: 0;
  margin-bottom: -2px;
  border-bottom: 2px solid #009955;
}
</style>
