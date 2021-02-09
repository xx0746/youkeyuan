<template>

  <div class="inx">
    <div class="title" style="border:none">
    <a href="javascript:void(0)">
      <img src='/static/index/logo.png' style="width:250px;margin-top:10px;margin-left:30px">
    </a>
    <div class="topbar-account topbar-btn" style="top:0px;right:60px;cursor:pointer;position:absolute;">
        <login-out :showlogins="showlogin"></login-out>
    </div>
    </div>
    <!-- <div style="margin-top:6%;">
      <el-input   class="search" v-model="input" placeholder="请输入内容"></el-input>
      <el-button class="button lv" disabled>搜索</el-button>
       <div style="margin-right:15%;color:white;float:right;margin-top:18px">高级搜索></div> -->
    <!-- </div> -->
    <div class="content">
      <el-menu style="border:none;"
              :default-active="defaultActiveIndex"
              class="el-menu-demo nav_all"
              mode="horizontal"
              @select="handleSelect"
              :router="true">

        <el-menu-item class="nav c2" v-if="isHaveChildren[1]!=0" :index="typeof firstPathArr[1] === 'undefined' ? '' : firstPathArr[1]"
        style="width: 170px; height: 170px;">
          <img src="/static/index/zhishiguanli.png"/>
          <span>知识管理</span>
        </el-menu-item>

        <el-menu-item class="nav c3" v-if="isHaveChildren[2]!=0" :index="typeof firstPathArr[2] === 'undefined' ? '' : firstPathArr[2]" style="width: 170px;
        height: 170px;" >
          <img src="/static/index/shujuguanli.png"/>
          <span>数据管理</span>
        </el-menu-item>
        <el-menu-item class="nav c4" v-if="isHaveChildren[3]!=0" :index="typeof firstPathArr[3] === 'undefined' ? '' : firstPathArr[3]" style="width: 170px;
        height: 170px;">
          <img src="/static/index/dingyue.png"/>
          <span>资源订阅管理</span>
        </el-menu-item>
        <el-menu-item class="nav c5" v-if="isHaveChildren[4]!=0" :index="typeof firstPathArr[4] === 'undefined' ? '' : firstPathArr[4]" style="width: 170px;
        height: 170px;">
          <img src="/static/index/pinglun.png"/>
          <span>资源评论管理</span>
        </el-menu-item>
        <el-menu-item class="nav c6" v-if="isHaveChildren[5]!=0" :index="typeof firstPathArr[5] === 'undefined' ? '' : firstPathArr[5]" style="width: 170px;
        height: 170px;">
          <img src="/static/index/02.png"/>
          <span>公告管理</span>
        </el-menu-item>
        <el-menu-item class="nav c7" v-if="isHaveChildren[6]!=0" :index="typeof firstPathArr[6] === 'undefined' ? '' : firstPathArr[6]" style="width: 170px;
        height: 170px;">
          <img src="/static/index/01.png"/>
          <span>系统管理</span>
        </el-menu-item>
      </el-menu>
    </div>
    <!-- <div >
      <div class="bot" style="margin-left:14%">关于我们</div>
      <div class="bot">联系我们</div>
      <div class="bot">加入我们</div>
      <div class="bot">订阅</div>
      <div class="bot">法律声明</div>
      <div class="bot" style="border:none;">友情链接</div>
    </div> -->
  </div>
</template>

<script>
  import {
    getModifyPwdInterface,
    getMenu
  } from "@/api/login";
  import loginOut from '@/components/loginOut'
  export default {
    components:{loginOut},
    name: 'home',
    data () {
      return {
        showlogin:{
          state:true,
          type:1
        },
        input:'',
        defaultActiveIndex: "/",
        loading: false,
        dialogFormVisible:false,
        modifyPwdForm:{
          oldPassword:'',
          password:'',
          newPassword:''
        },
        subDisabled:false,
        isHaveChildren:[],
        firstPathArr: [],
      }
    },
    created() {// 组件创建完后获取数据，
      // 此时 data 已经被 observed 了
      this.fetchNavData();
    },
    mounted() {
      this.getAuthMenu();
    },
    watch: {
      '$route': 'fetchNavData'  //监听router值改变时，改变导航菜单激活项
    },
    methods: {
      handleSelect(index){
        this.defaultActiveIndex = index;
      },
      fetchNavData () { // 初始化菜单激活项
        var cur_path = this.$route.path; //获取当前路由
        var routers = this.$router.options.routes; // 获取路由对象
        var nav_type = "", nav_name = "";
        for (var i = 0; i < routers.length; i++) {
          var children = routers[i].children;
          if(children){
            for (var j = 0; j < children.length; j++) {
              var grand_children = children[j].children;
              if(grand_children){
                for (var k = 0; k < grand_children.length; k++) {
                  if (grand_children[k].path === cur_path) {
                    nav_type = routers[i].type;
                    nav_name = routers[i].name;
                    break;
                  }
                  // 如果该菜单下还有子菜单
                  if(children[j].children) {
                    let grandChildren = children[j].children;
                    for(let z=0; z<grandChildren.length; z++) {
                      if(grandChildren[z].path === cur_path) {
                        nav_type = routers[i].type;
                        nav_name = routers[i].name;
                        break;
                      }
                    }
                  }
                }
              }
            }
          }
        }
        this.$store.state.topNavState = nav_type;  // 改变topNavState状态的值
        this.$store.state.leftNavState = nav_name;  // 改变leftNavState状态的值
        // if(nav_type == "home"){
        //   this.defaultActiveIndex = "/";
        // } else {
        //   this.defaultActiveIndex = "/" + nav_name + "Manager";
        // }
      },
      jumpTo(url){
        this.defaultActiveIndex = url;
        this.$router.push(url); //用go刷新
      },
      // 退出登录
      logout(){
        let that = this;
        this.$confirm('确认退出吗?', '提示', {
          confirmButtonClass: 'el-button--warning'
        }).then(() => {
          //确认

          window.sessionStorage.clear();
          // that.$router.go('/login'); //用go刷新
          this.$router.push({ path: "/login" });
        }).catch(() => {});
      },
      // 格式化数据
      resetTemp() {
        this.modifyPwdForm={
          oldPassword:'',
          password:'',
          newPassword:''
        }
      },
      // 点击修改密码按钮
      modifyPwd(){
        this.dialogFormVisible = true;
        this.resetTemp();
      },
      // 修改完成按钮
      modifyPwdFormClick(){
        var _this = this;
        getModifyPwdInterface(_this.modifyPwdForm).then(function(res){
          if (res.data.code == 1) {
            _this
              .$confirm("修改成功,是否返回当前页", "提示", {
                type: "success"
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
        })
      },
      // 对前后台配置权限
      getAuthMenu(){
        const _that = this;

        getMenu().then((res)=>{
          var data = res.data.data;
          console.log(data);
          var arr = [];
          var firstPath = "";
          $.each(data,function(index,value){
            arr.push(value.children.length)
            console.log(value);
            if(value.children.length == 0) {
              firstPath = "";
            } else {
              firstPath = value.children[0].children[0].path;
            }
            _that.firstPathArr.push(firstPath)
          })
          this.isHaveChildren = arr;
          console.log(this.isHaveChildren);
        });
      }
    },
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .search .el-input__inner{
    height:40px;
    border-radius: 0;
    font-size:24px;
  }
  .inx {
    background-image: url('/static/index/back.jpg');
    background-repeat:no-repeat;
    background-size:100% 100%;
     -moz-background-size:100% 100%;
    height:100%;
    width: 100%;
  }
  .bot{
    color:white;
    border-right:1px solid white;
    float:left;
    width:12%;
    text-align: center;
  }

  .fed{
    opacity:0.8;
    height:150px;
    width:13%;
    float:left;
    margin-left:2%;
    background-repeat:no-repeat;
    background-size:100% 100%;
     -moz-background-size:100% 100%;
  }


  .fed1{
    background-image: url('/static/index/t1.png');
    margin-left:6%;
  }

  .fed2{
    background-image: url('/static/index/t2.png');
  }

  .fed3{
    background-image: url('/static/index/t3.png');
  }

  .fed4{
    background-image: url('/static/index/t4.png');
  }

  .fed5{
    background-image: url('/static/index/t5.png');
  }

  .fed6{
    background-image: url('/static/index/t6.png');
  }

  .svg-container {//图标
    padding: 0px 0px 5px 10px;
    color: #CFCFCF;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
    &_login {
      font-size: 30px;
    }
  }

  .search{
    margin-left:15%;
    border-radius: 0;
    border:none;
    width:60%;
  }

  .button{
    font-size:18px;
    border:none;
    height:41px;
    width:10%;
    margin-left:-6px;
    border-radius: 0;
  }

  .lv{
    background: #009A52;color:white;
  }

  .lv:hover{
    color: white;
    background: #127714
  }


  .title {
    background: rgba(0,0,0,.5);
    height:70px;

  }
  .content {
    position: relative;
    top: 50%;
    transform: translateY(-50%);
  }
  .nav_all{
    width: 100%;
    padding: 0 40px;
    display: flex;
    justify-content: space-around;
    background:transparent;
    .nav{
      width:190px;
      min-height:173px;
      background:#980;
      text-align:center;
      color:#fff;
      /*opacity: 0.8;*/
      &last-child{
        margin-right:0;
      }
      img{
        margin-top:20px;
      }
      span{
        display: block;
        margin-top: 12px;
        &hover{
          color:#fff;
        }
      }
    }
  }
   .nav:first-child,.nav:first-child:hover{
    background:rgba(80,140,193,0.9) !important;
   }
   .nav:nth-child(2),.nav:nth-child(2):hover{
    background:rgba(216,141,50,0.9) !important;
   }
  .nav:nth-child(3),.nav:nth-child(3):hover{
    background:rgba(51,175,172,0.9) !important;
   }
  .nav:nth-child(4),.nav:nth-child(4):hover{
    background:rgba(46,171,104,0.9) !important;
   }
  .nav:nth-child(5),.nav:nth-child(5):hover{
    background:rgba(208,182,141,0.9) !important;
   }
  .nav:nth-child(6),.nav:nth-child(6):hover{
    background:rgba(42,192,241,0.9) !important;
   }
   .el-menu-item {
     font-size: 20px;
   }
   .el-menu--horizontal > .el-menu-item:not(.is-disabled):hover, .el-menu--horizontal > .el-menu-item:not(.is-disabled):focus, .el-menu--horizontal >.el-menu-item.is-active{
     color:#fff ;
   }
</style>
