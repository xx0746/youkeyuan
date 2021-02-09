<template>
  <el-col :span="24" class="main">
    <!--左侧导航-->
    <aside :class="{showSidebar:!collapsed}" style="padding-left:5%;background:#F2F2F2">
      <el-menu
        router
        :collapse="collapsed"
        ref="leftNavigation"
        :default-active="$store.state.activeMenu"
        class="el-menu-box"
        >
        <template v-for="issue in menuList">
          <template v-if="issue.path === '/'+$store.state.leftNavState">
            <!-- 注意：这里就是leftNavState状态作用之处，当该值与router的根路由的name相等时加载相应菜单组 -->
            <template v-for="(item,index) in issue.children">
              <el-submenu
                v-if="item.hasSub === 1"
                :index="index+''"
                :key="index"
              >
                <template slot="title">
                  <i :class="item.iconCls"></i>
                  <span slot="title">{{item.name}}</span>
                </template>
                <el-menu-item
                  style="margin-left:30px;padding-left:10px;margin-top:5px;margin-bottom:5px;height:30px;line-height: 30px"
                  v-for="term in item.children"
                  :key="term.path"
                  :index="term.path"
                >
                  <i :class="term.iconCls"></i>
                  <span slot="title">{{term.name}}</span>
                </el-menu-item>
              </el-submenu>
              <!--<el-menu-item  v-else-if="item.leaf&&item.children&&item.children.length" :index="item.children[0].path"-->
              <!--:class="$route.path==item.children[0].path?'is-active':''" v-show="item.menuShow">-->
              <!--<i :class="item.iconCls"></i><span slot="title">{{item.children[0].name}}</span>-->
              <!--</el-menu-item>-->
            </template>
          </template>
        </template>
      </el-menu>
    </aside>
    <!--右侧内容区-->
    <section class="content-container">
      <div class="grid-content bg-purple-light">
        <el-col :span="24" class="content-wrapper">
          <transition name="fade" mode="out-in">
            <router-view></router-view>
          </transition>
        </el-col>
      </div>
    </section>
  </el-col>
</template>
<script>
import { getMenu } from "@/api/login";
export default {
  name: "leftNav",
  data() {
    return {
      activeMenu:'',
      collapsed: this.$store.state.collapsed,
      menuList: [],
      openeds: ['0'],
    };
  },
  methods: {
    //折叠导航栏
    collapse() {
      this.collapsed = !this.collapsed;
      this.$store.state.collapsed = this.collapsed;
    },
    // 左侧导航栏根据当前路径默认打开子菜单（如果当前路由是三级，则二级子菜单默认打开）
    defaultLeftNavOpened() {
      let cur_path = this.$route.path; //获取当前路由
      let routers = this.$router.options.routes; // 获取路由对象
      getMenu().then(res => {
        // debugger
        let subMenuIndex = 0;
        let needOpenSubmenu = false;
        if (res.data.code == 1) {
          this.menuList = res.data.data;
          this.$store.state.activeMenu = cur_path;
        }
      });
    }
  },
  mounted() {
    this.defaultLeftNavOpened();
  }
};
</script>
<style lang="scss" scoped>
  aside .el-menu-box {
    float:right;
    background:#009A52;
    margin-top:10px;
    height:auto;
    border: 1px solid #c4c9d0;
  }
</style>
