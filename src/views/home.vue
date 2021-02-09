<template>
    <div class="container" >
        <!--头部-->
        <div class="topbar-wrap">
            <div class="topbar-logos" >
                <a href="javascript:void(0)">
                    <img src='/static/index/logo.png'>
                </a>
            </div>

            <div class="topbar-title" style="width:900px;">
                <el-row>
                    <!-- 注意：这里就是topNavState作用之处，根据当前路由所在根路由的type值判断显示不同顶部导航菜单 -->
                    <el-col :span="24"  >
                        <el-menu style="border:none;" :default-active="defaultActiveIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect" :router="true">
                            <el-menu-item class="nav c1" index="/index">首页</el-menu-item>
                            <el-menu-item class="nav c2" v-show="isHaveChildren[1]!==0" :index="typeof firstPathArr[1] === 'undefined' ? '' : firstPathArr[1]">知识管理</el-menu-item>
                            <el-menu-item class="nav c3" v-show="isHaveChildren[2]!==0" :index="typeof firstPathArr[2] === 'undefined' ? '' : firstPathArr[2]" >数据管理</el-menu-item>
                            <el-menu-item class="nav c4" v-show="isHaveChildren[3]!==0" :index="typeof firstPathArr[3] === 'undefined' ? '' : firstPathArr[3]">资源订阅管理</el-menu-item>
                            <el-menu-item class="nav c5" v-show="isHaveChildren[4]!==0" :index="typeof firstPathArr[4] === 'undefined' ? '' : firstPathArr[4]">资源评论管理</el-menu-item>
                            <el-menu-item class="nav c6" v-show="isHaveChildren[5]!==0" :index="typeof firstPathArr[5] === 'undefined' ? '' : firstPathArr[5]">公告管理</el-menu-item>
                            <el-menu-item class="nav c7" v-show="isHaveChildren[6]!==0" :index="typeof firstPathArr[6] === 'undefined' ? '' : firstPathArr[6]">系统管理</el-menu-item>
                        </el-menu>
                    </el-col>

                </el-row>

                <!-- <el-row  v-show="$store.state.topNavState==='enterprise'">
                  <el-col :span="24"  >
                    <el-menu style="border:none;" :default-active="defaultActiveIndex" class="el-menu-demo system_menu" mode="horizontal" @select="handleSelect" :router="true">
                      <el-menu-item class="nav c1"  index="/index">首页</el-menu-item>
                      <el-menu-item class="nav c2" index="/resource/manualupload">知识管理</el-menu-item>
                      <el-menu-item class="nav c3"  index="/resource/manager"v-if>数据管理</el-menu-item!
                      <el-menu-item class="nav c4"  index="/ressubscribe/index">资源订阅管理</el-menu-item>
                      <el-menu-item class="nav c5"  index="/resview/index">资源评论管理</el-menu-item>
                      <el-menu-item class="nav c6"  index="/rotationchart/index">图文管理</el-menu-item>
                      <el-menu-item class="nav c7"  index="/userlist">系统管理</el-menu-item>
                    </el-menu>
                  </el-col>
                </el-row> -->
            </div>
            <div class="topbar-account topbar-btn" style="cursor:pointer;">
                <login-out :showlogins="showlogindaiban"></login-out>
            </div>
        </div>

        <!--中间-->
        <transition name="fade" mode="out-in">
            <router-view style="margin-top:20px;padding-right:5%;background:#F2F2F2;"></router-view>
        </transition>

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
                showlogindaiban:{
                    state:true,
                    type:1
                },
                defaultActiveIndex: "/",
                loading: false,
                subDisabled:false,
                isHaveChildren:[],
                firstPathArr:[],
                value:''
            }
        },
        created() {// 组件创建完后获取数据，
            // 此时 data 已经被 observed 了
            this.fetchNavData();
        },
        mounted() {
            this.getAuthMenu();
            this.backgroundState(this.value)
        },
        methods: {
            handleSelect(index){
                this.defaultActiveIndex = index;
            },
            fetchNavData () { // 初始化菜单激活项
                var cur_path = this.$route.path; //获取当前路由
                var routers = this.$router.options.routes; // 获取路由对象
                var nav_type = "", nav_name = "";
                for (let i = 0; i < routers.length; i++) {
                    let children = routers[i].children;
                    if(children){
                        for (let j = 0; j < children.length; j++) {
                            let grand_children = children[j].children;
                            if(grand_children){
                                for (let k = 0; k < grand_children.length; k++) {
                                    if (grand_children[k].path === cur_path) {
                                        nav_type = routers[i].type;
                                        nav_name = routers[i].name;
                                        this.value = nav_name;
                                        console.log(this.value)
                                        this.backgroundState(this.value)
                                        break;
                                    }
                                    // // 如果该菜单下还有子菜单
                                    // if(children[j].children) {
                                    //   let grandChildren = children[j].children;
                                    //   for(let z=0; z<grandChildren.length; z++) {
                                    //     if(grandChildren[z].path === cur_path) {
                                    //       nav_type = routers[i].type;
                                    //       nav_name = routers[i].name;
                                    //       break;
                                    //     }
                                    //   }
                                    // }
                                }
                            }
                        }
                    }
                }
                this.$store.state.topNavState = nav_type;  // 改变topNavState状态的值
                this.$store.state.leftNavState = nav_name;  // 改变leftNavState状态的值
                this.$store.state.activeMenu = cur_path
            },
            backgroundState(val){
                if(val == "resource"){
                    $(".c2").css("background", "#009A52");
                    this._clear2();
                }else if(val == "data"){
                    $(".c3").css("background", "#009A52");
                    this._clear3();
                }else if(val == "subscribe"){
                    $(".c4").css("background", "#009A52");
                    this._clear4();
                }else if(val == "comment"){
                    $(".c5").css("background", "#009A52");
                    this._clear5();
                }else if(val == "carousel"){
                    $(".c6").css("background", "#009A52");
                    this._clear6();
                }else if(val == "sys"){
                    $(".c7").css("background", "#009A52");
                    this._clear7();
                }else{
                    this._clear()
                }
            },
            jumpTo(url){
                //this.defaultActiveIndex = url;
                this.$router.push(url); //用go刷新
            },
            // 退出登录
            logout(){
                this.$confirm('确认退出吗?', '提示', {
                    confirmButtonClass: 'el-button--warning'
                }).then(() => {
                    //确认
                    window.sessionStorage.clear();
                    // window.sessionStorage.removeItem('user-info');
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
                        if(value.children.length == 0) {
                            firstPath = "";
                        } else {
                            firstPath = value.children[0].children[0].path;
                        }
                        _that.firstPathArr.push(firstPath)
                    })
                    this.isHaveChildren = arr;
                    console.log(this.isHaveChildren);
                    // console.log(this.firstPathArr);
                });
            },
            _clear(){
                $(".c2").css("background", "");
                $(".c3").css("background", "");
                $(".c4").css("background", "");
                $(".c5").css("background", "");
                $(".c6").css("background", "");
                $(".c7").css("background", "");
            },
            _clear2(){
                $(".c3").css("background", "");
                $(".c4").css("background", "");
                $(".c5").css("background", "");
                $(".c6").css("background", "");
                $(".c7").css("background", "");
            },
            _clear3(){
                $(".c2").css("background", "");
                $(".c4").css("background", "");
                $(".c5").css("background", "");
                $(".c6").css("background", "");
                $(".c7").css("background", "");
            },
            _clear4(){
                $(".c2").css("background", "");
                $(".c3").css("background", "");
                $(".c5").css("background", "");
                $(".c6").css("background", "");
                $(".c7").css("background", "");
            },
            _clear5(){
                $(".c2").css("background", "");
                $(".c3").css("background", "");
                $(".c4").css("background", "");
                $(".c6").css("background", "");
                $(".c7").css("background", "");
            },
            _clear6(){
                $(".c2").css("background", "");
                $(".c3").css("background", "");
                $(".c4").css("background", "");
                $(".c5").css("background", "");
                $(".c7").css("background", "");
            },
            _clear7(){
                $(".c2").css("background", "");
                $(".c3").css("background", "");
                $(".c4").css("background", "");
                $(".c5").css("background", "");
                $(".c6").css("background", "");
            },
        },

        watch: {
            '$route': 'fetchNavData'  //监听router值改变时，改变导航菜单激活项
        }
    }
</script>
<style>
    .nav{
        font-size:24px;
    }
    .is_active{
        background: rgb(0, 154, 82);
    }

</style>
