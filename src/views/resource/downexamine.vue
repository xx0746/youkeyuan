<template>
  <div>
    <div class="title">资源下载审核</div>
    <div style="margin-top:20px;margin-left:20px;margin-bottom:20px;float:left;width:20%">
      <menu-tree 
        ref="menuTree" 
        menuClass="title2" 
        @nodeClick="handleNodeClick" 
        @listenToChildEvent ='showMsgfromChild' 
        :menuType="menuType" 
        :resourceCountType="resourceCountType" 
        :isNum="true" 
        :isRed="true"
        :currentNode="currentId">
      </menu-tree>
    </div>

    <div style="margin-top:20px;margin-left:2%;float:left;width:74%">
      <div style="border-bottom: 2px solid #c4c9d0">
        <el-button class="audit_btn" @click="auditWait" :class="{'nowStyle':auditWaitStyle}">
          待审核
          (<span>{{total1}}</span>)
        </el-button>
        <el-button class="audit_btn" @click="auditLog" :class="{'nowStyle':auditLogStyle}">
          审核记录
          <span>({{total2}})</span>
        </el-button>
      </div>
      <div style="position:relative;margin:20px 0; z-index:2;display:flex;align-items: center">
        <el-input v-model="auditForm.fileName" placeholder="请输入题目" style="width:200px"></el-input>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="small"
          @click="searchDownExamineList(1)"
          style="margin-left:10px"
        >查询</el-button>
      </div>
      <!-- 表格 -->
      <div id="roc1" class="leftPart">
        <el-table
          v-loading="loading"
          :data="auditList"
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
          <el-table-column align="center" width="60px"  label="序号">
            <template slot-scope="scope">
              <span>{{scope.$index+1}}</span>
            </template>
          </el-table-column>

          <el-table-column align="center" label="资源名称">
            <template slot-scope="scope">
              <span>{{scope.row.KU_NAME}}</span>
            </template>
          </el-table-column>

          <el-table-column align="center" width="100" label="下载申请人">
            <template slot-scope="scope">
              <span>{{scope.row.CREATE_NAME}}</span>
            </template>
          </el-table-column>

          <el-table-column align="center" width="170" label="申请时间">
            <template slot-scope="scope">
              <span>{{scope.row.CREATE_TIME}}</span>
            </template>
          </el-table-column>

          <el-table-column align="center" width="120" label="上传人">
            <template slot-scope="scope">
              <span>{{scope.row.UPLOADNAME}}</span>
            </template>
          </el-table-column>

          <el-table-column
            align="center"
            width="100"
            label="状态"
            v-if="auditForm.applyState == 0"
            >
            <template slot-scope="scope">
              <span>{{scope.row.APPLY_STATE | getState}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="资源查看" width="220px" v-if="auditForm.applyState == 0">
            <template slot-scope="scope">
              <el-button
                type="primary2"
                size="mini"
                @click="download(scope.row,scope.row.APPLY_FLAG)"
              >下载</el-button>
            </template>
          </el-table-column>
          <el-table-column
            fixed="right"
            align="center"
            label="操作"
            v-if="auditForm.applyState !=0"
            width="180px"
            >
            <template slot-scope="scope">
              <div style="text-align: center">
                <diy-btn
                  styleType="icon" iconType="icon-download"
                  @click="download(scope.row,scope.row.APPLY_FLAG)"
                >下载</diy-btn>
                <diy-btn
                  styleType="icon" iconType="icon-pass"
                  @click="pass(scope.row)"
                  v-if="stateIsShow==0"
                >通过</diy-btn>
                <diy-btn
                  styleType="icon" iconType="icon-unpass"
                  @click="unpass(scope.row)"
                  style="margin-top: -8px"
                  v-if="stateIsShow==0"
                >驳回</diy-btn>
                <diy-btn 
                  styleType="icon" iconType="icon-preview"
                  @click="getShow(scope.row)"
                >预览</diy-btn>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-dialog class="dialogTitle el-preview" title="文件预览" :visible.sync="showPdf">
        <div class="pdf-cont" style="width: 860px;" v-if="showPdfSrc">
          <pdf-preview :title="fileName" :dataFlow="src" style="width: 860px; height: 100%; margin-top: -10px; overflow: hidden;"></pdf-preview>
        </div>
      </el-dialog>
      <el-dialog title="预览文件列表" :visible.sync="dialogTableVisible" :close-on-click-modal="false">
        <div style="margin-top: -20px;">
          <file-list
            v-show="TableData.length !== 0"
            :data="TableData"
            @onPreview="review"
            class="file-list">
          </file-list>
        </div>
        <div v-show="TableData.length == 0">
          此条数据没有文件
        </div>
      </el-dialog>
      <!--分页-->
      <div class="block">
        <el-pagination
          style="text-align: center"
          :page-size="10"
          :current-page="auditForm.pageNumber"
          @current-change="handleCurrentChange"
          layout="total,  prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import {
  getCommentPreviewList,
  getCommentPreview,
  getPreviewBase64
  } from "@/api/comment";
import {
  getLeftTreeInterface,
  getDownExamineInterface,
  getPassExamInterface,
  getAuditLogListInterface,
  fileMoreDownLoad,
  getreSourceFiles
} from "@/api/resource_list";
import { downloadFile } from "@/utils/utile";
import { Loading } from 'element-ui';
import fileList from "@/components/fileList/fileList";
import pdfPreview from "@/components/pdfPreview/PdfPreview";
import menuTree from "@/components/menuTree/menuTree";
import { debounce } from '@/utils/Debounce';
export default {
  components: { fileList, pdfPreview, menuTree },
  data() {
    return {
      loading: false,
      showPdfSrc: false,
      totalpage: true,
      totalpage1: false,
      daishenhe: true,
      shenhejilu: false,
      total1: "",
      total2: "",
      // 预览
      src: "",
      fileName: "",
      showPdf: false,
      TableData: [],
      dialogTableVisible: false,
      tabPosition: "",
      //  树形菜单默认属性设置
      defaultProps: {
        children: "children",
        label: "label",
        value: "value"
      },
      artic: {
        flag: 2,
        menuId: 17,
        fileId: "",
        ZYK: "暂无数据",
        CREATETIME: "暂无数据",
        idx: 0,
        id: null,
        fileState: 0
      },
      hrefs: "",
      total: null,
      dataTree: [],
      // 待审核数据初始化
      auditList: [],
      auditForm: {
        menuId: null,
        applyState: 1,
        limit: 10,
        pageNumber: 1,
        id: "",
        dataOne: "",
        fileName: "",
        applyFlag: 1
      },
      // 状态是否展示
      stateIsShow: 0,
      auditWaitStyle: true,
      auditLogStyle: false,
      ss: {},
      currentId: '',
      menuType:1,
      resourceCountType:2,
      isDownSearch: false
    };
  },
  mounted() {
  },
  created: function() {},
  watch: {
    src(val) {
      if(val) {
        this.showPdfSrc = false;
        this.$nextTick(_ => {
          this.showPdfSrc = true;
        })
      }
    }
  },
  filters: {
    getState(value) {
      var arr = ["待审核", "审核驳回","审核通过","待审核", "审核驳回","审核通过"];
      return arr[value - 1];
    },
    getAchiWard(value) {
      const arr = ["获奖", "未获奖"];
      return arr[value - 1];
    }
  },
  methods: {
    getShow(row) {
      let param = {
        menuId: row.DATATHREE,
        resourceId: row.APPLY_FILE_ID,
        type: 2
      }
      getreSourceFiles(param).then(res => {
        if(res.data.code == 1) {
          this.TableData = res.data.data;
          this.dialogTableVisible = true;
        } else {
          this.$message.warning(res.data.msg);
        }
      })
    },
    //预览
    review(val) {
      console.log(val)
      let file = {
        fileUrl: null
      }
      if(typeof val.fileUrl == 'string') {
        file.fileUrl = val.fileUrl;
      } else {
        let value = val.fileName.toLocaleLowerCase()
        let fileName = value.replace(/<[^>]+>/g,"")
        let fileText = /\.(doc|docx|xls|xlsx|csv|ppt|pptx|pdf|txt|tif|tiff|db|zip|rar|psd|wps|et|ett|jpg|png)(\?.*)?$/.test(fileName);
        let fileExtension = fileName.substring( fileName.lastIndexOf('.') + 1);
        if(!fileText) return this.$message.warning(`以.${fileExtension}结尾的文件类型不支持预览`);
        this.fileName = fileName;
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
          this.showPdf = true;
        } else {
          this.$message.warning(resrc.data.msg);
        }
        this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
          loadingInstance.close();
        });
      })
    },
    handleCurrentChange(val) {
      this.auditForm.pageNumber = val;
      if(this.stateIsShow == 0){
        this.getDownExamine(1);
      }else{
        this.getDownExamine(0);
      }
    },
    // 点击左边树形菜单 这是左边的列表
    handleNodeClick(data) {
      this.auditForm.pageNumber = 1;
      this.auditForm.menuId = data.menuId;
      this.auditForm.fileName = '';
      this.auditForm.applyState = 1;
      this.currentId = data.menuId;
      this.auditWaitStyle = true;
      this.auditLogStyle = false;
      this.stateIsShow = '0';
      this.loading = true;
      debounce(() => {
        this.getDownExamine(1);
        this.getDownExamine(0);
      }, 500);
    },
    showMsgfromChild(menuId){
      this.auditForm.menuId = menuId;
      this.currentId = menuId;
      if(!this.isDownSearch) {
        this.getDownExamine(1);
        this.getDownExamine(0);
      }
    },
    searchDownExamineList(val) {
      this.loading = true;
      if(val) {
        this.auditForm.pageNumber = 1;
        this.isDownSearch = true;
      }
      console.log(this.stateIsShow);
      getDownExamineInterface({
        menuId: this.auditForm.menuId,
        applyState: this.stateIsShow == 0 ? 1 : 0,
        limit: this.auditForm.limit,
        pageNumber: this.auditForm.pageNumber,
        id: this.auditForm.id,
        dataOne: this.auditForm.dataOne,
        fileName: this.auditForm.fileName,
        applyFlag: this.auditForm.applyFlag
      }).then(res => {
        this.loading = false;
        console.log(res); //value   true是正常请求 false
        this.auditList = res.data.data.rows;
        if (this.stateIsShow == 0) {
          this.total1 = res.data.data.total; //待审核总数
        } else {
          this.total2 = res.data.data.total; //审核记录总数
        }
        this.total = res.data.data.total; //分页总数
      });

    },
    // 发送两次请求分别获取待审核和审核记录的数据、及总数
    getDownExamine(value) {
      var that = this;
      this.auditList = [];
      this.loading = true;
      if (value == 1) {
        //待审核
        getDownExamineInterface({
          menuId: this.auditForm.menuId,
          applyState: 1,
          limit: this.auditForm.limit,
          pageNumber: this.auditForm.pageNumber,
          id: this.auditForm.id,
          dataOne: this.auditForm.dataOne,
          fileName: this.auditForm.fileName,
          applyFlag: this.auditForm.applyFlag
        }).then(res => {
          this.loading = false;
          this.total1 = res.data.data.total; //待审核总数
          // 通过stateIsShow来判断是否给表格数据赋值当前所查数据
          if(this.stateIsShow == 0) {
            this.auditList = res.data.data.rows;
            this.total = this.total1; // 分页展示的总数
          }
        });
      } else {
        // 审核记录
        getDownExamineInterface({
          menuId: this.auditForm.menuId,
          applyState: 0,
          limit: this.auditForm.limit,
          pageNumber: this.auditForm.pageNumber,
          id: this.auditForm.id,
          dataOne: this.auditForm.dataOne,
          fileName: this.auditForm.fileName,
          applyFlag: this.auditForm.applyFlag
        }).then(res => {
          this.loading = false;
          // 通过stateIsShow来判断是否给表格数据赋值当前所查数据
          this.total2 = res.data.data.total; //审核记录总数
          if(this.stateIsShow == 1) {
            this.auditList = res.data.data.rows;
            this.total = this.total2; // 分页展示的总数
          }
        });
      }
    },
    // 通过
    pass(row) {
      console.log(row);
      this.auditForm.applyState = 3;
      this.auditForm.menuId = row.MENU_ID;
      this.auditForm.id = row.ID;
      this.auditForm.applyFileId = row.APPLY_FILE_ID;
      console.log(this.auditForm);
      this.$confirm("此操作将执行通过操作, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          getPassExamInterface(this.auditForm).then(res => {
            this.auditForm.applyState = 1;
            if (res.data.code == 1) {
              this.$message({
                type: "success",
                message: "通过!"
              });
              this.isDownSearch = true;
              this.auditForm.menuId = this.currentId;
              this.getDownExamine(1);
              this.getDownExamine(0);
              this.$refs.menuTree.getLeftTree();
              this.total2 = this.total2 + 1;
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
    },
    // 驳回
    unpass(row) {
      const _that = this;
      this.auditForm.applyState = 2;
      this.auditForm.menuId = row.MENU_ID;
      this.auditForm.id = row.ID;
      this.auditForm.applyFileId = row.APPLY_FILE_ID;
      this.$prompt("请输入驳回原因：", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputPattern: /\S{5,100}/,
        inputErrorMessage: "驳回原因不能少于5个字！"
      })
        .then(({ value }) => {
          this.auditForm.dataOne = value;
          console.log(this.auditForm);
          getPassExamInterface(_that.auditForm).then(res => {
            _that.auditForm.applyState = 1;
            if ((res.data.code == 1)) {
              _that.$message.success('已驳回！');
              this.isDownSearch = true;
              this.auditForm.menuId = this.currentId;
              this.getDownExamine(1);
              this.getDownExamine(0);
              this.$refs.menuTree.getLeftTree();
              this.total2 = this.total2 + 1;
            } else {
              _that.$message.error(res.data.msg);
              return false;
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消输入"
          });
        });
    },
    // 多文件下载
    download(row, num) {
      console.log(row, num);
      this.auditForm.fileId = row.APPLY_FILE_ID;
      this.auditForm.flag = num;
      let fileIds = `${row.MENU_ID}-${this.auditForm.fileId}`;
      let page = 0;
      let type = 2;
      let params = { fileIds, page, type };
      console.log(params);
      fileMoreDownLoad(params).then(res => {
        console.log(res);
        if (res.data.code == 4) {
          for (let i = 0; i < res.data.data.length; i++) {
            downloadFile(res.data.data[i]);
          }
        } else {
          this.$message({
            type: "info",
            message: res.data.msg
          });
        }
      });
    },
    // 点击待审核按钮
    auditWait() {
      this.auditList = [];
      this.stateIsShow = "0";
      this.auditForm.pageNumber = 1;
      this.auditWaitStyle = true;
      this.auditLogStyle = false;
      this.getDownExamine(1);
    },
    // 点击审核记录按钮
    auditLog() {
      this.auditList = [];
      this.stateIsShow = "1";
      this.auditForm.pageNumber = 1;
      this.auditWaitStyle = false;
      this.auditLogStyle = true;
      this.getDownExamine(0);
    },
  }
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
.leftPart {
  display: none;
}
#roc1 {
  display: block;
}
.audit_btn {
  border: none;
  position: relative;
  z-index: 22;
  font-size: 16px;
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
</style>
