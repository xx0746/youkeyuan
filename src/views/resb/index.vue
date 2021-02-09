<template>
  <div class="index-container" style="background:#F2F2F2;">
    <div class="top">
      <div class="sys_nav" style="border:none;background:transparent">
        <a href="#/resbsearch" class="sysname">
          <img src="/static/index/logo.png" style="width:250px;margin-top:16px;margin-left:30px" />
          <span>•&nbsp;科研资源数据平台</span>
        </a>
        <div
          class="topbar-account topbar-btn"
          style="margin-right:40px;position:relative;float:right;cursor: pointer;"
        >
          <span style="display: inline-block">
            <login-out :Updatenews="newsdata" :showlogins="showlogindaiban"></login-out>
          </span>
          <span style="display: inline-block"v-show="showAdmin">
            <el-button
              @click="goBackAdmin()"
              size="small"
              type="primary"
              style="vertical-align: -webkit-baseline-middle;vertical-align: text-top;margin-left:60px;font-weight: 700;font-size:14px;"
              v-show="showAdmin"
            >后台管理登录</el-button>
          </span>
        </div>
      </div>
      <div class="searchbox">
        <el-select
          v-model="value"
          placeholder="请选择"
          style="float:left;width:12%;margin-left:4%;border-right:1px solid #999999;display: none;"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <el-input
          class="search"
          ref="searchInput"
          :value="searchList.searchName"
          @input="handleInput"
          @blur="onblur(1)"
          @focus="onfocus(1)"
          placeholder="请输入内容"
          style="height: 40px"
        ></el-input>
        <el-button class="button lv" type="primary" :loading="isLoading" @click="search(1)">搜索</el-button>
        <div class="tit3" style="display:none;">跨库选择(7)</div>
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
                @mousedown="historySearch(1,item)"
                v-for="(item,key) in history"
                :key="key.id"
              >{{item}}</li>
            </ul>
          </div>
        </div>
        <div v-show="searchLinxion" style="z-index: 999;position: absolute; width:800px; ">
          <div class="searchmokuai-box">
            <ul>
              <li
                class="search-history"
                @mousedown="setSearchName(1,item)"
                v-for="(item,key) in lianxiangList"
                :key="key"
              >{{item}}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <div class="clearfix main">
      <div class="box search-tree">
        <el-tree
          class="treedisab"
          :data="treeList"
          :props="treeDefaultProps"
          ref="tree"
          accordion
          :default-expanded-keys="defaultExp"
          node-key="value"
          highlight-current
          @node-click="handleTreeNode"
          empty-text="正在加载中"
        ></el-tree>
      </div>
      <!-- 知识专区表格 -->
      <div class="tableSection" v-if="Number(searchKeyRegion)=== 1">
        <div class="navbox">
          <div class="taghide" v-show="allTallyList.length <= 0">
            <span>当前资源库无数据</span>
          </div>
          <div v-show="allTallyList.length > 0">
            <div class="group-nav">
              <strong>分组:</strong>
              <div class="groupbox" ref="groupbox">
                <span
                  v-for="(items, index) in tallyList"
                  :key="index"
                  :class="items.isActive ? 'active': ''"
                  @click="tagTabs(items.ids,index)"
                >{{items.name}}</span>
              </div>
              <span @click="getMoreTally" class="moreStyle" v-show="moreShow">
                <u :class="[MoreMsg == '更多 >'? 'more': 'close']">{{MoreMsg}}</u>
              </span>
            </div>
            <!-- <div class="tagsbox" v-show="tagList.length > 0"> -->
            <div class="tagsbox" v-show="tagListShow">
              <strong>标签:</strong>
              <div class="tags">
                <span
                  v-for="(items, index) in tagList"
                  :key="index"
                  class="tag-active"
                  tabindex="index"
                  @click="getTagTableData(items.ids,index)"
                  :class="items.isActive?'current':''"
                >{{items.name}}</span>
              </div>
              <span class="tagClose" @click="tagClose">
                <i class="el-icon-close"></i>
              </span>
            </div>
            <!-- <div class="taghide" v-show="tagList.length == 0">
              <span v-show="labelTypeId != ''">当前分组无标签</span>
              <span v-show="labelTypeId == ''">请选择分组</span>
            </div>-->
          </div>
        </div>
        <div style="margin-left: 20px; margin-top: 10px;">
          <el-button
            size="mini"
            type="primary"
            class="moredown-btn"
            @click="MoreFileDownLoad()"
          >批量下载</el-button>
          <span
            class="tab-btn1 iconfont icon-liebiao"
            :class="listStyle == 2? 'active' : ''"
            @click="tabList(2)"
          ></span>
          <span
            class="tab-btn2 iconfont icon-liebiao1"
            :class="listStyle == 1? 'active' : ''"
            @click="tabList(1)"
          ></span>
        </div>
        <div class="table" style="color:black;padding:20px;">
          <el-table
            v-if="listStyle == 2"
            v-loading="isLoading"
            fit
            highlight-current-row
            :data="searchTable"
            :show-header="false"
            class="search-list_box"
            @selection-change="handleSelectionChange"
          >
            <el-table-column align="center" width="30" type="selection"></el-table-column>
            <el-table-column align="center" width="40px" label="序号">
              <template slot-scope="scope">
                <span>{{scope.$index+1}}</span>
              </template>
            </el-table-column>

            <el-table-column align="left">
              <template slot-scope="scope">
                <div class="tr-title">
                  <a
                    href="javascript:;"
                    title="点击查看详情"
                    v-html="scope.row.resourceName"
                    @click="getTableData(scope.row)"
                    class="atag"
                  >{{scope.row.resourceName}}</a>
                  <div class="handle-btn">
                    <diy-btn
                      styleType="icon"
                      iconType="icon-download"
                      @click="isDownLoad(scope.row,1)"
                    ></diy-btn>
                    <diy-btn
                      styleType="icon"
                      iconType="icon-details"
                      @click="getTableData(scope.row)"
                    ></diy-btn>
                    <!-- <i title="详情" class="icon-details" @click="getTableData(scope.row)"></i>
                    <i title="下载" class="icon-download" @click="isDownLoad(scope.row,1)"></i>-->
                  </div>
                </div>
                <div class="tr-props">
                  <p>{{scope.row.createUser}}</p>
                  <el-tooltip
                    :content="scope.row.menuArray | menuStyle"
                    placement="top"
                    effect="dark"
                  >
                    <p
                      @click="clickMenuName(scope.row)"
                      style="text-align:center;"
                      class="menu-dash"
                    >{{scope.row.menuName}}</p>
                  </el-tooltip>
                  <p style="text-align:right;">{{scope.row.createTime}}</p>
                </div>
                <div class="file-digest">
                  <div
                    v-for="element in scope.row.fileDigest"
                    :key="element.id"
                    class="file-digest_box"
                  >
                    <a
                      href="javascript:;"
                      v-html="element.fileName"
                      @click="fileNameClick(element,scope.row.resourceId)"
                    >{{element.fileName}}</a>
                    <p
                      class="c"
                      v-html="element.content"
                      v-if="element.content != 'null'"
                    >{{element.content}}</p>
                    <p v-if="element.tags[0] != '' && element.tags[0] != 'null'">
                      <el-tag
                        type="success"
                        size="mini"
                        v-for="(item, index) in element.tags"
                        :key="index"
                        v-html="item"
                      >{{item}}</el-tag>
                    </p>
                  </div>
                </div>
                <p
                  style="text-align: left; font-size: 16px;"
                  @click="getTableData(scope.row)"
                  v-show="scope.row.fileNum > 3"
                >
                  <i class="el-icon-more" title="更多"></i>
                </p>
              </template>
            </el-table-column>
            <!-- <el-table-column class="icon_a" align="center" width="210">
              <template slot-scope="scope">
                <el-button type="primary2" @click="isDownLoad(scope.row,1)">下载</el-button>
                <el-button type="primary2" @click="getTableData(scope.row)">查看详情</el-button>
              </template>
            </el-table-column>-->
          </el-table>
          <el-table
            v-if="listStyle == 1"
            v-loading="isLoading"
            stripe
            border
            fit
            highlight-current-row
            :data="searchTable"
            @selection-change="handleSelectionChange"
            :header-cell-style="{
              'background-color': '#f5f7fa',
              'color': 'rgb(103, 194, 58)',
               }"
          >
            <el-table-column align="center" width="40" type="selection"></el-table-column>

            <el-table-column align="center" width="60px" label="序号">
              <template slot-scope="scope">
                <span>{{scope.$index+1}}</span>
              </template>
            </el-table-column>

            <el-table-column align="center" label="题名">
              <template slot-scope="scope">
                <div style="text-align:left;">
                  <a
                    href="javascript:;"
                    title="点击查看详情"
                    v-html="scope.row.resourceName"
                    @click="getTableData(scope.row)"
                    class="atag"
                  >{{scope.row.resourceName}}</a>
                </div>
              </template>
            </el-table-column>

            <el-table-column width="120" align="center" label="上传人">
              <template slot-scope="scope">
                <span>{{scope.row.createUser}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" width="170" label="上传时间">
              <template slot-scope="scope">
                <span>{{scope.row.createTime}}</span>
              </template>
            </el-table-column>

            <el-table-column width="110" align="center" label="所属资源目录">
              <template slot-scope="scope">
                <span>{{scope.row.menuName}}</span>
              </template>
            </el-table-column>

            <el-table-column class="icon_a" align="center" label="操作" width="140">
              <template slot-scope="scope">
                <!-- <el-button type="primary2" @click="isDownLoad(scope.row,1)">下载</el-button>
                <el-button type="primary2"  @click="getTableData(scope.row)">查看详情</el-button>-->
                <div class="handle-col">
                  <diy-btn
                    styleType="icon"
                    iconType="icon-download"
                    @click="isDownLoad(scope.row,1)"
                  ></diy-btn>
                  <diy-btn
                    styleType="icon"
                    iconType="icon-details"
                    @click="getTableData(scope.row)"
                  ></diy-btn>
                </div>
              </template>
            </el-table-column>
          </el-table>
          <div class="block">
            <el-pagination
              style="text-align: center"
              :page-size="10"
              :current-page="searchList.pageNumber"
              @current-change="handleCurrentChange"
              layout="total,  prev, pager, next, jumper"
              :total="total"
            ></el-pagination>
          </div>
        </div>
      </div>
      <!-- 数据专区表格 -->
      <div class="tableSection" v-else-if="Number(searchKeyRegion) === 2">
        <div v-if="subType === 4">
          <!-- <el-tabs v-model="activeName">
          <el-tab-pane name="first">-->
          <div class="navbox">
            <div class="taghide" v-show="allTallyList.length <= 0">
              <span>当前资源库无数据</span>
            </div>
            <div v-show="allTallyList.length > 0">
              <div class="group-nav">
                <strong>分组:</strong>
                <div class="groupbox" ref="groupbox">
                  <span
                    v-for="(items, index) in tallyList"
                    :key="items.ids"
                    :class="items.isActive?'active':''"
                    @click="tagTabs(items.ids, index)"
                  >{{items.name}}</span>
                </div>
                <span @click="getMoreTally" class="moreStyle" v-show="moreShow">
                  <u :class="[MoreMsg == '更多 >'? 'more': 'close']">{{MoreMsg}}</u>
                </span>
              </div>
              <div class="tagsbox" v-show="tagListShow ">
                <strong>标签:</strong>
                <div class="tags">
                  <span
                    v-for="(items, index) in tagList"
                    :key="index"
                    class="tag-active"
                    @click="getTagTableData(items.ids,index)"
                    :class="items.isActive?'current':''"
                  >{{items.name}}</span>
                </div>
                <span class="tagClose" @click="tagClose">
                  <i class="el-icon-close"></i>
                </span>
              </div>
              <!-- <div class="taghide" v-show="tagList.length == 0">
                <span v-show="labelTypeId != ''">当前分组无标签</span>
                <span v-show="labelTypeId == ''">请选择分组</span>
              </div>-->
            </div>
          </div>
          <div class="table" style="color:black;padding:20px;">
            <el-table
              row-key="id"
              stripe
              border
              fit
              highlight-current-row
              :data="dataTable"
              @selection-change="handleSelectionChange"
              :header-cell-style="{
              'background-color': '#f5f7fa',
              'color': 'rgb(103, 194, 58)',
               }"
            >
              <el-table-column align="center" width="60px" label="序号">
                <template slot-scope="scope">
                  <span>{{scope.$index+1}}</span>
                </template>
              </el-table-column>

              <el-table-column align="center" label="表单名称">
                <template slot-scope="scope">
                  <div
                    style="text-align:left;"
                    v-html="scope.row.collectName"
                  >{{scope.row.collectName}}</div>
                </template>
              </el-table-column>

              <el-table-column align="center" width="120" label="所属资源目录">
                <template slot-scope="scope">
                  <span>{{scope.row.menuName}}</span>
                </template>
              </el-table-column>
              <el-table-column align="center" width="100" label="表单类型">
                <template slot-scope="scope">
                  <span>{{scope.row.collectType | dataColloctType}}</span>
                </template>
              </el-table-column>
              <el-table-column align="center" width="120" label="上传人">
                <template slot-scope="scope">
                  <span>{{scope.row.createUser}}</span>
                </template>
              </el-table-column>
              <el-table-column align="center" width="170" label="上传时间">
                <template slot-scope="scope">
                  <span>{{scope.row.createTime}}</span>
                </template>
              </el-table-column>

              <el-table-column class="icon_a" align="center" label="操作" width="140">
                <template slot-scope="scope">
                  <div class="handle-col">
                    <diy-btn
                      styleType="icon"
                      iconType="icon-download"
                      @click="dataDownload(scope.row)"
                    ></diy-btn>
                    <diy-btn
                      styleType="icon"
                      iconType="icon-preview"
                      @click="handPreview(scope.row)"
                    ></diy-btn>
                  </div>
                  <!-- <el-button size="mini" type="primary2" @click="dataDownload(scope.row)">下载</el-button>
                  <el-button size="mini" type="primary2" @click="handPreview(scope.row)">预览</el-button>-->
                </template>
              </el-table-column>
            </el-table>
            <div class="block">
              <el-pagination
                style="text-align: center"
                :page-size="10"
                :current-page="searchList.pageNumber"
                @current-change="handleCurrentChange"
                layout="total,  prev, pager, next, jumper"
                :total="total"
              ></el-pagination>
            </div>
          </div>
          <!-- </el-tab-pane> -->
          <!-- <el-tab-pane label="快递数据列表" name="second">

          </el-tab-pane>-->
          <!-- </el-tabs> -->
        </div>
      </div>
      <!-- 预览弹窗 -->
      <el-dialog class="dialogTitle el-preview" title="文件预览" :visible.sync="isShow">
        <div class="pdf-cont" style="width: 860px;" v-if="isShowPdf">
          <pdf-preview
            :title="fileName"
            :dataFlow="dataFlow"
            :loadPage="fileState"
            style="width: 860px; height: 100%; margin-top: -10px; overflow: hidden;"
          ></pdf-preview>
        </div>
      </el-dialog>
      <div style="clear: both;"></div>
    </div>
    <div class="progress-box" v-show="downProgress">
      <p>文件过多，正在打包中...</p>
      <el-progress :text-inside="true" :stroke-width="14" :percentage="num" status="success"></el-progress>
    </div>
    <footer-view></footer-view>
  </div>
</template>


<script>
import { Loading } from "element-ui";
import loginOut from "@/components/loginOut";
import {
  getlabelListAllData,
  getTagListAllData,
  getTagcontentData,
} from "@/api/manualupload";
import { getDatasDown, auditDataDownCommit } from "@/api/datamanage";
import {
  searchSolrInterface,
  searchDataInterface,
  fileAddInterface,
  getNewsInfoList,
  getSearchAssociate,
  getSearchHistoryInterface,
  getsearchEmpty,
  searchFilePreview,
  getMenuidArr,
} from "@/api/search";
import { fileMoreDownLoad } from "@/api/resource_list";
import { downloadFile, handleBatchDownload } from "@/utils/utile";
import { finRepetionCode } from "@/utils/arr-compute";
import { throttle, debounce } from "@/utils/Debounce";
import footerView from "@/views/home/footerView";
import pdfPreview from "@/components/pdfPreview/PdfPreview";
import { getPreviewBase64 } from "@/api/comment";
export default {
  components: { loginOut, footerView, pdfPreview },
  data() {
    return {
      showAdmin:false,
      labelIds: "",
      tagListShow: false,
      // 预览
      dataFlow: "",
      fileName: "",
      fileState: 0,
      isShow: false,
      isShowPdf: false,
      isLoading: false,
      showlogindaiban: {
        state: false,
      },
      newsdata: true,
      activeName: "first",
      subType: 4,
      limit: 10,
      sortable: null,
      oldList: [],
      newList: [],
      active: false,
      // 主导航
      treeList: [],
      treeDefaultProps: {
        children: "children",
        label: "label",
        disabled: "disabled",
      },
      defaultExp: [15, 16],
      isDoMainMenu: true,
      // 面包屑
      crumbsList: [],
      // 标签分组数据
      allTallyList: [],
      tallyList: [],
      // 标签内容数据
      tagList: [],
      labelTypeId: "",
      // 是否展示更多分组
      isShowMore: true,
      MoreMsg: "更多 >",
      moreShow: true,

      options: [],
      // 订阅状态
      state: 0,
      value: "",
      searchList: {
        searchName: "",
        pageNumber: 1,
        limit: 10,
        menuIds: "",
        parentId: "",
        labelIds: "",
        groupIds: "",
        dataThree: "",
        items: [],
        menuidArr: [],
        searchType: "",
        // 数据专区参数
        dataType: "",
        dataLabelIds: "",
      },
      // 搜索联想
      temp: false,
      searchLinxion: false,
      lianxiangList: [],
      // 搜索历史
      searchhistory: false,
      isOnemptyBtn: false,
      searchHistory: [],
      //
      obj: {},
      list: "",
      checkList: [],
      currentPage1: 5,
      currentPage2: 5,
      currentPage3: 5,
      currentPage4: 4,
      total: null,
      searchTable: [],
      dataTable: [],
      menuIdsArr: [],
      itemCheck: false,
      // 表格切换展示效果
      status: false,
      listStyle: 2,
      // 数据下载
      downList: {
        menuId: "",
        fileId: "",
        flag: "",
      },
      // 获取最新消息栏信息参数
      theLatestWord: {
        userId: 1,
        pageSize: 5,
        pageNumber: 1,
      },
      // 表格多选数据
      multipleSelection: [],
      // 批量下载传参
      params: {},
      downProgress: false,
      num: 0,
      // 标签分组渲染
      iscount: false,
    };
  },
  computed: {
    getparentIds() {
      return this.$store.getters.getSearchList.parentId;
    },
    searchKeyRegion() {
      if (this.$store.getters.getSearchList.searchType) {
        return Number(this.$store.getters.getSearchList.searchType);
      } else {
        return 1;
      }
    },
    // 默认展示12个分组数据
    oneTallyList() {
      return this.allTallyList.slice(0, 12);
    },
    //搜索历史
    history() {
      return this.searchHistory
        .filter((item) => {
          return item != "" && item != null;
        })
        .slice(0, 4);
    },
    tableValue() {
      return this.$store.state.tableValue;
    },
  },
  watch: {
    dataFlow(val) {
      if (val) {
        this.isShowPdf = false;
        this.$nextTick((_) => {
          this.isShowPdf = true;
        });
      }
    },
    // 监听分组条数，判断是否展示 “更多>” 按钮
    allTallyList(val) {
      if (val.length > 10) {
        this.moreShow = true;
      } else {
        this.moreShow = false;
      }
    },
    // 监听开关状态，调整分组展示条数
    isShowMore(val) {
      if (val) {
        this.tallyList = this.allTallyList;
      } else {
        this.tallyList = this.oneTallyList;
      }
    },
    "searchList.searchName"(newVal, oldVal) {
      if (newVal != oldVal) {
        if (this.searchList.state != 1) {
          throttle((_) => {
            this.inputChange(newVal);
          }, 500);
        } else {
          this.searchList.state = 0;
        }
      }
    },
  },
  filters: {
    dataColloctType(v) {
      switch (v) {
        case 1:
          return "导入";
          break;
        case 2:
          return "清洗";
          break;
        case 3:
          return "排重";
          break;
        default:
          break;
      }
    },
    menuStyle(v) {
      let a = v.split(",");
      let str = a.join("/");
      return str;
    },
    editContent(v) {
      console.log(v);
    },
  },
  created() {
    let obj = { ...this.searchList, ...this.$store.getters.getSearchList };
    this.$store.dispatch("setSearchList", obj);
    this.searchList = JSON.parse(JSON.stringify(obj));
    this.searchList.groupIds = "";
    console.log(this.searchList);
    if (obj.dataThree != "") {
      this.crumbsList = obj.items;
      this.crumbsList.forEach((item) => {
        if (item.menuId == this.searchList.dataThree) {
          item.checked = true;
        }
      });
    } else {
      this.isDoMainMenu = false;
    }
    let a = obj.menuIds.split(",").map((item) => {
      return Number(item);
    });
    let b = a.concat(obj.menuidArr);
    this.defaultExp = [...new Set(b)];
    this.searchList.pageNumber = 1;
    this.getSearchHistory();
    this.getLeftTreeData();
    this.getTallyAllList();
    this.search(1);
  },
  mounted() {
    let roleName = window.sessionStorage.getItem("roleName");
    console.log(roleName)
    if(roleName === "用户") {
      this.showAdmin = false;
    }else{
      this.showAdmin = true;
    }
    console.log(this.tableValue);
    this.listStyle = this.tableValue;
  },
  beforeUpdate() {
    let box = this.$refs.groupbox;
    let boxWidth = box.offsetWidth;
    if (boxWidth != 0) {
      if (!this.iscount) {
        this.iscount = true;
        let boxspan = box.children;
        let childrenWidth = 0;
        for (let i = 0; i < boxspan.length; i++) {
          let cwidth = boxspan[i].offsetWidth;
          childrenWidth += cwidth;
          if (childrenWidth >= boxWidth) {
            boxspan[i].style.display = "none";
          }
        }
        console.log(childrenWidth);
      }
    }
  },
  methods: {
    goBackAdmin() {
      this.$router.push({
        path: "/index",
      });
    },
    // 获取资源库列表
    getLeftTreeData() {
      getlabelListAllData().then((res) => {
        if (res.data.code === 1) {
          if (this.searchKeyRegion == 1) {
            this.treeList = [res.data.data[0]];
            this.AddParentId(this.treeList, "", 15, [], []);
          } else if (this.searchKeyRegion == 2) {
            this.treeList = [res.data.data[1]];
            this.AddParentId(this.treeList, "", 16, [], []);
          }
        }
      });
    },
    handleTreeNode(val) {
      this._clear();
      if (val.rootId == 15) {
        this.searchList.searchType = 1;
      } else if (val.rootId == 16) {
        this.searchList.searchType = 2;
        this.searchList.dataType = val.menuId;
      }
      if (val.menuId == 15) {
        this.defaultExp = [15];
        this.getLeftTreeData();
      } else if (val.menuId == 16) {
        this.defaultExp = [16];
        this.getLeftTreeData();
      }
      this.searchList.menuIds = val.parentId.toString();
      this.searchList.dataType = val.parentId.toString();
      this.searchList.dataThree = val.menuId;
      this.searchList.items = val.items;
      this.searchList.menuidArr = val.menuidArr;
      this.searchList.groupIds = this.labelTypeId;
      this.searchList.labelIds = this.labelIds;
      this.searchList.dataLabelIds = this.labelIds;
      this.$store.dispatch("setSearchList", this.searchList);
      this.searchList.pageNumber = 1;
      this.search(1);
    },
    // 获取搜索历史
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
    // 搜索联想
    inputChange(value) {
      if (value != "undefined" && value != "") {
        this.searchhistory = false;
        getSearchAssociate(value).then((res) => {
          console.log(res);
          if (res.data.code == 1) {
            this.lianxiangList = res.data.data.suggest;
          }
          if (this.lianxiangList.length == 0) {
            this.searchLinxion = false;
          } else if (this.temp) {
            // 从搜索页跳转过来识别参数
            this.searchLinxion = true;
          }
        });
      } else {
        this.searchLinxion = false;
      }
    },
    // 点击搜索联想
    setSearchName(state, name) {
      this.searchList.searchName = name;
      this.searchList.state = state;
      this.searchLinxion = false;
      this.search(state);
    },
    // 点击搜索历史
    historySearch(state, item) {
      this.searchList.searchName = item;
      this.searchList.state = state;
      this.searchhistory = false;
      this.search(state);
    },
    // 输入框值改变
    handleInput(val) {
      if (val == "") {
        this.searchLinxion = false;
        this.searchhistory = true;
      } else {
        this.searchLinxion = true;
        this.searchhistory = false;
      }
      this.$set(this.searchList, "searchName", val);
      this.$store.dispatch("setSearchList", this.searchList);
    },
    onblur(state) {
      this.searchLinxion = false;
      setTimeout((_) => {
        if (this.isOnemptyBtn) {
          this.isOnemptyBtn = false;
        } else {
          this.searchhistory = false;
        }
      }, 200);
    },
    onfocus(state) {
      console.log(state);
      if (state == "undefined") {
        this.temp = false;
      } else {
        this.temp = true;
      }
      $(".search").keyup((event) => {
        if (event.keyCode == 13) {
          this.searchLinxion = false;
          this.searchhistory = false;
          this.search(1);
        }
      });
      this.getSearchHistory();
      if (this.searchList.searchName != "") {
        this.searchhistory = false;
        this.inputChange(this.searchList.searchName);
      } else {
        this.searchhistory = true;
      }
    },
    // 点击搜索按钮
    search(state) {
      // 搜索前初始化参数
      this.isLoading = true;
      if (state == 1) {
        this.searchList.pageNumber = 1;
      }
      if (typeof this.searchList.pageNumber == "undefined") {
        this.searchList.pageNumber = 1;
      }
      if (typeof this.searchList.searchName == "undefined") {
        this.searchList.searchName = "";
      }
      // 摘要数据均由@ZY@分隔 分别是: id 名称 文件内容 标签
      debounce(() => {
        if (this.searchKeyRegion == 1) {
          searchSolrInterface(this.searchList).then((res) => {
            if (res.data.code == 1 && res.data.data != null) {
              this.total = res.data.data.total;
              this.searchTable = res.data.data.rows;
              if (this.searchTable.length == 0) {
                this.$message.info("搜索内容无匹配结果！");
              }
              // 转数据
              this.changeData(this.searchTable);
            } else {
              this.total = 0;
              this.searchTable = [];
            }
            this.isLoading = false;
          });
        } else if (this.searchKeyRegion == 2) {
          searchDataInterface(this.searchList).then((res) => {
            if (res.data.code == 1 && res.data.data != null) {
              this.total = res.data.data.total;
              this.dataTable = res.data.data.rows;
              if (this.dataTable.length == 0) {
                this.$message.info("搜索内容无匹配结果！");
              }
            } else {
              this.total = 0;
              this.dataTable = [];
            }
            this.isLoading = false;
          });
        }
      }, 500);
    },
    // 点击下载按钮
    isDownLoad(row, num) {
      this.downList.menuId = row.menuId;
      this.downList.fileId = row.resourceId;
      this.downList.flag = num;
      let fileIds = `${this.downList.menuId}-${this.downList.fileId}`;
      let page = 1;
      let type = 3;
      let params = { fileIds, page, type, name: row.resourceName };
      this.downLoad(params);
    },
    // 数据专区点击下载按钮
    dataDownload(row) {
      let ss = {
        dataType: row.dataType,
        dataId: row.entityId,
      };
      getDatasDown(ss).then((res) => {
        if (res.data.code <= 0) {
          this.$message({
            type: "error",
            message: res.data.msg,
          });
        } else if (res.data.code == 4) {
          downloadFile(
            res.data.data.downUrl +
              "?attname=" +
              res.data.data.collectName +
              ".xls"
          );
        } else if (res.data.code == 1) {
          this.$message({
            type: "warning",
            message: res.data.msg,
          });
        } else if (res.data.code == 2) {
          this.$confirm(`该文件下载需要审核，是否提交下载申请？`, "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          })
            .then(() => {
              auditDataDownCommit(ss).then((res) => {
                if (res.data.code == 1) {
                  this.$message({
                    type: "success",
                    message: "申请已提交！",
                  });
                }
              });
            })
            .catch(() => {
              this.$message({
                type: "info",
                message: "已取消下载",
              });
            });
        } else if (res.data.code == 3) {
          this.$confirm(`${res.data.msg}\n是否重新提交下载申请？`, "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          })
            .then(() => {
              auditDataDownCommit(ss).then((res) => {
                if (res.data.code == 1) {
                  this.$message({
                    type: "success",
                    message: "申请已提交！",
                  });
                }
              });
            })
            .catch(() => {
              this.$message({
                type: "info",
                message: "已取消下载",
              });
            });
        }
      });
    },
    // 下载
    downLoad(params) {
      fileMoreDownLoad(params).then((res) => {
        if (res.data.code == 0) {
          this.$confirm(`${res.data.msg}是否提交下载申请？`, "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          })
            .then(() => {
              if (res.data.data != "") {
                let s = res.data.data;
                let a = s.split("-");
                this.downList.fileId = a[1];
                this.downList.menuId = a[0];
                this.downList.flag = 1;
              }
              fileAddInterface(this.downList).then((res) => {
                if (res.data.code == 1) {
                  this.$message({
                    type: "success",
                    message: "申请已提交！",
                  });
                }
              });
            })
            .catch(() => {
              this.$message({
                type: "info",
                message: "已取消下载",
              });
            });
        } else if (res.data.code == 4) {
          let urlArr = res.data.data;
          if (urlArr.length < 5) {
            for (let i = 0; i < urlArr.length; i++) {
              downloadFile(urlArr[i]);
            }
          } else {
            // 多文件打包压缩下载
            this.downProgress = true;
            let newUrlArr = finRepetionCode(urlArr);
            this.urlArr = newUrlArr.map((item) => {
              let url = item.split("?");
              let obj = {
                fileUrl: url[0],
                name: item.split("=")[1],
              };
              return obj;
            });
            handleBatchDownload(
              this.urlArr,
              params.name || "批量下载文件",
              (progress) => {
                this.num = progress;
                if (this.num == 100) {
                  this.downProgress = false;
                  this.num = 0;
                }
              }
            );
          }
        } else if (res.data.code == 1) {
          this.$message.warning(res.data.msg);
        } else if (res.data.code == 2) {
          this.$confirm(`${res.data.msg}是否重新提交下载申请？`, "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          })
            .then(() => {
              fileAddInterface(this.downList).then((res) => {
                if (res.data.code == 1) {
                  this.$message({
                    type: "success",
                    message: "申请已提交！",
                  });
                }
              });
            })
            .catch(() => {
              this.$message({
                type: "info",
                message: "已取消下载",
              });
            });
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    // 获取详情单行表格信息
    getTableData(row) {
      let rowInfo = {
        icon: 1,
        createTime: row.createTime,
        menuName: row.menuName,
        menuId: row.menuId,
        id: row.resourceId,
        name: row.resourceName,
        resourceId: row.resourceId,
        createUser: row.createUser,
        labelIds: row.labelIds,
      };
      this.$store.commit("setReview", rowInfo);
      this.$router.push({
        path: "/comment",
        query: {
          icon: 1,
        },
      });
    },
    // 标签分组导航选择
    tagTabs(ids, index) {
      if (this.allTallyList[index].isActive == true) {
        this.allTallyList[index].isActive = false;
        this.labelTypeId = "";
        this.searchList.groupIds = "";
      } else {
        this.allTallyList[index].isActive = true;
        this.labelTypeId = ids;
        this.searchList.groupIds = ids;
      }
      this.allTallyList.forEach((item) => {
        if (item.ids != ids) {
          item.isActive = false;
        }
      });
      console.log(this.allTallyList);
      this.getTagContent();
    },
    // 获取标签组
    getTallyAllList(index) {
      getTagListAllData().then((res) => {
        if (res.data.code == 1) {
          let list = this.formatterRes(res.data.data, "typeName");
          this.allTallyList = JSON.parse(JSON.stringify(list));
          if (this.allTallyList.length > 0) {
            this.isShowMore = false;
          }
        }
      });
    },
    // 获取标签内容
    getTagContent(index) {
      this.searchList.labelIds = "";
      this.searchList.dataLabelIds = "";
      let data = {
        labelTypeId: this.labelTypeId,
      };
      getTagcontentData(data).then((res) => {
        if (res.data.code == 1 && res.data.data != null) {
          this.tagList = res.data.data;
          this.tagList = this.formatterRes(this.tagList, "labelName");
          console.log(this.tagList);
          if (this.tagList.length > 0) {
            this.tagListShow = true;
          } else {
            this.tagListShow = false;
          }
          this.labelIds = "";
        } else {
          this.tagListShow = false;
        }
      });
    },
    // 获取标签对应表格数据
    // 摘要数据均由@ZY@分隔 分别是: id 名称 文件 内容 标签
    getTagTableData(val, index) {
      if (this.tagList[index].isActive == true) {
        this.tagList[index].isActive = false;
        this.labelIds = this.labelIds.replace(`${val},`, "");
      } else {
        this.tagList[index].isActive = true;
        this.labelIds += `${val},`;
      }
      this.searchList.pageNumber = 1;
      this.searchList.labelIds = this.labelIds;
      this.searchList.dataLabelIds = this.labelIds;
      if (this.searchKeyRegion == 1) {
        searchSolrInterface(this.searchList).then((res) => {
          if (res.data.code == 1 && res.data.data != null) {
            this.total = res.data.data.total;
            this.searchTable = res.data.data.rows;
            // 转数据
            this.changeData(this.searchTable);
          } else {
            this.total = 0;
            this.searchTable = [];
            return false;
          }
        });
      } else if (this.searchKeyRegion == 2) {
        searchDataInterface(this.searchList).then((res) => {
          if (res.data.code == 1 && res.data.data != null) {
            this.total = res.data.data.total;
            this.dataTable = res.data.data.rows;
          } else {
            this.total = 0;
            this.dataTable = [];
            return false;
          }
        });
      }
    },
    // 分页
    handleCurrentChange(val) {
      this.searchList.pageNumber = val;
      window.scrollTo(0, 0);
      this.search();
    },
    // 获取更多标签分组点击事件
    getMoreTally() {
      this.isShowMore = !this.isShowMore;
      if (this.isShowMore) {
        this.MoreMsg = "折叠 X";
        let box = this.$refs.groupbox;
        let boxspan = box.children;
        for (let i = 0; i < boxspan.length; i++) {
          boxspan[i].style.display = "inline-block";
        }
      } else {
        this.MoreMsg = "更多 >";
        this.iscount = false;
      }
    },
    // 表格复选框事件
    handleSelectionChange(arr) {
      this.multipleSelection = arr;
      this.params = this.getFilders(arr);
    },
    tabList(val) {
      this.$store.commit("setTableValue", val);
      console.log(val);
      this.listStyle = val;
      this.search();
    },
    // 批量下载
    MoreFileDownLoad() {
      let blen = JSON.stringify(this.params) == "{}";
      if (blen) {
        return this.$message.warning("请先勾选要下载的记录！");
      }
      console.log(this.params);
      this.downLoad(this.params);
    },
    // 数组去重，并且算出次数
    //方法：使用obj记录重复的元素，以及出现的次数
    getCount(arr) {
      var obj = {},
        k,
        arr1 = [];
      for (var i = 0, len = arr.length; i < len; i++) {
        k = arr[i].name;
        if (obj[k]) obj[k]++;
        else obj[k] = 1;
      }
      //保存结果{el-'元素'，count-出现次数}
      for (var o in obj) {
        arr1.push({
          name: o,
          count: obj[o],
        });
      }
      return arr1;
    },
    // 格式化获取的标签组和内容数据，返回一个有id，name，ids的对象
    formatterRes(arr, name) {
      let nameArr = arr.map((item) => {
        return { name: item[name], id: item.id };
      });
      let arr2 = this.getCount(nameArr);
      arr2.forEach((item) => {
        let a = [];
        for (let i = 0; i < nameArr.length; i++) {
          if (nameArr[i].name == item.name) {
            a.push(nameArr[i].id);
          }
        }
        item.ids = a.join(",");
        item.isActive = false;
      });
      return arr2;
    },
    // 批量下载获取参数
    getFilders(arr) {
      console.log(arr);
      let object = {};
      arr.forEach((item) => {
        let menuid = item.menuId;
        object[menuid] += "," + item.resourceId.toString();
      });
      let fileIds = [];
      for (const key in object) {
        let arr1 = object[key].split(",");
        arr1.splice(0, 1);
        fileIds.push(key + "-" + arr1.join(","));
      }
      let page = 1;
      let params = { fileIds: fileIds.join("_"), page, type: 3 };
      return params;
    },
    // 点击摘要目录名称，跳转目录
    clickMenuName(param) {
      getMenuidArr(param.dataThree).then((res) => {
        if (res.data.code == 1) {
          let menuArr = res.data.data.menuArray.split(",");
          this.defaultExp = menuArr;
          this.searchList.menuIds = param.menuId.toString();
          this.searchList.dataType = param.menuId.toString();
          this.searchList.dataThree = param.dataThree;
          this.$store.dispatch("setSearchList", this.searchList);
          this.$refs.tree.setCurrentKey(param.dataThree);
          this.search(1);
          $("html,body").animate({ scrollTop: 0 }, 500);
        }
      });
    },
    // 知识专区点击文件名预览
    fileNameClick(file, resourceId) {
      console.log(file);
      let data = {
        fileIds: `${file.id}-${resourceId}`,
        page: 1,
        type: 3,
        resourceIds: resourceId,
      };
      fileMoreDownLoad(data).then((res) => {
        let flag = false;
        if (
          res.data.code == 0 ||
          res.data.code == 1 ||
          res.data.code == 2 ||
          res.data.code == 3
        ) {
          this.fileState = 5;
          flag = true;
        } else if (res.data.code == 4) {
          this.fileState = 0;
        } else {
          console.log(res.data.msg);
        }
        this.fileView({
          fileName: file.fileName,
          id: file.id,
          flag: flag,
        });
      });
    },
    // 数据专区预览
    handPreview(row) {
      let ss = {
        dataType: row.dataType,
        dataId: row.entityId,
      };
      console.log(row);
      getDatasDown(ss).then((res) => {
        if (res.data.code == 0) {
          this.$message({
            type: "warning",
            message: res.data.msg,
          });
        } else {
          let param = {
            fileName: res.data.data.fileName,
            fileUrl: res.data.data.downUrl,
          };
          this.fileView(param, row.collectName);
        }
      });
    },
    fileView(val, collectName, flag) {
      // 后端只可转化这些doc|docx|xls|xlsx|csv|ppt|pptx|pdf|txt|wps|et|ett|csv
      let value = val.fileName.toLocaleLowerCase();
      let fileName = value.replace(/<[^>]+>/g, "");
      let fileType = /\.(doc|docx|xls|xlsx|csv|ppt|pptx|pdf|txt|tif|tiff|db|zip|rar|psd|wps|et|ett|jpg|png)(\?.*)?$/.test(
        fileName
      );
      if (!fileType) {
        let fileExtension = fileName.substring(fileName.lastIndexOf(".") + 1);
        return this.$message.warning(
          `以.${fileExtension}结尾的文件类型不支持预览`
        );
      }
      this.fileName = fileName;
      let loadingInstance = Loading.service({
        text: "正在努力加载中...",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      console.log(val.flag);
      if (val.flag) {
        this.$message({
          showClose: true,
          message: `需要下载申请文件，只可预览文件部分内容！`,
          type: "warning",
          duration: "6000",
        });
      }
      if (this.searchKeyRegion == 1) {
        searchFilePreview({ resourceFileId: val.id }).then((resrc) => {
          if (resrc.data.code == 1) {
            this.dataFlow = resrc.data.data;
            this.isShow = true;
          } else {
            this.$message.warning(resrc.data.msg);
          }
          this.$nextTick(() => {
            // 以服务的方式调用的 Loading 需要异步关闭
            loadingInstance.close();
          });
        });
      } else if (this.searchKeyRegion == 2) {
        this.fileName = collectName;
        getPreviewBase64({ fileUrl: val.fileUrl }).then((resrc) => {
          if (resrc.data.code == 1) {
            this.dataFlow = resrc.data.data;
            this.isShow = true;
          } else {
            this.$message.warning(resrc.data.msg);
          }
          this.$nextTick(() => {
            // 以服务的方式调用的 Loading 需要异步关闭
            loadingInstance.close();
          });
        });
      }
    },
    // 递归加父Id
    AddParentId(arr, parentId, rootId, items, menuidArr) {
      for (let i = 0; i < arr.length; i++) {
        if (parentId !== "") {
          arr[i].parentId = parentId;
        } else if (arr[i].menuPid == 0) {
          arr[i].parentId = "";
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
    // 转换搜索数据格式函数
    changeData(data) {
      data.forEach((item, index) => {
        if (item.fileDesc) {
          item.fileDigest = item.fileDesc.map((el, i) => {
            let tempArr = el.split("@ZY@");
            let str = tempArr[2].slice(0, 160);
            let char = str.slice(158, 160);
            if (char.indexOf("<") > -1) {
              str = str.slice(0, 158);
            }
            let fileObj = {
              id: tempArr[0],
              fileName: tempArr[1],
              content: str,
              tags: tempArr[3].split("@BQ@"),
            };
            return fileObj;
          });
          item.fileNum = item.fileNum || item.fileDesc.length;
          // console.log(item.fileNum)
        }
      });
    },
    tagClose() {
      this.tagListShow = false;
      this.labelIds = "";
      this.searchList.labelIds = "";
      this.searchList.dataLabelIds = "";
      this.search(1);
    },
    _clear() {
      this.defaultExp = [15, 16];
      this.searchList = {
        searchName: "",
        pageNumber: 1,
        limit: 10,
        menuIds: "",
        parentId: "",
        labelIds: "",
        groupIds: "",
        dataThree: "",
        searchType: "",
        // 数据专区参数
        dataType: "",
        dataLabelIds: "",
      };
    },
  },
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.el-icon-more {
  color: #127714;
}
i:hover {
  color: #009a52;
}
.current {
  color: #009a52;
}
.main {
  margin-top: -62px;
  min-height: 700px;
  height: 100%;
  display: flex;
}
.sysname span {
  margin-top: 6px;
}
.box {
  margin-bottom: 50px;
  width: 22%;
  margin-left: 5%;
  background: white;
  /*padding-bottom: 300px;*/
  /*float: left;*/
  border: 1px solid #c4c9d0;
  border-top: 3px solid #009a52;
}
// 搜索历史
.searchhistory_top {
  color: #009a52;
  font-size: 15px;
  border-left: 1px solid #c4c9d0;
  border-right: 1px solid #c4c9d0;
  padding: 10px 20px;
  background: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.searchmokuai-box {
  border: 1px solid #c4c9d0;
  background-color: #fff;
  margin-top: 0px;
  ul,
  li {
    margin: 0;
    padding: 0;
    list-style: none;
  }
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
.city2 {
  width: 930px;
  margin: 0 auto;
  margin-top: 30px;
  padding: 10px 0;
  .city3 {
    height: 26px;
    padding-left: 10px;
    padding-right: 10px;
    font-size: 18px;
    float: left;
    color: white;
    margin-right: 5px;
    margin-bottom: 5px;
    background-color: rgba(0, 0, 0, 0);
    border: 0;
    outline: rgba(0, 0, 0, 0);
  }

  .active {
    padding-left: 10px;
    padding-right: 10px;
    font-size: 18px;
    float: left;
    background: #009a52;
    color: white;
    margin-right: 5px;
    z-index: 999;
  }
}

.cursors {
  cursor: pointer;
}
.city4 {
  margin-left: 5%;

  .city5 {
    color: black;
    line-height: 25px;
    height: 25px;
    margin-top: 18px;
    border: 1px solid #e2e2e2;
    float: left;
    padding-left: 10px;
    padding-right: 10px;
  }

  .active {
    color: white;
    line-height: 25px;
    height: 25px;
    margin-top: 18px;
    border: 1px solid #e2e2e2;
    float: left;
    padding-left: 10px;
    padding-right: 10px;
    background: #009a52;
  }
}

.tit {
  padding-left: 5px;
  padding-right: 5px;
  font-size: 18px;
  float: left;
  color: white;
  margin-left: 5px;
}

.list {
  height: 35px;
  line-height: 35px;
  margin-left: 30px;
}

.cell {
  text-align: center;
  color: black;
  font-family: 微软雅黑;
}
.list a {
  color: black;
  font-size: 18px;
}
.block {
  position: relative;
  margin-top: 20px;
}
.moredown-btn {
  vertical-align: middle;
}

li {
  list-style-type: disc;
  margin-left: 45px;
  margin-top: 20px;
  margin-right: 30px;
  a {
    color: black;
  }
}

input[name="color"]::-webkit-input-placeholder {
  color: black;
  font-size: 15px;
}

//firefox火狐浏览器
input[name="color"]:-moz-placeholder {
  color: black;

  font-size: 15px;
}
  input[name="color"]::-moz-placeholder {
  color: black;

  font-size: 15px;
}

//IE浏览器
input[name="color"]:-ms-input-placeholder {
  color: black;
  font-size: 15px;
}

input[name="pay"]::-webkit-input-placeholder {
  color: black;

  font-size: 14px;
}

//firefox火狐浏览器
input[name="pay"]:-moz-placeholder {
  color: black;
  font-size: 14px;
}
  input[name="pay"]::-moz-placeholder {
  color: black;
  font-size: 14px;
}

//IE浏览器
input[name="pay"]:-ms-input-placeholder {
  color: black;
  font-size: 14px;
}

input[name="color"] {
  height: 25px;
  width: 150px;
}

/*.tip3 .el-input el-input--suffix{*/
/*height:25px;*/
/*line-heigh:normal;*/
/*border:1px solid #E2E2E2;*/
/*float:left;*/
/*font-size:15px*/
/*}*/

.el-pager li.active {
  color: #009a52;
  cursor: default;
}

.el-pager li:hover {
  color: #009a52;
}

.el-input__inner {
  height: 40px;
  border-radius: 0;
  border: none;
  font-size: 18px;
}
.xiala .el-input__suffix-inner i {
  margin-top: 8px;
}
.xiala .el-input__inner {
  height: 25px !important;
  border-radius: 0;
  border: 1px solid #e2e2e2 !important;
  color: black !important;
  text-align: center;
  line-height: 30px;
  font-size: 14px !important;
}

.el-select-dropdown__item.selected {
  color: #009a52;
  font-weight: 700;
}

.el-checkbox__label {
  font-size: 18px;
}
// 标签分组
.navbox {
  padding: 20px 20px 10px 20px;
  span {
    display: inline-block;
    padding: 6px 10px;
    cursor: pointer;
  }
  .el-breadcrumb {
    padding: 6px 10px 10px 10px;
    span {
      color: #333;
      padding: 0;
    }
  }
  .group-nav {
    border: 1px solid #c4c9d0;
    padding: 6px 10px;
    display: flex;
    strong {
      padding: 6px 0;
    }
    &:first-child {
      flex: 2;
    }
    .groupbox {
      flex: 20;
      .active {
        color: #009a52;
        background-color: #fff;
      }
    }
    &:last-child {
      flex: 2;
    }
  }
  .moreStyle {
    display: flex;
    align-items: flex-end;
    cursor: pointer;
    u {
      text-decoration: none;
    }
    .more:hover {
      color: #009a52;
      text-decoration: underline;
    }
    .close:hover {
      color: red;
      text-decoration: underline;
    }
  }
  .tagsbox {
    margin-top: -1px;
    border: 1px solid #c4c9d0;
    padding: 6px 10px;
    display: flex;
    strong {
      padding: 6px 0;
    }
    &:first-child {
      flex: 2;
    }
    .tags {
      flex: 20;
      .tag-active:hover {
        color: #009a52;
      }
    }
    &:last-child {
      flex: 2;
    }
    .tagClose {
      font-size: 16px;
      display: inline-block;
      line-height: 1;
      .el-icon-close:hover {
        color: red;
      }
    }
  }
  .taghide {
    overflow: hidden;
    margin-top: -1px;
    text-align: center;
    border: 1px solid #c4c9d0;
    padding: 6px 10px;
    .tagCloseEmpty {
      font-size: 16px;
      display: inline-block;
      margin-top: -6px;
      float: right;
      .el-icon-close:hover {
        color: red;
      }
    }
  }
}

.top {
  background-image: url("/static/index/s1.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  -moz-background-size: 100% 100%;
  width: 100%;
  padding-top: 10px;
  padding-bottom: 124px;
}

.bot {
  color: white;
  border-right: 1px solid white;
  float: left;
  width: 12%;
  text-align: center;
}

// li a:hover {
//   color: #009a52;
// }

.tit3 {
  color: #009a52;
  font-size: 18px;
  line-height: 40px;
}
.searchbox {
  margin: 0 auto;
  margin-top: 50px;
}
.search {
  border-radius: 0;
  border: none;
  width: 800px;
}
.button2 {
  float: left;
  border: none;
  height: 20px;
  min-width: 50px;
  margin-left: 5px;
  padding-left: 10px;
  padding-right: 10px;
  line-height: 0px;
  border-radius: 0;
}
.button2 :focus {
  background: #009a52 !important;
  color: #fff;
}

.tip2 {
  height: 25px;
  line-height: 25px;
  padding-top: -20px;
  border: 1px solid #e2e2e2;
  float: left;
  padding-left: 10px;
  padding-right: 10px;
}

.lv {
  background: #009a52;
  color: white;
  width: 126px;
}

.lv:hover {
  color: white;
  background: #127714;
}

// 标签搜索导航
.blue {
  color: #009a52;
  span {
    padding: 0;
    margin: 0;
    font-size: 10px;
    vertical-align: middle;
    color: red;
  }
}
.tableSection {
  border-top: 3px solid #009a52;
  width: 66.5%;
  margin-left: 1%;
  background: white;
  float: left;
  border-left: 1px solid #c4c9d0;
  border-bottom: 1px solid #c4c9d0;
  border-right: 1px solid #c4c9d0;
  margin-bottom: 50px;
}
.tableSection .el-tabs__active-bar {
  background-color: #409eff;
}
.tableSection /deep/ em {
  font-style: normal;
  color: red;
}
.search-list_box /deep/ .el-checkbox__input {
  margin-bottom: 2px;
}
.atag {
  color: #333;
  &:hover {
    color: #009a52;
  }
}
.tr-title {
  font-weight: 700;
  text-align: left;
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
  .handle-btn {
    flex: 0 0 70px;
    margin-left: 26px;
    i {
      display: inline-block;
      width: 24px;
      height: 24px;
      text-align: center;
      vertical-align: middle;
      line-height: 20px;
    }
    .icon-details {
      font-size: 23px;
      margin-right: 4px;
      padding-top: 2px;
    }
    .el-icon-download {
      font-size: 18px;
      font-weight: 700;
    }
  }
}
.tr-props {
  text-align: left;
  width: 550px;
  font-size: 12px;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  p {
    width: 50%;
    flex: 12;
  }
  .menu-dash {
    &:hover {
      color: #009a52;
    }
  }
}
.file-digest {
  text-align: left;
  margin-top: 10px;
  font-size: 12px;
  .file-digest_box {
    margin-top: 6px;
    p {
      margin-top: 4px;
    }
  }
  a {
    font-size: 14px;
    color: #090cf5;
    text-decoration: underline;
  }
  .c {
    line-height: 18px;
    font-family: "微软雅黑";
    color: #888;
  }
}
.tab-btn1,
.tab-btn2 {
  width: 26px;
  height: 26px;
  line-height: 24px;
  text-align: center;
  display: inline-block;
  vertical-align: middle;
  border: 1px solid #ccc;
  box-shadow: none;
}
.tab-btn1.active,
.tab-btn2.active {
  color: #009a52;
  border-color: #009a52;
  // background-image: linear-gradient(to top, rgb(238, 238, 238) 10%, rgb(253, 253, 253) 60%,rgb(238, 238, 238) 90%);
}
.tab-btn1 {
  margin-left: 8px;
  &:hover {
    color: #009a52;
  }
}
.tab-btn2 {
  margin-left: 2px;
  &:hover {
    color: #009a52;
  }
}
.progress-box {
  width: 400px;
  height: 70px;
  background-color: #fff;
  position: fixed;
  z-index: 9999;
  bottom: 20px;
  right: 20px;
  border-radius: 6px;
  box-shadow: 2px 2px 3px rgba(0, 0, 0, 0.143);
  padding: 10px;
  P {
    margin-bottom: 8px;
  }
}
.el-table__row td:not(.is-hidden):last-child {
  right: 0px;
}
</style>
