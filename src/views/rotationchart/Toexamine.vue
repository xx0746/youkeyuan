<template>
  <div v-loading="fileLoading"
       element-loading-spinner="el-icon-loading"
       element-loading-background="rgba(0, 0, 0, 0.8)">
    <div class="title">图文审核</div>
    <div class="filter-container r-menu" style="margin-top:20px;margin-left:20px;margin-right:20px">
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <el-tab-pane name="1">
          <el-button class="audit_btn" slot="label">待审核</el-button>
          <el-input class="filter-item czm_input" v-model="listQuery.title" clearable placeholder="请输入图文标题"></el-input>
          <el-button @click="loadRotationData(1)" type="primary" icon="el-icon-search" size="small" style="margin-left: 10px" >查询</el-button>
          <!-- 表格 -->
          <el-table
            :data="tablelist"
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
            <!-- 序号 -->
            <el-table-column align="center" width="60px" label="序号">
              <template slot-scope="scope">
                <span>{{scope.$index + 1}}</span>
              </template>
            </el-table-column>
            <el-table-column width="300" align="center" label="图文标题">
              <template slot-scope="scope">
                <a title="点击查看详情" class="table-title" @click="showInfo(scope.row)" >{{scope.row.title}}</a>
              </template>
            </el-table-column>
            <el-table-column align="center" label="排序">
              <template slot-scope="scope">
                <span>{{scope.row.bannerSort}}</span>
              </template>
            </el-table-column>
            <el-table-column width="300" align="center" label="封面图片">
              <template slot-scope="scope">
                <span>{{scope.row.bannerImg}}</span>
              </template>
            </el-table-column>
            <el-table-column width="300" align="center" label="原文链接">
              <template slot-scope="scope">
                <span>{{scope.row.originalLinked}}</span>
              </template>
            </el-table-column>
            <el-table-column width="160" align="center" label="发布时间">
              <template slot-scope="scope">
                <span>{{scope.row.createTime}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" width="120" label="发布人">
              <template slot-scope="scope">
                <span>{{scope.row.createUser}}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="120" fixed="right">
              <template slot-scope="scope">
                <div style="text-align: center">
                  <diy-btn
                    styleType="icon" iconType="icon-pass"
                    v-if="scope.row.state=1"
                    @click="Auditpass(scope.row.id,scope.row.state)">通过
                  </diy-btn>
                  <diy-btn
                    styleType="icon" iconType="icon-unpass"
                    v-if="scope.row.state=1"
                    @click="Auditrejected(scope.row)">驳回
                  </diy-btn>
                </div>
              </template>
            </el-table-column>
          </el-table>
          <div class="block">
            <el-pagination
              style="text-align: center"
              :page-sizes="[10,20,30, 50]"
              :page-size="10"
              layout="total,  prev, pager, next, jumper"
              :current-page="listQuery.pageNumber"
              @current-change="handleCurrentChange"
              :total="total"
            ></el-pagination>
          </div>
        </el-tab-pane>
        <el-tab-pane name="2">
          <el-button class="audit_btn" slot="label">审核记录</el-button>
          <el-input class="filter-item czm_input" v-model="listQuerydata.title" clearable placeholder="请输入图文标题"></el-input>
          <el-button @click="loadRotationDatalist(1)" type="primary" icon="el-icon-search" style="margin-left: 10px" size="small">查询</el-button>
          <el-table
            :data="tablelistdata"
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
            <!-- 序号 -->
            <el-table-column align="center" width="60px" label="序号">
              <template slot-scope="scope">
                <span>{{scope.$index + 1}}</span>
              </template>
            </el-table-column>
            <el-table-column width="300" align="center" label="图文标题">
              <template slot-scope="scope">
                <a title="点击查看详情" class="table-title" @click="showInfo(scope.row)">{{scope.row.title}}</a>
              </template>
            </el-table-column>
            <el-table-column width="80" align="center" label="排序">
              <template slot-scope="scope">
                <span>{{scope.row.bannerSort}}</span>
              </template>
            </el-table-column>
            <el-table-column width="300" align="center" label="原文链接">
              <template slot-scope="scope">
                <span>{{scope.row.originalLinked}}</span>
              </template>
            </el-table-column>
            <el-table-column width="160" align="center" label="发布时间">
              <template slot-scope="scope">
                <span>{{scope.row.createTime}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" width="120" label="发布人">
              <template slot-scope="scope">
                <span>{{scope.row.createUser}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="状态">
              <template slot-scope="scope">
                <span>{{scope.row.state == '1' ? '待审核' : scope.row.state == '2' ? '审核通过 ' : scope.row.state == '3' ? '审核驳回' : "--"}}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="80" fixed="right">
              <template slot-scope="scope">
                <div style="text-align: center">
                  <diy-btn
                    styleType="icon" iconType="icon-unpass_reason"
                    v-if="scope.row.state!=1&&scope.row.state!=2"
                    @click="lookrejected(scope.row.rejectReason)"
                  >驳回原因
                  </diy-btn>
                </div>
              </template>
            </el-table-column>
          </el-table>
          <div class="block">
            <el-pagination
              style="text-align: center"
              :page-sizes="[10,20,30, 50]"
              :page-size="10"
              layout="total,  prev, pager, next, jumper"
              :current-page="listQuerydata.pageNumber"
              @current-change="handleCurrentChange1"
              :total="total1"
            ></el-pagination>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <el-dialog title="图文详情" class="info-dialog" :visible.sync="dialogTableVisible">
      <show-info :data="tableInfo" :options="option"></show-info>
    </el-dialog>
  </div>
</template>
<script>
  import { imageTextDetail } from "@/api/search";
  import {
    getRotationData,
    insertCarousel,
    handDelInterface,
    imageTextByPage,
    deleteImageText,
    imageTextAudit
  } from "@/api/rotation";
  import showInfo from "@/views/rotationchart/showInfo.vue";

  export default {
    components: {
      showInfo
    },
    data() {
      // 验证是否整数
      var isInteger = (rule, value, callback) => {
        if (!value) {
          return callback(new Error("输入不可以为空"));
        }
        setTimeout(() => {
          if (!Number(value)) {
            callback(new Error("请输入正整数"));
          } else {
            const re = /^[0-9]*[1-9][0-9]*$/;
            const rsCheck = re.test(value);
            if (!rsCheck) {
              callback(new Error("请输入正整数"));
            } else {
              callback();
            }
          }
        }, 1000);
      };
      return {
        fileLoading: false,
        activeName: "1",
        headerType: {"Content-Type": "multipart/form_data"},
        actionUrl: "http://132.10.10.42:8765/yzyjy/thesis/get/url",
        tablelist: [],
        tablelistdata: [],
        dialogVisible: false,
        form: {
          carouselUrl: "",
          carouselName: "",
          orderBy: "",
          carouselType: 1,
          state: 1
        },
        listQuery: {
          pageNumber: 1,
          title: null,
          state: 1
        },
        listQuerydata: {
          pageNumber: 1,
          title: null,
          state: -2
        },
        listdata: {
          pageNumber: 1,
          title: null,
        },
        total1: null,
        total: null,
        state: true,
        subDisabled: false,
        carRules: {
          carouselName: [
            {required: true, message: "请输入图文名称", trigger: "blur"}
          ],
          orderBy: [
            {required: true, message: "请输入正整数", trigger: "blur"},
            {validator: isInteger, trigger: "blur"}
          ]
        },
        dialogTableVisible:false,
        tableInfo: {},
        option: {
          title: "title",
          content: "content",
          originalLink: "originalLinked",
          banner: "bannerImg",
          sort: "bannerSort"
        },
      };
    },
    mounted() {
      this.loadRotationData();
      this.loadRotationDatalist();
    },
    created: function () {
    },
    filters: {},
    methods: {
      showInfo(val) {
        console.log(val);
        imageTextDetail(val.id).then(res => {
          console.log(res.data.data);
          if(res.data.code == 1) {
            this.dialogTableVisible = true;
            this.tableInfo = res.data.data
          } else {
            this.$message.warning(res.data.msg);
          }
        })
      },
      handleTabClick() {
        this.listQuery.title = '';
        this.listQuerydata.title = '';
      },
      //查看驳回原因
      lookrejected(rejectReason) {
        this.$alert(`${rejectReason}`, '驳回原因',{
          confirmButtonText: '确定',
          callback: action => {
          }
        });
      },
      // handleTabClick(){
      //   if (this.activeName === "1") {
      //     this.handleGetList(this.listQuery);
      //   } else if (this.activeName === "2") {
      //     this.loadRotationData(this.listQuerydata);
      //   }
      // },
      // 驳回
      // Auditrejected(id,state) {
      //   this.$prompt("请输入驳回原因：", "提示", {
      //     confirmButtonText: "确定",
      //     cancelButtonText: "取消",
      //     inputPattern: /\S/,
      //     inputErrorMessage: "驳回原因不能为空"
      //   })
      //     .then(({ value }) => {
      //       this.rejected(id)
      //     })
      //
      // },
      // 驳回
      Auditrejected(row) {
        this.$prompt("请输入驳回原因：", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          inputPattern: /\S{5,100}/,
          inputErrorMessage: "驳回原因不能少于5个字！"
        })
          .then(({value}) => {
            this.fileLoading = true;
            let params = {
              state: 3,
              rejectReason: value,
              id: row.id
            };
            this.handleDoAudit(params)
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "取消输入"
            });
          });
      },
      // 执行审核/驳回
      handleDoAudit(params) {
        imageTextAudit(params).then(res => {
          console.log(res);
          if (res.data.code === 1) {
            this.$message.success("操作成功！");
            // 更新数据
            this.loadRotationData();
            this.loadRotationDatalist();
          } else {
            this.$message.error(res.data.msg);
            this.fileLoading = false;
          }
        });
      },
      // 驳回
      rejected(id) {
        let params = {
          id: id,
          state: 3
        };
        imageTextAudit(params).then(res => {
          if (res.data.code == 1) {
            this.$message({
              message: '驳回成功',
              type: 'success'
            });
            this.loadRotationData();
            this.loadRotationDatalist();
          }

        })
      },
      // 通过
      Auditpass(id,state){
        this.$confirm('此操作将执行通过操作, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.fileLoading = true;
          let params = {
            id: id,
            state: 2
          };
          imageTextAudit(params).then(res => {
            if (res.data.code == 1) {
              this.$message({
                message: '通过成功',
                type: 'success'
              });
              this.fileLoading = false;
              this.loadRotationData();
              this.loadRotationDatalist();

            }else{
              this.fileLoading = false;
              this.$message.error(res.data.msg)
            }
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消通过'
          });
        });
      },
      getContent() {
        let str = window.tinymce.get(this.tinymceId).getContent();
        this.$set(this.form, 'content', str);
      },
      handlePreview(file) {
        console.log(file);
      },
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      // 状态字段获取值
      getState(val) {
        if (val == 1) {
          this.form.state = '待审核';
        } else if (val == 2) {
          this.form.state = '不是';
        }
      },
      upload2(response, file, fileList) {
        this.form.carouselUrl = response.data.fileUrl;
        if (this.form.carouselUrl && response.code == 1) {
          this.$alert("上传成功", "提示", {
            type: "success"
          });
        } else {
          this.$alert("上传失败", "提示", {
            type: "error"
          });
        }
      },
      handleCreate() {
        var _this = this;
        // if (_this.form.carouselUrl == "") {
        //   _this.$message.error("请上传图片");
        //   return false;
        // }
        _this.$refs.form.validate(valid => {
          _this.subDisabled = false;
          if (valid) {
            _this.listLoading = true;
            insertCarousel(_this.form).then(function (res) {
              if (res.data.code == 1) {
                _this
                  .$confirm("添加成功,是否返回列表", "提示", {
                    type: "success"
                  })
                  .then(() => {
                    _this.subDisabled = false;
                    _this.dialogVisible = false;
                    _this.listLoading = false;
                    _this.loadRotationData();
                  })
                  .catch(() => {
                    _this.$message.info("已取消");
                    _this.subDisabled = false;
                  });
              } else {
                _this.listLoading = false;
                _this.$message.error(res.data.msg);
                return false;
              }
            });
          } else {
            return false;
          }
        });
      },
      //删除某条数据
      delCarousel(id) {
        var _this = this;
        _this
          .$confirm("是否删除", "提示", {
            type: "warning"
          })
          .then(function () {
            console.log(id, '11');

            deleteImageText(id).then(res => {
              if (res.data.code != "1") {
                _this.$message.error(res.data.msg);
                return false;
              } else {
                _this.$message.success("删除成功");
                _this.loadRotationData();
                _this.loadRotationDatalist();
              }
            })
          }).catch(() => {
              _this.$message.info("已取消删除");
            });
      },
      beforeChange(file, fileList) {
        if (fileList.length > 1) {
          fileList.splice(0, 1);
        }
        // console.log(fileList)
        // console.log(file)
      },
      resetTemp(){
        this.form = {
          carouselUrl: "",
          carouselName: "",
          orderBy: "",
          carouselType: 1,
          state: 1
        }
      },
      // 轮播列表
      bannerPublish() {
        this.resetTemp();
        this.dialogVisible = true;
      },

      handleCurrentChange(val) {
        // console.log(`当前页: ${val}`)
        this.listQuery.pageNumber = val;
        this.loadRotationData();
      },
      handleCurrentChange1(val) {
        // console.log(`当前页: ${val}`)
        this.listQuerydata.pageNumber = val;
        this.loadRotationDatalist();
      },
      //待审核列表
      loadRotationData(val) {
        if (val) {
          this.listQuery.pageNumber = 1;
        }
        let params = this.listQuery;
        imageTextByPage(params).then(res => {
          console.log(res);
          this.fileLoading = false;
          // this.listQuery.pageNumber = 1;
          this.tablelist = res.data.data.rows;
          this.total = res.data.data.total;
        });
      },
      //审核通过列表
      loadRotationDatalist(val) {
        if (val) {
          this.listQuerydata.pageNumber = 1;
        }
        let params = this.listQuerydata;
        imageTextByPage(params).then(res => {
          console.log(res);
          // this.listQuery.pageNumber = 1;
          this.tablelistdata = res.data.data.rows;
          this.total1 = res.data.data.total;
        });
      },
    }
  };
</script>
<style rel="stylesheet/scss" lang="scss" scoped>

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
  .icon_pointer {
    cursor: pointer;
  }
  .czm_input {
    width: 200px;
  }
  .audit_btn {
    border: none;
    position: relative;
    z-index: 22;
    height: 36px;
  }
  .audit_btn:hover,
  .audit_btn:active,
  .audit_btn:focus {
    color: #009A52;
    background: transparent;
  }
  .r-menu >>> .el-tabs__active-bar {
    background-color:#009A52;
  }
  .r-menu >>> .is-active .audit_btn {
    color: #009A52;
  }
  .table-title {
  cursor: pointer;
  }
  .table-title:hover {
    color:#009a52;
  }

</style>
