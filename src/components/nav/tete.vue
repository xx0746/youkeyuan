<template>
  <el-col :span="24" class="main">
    <!--左侧导航-->
    <aside :class="{showSidebar:!collapsed}" style="padding-left:5%;background:#F2F2F2">
      <el-menu
        router
        :collapse="collapsed"
        ref="leftNavigation"
        style="float:right;background:#009A52;margin-top:10px;height:auto"
      >
        <template v-for="(issue) in menuList">
          <template v-if="issue.url === '/'+$store.state.leftNavState">
            <!-- 注意：这里就是leftNavState状态作用之处，当该值与router的根路由的name相等时加载相应菜单组 -->
            <template v-for="(item,index) in issue.children">
              <el-submenu
                v-if="item.hasSub === 1"
                :index="index+''"
                :key="index"
                v-show="item.showMenu === 1"
                style="border-bottom:1px solid white;"
              >
                <template slot="title">
                  <i :class="item.iconCls"></i>
                  <span slot="title">{{item.name}}</span>
                </template>

                <el-menu-item
                  style="margin-left:30px;padding-left:10px;margin-top:5px;margin-bottom:5px;height:30px;line-height: 30px"
                  v-for="term in item.children"
                  :key="term.url"
                  :index="term.url"
                  v-show="term.showMenu"
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
      collapsed: this.$store.state.collapsed,
      menuList: []
    };
  },
  methods: {
    //折叠导航栏
    collapse: function() {
      this.collapsed = !this.collapsed;
      this.$store.state.collapsed = this.collapsed;
    },
    // 左侧导航栏根据当前路径默认打开子菜单（如果当前路由是三级，则二级子菜单默认打开）
    defaultLeftNavOpened() {
      let cur_path = this.$route.path; //获取当前路由
      let routers = this.$router.options.routes; // 获取路由对象
      let self = this;
      getMenu().then(function(res) {
        let subMenuIndex = 0,
          needOpenSubmenu = false;
        
        if (res.data.code == 1) {
          self.menuList = res.data.data;
          for (let i = 0; i < self.menuList.length; i++) {
            let children = self.menuList[i].children;
            if (children) {
              for (let j = 0; j < children.length; j++) {
                if (children[j].url === cur_path) {
                  break;
                }
                // 如果该菜单下有子菜单(个数>1且设置的leaf为false才有下拉子菜单)
                if (children[j].children && children[j].hasSub == 1) {
                  let grandChildren = children[j].children;

                  for (let z = 0; z < grandChildren.length; z++) {
                    if (grandChildren[z].url === cur_path) {
                      // alert (grandChildren[z].path);
                      subMenuIndex = j;
                      needOpenSubmenu = true;
                      break;
                    }
                  }
                }
              }
            }
          }

          if (self.$refs["leftNavigation"] && needOpenSubmenu) {
            self.$refs["leftNavigation"].open(subMenuIndex);
          }
        }
      });

      //   var aDiv=document.getElementsByClassName("container aside .el-submenu .el-menu-item");
      // // alert (aDiv);

      //   for (var i = 0;i<aDiv.length;i++) {
      //     aDiv[1].style.color="#009A52";
      //   };
    }
  },
  mounted() {
    this.defaultLeftNavOpened();
  }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
/*.container aside .el-submenu .el-menu-item {*/
/*background-color: white;*/
/*color: #009A52;*/
/*border-left:5px solid #009A52;*/
/*}*/
</style>
