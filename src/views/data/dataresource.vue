<template>
  <div>
    <div class="title">数据管理</div>

    <div style="margin:20px 0 20px 20px;float:left;width:20%">
      <div class="title3">
        <p class="title-size">资源目录</p>
      </div>
      <el-row class="tac">
        <el-col>
          <el-tree
            :data="treeData"
            @node-click="handleNodeClick"
            :props="defaultProps"
            node-key="value"
            accordion
            class="trr"
            highlight-current
            empty-text="正在加载中"
          ></el-tree>
        </el-col>
      </el-row>
    </div>

    <div class="formbox">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane :label="menuValue" name="first">
          <el-table
            :data="LogisticsData"
            row-key="id"
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

            <el-table-column align="center" label="数据集名称">
              <template slot-scope="scope">
                <span>{{scope.row.COLLECTNAME}}</span>
              </template>
            </el-table-column>

            <el-table-column width="100" align="center" label="数据模型">
              <template slot-scope="scope">
                <span>{{scope.row.DATANAME}}</span>
              </template>
            </el-table-column>

            <el-table-column width="100" align="center" label="创建人">
              <template slot-scope="scope">
                <span>{{scope.row.USERNAME}}</span>
              </template>
            </el-table-column>

            <el-table-column width="160" align="center" label="创建时间">
              <template slot-scope="scope">
                <span>{{scope.row.CREATETIME}}</span>
              </template>
            </el-table-column>

            <el-table-column width="160" align="center" label="操作" fixed="right">
              <template slot-scope="scope">
                <div class="handle-col">
                  <diy-btn styleType="icon" iconType="icon-download" @click="isDownLoad(scope.row)"></diy-btn>
                  <diy-btn styleType="icon" iconType="icon-edit" @click="handUpdate(scope.row)"></diy-btn>
                  <diy-btn styleType="icon" iconType="icon-preview" @click="handPreview(scope.row)"></diy-btn>
                </div>
              </template>
            </el-table-column>
          </el-table>
          <!-- 页脚分页 -->
          <div class="block">
            <el-pagination
              style="text-align: center"
              :page-sizes="[10,20,30, 50]"
              :page-size="10"
              layout="total,  prev, pager, next, jumper"
              :current-page="Logisticsdata.pageNumber"
              @current-change="handleCurrentChange"
              :total="total"
            ></el-pagination>
          </div>
        </el-tab-pane>
        <el-tab-pane label="快递数据列表" name="second" v-if="isShowSecond">
          <el-table
            :data="tableData"
            row-key="id"
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

            <el-table-column align="center" label="文件名">
              <template slot-scope="scope">
                <span>{{scope.row.FILENAME}}</span>
              </template>
            </el-table-column>

            <el-table-column width="120" align="center" label="快递公司">
              <template slot-scope="scope">
                <span>{{scope.row.EXPRESSNAME}}</span>
              </template>
            </el-table-column>
            <el-table-column width="108" align="center" label="条数">
              <template slot-scope="scope">
                <span>{{scope.row.DATACOUNT}}</span>
              </template>
            </el-table-column>

            <el-table-column width="100" align="center" label="操作" fixed="right" >
              <template slot-scope="scope">
                <div class="handle-col">
                  <diy-btn styleType="icon" iconType="icon-download" @click="isDownLoad(scope.row)"></diy-btn>
                </div>
              </template>
            </el-table-column>
          </el-table>
          <!-- 页脚分页 -->
          <div class="block">
            <el-pagination
              style="text-align: center"
              :page-sizes="[10,20,30, 50]"
              :page-size="10"
              layout="total,  prev, pager, next, jumper"
              :current-page="listQuery.pageNumber"
              @current-change="CurrentChange"
              :total="total1"
            ></el-pagination>
          </div>
        </el-tab-pane>
      </el-tabs>
      <!-- 数据管理修改弹框 -->
      <el-dialog
        title="修改"
        :visible.sync="dialogVisible"
        width="60%"
        :before-close="handleClose"
        :close-on-click-modal="false"
        >
        <el-form ref="form" :model="form" label-width="110px">
          <el-form-item label="数据集名称">
            <el-input v-model="form.collectName" :disabled="true" />
          </el-form-item>
          <el-form-item label="数据模板">
            <el-input v-model="form.dataName" :disabled="true" />
          </el-form-item>
          <el-form-item label="下载是否审核" label-width="120px">
            <!-- <template>
              <el-radio v-model="form.auditState" :label="1">是</el-radio>
              <el-radio v-model="form.auditState" :label="2">否</el-radio>
            </template> -->
            <el-radio-group v-model="form.auditState" @change="showValue">
              <el-radio class="radio" :label="1">是</el-radio>
              <el-radio class="radio" :label="2">否</el-radio> 
            </el-radio-group>
          </el-form-item>
          <el-form-item prop="tally" label="标签">
            <tag-selection v-if="dialogVisible" :tags="tags" @tabTwoClick="selectClick" @tagSelect="tagSelectItem" ></tag-selection>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary4" size="small" @click="cancel">取消</el-button>
          <el-button
            style="margin-left:50px;"
            type="primary"
            @click="submitForm"
            size="small"
          >保存</el-button>
        </span>
      </el-dialog>
      <!-- 预览 -->
      <el-dialog class="dialogTitle el-preview"
                 title="文件预览"
                 :visible.sync="isShow">
        <div class="pdf-cont" style="width: 860px;" v-if="isShowPdf">
          <pdf-preview :title="fileName" :dataFlow="dataFlow"  style="width: 860px; height: 100%; margin-top: -10px; overflow: hidden;"></pdf-preview>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import { Loading } from 'element-ui';
import { getLeftTreeInterface , getLabels , getreSourceFiles} from "@/api/resource_list";
import {
  logisticsCollectList,
  logisticsCollectDel,
  LogisticsFormData,
  getDataCollect,
  dataCollectInfo
} from "@/api/datamanage";
import { downloadFile } from "@/utils/utile";
import tagSelection from "@/components/tagSelection/tagSelection";
import pdfPreview from "@/components/pdfPreview/PdfPreview";
import { getPreviewBase64 } from '@/api/comment';
export default {
    components: {
    tagSelection,
    pdfPreview
  },
  data() {
    return {
      dataFlow: "",
      fileName: "",
      isShow: false,
      isShowPdf: false,
      listQuery: {
        pageNumber: 1,
        limit: 10,
        state: 2
      },
      Logisticsdata: {
        pageNumber: 1,
        limit: 10,
        dataType: null,
        pageSize: 10,
        menuId: null,
        state: 2
      },
      total: null,
      total1: null,
      tabPosition: "",
      treeData: [],
      defaultProps: {
        children: "children",
        label: "label"
      },
      tableData: [],
      LogisticsData: [],
      activeName: "first",
      isShowSecond: false,
      menuValue: "",
      dialogVisible:false,
      form: {
        auditState: null,
        collectName:'',
        dataName:'',
        dataTwo: '',
        dataA:'',
        dataB:'',
      } ,
      tagsType: "success",
      menuId:'',
      infoId:'',
      tags: [],
      isTagSelectItem:''
    };
  },
  mounted() {
    this.getLeftTree();
  },
  watch: {
    dataFlow(val) {
      if(val) {
        this.isShowPdf = false;
        this.$nextTick(_ => {
          this.isShowPdf = true;
        })
      }
    }
  },
  methods: {
    // 获取资源目录
    getLeftTree() {
      let s = {
        menuType: 2
      };
      getLeftTreeInterface(s).then(res => {
        var arr = res.data.data;
        this.treeData = arr;
        this.menuValue = arr[0].label;
        this.Logisticsdata.menuId = arr[0].menuId;
        this.Logisticsdata.dataType = arr[0].menuId;
        if(arr[0].label == '物流数据库') {
          this.isShowSecond = true;
        } else {
          this.isShowSecond = false;
        }
        this.Logistics();
        this.getCollectList();
        console.log(arr)
      });
    },
    Logistics() {
      LogisticsFormData(this.Logisticsdata).then(res => {
        if (res.data.code == 1) {
          this.LogisticsData = res.data.data.rows;
          this.total = res.data.data.total;
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    handleClick(tab, event) {
      this.activeName = tab.name;
    },
    handDel(row) {
      var _this = this;
      _this
        .$confirm("是否删除?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          logisticsCollectDel(row.ID).then(res => {
            if (res.data.code != 1) {
              _this.$message.error(res.data.msg);
              return false;
            } else {
              _this.$message.success("删除成功");
              _this.getCollectList();
            }
          });
        })
        .catch(() => {
          _this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    getCollectList() {
      logisticsCollectList(this.listQuery).then(res => {
        if (res.data.code == 1) {
          this.tableData = res.data.data.rows;
          this.total1 = res.data.data.total;
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    handleNodeClick(data) {
      this.menuId = data.menuId;
      this.activeName = 'first';
      this.menuValue = data.label;
      if ( data.menuId != this.Logisticsdata.menuId && this.activeName == "first") {
        this.Logisticsdata.menuId = data.menuId;
        this.Logisticsdata.dataType = data.menuId;
        this.Logisticsdata.pageNumber = 1;
        this.Logistics();
      }
      this.isShowSecond = false;
      if( this.menuValue == '物流数据库') {
        this.isShowSecond = true
      }
    },

    // 下载文件
    isDownLoad(val) {
      let url;
      if (this.activeName == "first") {
        let fileName = val.COLLECTNAME + val.DOWNURL.substring(val.DOWNURL.lastIndexOf("."));
        url = `${val.DOWNURL}?attname=${fileName}`;
      } else {
        url = `${val.DOWNURL}?attname=${val.COLLECTNAME}`;
      }
      downloadFile(url);
    },
    CurrentChange(val) {
      this.listQuery.pageNumber = val;
      this.getCollectList();
    },
    handleCurrentChange(val) {
      this.Logisticsdata.pageNumber = val;
      // this.getCollectList();
      this.Logistics();
    },
    handUpdate(row){
      this.dialogVisible = true;
      this.infoId = row.ID;
      getDataCollect(this.infoId).then(res => {
        if (res.data.code == 1) {
            this.form = res.data.data;
            let dataA = res.data.data.dataA
            let dataB = res.data.data.dataB
            // 获取标签内容
            if(dataA !== "") {
              getLabels(dataA).then(data => {
                if (data.data.code == 1) {
                  this.tags = data.data.data.map(item => {
                    return {
                      name: item.TYPENAME,
                      type: "",
                      id: item.LABELID
                    };
                  });
                }
              });
            }else{
              this.tags = [];
            }
            console.log(this.tags)
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    showValue(value){
      this.isTagSelectItem = true;
    },
    tagSelectItem(data){
      this.isTagSelectItem = data;
    },
    handleClose(){
      if(this.isTagSelectItem){
        this.$confirm('编辑的内容可能没有保存，确定关闭?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.isTagSelectItem = false;
          this.dialogVisible = false;
          this.$refs.form.resetFields();
        })
      }else{
          this.dialogVisible = false;
          this.$refs.form.resetFields();
      }
      console.log(this.isTagSelectItem)
    },
	  cancel() {
        this.isTagSelectItem = false;
        this.dialogVisible = false;
        this.$refs.form.resetFields();
    },
    selectClick(par,par1) {
      console.log(par,par1)
      this.form.dataA = par;
      this.form.dataB = par1;
    },
    submitForm(){
      dataCollectInfo(this.form).then(res => {
        if (res.data.code == 1) {
          this.isTagSelectItem = false;
          this.dialogVisible = false;
          this.$message.success('保存成功！');
        }else{
          this.isTagSelectItem = false;
          this.$message.error(res.data.msg);
        }
      })

    },
    //预览
    handPreview(row){
      // 后端只可转化这些doc,docx,xls,xlsx,ppt,pptx,txt,pdf
      let value = row.FILENAME.toLocaleLowerCase()
      let fileName = value.replace(/<[^>]+>/g,"")
      let fileType = /\.(doc|docx|xls|xlsx|csv|ppt|pptx|pdf|txt|tif|tiff|db|zip|rar|psd|wps|et|ett|jpg|png)(\?.*)?$/.test(fileName)
      if(!fileType) {
        let fileExtension = fileName.substring(fileName.lastIndexOf('.') + 1);
        return this.$message.warning(`以.${fileExtension}结尾的文件类型不支持预览`);
      }
      this.fileName = fileName;
      let loadingInstance = Loading.service({
        text: '正在努力加载中...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      let file = {
        fileUrl: row.DOWNURL
      }
      getPreviewBase64(file).then(resrc => {
        if(resrc.data.code == 1) {
          this.dataFlow = resrc.data.data;
          this.isShow = true
        } else {
          this.$message.warning(resrc.data.msg);
        }
        this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
          loadingInstance.close();
        });
      })
    }
  }
};
</script>
<style scoped  rel="stylesheet/scss" lang="scss">

.formbox {
  margin-top: 20px;
  margin-left: 2%;
  float: left;
  width: 74%;
  border-top: 1px solid #fff;
  h3 {
    font-size: 16px;
    font-weight: 400;
    color: #009a52;
  }
}

.btn-box {
  margin-top: 30px;
  text-align: center;
}

.btn-text {
  margin-left: 30px;
}

.tree-box .el-tree {
  background-color: rgb(242, 242, 242);
}
.icon_pointer{
  cursor: pointer;
}
.el-icon-download{
  font-size: 18px;
}
</style>
