<template>
  <div>
    <div class="title">资源入库审核</div>
    <div style="margin-top:20px;margin-left:20px;margin-bottom:20px;float:left;width:20%">
      <div class="title2">
        <p>资源目录</p>
        <p>(切换查看各目录的待审核记录)</p>
      </div>
      <el-tree
        :data="dataTree"
        :props="defaultProps"
        @node-click="handleNodeClick"
        :render-content="treeRender"
        class="trr"
        accordion
        ref="treeBox"
        node-key="value"
        :default-expanded-keys="[currentMenuId]"
        highlight-current
        empty-text="正在加载中"
      ></el-tree>
      <!-- <menu-tree
        ref="menuTree"
        @nodeClick="handleNodeClick"
        @listenToChildEvent ='showMsgfromChild'
        :menuType="menuType"
        :resourceCountType="resourceCountType"
        :isNum="true"
        :isRed="true"></menu-tree> -->
    </div>

    <div style="margin-top:20px;margin-left:2%;float:left;width:74%">
      <div style="border-bottom: 2px solid #c4c9d0; margin-bottom:20px;color:#333333;">
        <el-button class="audit_btn" @click="auditWait" :class="{'nowStyle':auditWaitStyle}">待审核 (<span>{{total}}</span>)</el-button>
        <el-button class="audit_btn" @click="auditSucc" :class="{'nowStyle':auditSuccStyle}">审核通过 <span>({{total1}})</span></el-button>
        <el-button class="audit_btn" @click="auditUnpass" :class="{'nowStyle':auditUnpassStyle}">审核驳回 <span>({{total3}})</span></el-button>
        <el-button class="audit_btn" @click="auditLog" :class="{'nowStyle':auditLogStyle}">审核记录 <span>({{total2}})</span></el-button>
      </div>
        <div>
          <el-table
            v-loading="loading"
            :data="auditList"
            row-key="id"
            border
            fit
            highlight-current-row
            :header-cell-style="{
            'background-color': '#f5f7fa',
            'color': 'rgb(103, 194, 58)',
            }"
            >

            <el-table-column align="center" width="60" label="序号">
              <template slot-scope="scope">
                <span>{{scope.$index+1}}</span>
              </template>
            </el-table-column>

            <el-table-column align="center" label="题目">
              <template slot-scope="scope">
                <div>{{scope.row.TITLE}}</div>
              </template>
            </el-table-column>

            <el-table-column align="center" width="160" :label="stateIsShow!= 0 ? '审核时间': '上传时间'">
              <template slot-scope="scope">
                <div>{{scope.row.CREATETIME}}</div>
              </template>
            </el-table-column>
            <el-table-column width="80" align="center" label="状态" v-if="stateIsShow!= 0">
              <template slot-scope="scope">
                <span>{{scope.row.RHSTATE | getState}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" width="160" v-if="auditForm.menuId === -1" :label="'所属目录'">
              <template slot-scope="scope">
                <div>{{scope.row.MENUNAME}}</div>
              </template>
            </el-table-column>
            <el-table-column align="center" width="135" label="下载是否需要审核" v-if="stateIsShow!=1&&stateIsShow!=3">
              <template slot-scope="scope">
                <span>{{scope.row.DATAONE | getDataOne}}</span>
                <el-button
                  type="primary5"
                  @click="AuditDataOne(scope.row)"
                  size="mini"
                  v-if="isRoleName"
                >调整</el-button>
              </template>
            </el-table-column>

            <el-table-column align="center" width="140" label="操作" fixed="right">
              <template slot-scope="scope">
                <div style="text-align: center;">
                  <diy-btn
                    styleType="icon" :iconType="stateIsShow == '0'?'icon-audit':'icon-list'"
                    @click="pagedata(scope.row)"
                  ></diy-btn>
                  <diy-btn
                    styleType="icon" iconType="icon-check_reason"
                    @click="seeReason(scope.row)"
                    v-if="stateIsShow==1&&(scope.row.RHSTATE==2 || scope.row.RHSTATE==3)"
                  ></diy-btn>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <el-dialog :title="stateIsShow | dialogTitle" :before-close="handleClose" :visible.sync="dialogTableVisible1" :close-on-click-modal="false">
          <!-- 文章内容 -->
          <div class="article-content" style="box-sizing: border-box;" v-if="stateIsShow == 0">
            <z-tree :fileTreeData="treeData" :countNum="count" :isShow="stateIsShow==0" :isShowDetails="false" @treeClick="clickTreeNode" @treeCheck="checkTreeNode"></z-tree>
            <div v-if="stateIsShow==0">
              <el-input type="textarea" style="width:100%;overflow-x:visible;overflow-y:visible;" v-model="auditForm.rejectReason" placeholder="请输入驳回原因"></el-input>
            </div>
            <div style="text-align: center;margin-top: 30px">
              <el-button type="primary4" size="small" style="height:32px;" @click="downArtic(rowdata)">下载</el-button>
              <el-button v-if="stateIsShow==0" type="primary"  style="height:32px; margin: 0 40px 0 50px;" size="small" :disabled="subDisabled" @click="pass(rowdata)">通过</el-button>
              <el-button v-if="stateIsShow==0" type="primary3"  style="height:32px" size="small" :disabled="subDisabled" @click="unpass(rowdata,2)">驳回</el-button>
            </div>
          </div>
          <div v-else style="margin-top: -20px;">
            <file-list
              v-show="passPreviewFiles.length !== 0"
              title="通过文件列表"
              :data="passPreviewFiles"
              @onPreview="review"
              class="file-list">
            </file-list>
            <file-list
              v-show="unpassPreviewFiles.length !== 0"
              title="驳回文件列表"
              :data="unpassPreviewFiles"
              @onPreview="review"
              class="file-list">
            </file-list>
            <div v-show="passPreviewFiles.length == 0 && unpassPreviewFiles.length == 0">
              此条数据没有文件
            </div>
          </div>
        </el-dialog>
        <!-- 预览 -->
        <el-dialog class="dialogTitle el-preview"
          title="文件预览"
          :visible.sync="isShow">
          <div class="pdf-cont" style="width: 860px;" v-if="isShowPdf">
            <pdf-preview :title="fileName" :dataFlow="src"  style="width: 860px; height: 100%; margin-top: -10px; overflow: hidden;"></pdf-preview>
          </div>
        </el-dialog>
        <!--分页-->
        <div class="block">
          <el-pagination
            style="text-align: center"
            :page-size="10"
            :current-page="auditForm.pageNumber"
            @current-change="handleCurrentChange"
            layout="total,prev, pager, next, jumper"
            :total="tableTotal"
          ></el-pagination>
        </div>
    </div>
  </div>
</template>
<script>
import zTree from "@/components/zTree/zTree";
import pdfPreview from "@/components/pdfPreview/PdfPreview";
import { Loading } from 'element-ui';
import {
  getLeftTreeInterface,
  getAuditListInterface,
  getPassInterface,
  getReviewHistory,
  auditResourceDown,
  fileMoreDownLoad,
  getPreviewFiles,
  getLookFiles,
  getReviewFile
} from "@/api/resource_list";
  import {
    fileAddInterface,
  } from "@/api/search";
import {
  getCommentPreviewList,
  getCommentPreview,
  getCommentFileMenudata,
  getCommentFileMenu,
  getPreviewBase64
} from '@/api/comment'
import fileList from "@/components/fileList/fileList";
import { downloadFile, handleBatchDownload } from "@/utils/utile";
import menuTree from "@/components/menuTree/menuTree";
import { debounce } from '@/utils/Debounce';
export default {
  components: { zTree, pdfPreview, fileList, menuTree },
  data() {
    return {
      loading: false,
      subDisabled: false,
      rejectReasondata:true,
      tableTotal: null,
      total:'',
      total1:'',
      total2:'',
      total3:'',
      artic: {
        flag: 2,
        menuId: null,
        fileId:'',
        ZYK: '暂无数据',
        CREATETIME: '暂无数据',
        idx: 0,
        id: null,
        fileState:0,
        type:''
      },
      // 树形菜单默认属性设置
      defaultProps: {
        children: "children",
        label:'label'
      },
      dataTree: [],
      currentMenuId: "",
      // 待审核数据初始化
      auditList: [],
      // 因为后期修改没有拆分参数，所有请求数据，审核数据接口的参数用的都是auditForm里的参数，
      // 但是menuId的获取，点击左侧目录获取表格数据，用的是目录树的menuId；审核操作用的是每条数据中的DATATHREE
      auditForm: {
        menuId: null,
        menuPid: 0,
        dataTree: null,
        type: 1,
        fileId:'',
        ids: "",
        rejectReason: "",
        searchName: "",
        limit: 10,
        pageNumber: 1,
        basicId: "",
        state: "",
        Reasons:'',
        selectIds: '',
        getAudit: 1,
      },
      passPreviewFiles: [],
      unpassPreviewFiles: [],
      src: "",
      fileName: "",
      isShow: false,
      isShowPdf: false,
      count: 0,
      treeData: [],
      rowdata:{},
      dialogTableVisible1:false,
      // 状态是否展示
      stateIsShow: 0,
      isRoleName: false,
      auditWaitStyle: true,
      auditLogStyle: false,
      auditSuccStyle: false,
      auditUnpassStyle: false,
      resourceIds: "",
      fileDownList: {
        menuId: null,
        fileId: "",
        flag: ""
      },
      menuType: 1,
      resourceCountType:0,
    };
  },
  watch: {
    src(val) {
      if(val) {
        this.isShowPdf = false;
        this.$nextTick(_ => {
          this.isShowPdf = true;
        })
      }
    },
  },
  filters: {
    patentType(value){
      var arr = ["专利", "软件著作权"];
      return arr[value - 1];
    },
    patentMainType(value){
      var arr = ["发明专利", "外观专利",'实用新型'];
      return arr[value - 1];
    },
    getState(value) {
      // 审核状态： 0.全部通过。1 部分通过  2 部分驳回  3 全部驳回。
      var arr = ["全部通过", "部分通过", "部分驳回", "全部驳回"];
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
    dialogTitle(value) {
      return value == '0'?'审核':'文件列表';
    }
  },
  created() {
    let roleName = window.sessionStorage.getItem("roleName");
    if (roleName === "数据审核员" || roleName === "部门数据审核员") {
      this.isRoleName = true;
    } else {
      this.isRoleName = false;
    }
  },
  mounted() {
    this.getLeftTree();
  },
  methods: {
    handleClose(){
      this.rejectReasondata = false;
      this.dialogTableVisible1 = false;
    },
    //审核
    pagedata(row,val){
      this.auditForm.rejectReason = '';
      this.auditForm.dataTree = row.DATATHREE;
      this.fileDownList.menuId = row.DATATHREE;
      this.rejectReasondata = true;
      this.getShow(row);
      this.dialogTableVisible1 = true;
      this.rowdata = row;

    },
    // 点击文件列表目录树节点
    clickTreeNode(val) {
      if(val.menuPid != 15) {
        let file = {
          fileName: val.menuName,
          fileUrl: val.fileUrl
        }
        this.review(file)
      }
    },
    // 选择文件目录树节点
    checkTreeNode(val) {
      this.resourceIds = val.join(',');
      console.log(this.resourceIds,'resourceIds');
    },
    //下载
    downArtic(row) {
      console.log(this.resourceIds)
      if(this.resourceIds != ''){
        let data = {
          fileIds: `${row.DATATHREE}-${row.ID}`,
          page: 0,
          type: 1,
          resourceIds: this.resourceIds
        };
        fileMoreDownLoad(data).then(res => {
          console.log(res);
          if (res.data.code == 0) {
            this.$confirm(`${res.data.msg}是否提交下载申请？`, "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            })
              .then(() => {
                let s = res.data.data;
                let a = s.split("-");
                this.downList.fileId = a[1];
                this.downList.menuId = a[0];
                this.downList.flag = 1;
                fileAddInterface(this.downList).then(res => {
                  if (res.data.code == 1) {
                    this.$message({
                      type: "success",
                      message: "申请已提交！"
                    });
                  }
                });
              })
              .catch(() => {
                this.$message({
                  type: "info",
                  message: "已取消下载"
                });
              });
          } else if (res.data.code == 4) {
            for (let i = 0; i < res.data.data.length; i++) {
              downloadFile(res.data.data[i]);
            }
          } else if (res.data.code == 1) {
            this.$message.warning(res.data.msg);
          } else if (res.data.code == 2) {
            this.$confirm(`${res.data.msg}是否重新提交下载申请？`, "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            })
              .then(() => {
                console.log(this.downList);
                fileAddInterface(this.downList).then(res => {
                  if (res.data.code == 1) {
                    this.$message({
                      type: "success",
                      message: "申请已提交！"
                    });
                  }
                });
              })
              .catch(() => {
                this.$message({
                  type: "info",
                  message: "已取消下载"
                });
              });
          }
        });
      }else {
        this.$message.warning('请先勾选要下载的文件！')
      }
    },
    // 预览
    getShow(row) {
      console.log(row)
      this.artic.FLAG = 2;
      this.artic.fileId = row.ID;
      this.artic.auditState = row.AUDITSTATE;
      this.artic.menuId = row.DATATHREE;
      this.treeData = [];
      if(this.stateIsShow == "0"){
        this.artic.fileState = 0;
        getCommentFileMenudata(this.artic).then(res => {
          if(res.data.code == 1) {
            this.treeData = res.data.data.fileLists;
            this.count = res.data.data.count;
          } else {
            this.$message.warning(res.data.msg);
          }
        })
      }else{
        this.passPreviewFiles = [];
        this.unpassPreviewFiles = [];
        let rhstate = row.RHSTATE
        let param = {
          reviewId : row.RHID,
        }
        console.log(param)
        getReviewFile(param).then(res => {
          if(res.data.code == 1) {
            this.dialogTableVisible = true;
            let arr = res.data.data;
            console.log(arr)
            arr.forEach(item => {
              if(item.state == 1) {
                this.passPreviewFiles.push(item);
              } else {
                this.unpassPreviewFiles.push(item);
              }
            })
          } else {
            this.$message.warning(res.data.msg);
          }
        })
      }
    },
    review(val) {
      console.log(val);
      let file = {
        fileUrl: null
      }
      if(typeof val == 'string') {
        file.fileUrl = val;
      } else {
        let fileText = /\.(doc|docx|xls|xlsx|csv|ppt|pptx|pdf|txt|tif|tiff|db|zip|rar|psd|wps|et|ett|jpg|png)(\?.*)?$/.test(val.fileName.toLocaleLowerCase());
        let fileExtension = val.fileName.substring( val.fileName.lastIndexOf('.') + 1);
        if(!fileText) return this.$message.warning(`以.${fileExtension}结尾的文件类型不支持预览`);
        this.fileName = val.fileName;
        file.fileUrl = val.fileUrl;
      }
      let loadingInstance = Loading.service({
        text: '正在努力加载中...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      getPreviewBase64(file).then(resrc => {
        if(resrc.data.code == 1) {
          this.src = resrc.data.data;
          this.isShow = true;
        } else {
          this.$message.warning(resrc.data.msg);
        }
        this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
          loadingInstance.close();
        });
      })
    },
    //查看驳回原因
    seeReason(row) {
      this.$alert(row.REJECTREASON, "驳回原因", {});
    },
    handleCurrentChange(val) {
      this.auditForm.pageNumber = val;
      if (this.stateIsShow == "0") {
        this.getAuditList();
      } else if (this.stateIsShow == "1") {
        this.getLibraryList(3); //审核记录
      } else if (this.stateIsShow == "2"){
        this.getLibraryList(2); //审核通过
      } else {
        this.getLibraryList(4); //审核驳回
      }
    },
    // 获取资源目录
    getLeftTree() {
      let param = {
        menuType: 1,
        resourceCountType: 0
      };
      getLeftTreeInterface(param).then(res => {
        this.dataTree = res.data.data;
        if(this.currentMenuId == "") {
          this.auditForm.menuId = this.dataTree[0].menuId;
        } else {
          this.auditForm.menuId = this.currentMenuId;
        }
        console.log(this.currentMenuId);
        this.getAuditList();
        this.dataTree.forEach(item => {
          item.parentId = item.menuId;
          if(item.children != null) {
            item.children.forEach(item1 => {
              item1.parentId = item.menuId;
              if(item1.children != null) {
                item1.children.forEach(item2 => {
                  item2.parentId = item.menuId;
                  if(item2.children != null) {
                      item2.children.forEach(item3 => {
                        item3.parentId = item.menuId;
                      })
                    }
                })
              }
            })
          }
        })
      });
    },
    treeRender(h, { node, data, store }) {
      return (
        <span class="custom-tree-node">
          <span>{node.label}</span>
          (<span style="color: #ff7c7c;">{data.resourceCount}</span>)
        </span>);
    },
    // 点击左边树形菜单
    handleNodeClick(data) {
      this.auditList = [];
      this.auditWaitStyle = true;
      this.auditLogStyle = false;
      this.auditSuccStyle = false;
      this.auditUnpassStyle = false;
      this.auditForm.pageNumber = 1;
      this.auditForm.menuId = data.menuId;
      this.currentMenuId = data.menuId;
      this.stateIsShow = '0';
      this.loading = true;
      debounce(()=> {
        this.getAuditList();
      }, 500)
    },
    // showMsgfromChild(menuId){
    //   this.auditForm.menuId = menuId;
    //   this.fileDownList.menuId = menuId;
    //   this.getAuditList();
    // },
    // 调整下载审核状态
    AuditDataOne(row) {
      let dataOne = row.DATAONE;
      if (typeof dataOne === "undefined") {
        dataOne = "2";
      }
      let s = 0;
      let a = "";
      console.log(dataOne);
      if (dataOne == 2) {
        s = 1;
        a = "调整为下载需要审核";
      } else {
        s = 2;
        a = "调整为下载不需要审核";
      }
      let sb = {
        resourceId: row.ID,
        dataOne: s,
        type: 1
      };
      this.$confirm(a, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
      .then(() => {
        auditResourceDown(sb).then(res => {
          if (res.data.code == 1) {
            this.$message({
              type: "success",
              message: "调整成功!"
            });
            if(this.auditWaitStyle == true){
              this.getAuditList();
            }else{
              this.getLibraryList(2);
            }
          } else {
            this.$message.error(res.data.msg);
            return false;
          }
        });
      })
      .catch(() => {
        this.$message({
          type: "info",
          message: "已取消调整"
        });
      });
    },
    // 获取待审核数据
    getAuditList() {
      this.loading = true;
      getAuditListInterface(this.auditForm).then(res => {
        this.loading = false;
        if (res.data.code != 1) {
          return this.$message.warning(res.data.msg);
        }
        this.auditList = res.data.data.rows;
        this.tableTotal = res.data.data.total;
        this.total = res.data.data.total;
        this.total1 = res.data.data.total1;
        this.total2 = res.data.data.total2;
        this.total3 = res.data.data.total3;
      });
    },
    // 获取审核通过、审核记录数据
    getLibraryList(val) {
      if(val == 2) {
        this.auditForm.state = 1;
      } else if(val == 3){
        this.auditForm.state = '';
      } else {
        this.auditForm.state = 2;
      }
      this.loading = true;
      getReviewHistory(this.auditForm).then(res => {
        this.loading = false;
        if (res.data.code == 1) {
          this.auditList = res.data.data.rows;
        }
      });
    },
    // 通过
    pass(row) {
      var that = this;
      this.subDisabled = true;
      if(this.auditForm.rejectReason!==''){
        this.subDisabled = false;
        this.$message({
          type: "error",
          message: "通过时驳回原因应为空"
        });
      }else{
        let str = '';
        let str0 = '';
        if(this.resourceIds == '') {
          str0 = '全部'
          str = '全部文件'
        } else {
          str0 = '部分'
          str = '选中文件，未通过的文件不能追加提交'
        }
        if(window.sessionStorage.getItem('roleName')=='部门数据审核员'){
          this.auditForm.type = 1;
          this.auditForm.ids = row.ID;
          this.auditForm.selectIds = this.resourceIds;
          this.$confirm(`此操作将执行部门审核通过，${str},审核通过后将由数据审核员审核，是否继续？`, "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
          .then(() => {
            getPassInterface(this.auditForm).then(res => {
              if (res.data.code == 1) {
                this.$message({
                  type: "success",
                  message: "通过!"
                });
                this.dialogTableVisible1 = false;
                this._reset();
              } else {
                this.$message.error(res.data.msg);
                return false;
              }
            });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消通过"
            });
          });
          this.subDisabled = false;
        }else{
          this.auditForm.type = 1;
          this.auditForm.ids = row.ID;
          this.auditForm.selectIds = this.resourceIds;
          this.$confirm(`此操作将执行${str0}通过操作,通过内容为${str}，是否继续?`, "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
          .then(() => {
            getPassInterface(this.auditForm).then(res => {
              if (res.data.code == 1) {
                this.$message({
                  type: "success",
                  message: "通过!"
                });
                this.dialogTableVisible1 = false;
                this._reset();
              } else {
                this.$message.error(res.data.msg);
                return false;
              }
            });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消通过"
            });
          });
          this.subDisabled = false;
        }
      }


    },
    // 驳回
    unpass(row,val) {
      //var that = this;
      this.auditForm.type = 2;
      this.auditForm.ids = row.ID;
      this.auditForm.selectIds = this.resourceIds;
      if(val==1){
        this.$prompt("请输入驳回原因：", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          inputPattern: /\S{5,100}/,
          inputErrorMessage: "驳回原因不能少于5个字！"
        })
          .then(({ value }) => {
            this.auditForm.rejectReason = value;
            getPassInterface(this.auditForm).then(res => {
              console.log(res);
              if ((res.data.code = 1)) {
                this.$message({
                  type: "success",
                  message: "已提交驳回原因"
                });
                this._reset();
              } else {
                this.$message.error(res.data.msg);
                return false;
              }
            });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "取消输入"
            })
          })
      }else{
        const reg = /\S{5,100}/;
        if(this.auditForm.rejectReason=='' || !reg.test(this.auditForm.rejectReason)){
          this.$message({
            type: "error",
            message: "驳回原因不能少于5个字!"
          });
          $('.articleinput').css('border-color','red');
        }else{
          console.log("111111")
          $('.articleinput').css('border-color','#c4c9d0');
           this.subDisabled = true;
          getPassInterface(this.auditForm).then(res => {
            console.log(res)
            if ((res.data.code == 1)) {
              this.$message({
                type: "success",
                message: "已提交驳回原因"
              });
              this.rejectReasondata = false;
              this.dialogTableVisible1 = false;
              this._reset();
            } else {
              this.subDisabled = false;
              this.$message.error(res.data.msg);
              return false;
            }
            this.subDisabled = false;
          });
        }
      }
    },
    // 点击待审核按钮
    auditWait() {
      this.auditList = [];
      this.stateIsShow = "0";
      this.auditForm.pageNumber = 1;
      this.getAuditList();
      this.auditWaitStyle = true;
      this.auditLogStyle = false;
      this.auditSuccStyle = false;
      this.auditUnpassStyle = false;
    },
    // 点击审核通过按钮
    auditSucc() {
      this.auditList = [];
      this.stateIsShow = "2";
      this.auditForm.pageNumber = 1;
      this.getLibraryList(2);
      this.tableTotal = this.total1;
      this.auditWaitStyle = false;
      this.auditLogStyle = false;
      this.auditSuccStyle = true;
      this.auditUnpassStyle = false;
    },
    // 点击审核驳回按钮
    auditUnpass() {
      this.auditList = [];
      this.stateIsShow = "3";
      this.auditForm.pageNumber = 1;
      this.getLibraryList(4);
      this.tableTotal = this.total3;
      this.auditWaitStyle = false;
      this.auditLogStyle = false;
      this.auditSuccStyle = false;
      this.auditUnpassStyle = true;
    },
    // 点击审核记录按钮
    auditLog() {
      this.auditList = [];
      this.stateIsShow = "1";
      this.auditForm.pageNumber = 1;
      this.getLibraryList(3);
      this.tableTotal = this.total2;
      this.auditWaitStyle = false;
      this.auditLogStyle = true;
      this.auditSuccStyle = false;
      this.auditUnpassStyle = false;
    },
    // 下载
    // download(row, num) {
    //   console.log(row, num);
    //   this.fileDownList.fileId = row.ID;
    //   this.fileDownList.flag = num;
    //   console.log(this.stateIsShow);
    //   if (this.stateIsShow == "2") {
    //     let fileIds = `${row.DATATHREE}-${this.fileDownList.fileId}`;
    //     let page = 0;
    //     let params = { fileIds, page,type:1 ,resourceIds: this.resourceIds};
    //     console.log(params);
    //     fileMoreDownLoad(params).then(res => {
    //       console.log(res);
    //       if (res.data.code == 4) {
    //         for (let i = 0; i < res.data.data.length; i++) {
    //           downloadFile(res.data.data[i]);
    //         }
    //       } else {
    //         this.$message({
    //           type: "info",
    //           message: res.data.msg
    //         });
    //       }
    //     });
    //   } else if (this.stateIsShow == "1"){
    //     let fileIds = `${row.DATATHREE}-${this.fileDownList.fileId}`;
    //     let page = 0;
    //     // 控制查询哪个schema
    //     let type = 1
    //     let params = { fileIds, page,type };
    //     console.log(params);
    //     fileMoreDownLoad(params).then(res => {
    //       console.log(res);
    //       if (res.data.code == 4) {
    //         for (let i = 0; i < res.data.data.length; i++) {
    //           downloadFile(res.data.data[i]);
    //         }
    //       } else {
    //         this.$message({
    //           type: "info",
    //           message: res.data.msg
    //         });
    //       }
    //     });
    //   } else if (this.stateIsShow == "0"){
    //     let fileIds = `${row.DATATHREE}-${this.fileDownList.fileId}`;
    //     let page = 0;
    //     // 控制查询哪个schema
    //     let type = 1
    //     let params = { fileIds, page,type };
    //     console.log(params);
    //     fileMoreDownLoad(params).then(res => {
    //       console.log(res);
    //       if (res.data.code == 4) {
    //         for (let i = 0; i < res.data.data.length; i++) {
    //           downloadFile(res.data.data[i]);
    //         }
    //       } else {
    //         this.$message({
    //           type: "info",
    //           message: res.data.msg
    //         });
    //       }
    //     });
    //   }
    // },
    // 通过、驳回 后初始化数据
    _reset() {
      this.resourceIds = '';
      this.auditForm.selectIds = '';
      // this.$refs.menuTree.getLeftTree();
      this.auditForm.menuId = this.currentMenuId;
      console.log(this.auditForm.menuId);
      this.getLeftTree();
    }
  }
};
</script>
<style scoped lang="scss">
/*操作审核*/
.el-dialog__body{
  padding: 10px 20px !important;
}
.actionbar{
  .detailedinformation{
    display: flex;
    /*justify-content: space-between;*/
    flex-wrap: wrap;
    align-items: center;
    border-bottom: 1px dotted rgba(210,210,210,1);
    width: 100%;
    div{padding: 10px 0px; font-size: 14px;}
    div:nth-child(odd){
      width: 110px;
      color: rgb(126, 126, 126);
    }
    div:nth-child(even){
      width: 30%;
    }
    .detailedinformationLeft{
      margin-left: 40px;
    }

  }

}
.articleinput{
  width: 100%;
  border: 1px solid #c4c9d0;
  height: 70px;outline:none;border-radius: 5px;padding-left: 5px;
  line-height: 20px;
}
input::-webkit-input-placeholder {
  font-size: 14px;
  height:22px;
  font-family:PingFangSC-Regular;
  font-weight:400;
  color:rgba(6,6,6,0.5);
  line-height:20px;
}
.file-list {
  margin-top: 10px;
}
.pdf {
  width: 100%;
}
iframe{width:638px;height: 500px;}
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
  font-size: 16px;
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
  border-bottom:2px solid #009955;
}
.el-input__inner{
  border: 1px solid red;
}
</style>
