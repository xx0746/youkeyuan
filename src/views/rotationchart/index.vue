<template>
  <div>
    <div class="title" style="margin-top:0px">图文列表</div>
    <div class="content">
      <el-row style="overflow: hidden">
        <div style="float: left;width:200px">
          <el-input v-model="listQuery.title" clearable placeholder="请输入图文标题"></el-input>
        </div>
        <div style="float: left;margin-left:14px;">
          <el-button
            @click="loadRotationData(1)"
            type="primary"
            icon="el-icon-search"
            size="small"
          >查询</el-button>
          <!--<el-button @click="bannerPublish" type="primary" size="small">发布</el-button>-->
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
        <el-table-column align="center" width="60px" label="序号">
          <template slot-scope="scope">
            <span>{{scope.$index+1}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" width="300px" label="图文标题">
          <template slot-scope="scope">
            <div>{{scope.row.title}}</div>
          </template>
        </el-table-column>
        <!--<el-table-column align="center" label="是否展示">-->
        <!--<template slot-scope="scope">-->
        <!--<span>{{scope.row.STATE | getState}}</span>-->
        <!--</template>-->
        <!--</el-table-column>-->
        <el-table-column align="center" label="排序">
          <template slot-scope="scope">
            <span>{{scope.row.bannerSort}}</span>
          </template>
        </el-table-column>
        <el-table-column width="300px" align="center" label="封面图片">
          <template slot-scope="scope">
            <span>{{scope.row.bannerImg}}</span>
          </template>
        </el-table-column>
        <el-table-column width="300px" align="center" label="原文链接">
          <template slot-scope="scope">
            <span>{{scope.row.originalLinked}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" width="160" label="发布时间">
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
            <diy-btn styleType="icon" iconType="icon-edit" @click="updCarouselNum(scope.row.id)">修改排序</diy-btn>
            <diy-btn styleType="icon" iconType="icon-del" @click="delCarousel(scope.row.id)">删除</diy-btn>
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
  </div>
</template>
<script>
import {
  getRotationData,
  updImageText,
  handDelInterface,
  imageTextByPage,
  deleteImageText,
} from "@/api/rotation";
export default {
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
      headerType: { "Content-Type": "multipart/form_data" },
      actionUrl: "http://132.10.10.42:8765/yzyjy/thesis/get/url",
      tablelist: [],
      dialogVisible: false,
      form: {
        carouselUrl: "",
        carouselName: "",
        orderBy: "",
        carouselType: 1,
        state: 1,
      },
      listQuery: {
        pageNumber: 1,
        title: null,
        state: 2,
      },
      total: null,
      state: true,
      subDisabled: false,
      carRules: {
        carouselName: [
          { required: true, message: "请输入图文名称", trigger: "blur" },
        ],
        orderBy: [
          { required: true, message: "请输入正整数", trigger: "blur" },
          { validator: isInteger, trigger: "blur" },
        ],
      },
    };
  },
  mounted() {
    this.loadRotationData();
  },
  created: function () {},
  filters: {},
  methods: {
    getContent() {
      let str = window.tinymce.get(this.tinymceId).getContent();
      this.$set(this.form, "content", str);
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
        this.form.state = "待审核";
      } else if (val == 2) {
        this.form.state = "不是";
      }
    },
    upload2(response, file, fileList) {
      this.form.carouselUrl = response.data.fileUrl;
      if (this.form.carouselUrl && response.code == 1) {
        this.$alert("上传成功", "提示", {
          type: "success",
        });
      } else {
        this.$alert("上传失败", "提示", {
          type: "error",
        });
      }
    },

    //修改排序号
    updCarouselNum(id){
      var _this = this;
      _this.$prompt('请输入排序号', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /^-?[1-9]\d*$/,
          inputErrorMessage: '只能输入整数。'
        }).then(({ value }) => {
          let datas = {
            id:id,
            bannerSort:value
          }
          updImageText(datas).then((res) => {
            if (res.data.code != "1") {
              _this.$message.error(res.data.msg);
              return false;
            } else {
              _this.$message.success("更新排序号成功");
              _this.loadRotationData();
            }
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消输入'
          });
        });
    },
    //删除某条数据
    delCarousel(id) {
      var _this = this;
      _this
        .$confirm("是否删除", "提示", {
          type: "warning",
        })
        .then(function () {
          console.log(id, "11");
          deleteImageText(id).then((res) => {
            if (res.data.code != "1") {
              _this.$message.error(res.data.msg);
              return false;
            } else {
              _this.$message.success("删除成功");
              _this.loadRotationData();
            }
          });
        })
        .catch(() => {
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
    resetTemp() {
      this.form = {
        carouselUrl: "",
        carouselName: "",
        orderBy: "",
        carouselType: 1,
        state: 1,
      };
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
      if (val) {
        this.listQuery.pageNumber = 1;
      }
      let params = this.listQuery;
      imageTextByPage(params).then((res) => {
        console.log(res);
        // this.listQuery.pageNumber = 1;
        this.tablelist = res.data.data.rows;
        this.total = res.data.data.total;
      });
    },
  },
};
</script>
<style rel="stylesheet/scss" lang="scss">
.serch-btn {
  margin-left: 14px;
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
</style>
