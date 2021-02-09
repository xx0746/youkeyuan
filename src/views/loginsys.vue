<template>
  <div class="login-container">
    <div class="sys_nav" style="border:none">
      <span class="sysname">
        <img src="/static/index/logo.png" style="width:250px;margin-top:16px;margin-left:30px">
        <span>•&nbsp;科研资源数据平台</span>
      </span>
      <el-button @click="gobackindex()"  size="small" type="primary" style="height:32px;margin-right:40px;font-weight: 700;font-size:14px;">资源应用登录</el-button>
    </div>

    <el-form
      ref="loginForm"
      class="login-form"
      :model="loginForm"
      :rules="loginRules"
      label-position="left"
      label-width="0px"
    >
      <h3>后台管理</h3>
      <el-form-item prop="username" style="height:40px">
        <i class="iconfont icon-user" style="font-size:18px;margin-left:10px"></i>
        <el-input
          name="username"
          type="text"
          style="margin-left:-4px;"
          v-model="loginForm.username"
          autocomplete="on"
          placeholder="登录名"
        />
      </el-form-item>

      <el-form-item prop="password" style="height:40px">
        <i class="el-icon-warning" style="font-size:18px;margin-left:10px"></i>

        <el-input
          style="margin-left:-4px"
          name="password"
          :type="passwordType"
          @keyup.enter.native="handleLogin"
          v-model="loginForm.password"
          autocomplete="on"
          placeholder="请输入密码"
        />
      </el-form-item>
      <el-form-item style="width:100%;border:none;">
        <el-button
          type="primary"
          class="login-btn"
          style="width:100%;margin-bottom:10px;height:40px;font-size:16px"
          :loading="loading"
          @click.native.prevent="handleLogin"
        >登录</el-button>
        <!-- <el-button type="primary" style="width:100%;margin-bottom:20px;font-size:16px;background:#029A51;margin-top:20px"  @click.native.prevent="handleLogin" :disabled="allowLogin" :loading="loading">登录</el-button> -->
      </el-form-item>
      <div class="addition">
        <el-checkbox v-model="rememberMe" @change="pitchOn" style="margin-right: 0;">自动登录</el-checkbox>
        <el-dropdown trigger="click">
          <span class="el-dropdown-link">
            操作手册下载<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>
              <a href="http://132.10.10.52:8888/group1/M00/00/32/hAoKNF4hjIaEWdI0AAAAANx22SM10.docx?attname=邮政研究院科研资源数据平台操作手册.docx">
                邮政研究院科研资源数据平台操作手册
              </a>
            </el-dropdown-item>
            <el-dropdown-item>
              <a href="http://132.10.10.52:8888/group1/M00/00/32/hAoKNV4hjIaEQhkSAAAAAHF-Khc62.docx?attname=部门数据管理员操作手册.docx"
                >
                部门数据管理员操作手册
              </a>
            </el-dropdown-item>
            <el-dropdown-item>
              <a href="http://132.10.10.52:8888/group1/M00/00/32/hAoKNV4hjIaEN0fMAAAAAFYCP4461.docx?attname=部门数据审核员操作手册.docx">
                部门数据审核员操作手册
              </a>
            </el-dropdown-item>
            <el-dropdown-item>
              <a href="http://132.10.10.52:8888/group1/M00/00/32/hAoKNV4hjGuERbIoAAAAAC4_tNg99.docx?attname=数据管理员操作手册.docx">
                数据管理员操作手册
              </a>
            </el-dropdown-item>
            <el-dropdown-item>
              <a href="http://132.10.10.52:8888/group1/M00/00/32/hAoKNF4hjGOEQiKCAAAAABF8HaM26.docx?attname=数据审核员操作手册.docx">
                数据审核员操作手册
              </a>
            </el-dropdown-item>
            <el-dropdown-item>
              <a href="http://132.10.10.52:8888/group1/M00/00/32/hAoKNF4hjG6Eay-2AAAAAOZmBnE23.docx?attname=用户操作手册.docx">
                用户操作手册
              </a>
            </el-dropdown-item>
            <el-dropdown-item>
              <a href="http://132.10.10.52:8888/group1/M00/00/27/hAoKNF1outmEf9w4AAAAAJCmGmY34.pptx?attname=科研资源数据平台系统培训PPT.pptx">
                科研资源数据平台系统培训PPT
              </a>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <a @click.prevent="openContact">忘记密码</a>
      </div>
    </el-form>

  </div>
</template>
<script>
import { loginInterface, loginInterfaceVerify } from "@/api/login";
export default {
  data() {
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error("The password can not be less than 6 digits"));
      } else {
        callback();
      }
    };
    return {
      handboolUrl: '123',
      loginForm: {
        username: "",
        password: "",
        userType: "1",
        rememberMe: false
      },
      loginRules: {
        username: [
          { required: true, message: "请输入登录名", trigger: "blur" }
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }]
      },
      passwordType: "password",
      loading: false,
      showDialog: false,
      select_content: [
        { id: 1, value: "管理员" },
        { id: 2, value: "系统用户" }
      ],
      rememberMe: false
    };
  },
  created() {
    loginInterfaceVerify().then(res => {
      console.log(res);
      if (res.data.code === 1) {
        window.sessionStorage.setItem("user-info", res.data.data.userName);
        window.sessionStorage.setItem("loginName", res.data.data.loginName);
        window.sessionStorage.setItem("roleName", res.data.data.roleName);
        window.sessionStorage.setItem("loginId", res.data.data.userId);
        window.sessionStorage.setItem("userType", 1);
        this.$router.push({ path: "/index" });
      }
    });
  },
  methods: {
    gobackindex(){
      // let roleName = window.sessionStorage.getItem("roleName");
      this.$router.push({
        path:'/',
      });
    },
    showPwd() {
      if (this.passwordType === "password") {
        this.passwordType = "";
      } else {
        this.passwordType = "password";
      }
    },
    handleLogin() {
      var _this = this;
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true;
          if (this.rememberMe) {
            this.loginForm.rememberMe = 1;
          } else {
            this.loginForm.rememberMe = 0;
          }
          loginInterface(this.loginForm).then(function(res) {
            console.log(res);
            if (res.data.code == 1) {
              window.sessionStorage.setItem(
                "user-info",
                res.data.data.userName
              );
              window.sessionStorage.setItem(
                "loginName",
                res.data.data.loginName
              );

              window.sessionStorage.setItem("roleName", res.data.data.roleName);
              window.sessionStorage.setItem("userType", 1);
              window.sessionStorage.setItem("loginSysStyle", "后台");
              window.sessionStorage.setItem("loginId", res.data.data.userId);
              if(res.data.data.roleName==='用户'){
                _this.$message.error('您无后台访问权限');
              }else{
                _this.$router.push({ path: "/index" });
              }
              _this.loading = false;
            } else {
              _this.loading = false;
              _this.$message.error(res.data.msg);
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    getUserType(parm) {
      this.loginForm.userType = parm;
    },
    // 忘记密码
    openContact() {
      this.$alert("<div>联系人：朱磊</br>分机号：8776 </br>邮箱：zhulei@chinapost.com.cn</div>", "联系方式", {
        dangerouslyUseHTMLString: true
      });
    },
    // 记住密码
    pitchOn(val) {}
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">

.login-btn {
  background-color: #009955;
  border-color: #009955;
}
.login-btn:hover {
  background-color: #008148;
  border-color: #008148;
}
/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 40px;
    width: 85%;
    input {
      font-size: 16px;
      background: white;
      border: none;
      border-radius: 0px;
      color: #686868;
      height: 30px;
      width: 100%;
      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px white inset !important;
        -webkit-text-fill-color: #686868 !important;
      }
    }
  }

  .el-input__icon {
    height: 100%;
    width: 25px;
    margin-left: 140%;
    text-align: center;
    -webkit-transition: all 0.3s;
    transition: all 0.3s;
    line-height: 40px;
  }

  .el-form-item {
    border: 1px solid #cfcfcf;
    background: white;
    color: #cfcfcf;
  }
}
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
.login-container {
  background-image: url("/static/index/sys-back.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  -moz-background-size: 100% 100%;
  position: fixed;
  height: 100%;
  width: 100%;
  background-color: #2d3a4b;
  .login-form {
    background: white;
    position: absolute;
    left: 0;
    right: 0;
    width: 380px;
    padding: 20px 35px 0px 35px;
    margin: 120px auto;
    margin-left: 50%;
  }
  h3 {
    color: #686868;
    height: 30px;
    line-height: 30px;
    margin: 0 auto;
    text-align: center;
    margin-bottom: 20px;
  }

  .svg-container {
    //图标
    padding: 0px 0px 5px 10px;
    color: #cfcfcf;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
    &_login {
      font-size: 30px;
    }
  }

  .sys_nav {
    height: 70px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .sysname span {
    margin-top: 6px;
  }
  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: #889aa4;
    cursor: pointer;
    user-select: none;
  }
}

.label_name {
  font-size: 16px;
  background: white;

  border-radius: 0px;
  padding: 0px 5px 0px 0px;
  color: #cfcfcf;
  height: 47px;
}

.addition {
  display: flex;
  justify-content: space-between;
  margin-top: -10px;
  margin-bottom: 20px;
  a {
    border: 0;
    font-size: 12px;
    background: transparent;
    color: #009a52;
    cursor: pointer;
  }
  a:hover {
    text-decoration: underline;
  }
  .el-radio__label {
    font-size: 12px;
  }
}
.addition /deep/ .el-dropdown-link.el-dropdown-selfdefine {
  cursor: pointer;
  font-weight: 400;
  font-size: 12px;
}
.addition /deep/ .el-dropdown-link.el-dropdown-selfdefine:hover {
  text-decoration: #009A52;
  color: #009A52;
}
.el-dropdown-menu__item {
  line-height: 30px;
  font-size: 12px !important;
  a {
    font-weight: 400;
    color: #333333;
    &:hover {
      color: #009A52;
    }
  }
}
.el-dropdown-menu__item:focus,
.el-dropdown-menu__item:not(.is-disabled):hover {
  color:#009A52;
  background-color: #edffec;
}
.el-dropdown-menu.el-popper {
  top: 460px !important;
  left: 55% !important;
}
</style>
