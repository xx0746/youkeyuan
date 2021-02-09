<template>
  <div class="index-container" style="background:#F2F2F2;">
    <div class="top">
      <div class="sys_nav" style="border:none;background:transparent">
        <a href="javascript:void(0)" class="sysname">
          <img src="/static/index/logo.png" style="width:250px;margin-top:16px;margin-left:30px" />
          <span>•&nbsp;科研资源数据平台</span>
        </a>

        <div
          class="topbar-account topbar-btn"
          style="margin-right:40px;position:relative;float:right;cursor: pointer;"
        >
          <span style="display: inline-block">
            <login-out :Updatenews="newsdata" :icon="icon" :showlogins="showlogindaiban"></login-out>
          </span>
          <span style="display: inline-block" v-show="showAdmin">
            <el-button
              @click="gobackAdmin()"
              size="small"
              type="primary"
              style="vertical-align: -webkit-baseline-middle;vertical-align: text-top;margin-left:60px;font-weight: 700;font-size:14px;"
              v-show="showAdmin"
            >后台管理登录</el-button>
          </span>
        </div>
      </div>

      <div class="searchbox" id="searchSeleced">
        <el-input
          class="search"
          v-model="searchName"
          ref="searchInput"
          @focus="History()"
          @blur="inputblur()"
          @change="inputChange()"
          placeholder="请输入内容"
        >
          <el-select
            v-model="searchKeyRegion"
            @change="getSearchHistory"
            style="font-weight:900"
            slot="prepend"
            placeholder="请选择专区"
          >
            <el-option label="知识专区" value="1"></el-option>
            <el-option label="数据专区" value="2"></el-option>
          </el-select>
        </el-input>
        <el-button class="button lv" type="primary" @click="search()">搜索</el-button>
        <div v-show="searchhistory" class="search" style="z-index: 999;position: absolute;">
          <div class="searchhistory_top">
            <div>
              <strong>搜索历史</strong>
            </div>
            <el-button @click="searchEmpty()" size="mini" type="primary">清空</el-button>
          </div>
          <div class="searchmokuai-box">
            <ul>
              <li
                class="search-history"
                @mousedown="search(item)"
                v-for="(item,key) in history"
                :key="key.id"
              >{{item}}</li>
            </ul>
          </div>
        </div>
        <div v-show="searchLinxion" class="search" style="z-index: 999;position: absolute;">
          <div class="searchmokuai-box">
            <ul>
              <li
                class="search-history"
                @mousedown="search(item)"
                v-for="(item,key) in lianxiangList"
                :key="key"
              >{{item}}</li>
            </ul>
          </div>
        </div>
      </div>
      <!---->

      <div class="zhuanqu" style="z-index:-100;">
        <div class="checkbox-nav" v-show="searchKeyRegion == 1">
          <!-- <h4 style="font-size: 18px;">知识专区 ></h4> -->
          <el-checkbox-group v-model="menuIds" class="checkstyle">
            <el-checkbox
              v-for="(item, index) in checkboxMenuIds"
              :key="index"
              :title="item.label"
              :label="item.label"
              :value="item.value"
              :disabled="item.disabled"
              style="color:#fff;"
              @change="getMenuIds(item.value)"
            >{{item.label}}</el-checkbox>
          </el-checkbox-group>
        </div>
        <div class="checkbox-nav" v-show="searchKeyRegion == 2">
          <!-- <h4 style="font-size: 18px;">数据专区 ></h4> -->
          <el-checkbox-group v-model="checkList" class="checkstyle">
            <el-checkbox
              v-for="(item, key) in dataSectionList"
              :key="key"
              :title="item.label"
              :label="item.label"
              :value="item.value"
              :disabled="item.disabled"
              style="color:#fff;"
              @change="getMenuIds(item.value)"
            ></el-checkbox>
          </el-checkbox-group>
        </div>
      </div>
    </div>

    <div style="display: flex;margin-bottom: 40px">
      <div class="left-column">
        <div class="tree-box search-tree">
          <el-tree
            class="treedisab"
            :data="dataLeftMenu"
            :props="treeDefaultProps"
            accordion
            :default-expanded-keys="defaultExp"
            node-key="value"
            highlight-current
            @node-click="openToIndex"
            empty-text="正在加载中"
          ></el-tree>
        </div>
      </div>
      <div class="middle-column">
        <div style="display:flex">
          <div class="title0" style="color:#009A52;width: 50%;">信息公告</div>
          <div
            class="title0"
            style="color:#009A52;width: 50%;text-align: right;font-size: 13px;font-weight: 500;"
          >
            <span
              v-show="information.length > 4"
              style="cursor:pointer;"
              @click="clickInfomation()"
            >查看更多 >></span>
          </div>
        </div>
        <div class="information" style="height: 176px;">
          <ul>
            <li
              style="cursor:pointer;"
              v-for="(x, index) in sliceNotice"
              :key="index"
              @click="details(x)"
            >
              <a class="info-text">
                <span
                  style="width:60%;overflow: hidden; white-space: nowrap;text-overflow: ellipsis;"
                >{{x.title}}</span>
                <span>{{x.createTime}}</span>
              </a>
            </li>
          </ul>
        </div>
        <!--图文轮播-->
        <div style="height:184px;width:100%" id="wrapper">
          <div class="commodity swiper-no-swiping">
            <div class="container">
              <swiper class="swiImgs" :options="swiperOption" v-if="commodity.length!=0">
                <swiper-slide
                  v-for="(item, index) in commodityList"
                  data-index="index"
                  :key="index"
                  class="item"
                  :class="commodityList.length <= 1 ? 'swiper-no-swiping' : ''"
                >
                  <img
                    class="swiImg"
                    :src="item.BANNERIMG"
                    @click="imgdetails(item.ID,item.ORIGINALLINKED)"
                  />
                </swiper-slide>
                <div class="swiper-pagination" slot="pagination"></div>
              </swiper>
              <div class="swiper-button-next"></div>
              <div class="swiper-button-prev"></div>
            </div>
          </div>
        </div>
        <div style="display:flex">
          <div class="title0" style="color:#009A52;width: 50%;">动态要闻</div>
          <div
            class="title0"
            style="color:#009A52;width: 50%;text-align: right;font-size: 13px;font-weight: 500;"
          >
            <span
              v-show="news.length > 4"
              style="cursor:pointer;"
              @click="clickNews()"
            >查看更多 >></span>
          </div>
        </div>
        <div class="information" style="height:273px;">
          <ul>
            <li
              style="cursor:pointer;"
              v-for="(item,key) in getNews"
              :key="key"
              @click="detailsnews(item)"
            >
              <a style="display: flex;justify-content: space-between;">
                <div
                  style="width:60%;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;"
                >{{item.title}}</div>
                <div>{{item.createTime}}</div>
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div class="right-column">
        <div class="title0" style="color:#009A52">热搜词</div>
        <div style="height: 174px; border-bottom: 0;">
          <div id="hotsearch">
            <div
              class="hotsearchlist hot_li"
              @click="search(item)"
              v-for="(item,key,index) in hotSearch"
              :key="index"
            >{{item.SEARCHNAME}}</div>
          </div>
        </div>
        <div class="title0" style="color:#009A52;display: flex;">
          <div>订阅</div>
          <div class="jia" @click="showSubscribe" style="margin-left: 15px;">+</div>
        </div>
        <div class="tags-box">
          <el-tag
            size="mini"
            type="success"
            v-for="(item, index) in subViewArr"
            :key="index"
          >{{item.label}}</el-tag>
          <div style="text-align:center;margin-top: 10px;box-sizing: border-box;margin-right: 5px;">
            <el-button plain size="small" v-show="checkedArr.length > 4" @click="viewMoreSub">
              查看更多
              <i class="el-icon-more"></i>
            </el-button>
          </div>
        </div>
        <div class="title0" style="color:#009A52;clear:both;">我的收藏</div>
        <div style="height: 200px;">
          <div class="subbox">
            <div
              class="hotsearchlist collect-li"
              v-for="(item, index) in Favorites2"
              @click="clickFavorites(item)"
              :key="index"
            >{{item.title}}</div>
            <div
              style="text-align:center;margin-top: 10px;box-sizing: border-box;margin-right: 5px;"
            >
              <el-button plain size="small" v-show="total > 4" @click="seiMove">
                查看更多
                <i class="el-icon-more"></i>
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <footer-view></footer-view>
    <el-dialog
      title="收藏夹列表"
      :visible.sync="centerDialogVisible"
      width="68%"
      :close-on-click-modal="false"
      :before-close="favoritesClose"
      center
    >
      <el-table
        border
        @row-click="clickFavorites"
        :data="Favorites1"
        :header-cell-style="{
          'background-color': '#f5f7fa',
          'color': 'rgb(103, 194, 58)',
            }"
      >
        <el-table-column label="名称">
          <template slot-scope="scope">
            <div>{{scope.row.title}}</div>
          </template>
        </el-table-column>
        <el-table-column property="createTime" width="200px" label="时间"></el-table-column>
      </el-table>
      <el-pagination
        style="text-align: center;margin-top: 10px"
        :page-size="10"
        :current-page="auditForm.pageNumber"
        @current-change="handleCurrentChange"
        layout="total,prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
      <div style="text-align: center;margin-top: 10px;">
        <el-button
          type="primary4"
          size="small"
          class="btn-width"
          @click="centerDialogVisible = false"
        >取消</el-button>
        <el-button
          type="primary"
          size="small"
          class="btn-width"
          @click="centerDialogVisible = false"
          style="margin-left:50px;"
        >确定</el-button>
      </div>
    </el-dialog>
    <!-- 公告查看更多 -->
    <el-dialog
      title="公告列表"
      :visible.sync="informationListSync"
      width="68%"
      :close-on-click-modal="false"
      center
    >
      <el-table
        border
        @row-click="details"
        :data="information1"
        :header-cell-style="{
          'background-color': '#f5f7fa',
          'color': 'rgb(103, 194, 58)',
            }"
      >
        <el-table-column label="标题">
          <template slot-scope="scope">
            <div>{{scope.row.title}}</div>
          </template>
        </el-table-column>
        <el-table-column property="createTime" width="200px" label="发布时间"></el-table-column>
      </el-table>
      <el-pagination
        style="text-align: center;margin-top: 10px"
        :page-size="10"
        :current-page="informationForm.pageNumber"
        @current-change="handleInfoCurrentChange"
        layout="total,prev, pager, next, jumper"
        :total="infomationTotal"
      ></el-pagination>
      <div style="text-align: center;margin-top: 10px;">
        <el-button
          type="primary4"
          size="small"
          class="btn-width"
          @click="informationListSync = false"
        >关闭</el-button>
      </div>
    </el-dialog>
    <!-- 动态查看更多 -->
    <el-dialog
      title="动态列表"
      :visible.sync="newsListSync"
      width="68%"
      :close-on-click-modal="false"
      center
    >
      <el-table
        border
        @row-click="detailsnews"
        :data="news1"
        :header-cell-style="{
          'background-color': '#f5f7fa',
          'color': 'rgb(103, 194, 58)',
            }"
      >
        <el-table-column label="标题">
          <template slot-scope="scope">
            <div>{{scope.row.title}}</div>
          </template>
        </el-table-column>
        <el-table-column property="createTime" width="200px" label="发布时间"></el-table-column>
      </el-table>
      <el-pagination
        style="text-align: center;margin-top: 10px"
        :page-size="10"
        :current-page="newsForm.pageNumber"
        @current-change="handleNewsCurrentChange"
        layout="total,prev, pager, next, jumper"
        :total="newsTotal"
      ></el-pagination>
      <div style="text-align: center;margin-top: 10px;">
        <el-button
          type="primary4"
          size="small"
          class="btn-width"
          @click="newsListSync = false"
        >关闭</el-button>
      </div>
    </el-dialog>
    <!-- 订阅标签弹窗 -->
    <el-dialog
      class="dialogTitle"
      :title="titleMsg"
      :before-close="handleClose"
      center
      :visible.sync="dialogShow"
      width="40%"
      :close-on-click-modal="false"
    >
      <div class="checks" v-if="dialogShow">
        <el-tree
          ref="subscripe"
          :data="checkboxList"
          show-checkbox
          node-key="value"
          @check-change="checkChange"
          default-expand-all
          :default-checked-keys="checkedIdArr"
          empty-text="正在加载中"
          :props="defaultProps"
        ></el-tree>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button
          v-show="isDisabled == false"
          class="btn-width"
          size="small"
          type="primary4"
          @click="handleClose"
        >取消</el-button>
        <el-button
          v-show="isDisabled == false"
          class="btn-width"
          size="small"
          type="primary"
          @click="handleChecke"
          style="margin-left:50px;"
        >保存</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import footerView from "@/views/home/footerView";
import loginOut from "@/components/loginOut";
import { getLeftTreeInterface } from "@/api/resource_list";
import { throttle } from "@/utils/Debounce";
import "../../assets/iconfont/iconfont.css";
import {
  getSearchHistoryInterface,
  getSearchHostInterface,
  getBannerListData,
  getSystemBulletin,
  getDynamicnews,
  getfavorites,
  getsearchEmpty,
  getSearchAssociate,
  getMenuidArr,
} from "@/api/search";
import {
  getSubscribeInfo,
  addSubscribeInfo,
  delSubscribeInfo,
} from "@/api/ressubscribe";
export default {
  components: { loginOut, footerView },
  data() {
    const that = this;
    return {
      icon:"",
      informationForm: {
        pageNumber: 1,
      },
      informationListSync: false,
      information1:[],
      infomationTotal:0,
      newsForm: {
        pageNumber: 1,
      },
      newsListSync: false,
      news1:[],
      newsTotal:0,

      showlogindaiban: {
        state: false,
      },
      showAdmin: false,
      newsdata: true,
      Favorites1: [],
      total: "",
      auditForm: {
        pageNumber: 1,
      },
      centerDialogVisible: false,
      popver1: false,
      searchhistory: false,
      isOnemptyBtn: false,
      information: [], //信息公告数据
      news: [], //动态要闻
      searchList: {
        menuIds: "",
        parentId: "",
        pageNumber: 1,
      },
      menuIds: [],
      // 知识专区多选框
      checkboxMenuIds: [],
      searchName: "",
      checkList: [],
      // 数据专区多选框
      dataSectionList: [],
      // 左侧列表
      dataLeftMenu: [],
      defaultExp: [15, 16, 19],
      //  树形菜单默认属性设置
      defaultProps: {
        children: "children",
        label: "label",
        disabled: "disabled",
      },
      treeDefaultProps: {
        children: "children",
        label: "label",
        disabled: "disabled",
      },
      // 搜索历史
      searchHistory: [],
      searchHost: [],
      menuIdsArr: [],
      // 搜索联想
      searchLinxion: false,
      lianxiangList: [],
      // 图文轮播
      commodity: [],
      imgIndex: 1,
      // 轮播图配置
      swiperOption: {
        pagination: {
          el: ".swiper-pagination",
          clickable: true,
        },
        observer: true,
        autoplay: {
          delay: 3000,
          stopOnLastSlide: false,
          disableOnInteraction: false,
        },
        noSwiping: true,
        // loop: true,
        paginationClickable: true,
        debugger: true,
      },
      // 订阅功能
      titleMsg: "订阅",
      dialogShow: false,
      isDisabled: false,
      isHandle: false,
      checkboxList: [],
      checkedArr: [],
      checkedIdArr: [],
      searchKeyRegion: "1",
      aa: [],
      // 模拟左侧导航下部菜单
      mockData: {
        children: [
          {
            children: null,
            label: "物流分析应用",
            menuId: 11000,
            menuPid: 19,
            parentId: 11000,
            value: 11000,
          },
        ],
        label: "数据分析",
        menuId: 19,
        menuPid: 10000,
        value: 19,
      },
    };
  },
  watch: {
    searchName(newVal, oldVal) {
      if (newVal != oldVal) {
        throttle((_) => {
          this.inputChange(newVal);
        }, 500);
      }
    },
  },
  computed: {
    Favorites2: function () {
      return this.Favorites1.slice(0, 4);
    },
    commodityList: function () {
      return this.commodity.slice(0, 5);
    },
    //搜索历史
    history: function () {
      return this.searchHistory
        .filter((item) => {
          return item != "";
        })
        .slice(0, 4);
      // return this.searchHistory.slice(0,4);
    },
    // 信息公告限制显示
    sliceNotice: function () {
      return this.information.slice(0, 4);
    },
    // 动态新闻限制显示
    getNews: function () {
      return this.news.slice(0, 4);
    },
    // 热搜词
    hotSearch: function () {
      let allArr = []; //建立新的临时数组
      for (let i = 0; i < this.searchHost.length; i++) {
        let flag = true;
        for (let j = 0; j < allArr.length; j++) {
          if (this.searchHost[i].SEARCHNAME == allArr[j].SEARCHNAME) {
            flag = false;
          }
        }
        if (flag) {
          allArr.push(this.searchHost[i]);
        }
      }
      return allArr.slice(0, 5);
    },
    // 订阅
    subViewArr: function () {
      return this.checkedArr.slice(0, 4);
    },
  },
  created() {
    this.SystemBulletin();
    this.Dynamicnews();
  },
  mounted() {
    let roleName = window.sessionStorage.getItem("roleName");
    console.log(roleName)
    if(roleName === "用户") {
      this.showAdmin = false;
    }else{
      this.showAdmin = true;
    }
    this.getFavoriteslist();
    this.getLeftTree();
    this.getSearchHistory();
    this.getSearchHost();
    this.getBannerList();
  },
  methods: {
    // 搜索历史清空
    searchEmpty() {
      this.isOnemptyBtn = true;
      getsearchEmpty(this.searchKeyRegion).then((res) => {
        if (res.data.code == 1) {
          this.getSearchHistory();
        }
        this.$refs.searchInput.focus();
      });
    },
    imgdetails(ID, imgdetails) {
      console.log(ID, imgdetails);
      if (imgdetails == "") {
        this.$router.push({
          path: "/details",
          query: { id: ID, status: 3, icon: 1 },
        });
      } else {
        window.open(imgdetails, "_blank");
      }
    },
    detailsnews(row) {
      let id = row.id;
      let originalLinked = row.originalLinked;
      if (
        originalLinked === "" ||
        originalLinked === null ||
        originalLinked === undefined
      ) {
        this.$router.push({
          path: "/details",
          query: { id: id, status: 2, icon: 1 },
        });
      } else {
        window.open(originalLinked, "_blank");
      }
    },
    //公告详情
    details(row) {
      let id = row.id;
      let originalLinked = row.originalLinked;
      if (
        originalLinked === "" ||
        originalLinked === null ||
        originalLinked === undefined
      ) {
        this.$router.push({
          path: "/details",
          query: { id: id, status: 1, icon: 1 },
        });
      } else {
        window.open(originalLinked, "_blank");
      }
    },
    clickFavorites(item) {
      let rowInfo = {
        createTime: item.createTime,
        menuName: item.dataOne, //所属资源库
        menuId: item.menuId,
        id: item.fileId,
        name: item.title,
        resourceId: item.fileId,
      };
      this.$store.commit("setReview", rowInfo);
      this.$router.push({
        path: "/comment",
        query: { icon: 1, createUser: item.createUser },
      });
    },
    //收藏夹列表
    getFavoriteslist() {
      getfavorites(this.auditForm).then((res) => {
        if (res.data.code == 1) {
          this.Favorites1 = res.data.data.rows;
          this.total = res.data.data.total;
        }
      });

    },
    getSearchHost(){
      getSearchHostInterface().then((res) => {
        if (res.data.code == 1) {
          this.searchHost = res.data.data;
        }
      })
    },
    favoritesClose() {
      this.centerDialogVisible = false;
      this.auditForm.pageNumber = 1;
      this.getFavoriteslist();
    },
    seiMove() {
      this.centerDialogVisible = true;
      this.auditForm.pageNumber = 1;
      this.getFavoriteslist();
    },
    Favoriteslist() {
      this.popver1 = true;
    },
    inputblur() {
      setTimeout((_) => {
        if (this.isOnemptyBtn) {
          this.isOnemptyBtn = false;
        } else {
          this.searchhistory = false;
        }
      }, 200);
    },
    History() {
      var that = this;
      this.searchhistory = true;
      $(".search").keyup(function (event) {
        if (event.keyCode == 13) {
          that.search();
        }
      });
      if (this.searchName != "") {
        this.inputChange(this.searchName);
      }
    },
    // 搜索联想
    inputChange(value) {
      console.log(value);
      if (value != "undefined" && value != "") {
        this.searchhistory = false;
        getSearchAssociate(value).then((res) => {
          if (res.data.code == 1) {
            this.lianxiangList = res.data.data.suggest;
          }
          if (this.lianxiangList.length == 0) {
            this.searchLinxion = false;
          } else {
            this.searchLinxion = true;
          }
        });
      } else {
        this.searchhistory = true;
        this.searchLinxion = false;
      }
    },
    // 获取动态要闻
    Dynamicnews() {
      let ss = {
        pageSize: 5,
      };
      getDynamicnews(ss).then((res) => {
        if (res.data.code == 1) {
          this.news = res.data.data.rows;
        }
      });
    },
    clickInfomation(){
      this.informationListSync = true;
      getSystemBulletin(this.informationForm).then((res) => {
        if (res.data.code == 1) {
          this.information1 = res.data.data.rows;
          this.infomationTotal = res.data.data.total
        }
      });
    },
    clickNews(){
      this.newsListSync = true;
      getDynamicnews(this.newsForm).then((res) => {
        if (res.data.code == 1) {
          this.news1 = res.data.data.rows;
          this.newsTotal = res.data.data.total;
        }
      });
    },
    // 获取公告信息目录
    SystemBulletin() {
      let ss = {
        pageSize: 5,
      };
      getSystemBulletin(ss).then((res) => {
        if (res.data.code == 1) {
          this.information = res.data.data.rows;
        }
      });
    },
    // 获取资源目录
    getLeftTree() {
      getLeftTreeInterface().then((res) => {
        if (res.data.code == 1) {
          // 搜索框下部多选框
          this.checkboxMenuIds = JSON.parse(
            JSON.stringify(res.data.data[0].children)
          );
          this.checkboxMenuIds.forEach((item) => {
            item.disabled = false;
          });
          this.dataSectionList = JSON.parse(
            JSON.stringify(res.data.data[1].children)
          );
          // 左侧tree目录
          this.dataLeftMenu = JSON.parse(JSON.stringify(res.data.data));
          this.dataLeftMenu.push(this.mockData);
          this.AddParentId(this.dataLeftMenu[0].children, "", 15, [], [15]);
          this.AddParentId(this.dataLeftMenu[1].children, "", 16, [], [16]);
          console.log(this.dataLeftMenu);
          // 订阅
          let obj = JSON.parse(JSON.stringify(res.data.data[0].children));
          this.checkboxList = obj.slice(0, 9);
          this.checkedArr = [];
          this.checkedIdArr = [];
          this.setSubDisabled(this.checkboxList);
          this.getSubscribeId(this.checkboxList);
          this.checkedArr.forEach((item) => {
            this.checkedIdArr.push(item.value);
          });
        }
      });
    },
    search(item) {
      if (item) {
        if (typeof item.SEARCHNAME !== "undefined") {
          this.searchList.searchName = item.SEARCHNAME;
        } else if (typeof item !== "undefined") {
          this.searchList.searchName = item;
        } else {
          this.searchList.searchName = item;
        }
      } else {
        this.searchList.searchName = this.searchName;
      }
      if (this.searchList.menuidArr) {
      } else {
        if (this.searchKeyRegion == 1) {
          this.searchList.menuidArr = [15];
        } else {
          this.searchList.menuidArr = [16];
        }
      }
      this.searchList.searchType = this.searchKeyRegion;
      this.$store.dispatch("setSearchList", this.searchList);
      console.log(this.$store.getters.getSearchList);
      this.$router.push({ path: "/resbindex", query: { icon: "1" } });
    },
    // 退出登录
    logout() {
      let that = this;
      this.$confirm("确认退出吗?", "提示", {
        confirmButtonClass: "el-button--warning",
      })
        .then(() => {
          //确认
          window.sessionStorage.clear();
          // that.$router.go('/login'); //用go刷新
          this.$router.push({ path: "/login" });
        })
        .catch(() => {});
    },
    // 搜索历史
    getSearchHistory() {
      let s = {
        areaType: this.searchKeyRegion,
      };
      getSearchHistoryInterface(s).then((res) => {
        if (res.data.code == 1) {
          this.searchHistory = res.data.data;
        }
        this.isOnemptyBtn = false;
      });
    },
    getMenuIds(val) {
      if (this.menuIdsArr.indexOf(val) == -1) {
        this.menuIdsArr.push(val);
      } else {
        this.menuIdsArr.splice(this.menuIdsArr.indexOf(val), 1);
      }
      this.searchList.menuIds = this.menuIdsArr.join(",");
      this.searchList.dataType = this.menuIdsArr.join(",");
      this.searchList.parentId = this.menuIdsArr.join(",");
      console.log(this.searchList);
    },
    // 获取图文数据
    async getBannerList() {
      const res = await getBannerListData();
      this.commodity = res.data.data;
      // 自动轮播需先初始化调用一个autoplay属性
      if (this.commodityList.length <= 1) {
        this.swiperOption.autoplay = false;
      } else {
        this.swiperOption.autoplay = true;
      }

      if (this.commodityList.length != 0) {
        $("#wrapper").removeClass("wrapper").addClass("wrapperNew");
      } else {
        $("#wrapper").removeClass("wrapperNew").addClass("wrapper");
      }
    },
    openToIndex(data) {
      if (data.menuId === 11000) {
        this.$router.push({ path: "/dataAnalysis", query: { icon: 1 } });
      } else {
        if (data.menuId != 15 && data.menuId != 16 && data.menuId != 19) {
          this.searchList.dataThree = data.menuId;
          this.searchList.menuIds = data.parentId.toString();
          this.searchList.parentId = data.parentId.toString();
          this.searchList.items = data.items;
          this.searchList.menuidArr = data.menuidArr;
          if (data.rootId == 15) {
            this.searchKeyRegion = "1";
            this.search();
          } else if (data.rootId == 16) {
            this.searchKeyRegion = "2";
            this.search();
          }
        } else {
          if (this.defaultExp.indexOf(data.menuId) == -1) {
            this.defaultExp.push(data.menuId);
          } else {
            this.defaultExp.splice(this.defaultExp.indexOf(data.menuId), 1);
          }
        }
      }
    },
    // 订阅
    showSubscribe() {
      this.titleMsg = "订阅";
      this.isDisabled = false;
      this.isHandle = false;
      this.defaultProps.disabled = "";
      this.dialogShow = true;
    },
    // 查看更多订阅
    viewMoreSub() {
      this.titleMsg = "订阅信息查看";
      this.isDisabled = true;
      this.defaultProps.disabled = "disabled";
      this.dialogShow = true;
    },
    handleClose() {
      // 如果是更新订阅，没有操作，就不做关闭提醒
      if (!this.isDisabled && this.isHandle == true) {
        this.$confirm("您还没保存，操作将无效，确认关闭？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then((_) => {
            this.dialogShow = false;
          })
          .catch((_) => {});
      } else {
        this.dialogShow = false;
      }
    },
    // 添加订阅
    async handleChecke() {
      let res = "";
      let add = "";
      add = this.$refs.subscripe.getCheckedKeys().join(",");
      console.log(add);
      res = await addSubscribeInfo(add);
      if (res.data.code == 1) {
        this.$message.success("订阅更新成功！");
        this.dialogShow = false;
        this.getLeftTree();
      } else {
        this.$message.error(res.data.msg);
      }
    },
    checkChange() {
      // 判断是否操作
      this.isHandle = true;
    },
    // 递归添加所需数据
    AddParentId(arr, parentId, rootId, items, menuidArr) {
      for (let i = 0; i < arr.length; i++) {
        if (parentId !== "") {
          arr[i].parentId = parentId;
        } else {
          arr[i].parentId = arr[i].menuId;
        }
        arr[i].rootId = rootId;
        arr[i].items = JSON.parse(JSON.stringify(items));
        arr[i].items.push({
          menuId: arr[i].menuId,
          label: arr[i].label,
          checked: false,
        });
        arr[i].menuidArr = JSON.parse(JSON.stringify(menuidArr));
        arr[i].menuidArr.push(arr[i].menuId);
        if (arr[i].children) {
          this.AddParentId(
            arr[i].children,
            arr[i].parentId,
            rootId,
            arr[i].items,
            arr[i].menuidArr
          );
        }
      }
    },
    // 递归获取订阅目录id数组
    getSubscribeId(arr) {
      arr.forEach((item) => {
        if (item.subscribe == true && item.children == null) {
          this.checkedArr.push(item);
        }
        if (item.children == null) {
          return;
        } else {
          this.getSubscribeId(item.children);
        }
      });
    },
    // 递归给订阅树目录加禁用状态
    setSubDisabled(arr) {
      arr.forEach((item) => {
        item.disabled = true;
        if (item.children == null) {
          return;
        } else {
          this.setSubDisabled(item.children);
        }
      });
    },
    handleCurrentChange(val) {
      this.auditForm.pageNumber = val;
      this.getFavoriteslist();
    },
    handleNewsCurrentChange(val){
      this.newsForm.pageNumber = val;
      this.clickNews();
    },
    handleInfoCurrentChange(val){
      this.informationForm.pageNumber = val;
      this.clickInfomation();
    },
    gobackAdmin() {
      this.$router.push({
        path: "/index",
      });
    },
  },
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.list {
  height: 35px;
  line-height: 35px;
  margin-left: 30px;
}
.historylink {
  color: #333333;
  &:hover {
    color: #009a52;
  }
}
.list a {
  color: #777777;
  font-size: 15px;
}
.title0 {
  background: white;
  height: 60px;
  padding: 0 30px;
  font-size: 17px;
  line-height: 60px;
  font-weight: 900;
  border-top: 1px solid #c4c9d0;
  border-bottom: 1px solid #c4c9d0;
  .jia {
    display: block;
    width: 14px;
    height: 14px;
    font-weight: 400;
    border: 1px solid #009a52;
    font-size: 14px;
    text-align: center;
    line-height: 13px;
    /*float: right;*/
    margin-top: 24px;
    cursor: pointer;
    &:hover {
      color: #fff;
      background-color: #009a52;
    }
    &:focus {
      color: #fff;
      background-color: #009a52;
    }
  }
}
.el-checkbox__inner {
  zoom: 110%;
  background: white;
  margin-top: -3px;
}
.el-checkbox__input.is-checked + .el-checkbox__label {
  color: #fff;
}

.checks {
  .el-checkbox {
    .el-checkbox__input.is-checked + .el-checkbox__label {
      color: #009a52;
    }
  }
  .el-checkbox {
    .el-checkbox__input.is-disabled.is-checked .el-checkbox__inner {
      background-color: rgba(103, 194, 58, 0.1);
      border-color: rgba(103, 194, 58, 0.2);
      &:after {
        border-color: #67c23a;
      }
    }
  }
}

.el-checkbox__input.is-checked .el-checkbox__inner,
.el-checkbox__input.is-indeterminate .el-checkbox__inner {
  background-color: #009a52;
  border-color: #009a52;
}

.el-checkbox__inner:hover {
  border: 1px solid #009a52;
}

.el-checkbox__input.is-focus .el-checkbox__inner {
  border: 1px solid #009a52;
}
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
.sysname span {
  margin-top: 6px;
}
.content1 > div {
  padding-left: 25px;
  font-size: 16px;
  color: gray;
  padding-bottom: 4px;
  margin-top: 4px;
}
.content1 .contentdisabel {
  color: rgb(190, 190, 190);
}
.content2:hover {
  background-color: #f5f7f9;
  color: rgb(0, 154, 82);
  /*height: 6px;*/
  /*border: 2px solid transparent;*/
  /*background-clip: content-box;*/
}
#hotsearch {
  padding: 10px 30px;
  div {
    text-align: left;
    padding: 8px 0px;
    color: #333;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
}
.hotsearchlist:hover {
  color: #009a52;
}
.left-column {
  height: 694px;
  border: 1px solid #c4c9d0;
  border-top: 3px solid #009a52;
  width: 21%;
  margin-left: 5%;
  margin-top: -62px;

  overflow-y: scroll;
  background: white;
}
.top {
  background-image: url("/static/index/s1.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  -moz-background-size: 100% 100%;
  width: 100%;
  padding-top: 10px;
  padding-bottom: 80px;
}
.checkbox-nav {
  width: 930px;
  color: white;
  font-weight: 700;
  font-size: 15px;
  line-height: 30px;
  padding: 10px 0px;
  margin: 0 auto;
  display: flex;
  align-items: flex-start;
  h4 {
    display: block;
    width: 100px;
    height: 24px;
  }
  .checkstyle {
    margin-left: 140px;
    width: 850px;
    display: flex;
    flex-wrap: wrap;
    .el-checkbox {
      display: flex;
      align-items: center;
      margin: 6px 6px 6px 0;
    }
  }
}

.list a:hover {
  color: #009a52;
}

.wrapper {
  background-image: url("/static/index/lunbo.jpg");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  -moz-background-size: 100% 100%;
}
.wrapperNew {
  background-repeat: no-repeat;
  background-size: 100% 100%;
  -moz-background-size: 100% 100%;
}
.commodity {
  background: #f5f5f5;
  .container {
    position: relative;
    .swiImgs {
      width: 100%;
      cursor: pointer;
      .item {
        height: 184px;
        .swiImg {
          width: 100%;
        }
      }
    }
  }
}
// 中间区域样式
.middle-column {
  border: 1px solid #c4c9d0;
  border-top: 3px solid #009a52;
  width: 47%;
  height: 694px;
  margin-left: 1%;
  margin-top: -62px;
  background: white;
}
// 信息公告
.information {
  display: block;
  width: 100%;
  height: 16px;
  padding: 10px 30px 16px 30px;
  font-size: 15px;
  line-height: 1;
  li {
    border-bottom: 1px dashed #c4c9d0;
    padding: 10px 0;
  }
  a {
    display: flex;
    justify-content: space-between;
    color: #333;
    font-size: 14px;
    &:hover {
      color: #009a52;
    }
  }
}
// 右侧侧边栏
.right-column {
  border: 1px solid #c4c9d0;
  border-top: 3px solid #009a52;
  width: 21%;
  margin-left: 1%;
  margin-top: -62px;
  /*z-index:999;*/
  background: white;
  /*float:left;*/
}
.searchhistory_top {
  color: #009a52;
  background: white;
  font-size: 15px;
  border-left: 1px solid #c4c9d0;
  border-right: 1px solid #c4c9d0;
  padding: 10px 20px;
  margin-left: 140px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
// 搜索历史
.searchmokuai-box {
  margin-left: 140px;
  border: 1px solid #c4c9d0;
  background-color: #fff;
  .search-history {
    height: 40px;
    padding: 0 20px;
    line-height: 40px;
    font-size: 15px;
    text-overflow: ellipsis;
    /*1. 强制文本不换行(css3)*/
    white-space: nowrap;
    /*2. overflow:hidden*/
    overflow: hidden;
    /*强制文字换行,也包括英文无空格*/
    word-break: break-all;
    &:hover {
      background-color: #f5f7fa;
    }
  }
}
.tags-box {
  height: 126px;
  padding: 10px 30px;
  .el-tag {
    border-radius: 0;
    margin-right: 4px;
    margin-top: 4px;
  }
}

.checks {
  .el-checkbox {
    width: 80px;
    text-align: left;
    margin: 6px 15px;
  }
}
.el-checkbox {
  margin-right: 20px;
  font-size: 18px;
}
.subbox {
  margin: 10px 30px;
  .el-tag {
    margin: 0 8px;
    border-radius: 0;
  }
}

.bot {
  color: white;
  border-right: 1px solid white;
  float: left;
  width: 12%;
  text-align: center;
}
.tree-box {
  padding: 0px 0px;
  background: white;
}
.list1 {
  margin-left: 30px;
  color: black;
  font-size: 18px;
}

.alist3 a {
  color: black;
  font-size: 18px;

  margin-left: 30px;
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

.search {
  border-radius: 0;
  border: none;
  width: 800px;
  font-size: 18px;
}

.lv {
  background: #009a52;
  color: white;
}

.lv:hover {
  color: white;
  background: #127714;
}

.checkbox {
  color: white;
  margin-left: 13px;
}

.el-input__inner {
  height: 40px;
  border-radius: 0;
  border: none;
  font-size: 18px;
}
.collect-li,
.hot_li {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  padding: 10px 0;
  line-height: 1;
  cursor: pointer;
  border-bottom: 1px dashed #c4c9d0;
}
.hot_li {
  border: none;
}

.swiper-button-next,
.swiper-button-prev {
  display: none;
}
// /*谷歌、safari、qq浏览器、360浏览器滚动条样式*/
// /*定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸*/
// ::-webkit-scrollbar {
//   width: 1px;
//   height: 110px;
//   background-color: #F5F5F5;
// }
// /*定义滚动条轨道 内阴影+圆角*/
// ::-webkit-scrollbar-track {
//   box-shadow: inset 0 0 6px rgba(194, 194, 194, 0.3);
//   border-radius: 1px;
//   background-color: #F5F5F5;
// }
// /*定义滑块 内阴影+圆角*/
// ::-webkit-scrollbar-thumb {
//   border-radius: 1px;
//   box-shadow: inset 0 0 6px rgba(0, 104, 17, 0.637);
//   background-color: #bdbdbd;
// }
// /*滑块效果*/
// ::-webkit-scrollbar-thumb:hover {
//   border-radius: 1px;
//   box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
//   background: rgba(0, 100, 8, 0.4);
// }
</style>

