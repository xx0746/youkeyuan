<template>
  <div>
    <div class="title" style="margin-top:0px">发布记录</div>
    <div class="content">
      <el-row style="overflow: hidden">
        <div style="float: left;width:200px">
          <el-input v-model="listQuery.title" clearable placeholder="请输入图文标题"></el-input>
        </div>
        <div class="serch-btn">
          <el-button @click="loadRotationData(1)" type="primary" icon="el-icon-search" size="small">查询</el-button>
        </div>
      </el-row>
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
        <el-table-column align="center"  width="60px" label="序号">
          <template slot-scope="scope">
            <span>{{scope.$index+1}}</span>
          </template>
        </el-table-column>
        <el-table-column width="300"  align="center" label="图文标题">
          <template slot-scope="scope">
            <a title="点击查看详情" class="table-title" @click="showInfo(scope.row)">{{scope.row.title}}</a>
          </template>
        </el-table-column>
        <el-table-column width="80" align="center" label="排序">
          <template slot-scope="scope">
            <span v-show="bannerSort1">{{scope.row.bannerSort}}</span>
            <span v-show="bannerSort2">{{scope.$index+1}}</span>
          </template>
        </el-table-column>
        <el-table-column  width="300" align="center" label="封面图片">
          <template slot-scope="scope">
            <span>{{scope.row.bannerImg}}</span>
          </template>
        </el-table-column>
        <el-table-column  width="300" align="center" label="原文链接">
          <template slot-scope="scope">
            <span>{{scope.row.originalLinked}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"  width="120" label="发布人">
          <template slot-scope="scope">
            <span>{{scope.row.createUser}}</span>
          </template>
        </el-table-column>
        <el-table-column  width="160" align="center" label="发布时间">
          <template slot-scope="scope">
            <span>{{scope.row.createTime}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="状态">
          <template slot-scope="scope">
            <span>{{scope.row.state == '1' ? '待审核' : scope.row.state == '2' ? '通过 ' : scope.row.state == '3' ? '驳回' : "--"}}</span>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="80" fixed="right">
          <template slot-scope="scope">
            <div style="text-align: center">
              <diy-btn
                styleType="icon" iconType="icon-unpass_reason"
                v-if="scope.row.state!=1&&scope.row.state!=2"
                @click="lookrejected(scope.row.rejectReason)"
              >驳回原因</diy-btn>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 分页组件 -->
    <div class="pagepostion">
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
    <el-dialog title="图文详情" class="info-dialog" :visible.sync="dialogTableVisible">
      <show-info :data="tableInfo" :options="option"></show-info>
    </el-dialog>
  </div>
</template>
<script>
  import showInfo from "@/views/rotationchart/showInfo.vue";
  import {
    getRotationData,
    insertCarousel,
    handDelInterface,
    imageTextByPage,
    deleteImageText
  } from "@/api/rotation";
  import { imageTextDetail } from "@/api/search";
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
        bannerSortlist:'',
        bannerSort1:true,
        bannerSort2:false,
        headerType: { "Content-Type": "multipart/form_data" },
        actionUrl: "http://132.10.10.42:8765/yzyjy/thesis/get/url",
        tablelist: [],
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
        },
        total: null,
        state: true,
        subDisabled: false,
        carRules: {
          carouselName: [
            { required: true, message: "请输入图文名称", trigger: "blur" }
          ],
          orderBy: [
            { required: true, message: "请输入正整数", trigger: "blur" },
            { validator: isInteger, trigger: "blur" }
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
    created() {},
    mounted() {
      this.loadRotationData();
    },
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
      //查看驳回原因
      lookrejected(rejectReason){
        this.$alert(`${rejectReason}`, '驳回原因',{
          confirmButtonText: '确定',
          callback: action => {
          }
        });
      },
      getContent() {
        let str = window.tinymce.get(this.tinymceId).getContent();
        this.$set(this.form,'content',str);
      },
      handlePreview(file) {
        console.log(file);
      },
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      // 状态字段获取值
      getState(val) {
        if (val==1) {
          this.form.state = '待审核';
        } else if(val==2) {
          this.form.state ='不是';
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
        _this.$refs.form.validate(valid => {
          _this.subDisabled = false;
          if (valid) {
            _this.listLoading = true;
            insertCarousel(_this.form).then(function(res) {
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
          .then(function() {
            console.log(id,'11');
            deleteImageText(id).then(res => {
              if (res.data.code != "1") {
                _this.$message.error(res.data.msg);
                return false;
              } else {
                _this.$message.success("删除成功");
                _this.loadRotationData();
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
      //列表
      loadRotationData(val) {
        if(val){
          this.listQuery.pageNumber = 1;
        }
        let params = this.listQuery;
        imageTextByPage(params).then(res => {
          console.log(res);
          this.bannerSort1 = true;
          this.bannerSort2 = false;
          // this.listQuery.pageNumber = 1;
          this.tablelist = res.data.data.rows;
          this.total = res.data.data.total;
        });
      },

    }
  };
</script>
<style rel="stylesheet/scss" lang="scss">
  .serch-btn {
    margin-left: 14px;
    float: left;
  }

  #banner-table {
    margin-top: 30px;
    .el-button--primary {
      background-color: #409eff;
    }
    .el-table__header {
      text-align: center !important;
    }
  }

  .content {
    padding: 20px;
  }
  .pagepostion {
    margin: 0 auto;
  }
  .table-title {
  cursor: pointer;
  }
  .table-title:hover {
    color:#009a52;
  }
</style>
