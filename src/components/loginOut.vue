<template>
  <div class="loginout">
    <!--<i class="el-icon-bell" style="font-size:16px;font-weight: bold;margin-right: 40px;font-family: 'Avenir', Helvetica, Arial, sans-serif" @click="Update" v-show="news"> 最新消息</i>-->
    <i
      class="el-icon-arrow-left"
      style="font-size: 16px; font-weight: bold; margin-left: 40px"
      @click="goindex"
      v-show="iconfont"
      >返回首页</i
    >
    <el-dropdown trigger="click" v-show="AgentNews" class="userinfo-inner">
      <span class="el-dropdown-link">
        <i id="lingDang"></i>
        <!--<i class="el-icon-caret-bottom icon-style" style="margin-right: -25px"></i>-->
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item>
          <span @click="AgentInformation(1)">
            知识管理入库待审核(
            <span>{{ toBeAudit.iThesisDshCount }}</span
            >)
          </span>
        </el-dropdown-item>
        <el-dropdown-item>
          <span @click="AgentInformation(2)">
            知识管理下载待审核(
            <span>{{ toBeAudit.iApplyFileDshCount }}</span
            >)
          </span>
        </el-dropdown-item>
        <el-dropdown-item>
          <span @click="AgentInformation(3)" v-show="DisplayAudit">
            数据管理入库待审核(
            <span>{{ toBeAudit.iBaseCollectDshCount }}</span
            >)
          </span>
        </el-dropdown-item>
        <el-dropdown-item>
          <span @click="AgentInformation(4)" v-show="DisplayAudit">
            数据管理下载待审核(
            <span>{{ toBeAudit.iDataDownCount }}</span
            >)
          </span>
        </el-dropdown-item>
        <el-dropdown-item>
          <span @click="AgentInformation(8)" v-show="DisplayAudit">
            评论待审核(
            <span>{{ toBeAudit.iResourceCommentCount }}</span
            >)
          </span>
        </el-dropdown-item>
        <el-dropdown-item>
          <span @click="AgentInformation(7)" v-show="DisplayAudit">
            公告待审核(
            <span>{{ toBeAudit.iSysNoticeCount }}</span
            >)
          </span>
        </el-dropdown-item>
        <el-dropdown-item>
          <span @click="AgentInformation(5)" v-show="DisplayAudit">
            图文待审核(
            <span>{{ toBeAudit.iImageTextDshCount }}</span
            >)
          </span>
        </el-dropdown-item>
        <el-dropdown-item>
          <span @click="AgentInformation(6)" v-show="DisplayAudit">
            动态待审核(
            <span>{{ toBeAudit.iSystemDynamicCount }}</span
            >)
          </span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <el-dropdown
      trigger="click"
      class="userinfo-inner"
      style="line-height: 48px"
      @click="Update"
      v-show="news"
    >
      <span class="el-dropdown-link lingdang">
        <i id="lingDangResource"></i>
        <!--<i class="el-icon-caret-bottom icon-style" style="margin-right: -25px"></i>-->
      </span>
      <el-dropdown-menu
        slot="dropdown"
        style="
          outline: none;
          overflow-y: scroll;
          overflow-x: scroll;
          top: 75px;
          height: 250px;
        "
        v-if="newslength"
      >
        <el-dropdown-item
          v-for="(item, index) in theLatesNews"
          :key="index"
          class="resourcesStyle"
        >
          <a
            v-show="item.noticeInfo.indexOf('文件下载申请已通过审核') != -1"
            :class="item.hasOwnProperty('type') ? 'newStyle' : 'newStyle'"
            @click="noticeToResource(item.fileId)"
            style="cursor: pointer"
            >{{ item.noticeInfo }}</a
          >
          <div
            v-if="item.noticeInfo.indexOf('文件下载申请已通过审核') === -1"
            :class="item.hasOwnProperty('type') ? 'newStyle' : 'newStyles'"
          >
            {{ item.noticeInfo }}
          </div>
        </el-dropdown-item>
      </el-dropdown-menu>
      <el-dropdown-menu style="outline: none" v-else>
        <el-dropdown-item class="resourcesStyle">
          <div>暂无消息</div>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <el-dropdown trigger="click" class="userinfo-inner" style="width: 205px">
      <span class="el-dropdown-link" style="font-size: 20px">
        <i class="iconfont icon-user icon-style"></i>
        <span class="nickname">{{ nickname }}</span>
        <i class="el-icon-caret-bottom icon-style"></i>
      </span>
      <el-dropdown-menu slot="dropdown" id="dropdown-box" style="top: 60px">
        <el-dropdown-item>
          <span @click="modifyPwd">修改密码</span>
        </el-dropdown-item>
        <el-dropdown-item divided @click.native="logout"
          >退出登录</el-dropdown-item
        >
      </el-dropdown-menu>
    </el-dropdown>
    <el-button
      @click="gobackindex()"
      size="small"
      type="primary"
      style="margin-left: 30px; font-weight: 700; font-size: 14px"
      v-show="showlogin"
      >资源应用登录
    </el-button>
    <!-- 修改密码 弹窗 -->
    <el-dialog
      title="修改密码"
      class="dialogTitle"
      :visible.sync="dialogFormVisible"
      style="padding-left: 10%; padding-right: 10%"
    >
      <el-form
        ref="modifyPwdForm"
        :model="modifyPwdForm"
        label-width="100px"
        style="width: 85%; margin-left: 5%"
      >
        <el-form-item label="登录名：" style="margin-top: -5px">
          <el-input
            v-model="modifyPwdForm.loginName"
            disabled="disabled"
          ></el-input>
        </el-form-item>
        <el-form-item label="姓名：" style="margin-top: -5px">
          <el-input
            v-model="modifyPwdForm.userName"
            disabled="disabled"
          ></el-input>
        </el-form-item>

        <el-form-item label="原密码：" style="margin-top: -5px">
          <el-input
            type="password"
            v-model="modifyPwdForm.oldPassword"
          ></el-input>
        </el-form-item>

        <el-form-item label="密码：" style="margin-top: -5px">
          <el-input type="password" v-model="modifyPwdForm.password"></el-input>
        </el-form-item>

        <el-form-item label="确认密码：" style="margin-top: -5px">
          <el-input
            type="password"
            v-model="modifyPwdForm.newPassword"
          ></el-input>
        </el-form-item>

        <el-form-item>
          <el-button
            size="small"
            style="margin-left: 15%"
            type="primary"
            :disabled="subDisabled"
            @click="modifyPwdFormClick"
            >提交
          </el-button>
          <el-button
            type="primary4"
            size="small"
            @click="dialogFormVisible = false"
            style="margin-left: 15%"
            >取消
          </el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 最新消息列表 弹窗 -->
    <!--<el-dialog-->
    <!--title="最新消息列表"-->
    <!--:visible.sync="centerDialogVisible"-->
    <!--width="70%"-->
    <!--center>-->
    <!--<el-table border  :data="theLatesNews" style="font-family: 'Avenir', Helvetica, Arial, sans-serif; font-weight:400">-->
    <!--<el-table-column  label="名称">-->
    <!--<template slot-scope="scope">-->
    <!--<div style="text-align: left">{{scope.row.NOTICE_INFO}}</div>-->
    <!--</template>-->
    <!--</el-table-column>-->
    <!--<el-table-column  property="ACQ_TIME" label="时间"></el-table-column>-->
    <!--</el-table>-->
    <!--<el-pagination-->
    <!--style="text-align: center;margin-top: 10px"-->
    <!--:page-size="10"-->
    <!--:current-page="theLatestWord.pageNumber"-->
    <!--@current-change="handleCurrentChange"-->
    <!--layout="total,prev, pager, next, jumper"-->
    <!--:total="total"-->
    <!--&gt;</el-pagination>-->
    <!--<div style="text-align: center;margin-top: 10px;">-->
    <!--<el-button @click="centerDialogVisible = false">取 消</el-button>-->
    <!--<el-button type="primary" @click="centerDialogVisible = false">确 定</el-button>-->
    <!--</div>-->
    <!--</el-dialog>-->
  </div>
</template>
<script>
import {
  getModifyPwdInterface,
  getNoticeAudit,
  gettoBeAudit,
  loginOutInterface,
} from "@/api/login";
import { getnewMessagesList } from "@/api/search";

export default {
  name: "loginOut",
  props: ["showlogins", "Updatenews", "icon"],
  data() {
    return {
      meta: "",
      newslength: true,
      toBeAudit: [],
      DisplayAudit: true,
      AgentNews: false,
      news: false,
      total: null,
      // 获取最新消息栏信息参数
      theLatestWord: {
        userId: 1,
        pageSize: 10,
        pageNumber: 1,
      },
      centerDialogVisible: false,
      showlogin: false,
      iconfont: false,
      nickname: "",
      dialogFormVisible: false,
      theLatesNews: [],
      modifyPwdForm: {
        loginName: "",
        userName: "",
        oldPassword: "",
        password: "",
        newPassword: "",
      },
      subDisabled: false,
    };
  },
  methods: {
    noticeToResource(fileId) {
      if (this.$router.path !== "/comment") {
        getNoticeAudit(fileId).then((res) => {
          if (res.data.code === 1) {
            let rowInfo = {
              icon: 1,
              createTime: res.data.data.createTime,
              menuName: res.data.data.menuName,
              menuId: res.data.data.menuId,
              id: res.data.data.resourceId,
              name: res.data.data.resourceName,
              resourceId: res.data.data.resourceId,
              createUser: res.data.data.createUser,
              labelIds: res.data.data.labelIds,
            };
            console.log(rowInfo);
            this.$store.commit("setReview", rowInfo);
            this.$router.push({
              path: "/comment",
              query: {
                icon: 1,
              },
            });
          } else {
            thie.$message.warning("发生错误，请操作其它！");
          }
        });
      } else {
        this.$parent.noticeToResource(fileId);
      }
    },
    getToBeAudits() {
      gettoBeAudit().then((res) => {
        if (res.data.code === 1) {
          this.toBeAudit = res.data.data;
          let a = this.toBeAudit.iApplyFileDshCount;
          let b = this.toBeAudit.iBaseCollectDshCount;
          let c = this.toBeAudit.iDataDownCount;
          let d = this.toBeAudit.iImageTextDshCount;
          let e = this.toBeAudit.iResourceCommentCount;
          let f = this.toBeAudit.iSystemDynamicCount;
          let j = this.toBeAudit.iThesisDshCount;
          let arr = [];
          for (let i in this.toBeAudit) {
            arr.push(this.toBeAudit[i]);
          }
          if (arr.length === 2) {
            if (a === 0 && j === 0) {
              $("#lingDang")
                .removeClass("daiban-iconNew")
                .addClass("daiban-icon");
            } else {
              $("#lingDang")
                .removeClass("daiban-icon")
                .addClass("daiban-iconNew");
            }
          } else {
            if (
              a === 0 &&
              b === 0 &&
              c === 0 &&
              d === 0 &&
              e === 0 &&
              f === 0 &&
              j === 0
            ) {
              $("#lingDang")
                .removeClass("daiban-iconNew")
                .addClass("daiban-icon");
            } else {
              $("#lingDang")
                .removeClass("daiban-icon")
                .addClass("daiban-iconNew");
            }
          }
          window.sessionStorage.setItem(
            "iDataDownCount",
            this.toBeAudit.iDataDownCount
          );
        }
      });
    },
    AgentInformation(val) {
      switch (val) {
        case 1:
          this.$router.push({
            path: "/resource/warehousaudit",
          });
          break;
        case 2:
          this.$router.push({
            path: "/resource/downexamine",
          });
          break;
        case 3:
          this.$router.push({
            path: "/data/audit",
          });
          break;
        case 4:
          this.$router.push({
            path: "/data/down",
          });
          break;
        case 5:
          this.$router.push({
            path: "/rotationchart/Toexamine",
          });
          break;
        case 6:
          this.$router.push({
            path: "/dynamic/audit",
          });
          break;
        case 7:
          this.$router.push({
            path: "/notice/audit",
          });
          break;
        case 8:
          this.$router.push({
            path: "/resview/index",
          });
          break;
        default:
          break;
      }
    },
    handleCurrentChange(val) {
      this.theLatestWord.pageNumber = val;
      this.getNewsInfo();
    },
    // 最新消息
    Update() {
      this.centerDialogVisible = true;
      this.getNewsInfo();
    },
    // 获取最新消息
    getNewsInfo() {
      getnewMessagesList(this.theLatestWord).then((res) => {
        if (res.data.code === 1) {
          this.total = res.data.data.total;
          var arr = [];
          for (var key in res.data.data) {
            if (res.data.data[key] instanceof Array) {
              var noticeInfo = { noticeInfo: key, type: "1" };
              arr.push(noticeInfo);
              for (var j = 0; j < res.data.data[key].length; j++) {
                arr.push(res.data.data[key][j]);
              }
            }
          }
          this.theLatesNews = arr;
          if (this.theLatesNews.length === 0) {
            $("#lingDangResource")
              .removeClass("lingDang-iconNew")
              .addClass("lingDang-icon");
          } else {
            $("#lingDangResource")
              .removeClass("lingDang-icon")
              .addClass("lingDang-iconNew");
          }
          if (arr.length === 0) {
            this.newslength = false;
          } else {
            this.newslength = true;
          }
        }
      });
    },
    showButton() {
      if (this.showlogins !== undefined) {
        if (this.showlogins.state === true) {
          if (this.showlogins.type === 1) {
            this.showlogin = true;
          }
          if (
            window.sessionStorage.getItem("roleName") === "数据审核员" ||
            window.sessionStorage.getItem("roleName") === "部门数据审核员" ||
            window.sessionStorage.getItem("roleName") === "系统管理员"
          ) {
            this.AgentNews = true;
          }
        } else {
          this.showlogin = false;
        }
      }
    },
    gobackindex() {
      // let roleName = window.sessionStorage.getItem("roleName");
      this.$router.push({
        path: "/resbsearch",
      });
    },
    goiconfont() {
      console.log(this.$route.query.icon);
      if (this.$route.query.icon === "1") {
        this.iconfont = true;
      } else {
        this.iconfont = false;
      }
    },
    goindex() {
      this.$router.push({ path: "/resbsearch" });
    },
    // 退出登录
    logout() {
      let that = this;
      this.$confirm("确认退出吗?", "提示", {
        confirmButtonClass: "el-button--warning",
        cancelButtonClass: "is-plain",
      })
        .then(() => {
          //确认
          //后台接口。
          loginOutInterface().then((res) => {
            if (res.data.code === 1) {
              // let userType = window.sessionStorage.getItem("userType");
              // window.sessionStorage.clear();
              // if (userType === 2) {
              //   that.$router.push({ path: "/login" });
              // } else {
              //   that.$router.push({ path: "/loginsys" });
              // }
              // window.localStorage.clear();
              console.log(that.meta);
              if (that.meta === "enterprise") {
                that.$router.push({ path: "/loginsys" });
              } else if (that.meta === "login") {
                that.$router.push({ path: "/login" });
              }
            } else {
              that.$message.warning(res.data.msg);
            }
          });
          // that.$router.go('/login'); //用go刷新
        })
        .catch(() => {});
    },
    // 格式化数据
    resetTemp() {
      this.modifyPwdForm = {
        userName: window.sessionStorage.getItem("user-info"),
        loginName: window.sessionStorage.getItem("loginName"),
        oldPassword: "",
        password: "",
        newPassword: "",
      };
    },
    // 点击修改密码按钮
    modifyPwd() {
      this.dialogFormVisible = true;
      this.resetTemp();
      let user = window.sessionStorage.getItem("user-info");
      let loginName = window.sessionStorage.getItem("loginName");
      this.modifyPwdForm.userName = user;
      this.modifyPwdForm.loginName = loginName;
    },
    // 修改完成按钮
    modifyPwdFormClick() {
      var _this = this;
      if (this.modifyPwdForm.oldPassword === this.modifyPwdForm.password) {
        _this.$message.error("与原密码一致");
        this.resetTemp();
      } else if (
        this.modifyPwdForm.newPassword !== this.modifyPwdForm.password
      ) {
        _this.$message.error("两次输入密码不一致");
        this.resetTemp();
      } else {
        getModifyPwdInterface(_this.modifyPwdForm).then(function (res) {
          if (res.data.code === 1) {
            _this
              .$confirm("修改成功,是否返回当前页", "提示", {
                type: "success",
              })
              .then(() => {
                _this.dialogFormVisible = false;
              })
              .catch(() => {
                _this.$message.info("已取消");
                _this.subDisabled = false;
              });
          } else {
            _this.$message.error(res.data.msg);
            _this.resetTemp();
            return false;
          }
        });
      }
    },
  },
  computed: {
    // newdata:function (){
    //   return this.theLatesNews.slice(0,4);
    // },
  },
  watch: {
    $route: {
      handler: function (route) {
        this.meta = route.meta.flag;
      },
      immediate: true,
    },
  },
  mounted() {
    this.getNewsInfo();
    this.getToBeAudits();
    this.goiconfont();
    this.showButton();
    if (this.Updatenews) {
      this.news = true;
    }

    if (this.icon === "1") {
      this.iconfont = true;
    }
    if (window.sessionStorage.getItem("roleName") === "部门数据审核员") {
      this.DisplayAudit = false;
    }
    let user = window.sessionStorage.getItem("user-info");
    let loginName = window.sessionStorage.getItem("loginName");
    if (user && loginName) {
      this.nickname = user;
    }
  },
};
</script>
<style scoped lang="scss">
.daiban-icon {
  display: inline-block;
  width: 20px;
  height: 20px;
  background: url("../assets/daiban.png") no-repeat;
  background-size: 20px 20px;
  vertical-align: middle;
  margin-bottom: 4px;
  margin-left: 4px;
}

.daiban-iconNew {
  display: inline-block;
  width: 20px;
  height: 20px;
  background: url("../assets/daibanNew.png") no-repeat;
  background-size: 20px 20px;
  vertical-align: middle;
  margin-bottom: 4px;
  margin-left: 4px;
}

.lingDang-icon {
  display: inline-block;
  width: 20px;
  height: 20px;
  background: url("../assets/daiban.png") no-repeat;
  background-size: 20px 20px;
  vertical-align: middle;
  margin-left: 20px;
  margin-bottom: 4px;
}

.lingDang-iconNew {
  display: inline-block;
  width: 20px;
  height: 20px;
  background: url("../assets/daibanNew.png") no-repeat;
  background-size: 20px 20px;
  vertical-align: middle;
  margin-left: 20px;
  margin-bottom: 4px;
}

.el-dropdown-menu__item:focus,
.el-dropdown-menu__item:not(.is-disabled):hover {
  color: #009a52;
  background-color: #edffec;
}

.resourcesStyle.el-dropdown-menu__item:focus,
.resourcesStyle.el-dropdown-menu__item:not(.is-disabled):hover {
  background-color: #fff;
  color: #333333;
}

.resourcesStyle.el-dropdown-menu__item {
  cursor: auto;
}

.el-dropdown {
  margin-left: 20px;
}

.el-icon-bell:hover {
  color: #009a52;
}

.newStyle {
  font-weight: 600;
  color: rgba(6, 6, 6, 0.5);
}

.newStyles {
  color: rgba(6, 6, 6, 0.5);
}

div.loginout {
  clear: both;
  color: #fff;
  font-size: 33px;
  position: relative;
  top: 10px;
  display: flex;
  align-items: center;
}

.icon-style {
  font-size: 20px;
  color: #fff;
}

.nickname {
  display: inline-block;
  color: #fff;
  margin-left: 5px;
  font-weight: bold;
  white-space: nowrap !important;
}

.lingdang {
  display: inline-block;
  font-size: 20px;
  height: 48px;
  line-height: 48px;
  vertical-align: middle;
}

.lingdang img {
  vertical-align: text-top;
}
</style>

