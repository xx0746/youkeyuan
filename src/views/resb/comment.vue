<template>
  <div class="comment">
    <div class="top">
      <div class="sys_nav" style="border:none;background:transparent">
        <a href="#/resbsearch" class="sysname">
          <img src="/static/index/logo.png" style="width:250px;margin-top:10px;margin-left:30px" />
          <span>•&nbsp;科研资源数据平台</span>
        </a>
        <div
          class="topbar-account topbar-btn"
          style="margin-right:40px;position:relative;float:right;cursor: pointer;"
        >
          <login-out :Updatenews="newsdata" :showlogins="showlogindaiban"></login-out>
        </div>
      </div>

      <!--<div class="searchbox">-->
      <!--<el-input class="search" v-model="searchName" placeholder="请输入内容">-->
      <!--<el-select v-model="searchKeyRegion" slot="prepend" placeholder="请选择专区">-->
      <!--<el-option label="知识专区" value="1"></el-option>-->
      <!--<el-option label="数据专区" value="2"></el-option>-->
      <!--</el-select>-->
      <!--</el-input>-->
      <!--<el-button class="button lv" type="primary" @click="search">搜索</el-button>-->
      <!--</div>-->
    </div>
    <div class="content">
      <div class="recommend">
        <h2>最新消息</h2>
        <div class="recommend-list">
          <ul>
            <li v-for="(item) in theLatesNews" :key="item.ROWNUM_">
              <a v-show="item.NOTICE_INFO.indexOf('文件下载申请已通过审核') == -1">{{item.NOTICE_INFO}}</a>
              <a
                v-show="item.NOTICE_INFO.indexOf('文件下载申请已通过审核') != -1"
                @click="noticeToResource(item.FILE_ID)"
                style="cursor: pointer;"
              >{{item.NOTICE_INFO}}</a>
            </li>
          </ul>
        </div>
      </div>
      <div class="article">
        <el-button size="mini" type="primary" onclick="javascript :history.go(-1);">返回上一层</el-button>
        <h2 v-html="artic.name">{{artic.name}}</h2>
        <div class="article-load">
          <!-- <span class="green">
            <i class="el-icon-download green1"></i>
            <span @click="downArtic">下载</span>
          </span>-->
          <span>{{artic.menuName}}</span>
          <span v-show="artic.createUser != null">{{artic.createUser}}</span>
          <span>{{artic.createTime}}</span>
          <span class="green" @click="trigeCollect">
            <i class="el-icon-star-off green1"></i>&nbsp;
            <span v-show="Collectionicon == 0">{{Collectionpage}}</span>
            <span v-show="Collectionicon == 1">{{Collectionpages}}</span>
          </span>
        </div>
        <div style="margin-top: 30px;" v-if="tags.length != 0">
          <div class="tagbox">
            <el-tag v-for="tag in tags" :key="tag.index" size="small" :type="tag.type">{{tag.name}}</el-tag>
          </div>
        </div>
        <div class="show-audit">
          <span>下载是否审核：</span>
          <span>{{pageInfo.dataOne | showAudit}}</span>
        </div>
        <div class="actionbar" v-if="rowdata.length != 0">
          <div
            class="attribute"
            v-for="(item, index) in rowdata"
            :key="index"
            v-show="item.value != null"
          >
            <span>{{item.columnName}}</span>
            <span>{{item.value}}</span>
          </div>
        </div>
        <!-- 文章内容 -->
        <div class="article-content">
          <z-tree
            :fileTreeData="TableData"
            :countNum="count"
            v-if="showTree"
            :isShowDetails="true"
            @treeClick="clickTreeNode"
            @treeCheck="checkTreeNode"
            @treeDiy="clickTreeDetail"
          ></z-tree>
          <div style="text-align: right">
            <el-button type="primary" size="mini" @click="downArtic">下载</el-button>
          </div>
        </div>
        <!-- 我要评论 -->
        <div class="publish-review">
          <h4 style="font-size:16px;color:rgba(0,153,85,1);">我要评论</h4>
          <div class="review-cont">
            <!-- <span class="icon-user"></span> -->
            <div class="review-form">
              <el-form
                :model="reviewForm"
                ref="reviewForm"
                label-width="100px"
                class="demo-reviewForm"
                :rules="reviewFormrul"
              >
                <el-form-item prop="descs" class="rev-textarea">
                  <el-input type="textarea" v-model="reviewForm.desc" minlength="5"></el-input>
                </el-form-item>
                <el-form-item class="revbtm">
                  <div class="formbotm">
                    <div class="formplugs"></div>
                    <div class="publishbtn">
                      <el-button
                        class="btnback"
                        size="mini"
                        type="primary"
                        @click="submitForm('reviewForm')"
                      >发表</el-button>
                    </div>
                  </div>
                </el-form-item>
              </el-form>
            </div>
          </div>
        </div>
        <!-- 评论信息 -->
        <div class="reviewinfo">
          <p class="review-title">评论({{total}})</p>
          <div class="review" v-for="item in articinfo" :key="item.ID">
            <div class="review-name">
              <p class="blue">{{item.COMMENTUSER}}</p>
            </div>
            <div>{{item.COMMENTCONTENT}}</div>
          </div>
          <!-- <el-row class="morebtn">
            <el-button type="primary" class="button">查看更多</el-button>
          </el-row>-->
        </div>
      </div>
    </div>
    <!-- 文件预览 -->
    <el-dialog class="dialogTitle el-preview" title="文件预览" :visible.sync="showPdf">
      <div class="pdf-cont" style="width: 860px;" v-if="showPdfSrc">
        <pdf-preview :title="fileName" :dataFlow="src" :loadPage="fileState" class="preview_style"></pdf-preview>
      </div>
      <!-- <div style="width: 860px;">
        <iframe id="my_img" :src="txtUrl" v-if="showIfram" width="100%" frameborder="0" scrolling="yes">
          <head>
            <meta http-equiv="Content-Type" content="text/html; charset=gbk" />
          </head>
        </iframe>
      </div>-->
    </el-dialog>
    <!-- 文件详情预览 -->
    <el-dialog
      class="fileDetail-dia"
      :title="fileDetail.menuName"
      :visible.sync="detailDialog"
      width="860px"
    >
      <div style="width: 100%" v-cloak>
        <div v-show="fileTags.length == 0 && !fileInfo.isTemp" style="color: #666">该文件暂未维护属性及标签</div>
        <div v-show="fileTags.length != 0 || fileInfo.isTemp">
          <div class="tagbox" style="margin-bottom: 6px;" v-show="fileTags.length != 0">
            <el-tag
              v-for="tag in fileTags"
              :key="tag.index"
              size="small"
              :type="tag.type"
            >{{tag.name}}</el-tag>
          </div>
          <div class="actionbar" style="margin-top: 0" v-show="fileInfo.isTemp">
            <div
              class="attribute"
              v-for="(item, index) in fileInfo.columns"
              :key="index"
              v-show="item.value != null"
            >
              <span>{{item.columnName}}</span>
              <span>{{item.value}}</span>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
    <footer-view></footer-view>
  </div>
</template>

<script>
import footerView from "@/views/home/footerView";
import loginOut from "@/components/loginOut";
import zTree from "@/components/zTree/zTree";
import pdfPreview from "@/components/pdfPreview/PdfPreview";
import { Loading } from "element-ui";
import {
  getArticleInfo,
  submitArticleInfo,
  searchInterface,
  Isfavorites,
  addfavorites,
  fileAddInterface,
  getNewsInfoList,
  DELETEfavorites,
} from "@/api/search";
import {
  getNoticeAudit,
} from "@/api/login";
import {
  getSubscribeInfo,
  addSubscribeInfo,
  delSubscribeInfo,
} from "@/api/ressubscribe";
import {
  getCommentPreviewList,
  getCommentPreview,
  getCommentFileMenu,
  getPreviewBase64,
} from "@/api/comment";
import {
  fileMoreDownLoad,
  getRcodeInfo,
  getFileInfo,
  getLabels,
} from "@/api/resource_list";
import { finRepetionCode } from "@/utils/arr-compute";
import { downloadFile, handleBatchDownload } from "@/utils/utile";
import * as elValidate from "@/utils/elValidate";
export default {
  components: { loginOut, zTree, pdfPreview, footerView },
  data() {
    return {
      pageInfo: {},
      showlogindaiban: {
        state: false,
      },
      newsdata: true,
      rowdata: [],
      artice: {
        menuId: "",
        resourceId: "",
      },
      // 默认标签展示
      tags: [],
      Collection: {},
      Collectionicon: 0,
      Collectionpages: "",
      Collectionpage: "",
      // 最新消息数据
      theLatesNews: {},
      pageId: null,
      searchList: {
        searchName: "",
        pageNumber: 1,
        limit: 10,
        menuIds: "",
        labelIds: "",
      },
      searchName: "",
      searchKeyRegion: "1",
      reviewForm: {
        desc: "",
      },
      reviewFormrul: {
        desc: [
          // {validator:elValidate.elNumberSize,trigger: ['blur', 'change']},
        ],
      },
      artic: {
        flag: 2,
        menuId: "",
        fileId: "",
        menuName: "暂无数据",
        createTime: "暂无数据",
        idx: 0,
        id: null,
        fileState: 1,
        type: 1,
        createUser: this.$route.query.createUser,
      },
      // 获取最新消息栏信息参数
      theLatestWord: {
        userId: 1,
        pageSize: 10,
        pageNumber: 1,
      },
      // 默认订阅状态
      state: null,
      // 获评论信息
      articinfo: [],
      total: 0,
      count: 0,
      TableData: [],
      // pdf文件变量
      // src: "/static/index/pdf实验.pdf",
      src: "",
      txtUrl: "",
      fileName: "",
      fileState: 0,
      showPdf: false,
      showPdfSrc: false,
      showIfram: false,
      showTree: false,
      downList: {},
      resourceIds: "",
      urlArr: [],
      // 文件详情
      detailDialog: false,
      fileDetail: {},
      fileInfo: {},
      fileTags: [],
      columnsLength: "",
    };
  },
  created() {
    // this.getIsfavorites();
    // console.log(this.$route.query.NAME,'DCDCDS');
  },
  watch: {
    src(val) {
      if (val) {
        this.showPdfSrc = false;
        this.$nextTick((_) => {
          this.showPdfSrc = true;
        });
      }
    },
  },
  filters: {
    patentType(value) {
      var arr = ["专利", "软件著作权"];
      return arr[value - 1];
    },
    showAudit(value) {
      var arr = ["是", "否"];
      return arr[value - 1];
    },
  },
  computed: {
    getReviewInfo() {
      return this.$store.state.review;
    },
  },
  mounted() {
    this.getPageInfo();
    this.getIsfavorites();
    this.getNewsInfo();
    // this.getSubscribe();
    this.getShowFiles();
    this.showpage();
    this.showTree = true;
  },
  destroyed() {
    this.showTree = false;
  },
  methods: {
    noticeToResource(fileId) {
      getNoticeAudit(fileId).then((res) => {
        if (res.data.code == 1) {
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
          this.$store.commit("setReview", rowInfo);
          
    this.getPageInfo();
    this.getShowFiles();
    this.showpage();
        } else {
          thie.$message.warning("发生错误，请操作其它！");
        }
      });
    },
    // 显示详情
    showpage() {
      this.artice.menuId = this.getReviewInfo.menuId;
      this.artice.resourceId = this.getReviewInfo.resourceId;
      let param = {
        resourceId: this.getReviewInfo.resourceId,
        type: 2,
      };
      getRcodeInfo(param).then((res) => {
        if (res.data.code == 1) {
          this.pageInfo = res.data.data;
          console.log(this.pageInfo);
          this.rowdata = res.data.data.columns;
          // 获取标签内容
          if (this.pageInfo.dataTwo !== "") {
            getLabels(this.pageInfo.dataTwo).then((data) => {
              if (data.data.code == 1 && data.data.data != null) {
                this.tags = data.data.data.map((item) => {
                  return {
                    name: item.TYPENAME,
                    type: "success",
                    id: item.LABELID,
                  };
                });
              }
            });
          }
        }
      });
    },
    // 获取最新消息
    async getNewsInfo() {
      const res = await getNewsInfoList(this.theLatestWord);
      let {
        data: {
          data: { rows },
          code,
        },
      } = res;
      if (code == 1) {
        this.theLatesNews = rows;
      }
    },
    trigeCollect() {
      if (this.Collectionicon == 0) {
        this.addfavoritespage();
      } else {
        this.DELETEfavoritespage();
      }
    },
    //取消收藏
    DELETEfavoritespage() {
      var that = this;
      this.Collection.menuId = this.getReviewInfo.menuId;
      this.Collection.fileId = this.getReviewInfo.id;
      // this.artic.title =  this.artic.NAME.split(".")[0];
      console.log(this.Collection, "scdsc");
      DELETEfavorites(this.Collection).then((res) => {
        if (res.data.code == 1) {
          this.$message.success("取消收藏！");
          that.getIsfavorites();
        }
      });
    },
    //添加收藏
    addfavoritespage() {
      var that = this;
      console.log(this.$route.query);
      this.Collection.menuId = this.getReviewInfo.menuId;
      this.Collection.fileId = this.getReviewInfo.id;
      this.Collection.title = this.getReviewInfo.name;
      this.Collection.dataOne = this.getReviewInfo.menuName;
      console.log(this.Collection);
      addfavorites(this.Collection).then((res) => {
        if (res.data.code == 1) {
          this.$message.success('收藏成功，可在首页"我的收藏"查看！');
          that.getIsfavorites();
        }
      });
    },
    //获取收藏状态
    getIsfavorites() {
      var that = this;
      let param = {
        menuId: this.artic.menuId,
        fileId: this.getReviewInfo.id,
      };
      Isfavorites(param).then((res) => {
        if (res.data.code == 1) {
          that.Collectionpages = "取消收藏";
          that.Collectionicon = 1;
        } else if (res.data.code == -1) {
          that.Collectionpage = "收藏";
          that.Collectionicon = 0;
        }
      });
    },
    // 获取文章详情页面信息
    getPageInfo() {
      this.artic = { ...this.artic, ...this.getReviewInfo };
      console.log(this.artic);
      // 获取评论信息
      getArticleInfo(this.artic).then((res) => {
        if (res.data.code == 1) {
          this.articinfo = res.data.data;
          console.log(this.articinfo);
          this.total = this.articinfo.length;
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    search() {
      console.log(this.searchKeyRegion);
      if (this.searchKeyRegion == 1) {
        //知识专区
        this.searchList.searchName = this.searchName;
        this.$store.dispatch("setSearchList", this.searchList);
        console.log(this.searchList);
        this.$router.push({
          path: "/resbindex",
          query: {
            menuId: this.searchList.menuIds,
            parentId: this.searchList.menuIds,
            icon: 1,
            type: this.searchKeyRegion,
            searchType: 1,
          },
        });
      } else if (this.searchKeyRegion == 2) {
        //数据专区
        // 当前默认为物流数据库
        this.searchList.menuIds = "14";
        this.searchList.searchName = this.searchName;
        this.$store.dispatch("setSearchList", this.searchList);
        this.$router.push({
          path: "/resbindex",
          query: {
            menuId: this.searchList.menuIds,
            parentId: this.searchList.menuIds,
            icon: 1,
            type: this.searchKeyRegion,
            searchType: 2,
          },
        });
      }
    },
    submitForm(formName) {
      let _that = this;
      this.$refs[formName].validate((valid) => {
        if (this.reviewForm.desc.length < 5) {
          return _that.$message({
            message: "评论内容不能少于5个字！",
            type: "warning",
          });
        }
        let data = {
          menuId: this.artic.menuId,
          resourceId: this.artic.id,
          commentContent: this.reviewForm.desc,
        };
        if (valid) {
          submitArticleInfo(data).then((res) => {
            if (res.data.code == 1) {
              _that.$message({
                message: "评论成功,请等待审核",
                type: "success",
              });
              this.reviewForm.desc = "";
              this.getPageInfo();
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    downArtic() {
      // 下载
      console.log(this.urlArr);
      if (this.resourceIds != "") {
        // 实验测试打包下载，超过n个文件时走打包下载。暂时放弃此操作
        let data = {
          fileIds: `${this.artic.menuId}-${this.artic.id}`,
          page: 1,
          type: 3,
          resourceIds: this.resourceIds,
        };
        fileMoreDownLoad(data).then((res) => {
          console.log(res);
          if (res.data.code == 0) {
            this.$confirm(`${res.data.msg}是否提交下载申请？`, "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning",
            })
              .then(() => {
                let s = res.data.data;
                let a = s.split("-");
                this.downList.fileId = a[1];
                this.downList.menuId = a[0];
                this.downList.flag = 1;
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
              let newUrlArr = finRepetionCode(urlArr);
              this.urlArr = newUrlArr.map((item) => {
                let url = item.split("?");
                let obj = {
                  fileUrl: url[0],
                  name: item.split("=")[1],
                };
                return obj;
              });
              handleBatchDownload(this.urlArr, this.artic.name, function () {});
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
                let s = res.data.data;
                let a = s.split("-");
                this.downList.fileId = a[1];
                this.downList.menuId = a[0];
                this.downList.flag = 1;
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
          }
        });
      } else {
        this.$message.warning("请先勾选要下载的文件！");
      }
    },
    //将要进行多文件下载的mp3文件地址，以组数的形式存起来（这里只例了3个地址）
    download(name, href) {
      var a = document.createElement("a"), //创建a标签
        e = document.createEvent("MouseEvents"); //创建鼠标事件对象
      e.initEvent("click", false, false); //初始化事件对象
      a.href = href; //设置下载地址
      a.download = name; //设置下载文件名
      a.dispatchEvent(e); //给指定的元素，执行事件click事件
    },
    // 展示文件列表
    getShowFiles() {
      this.artic.FLAG = 2;
      this.artic.fileState = 1;
      this.artic.fileId = this.getReviewInfo.id;
      this.artic.type = 1;
      // 目录树获取
      getCommentFileMenu(this.artic).then((res) => {
        if (res.data.code == 1) {
          this.TableData = res.data.data.fileLists;
          this.count = res.data.data.count;
        }
      });
    },
    // 点击文件列表目录树节点
    clickTreeNode(val, obj, e, type) {
      console.log(val);
      if (val.menuId != 15) {
        let file = {
          fileName: val.menuName,
          fileUrl: val.fileUrl,
          menuId: val.menuId,
        };
        this.review(file);
      }
    },
    // 选择文件目录树节点
    checkTreeNode(val, urlArr) {
      this.resourceIds = val.join(",");
      this.urlArr = urlArr;
    },
    clickTreeDetail(id, node) {
      this.detailDialog = true;
      this.fileDetail = node;
      let param = {
        fileId: id,
        menuId: this.artic.menuId,
      };
      getFileInfo(param).then((res) => {
        // this.fileInfo.columns = [];
        // this.fileTags = [];
        if (res.data.code == 1) {
          this.fileInfo = res.data.data;
          this.columnsLength = this.fileInfo.columns.length;
          this.fileInfo.isTemp = this.fileInfo.columns.some((item, index) => {
            return item.value != null;
          });
          console.log(this.fileInfo.isTemp);
          // 获取标签内容
          if (this.fileInfo.labelIds !== "" && this.fileInfo.labelIds != null) {
            getLabels(this.fileInfo.labelIds).then((data) => {
              if (data.data.code == 1) {
                this.fileTags = data.data.data.map((item) => {
                  return {
                    name: item.TYPENAME,
                    type: "success",
                    id: item.LABELID,
                  };
                });
              }
            });
          } else {
            this.fileTags = [];
          }
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    review(val) {
      let value = val.fileName.toLocaleLowerCase();
      let fileName = value.replace(/<[^>]+>/g, "");
      let fileText = /\.(doc|docx|xls|xlsx|csv|ppt|pptx|pdf|txt|tif|tiff|db|zip|rar|psd|wps|et|ett|jpg|png)(\?.*)?$/.test(
        fileName
      );
      let fileExtension = fileName.substring(fileName.lastIndexOf(".") + 1);
      if (!fileText)
        return this.$message.warning(
          `以.${fileExtension}结尾的文件类型不支持预览`
        );
      this.fileName = fileName;
      this.resourceIds = val.menuId;
      let data = {
        fileIds: `${this.artic.menuId}-${this.artic.id}`,
        page: 1,
        type: 3,
        resourceIds: val.menuId,
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
        this.showPreview(val, flag);
      });
      this.resourceIds = "";
    },
    // 预览
    showPreview(val, flag) {
      console.log(val);
      let loadingInstance = Loading.service({
        text: "正在努力加载中...",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      if (flag) {
        this.$message({
          showClose: true,
          message: `需要下载申请文件，只可预览文件部分内容！`,
          type: "warning",
          duration: "6000",
        });
      }
      getPreviewBase64(val).then((resrc) => {
        if (resrc.data.code == 1) {
          this.src = resrc.data.data;
          this.showPdf = true;
        } else {
          this.$message.warning(resrc.data.msg);
        }
        this.$nextTick(() => {
          // 以服务的方式调用的 Loading 需要异步关闭
          loadingInstance.close();
        });
      });
    },
    // review(val) {
    // console.log(val);
    // this.fileName = val.menuName;
    // let data = {
    //   fileIds: `${this.artic.menuId}-${this.artic.id}`,
    //   page: 1,
    //   type: 2,
    // };
    // let loadingInstance = Loading.service({
    //   text: '正在努力加载中...',
    //   spinner: 'el-icon-loading',
    //   background: 'rgba(0, 0, 0, 0.7)'
    // });
    // fileMoreDownLoad(data).then(res => {
    //   if(res.data.code == 0 || res.data.code == 1 || res.data.code == 2 || res.data.code == 3) {
    //     this.fileState = 1;
    //     this.$message.info(`${res.data.msg}只可预览文件部分内容！`);
    //   } else if(res.data.code == 4) {
    //     this.fileState = 0;
    //   } else {
    //     this.$message.warning(res.data.msg);
    //   }
    //   console.log(this.fileState);
    //   let param = {
    //     menuId: this.artic.menuId,
    //     fileId: this.artic.fileId,
    //     fileState: 1,
    //     id: val.menuId
    //   }
    //   getCommentPreview(param).then(resc => {
    //     if(resc.data.code == 1) {
    //       let fileExtension =  resc.data.data.substring( resc.data.data.lastIndexOf('.') + 1);
    //       if (fileExtension !== "pdf" && fileExtension !== "PDF") {
    //         this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
    //           loadingInstance.close();
    //         });
    //         this.$message.warning(`以.${fileExtension}结尾的文件类型不支持预览`);
    //       } else {
    //         let file = {
    //           fileUrl: resc.data.data
    //         }
    //         getPreviewBase64(file).then(resrc => {
    //           console.log(resrc);
    //           if(resrc.data.code == 1) {
    //             this.src = resrc.data.data;
    //             this.showPdf = true;
    //           } else {
    //             this.$message.warning(resrc.data.msg);
    //           }
    //           this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
    //             loadingInstance.close();
    //           });
    //         })
    //       }
    //     } else {
    //       this.$message.warning(resc.data.msg);
    //       this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
    //         loadingInstance.close();
    //       });
    //     }
    //   })
    // })
    // }
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.comment {
  // height: 100%;
  background-color: #f2f2f2;
}
/*操作详情*/
.actionbar {
  margin-top: 6px;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  align-items: center;
  .attribute {
    border-bottom: 1px dashed #a3a3a3;
    text-align: left;
    padding: 6px 0;
    width: 100%;
    span {
      font-size: 14px;
      vertical-align: top;
      display: inline-block;
    }
    span:nth-child(odd) {
      width: 140px;
      color: #a3a3a3;
      margin-right: 20px;
    }
    span:nth-child(even) {
      width: 30%;
    }
  }
}
/*预览*/
.preview {
  padding-bottom: 22px;
  box-sizing: border-box;
  ul {
    display: flex;
    li {
      text-align: center;
      width: 100px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      padding: 3px 13px;
      box-sizing: border-box;
      height: 30px;
      background: rgba(49, 168, 4, 0.1);
      font-size: 16px;
      font-family: MicrosoftYaHei;
      font-weight: 400;
      color: #333;
      margin-right: 20px;
      margin-bottom: 10px;
    }
  }
}
.preview > ul > li:hover {
  color: rgba(0, 129, 72, 1);
}
.preview_style {
  width: 860px;
  height: 100%;
  margin-top: -10px;
  overflow: hidden;
}
.green {
  width: 80px;
  box-sizing: border-box;
  font-size: 14px;
  display: inline-flex;
  justify-content: flex-end;
  align-items: center;
  flex-wrap: nowrap;
}
.green:hover {
  color: rgba(0, 153, 85, 1);
  .green1 {
    color: rgba(0, 153, 85, 1);
  }
}
.top {
  background-image: url("/static/index/s1.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  -moz-background-size: 100% 100%;
  height: 106px;
  width: 100%;
  padding-top: 20px;
  overflow: hidden;
}

.searchbox {
  margin-top: 3.5%;
  .search {
    margin-left: 15%;
    border-radius: 0;
    border: none;
    width: 60%;
    font-size: 18px;
  }
  .button {
    font-size: 18px;
    border: none;
    height: 40px;
    width: 10%;
    margin-left: -6px;
    border-radius: 0;
    vertical-align: top;
  }

  .lv {
    background: #009a52;
    color: white;
  }

  .lv:hover {
    color: white;
    background: #127714;
  }
}

.content {
  width: 1230px;
  display: flex;
  margin: 20px auto;
  justify-content: space-between;
}

.recommend {
  width: 25%;
  border: 1px solid #e4e5e6;
  border-top: 3px solid #009a52;
  background: white;
  float: left;
  box-sizing: border-box;
  .recommend-list {
    padding: 20px 30px;
    border-top: 1px solid #d4dbe4;
  }
  h2 {
    padding: 20px 0 20px 20px;
    color: #009a52;
    font-size: 18px;
  }
  ul,
  li {
    padding: 0;
    margin: 0;
  }
  li {
    margin: 10px 0 10px 10px;
    list-style: disc;
    a {
      color: #333;
    }
  }
}

// 右侧文章内容样式
.article {
  width: 74%;
  padding: 30px;
  background-color: #fff;
  border-top: 3px solid #009a52;
  /*border: 1px solid #C4C9D0;*/
  h2 {
    text-align: center;
    font-family: "微软雅黑 Light";
    color: #333;
    padding: 20px 0;
    font-weight: 400;
  }
  .author {
    text-align: center;
    margin: 14px 0;
  }

  .article-load {
    padding: 6px 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #c4c9d0;
    i {
      font-weight: 600;
    }
    span {
      cursor: pointer;
      &:nth-child(1) {
        flex: 7;
      }
      &:nth-child(2) {
        flex: 10;
      }
      &:nth-child(3) {
        width: 160px;
        display: block;
      }
    }
    // .el-icon-edit-outline {
    //   margin-left: 10px;
    // }
  }
  .article-content {
    margin: 30px 0px;
    .art-text {
      width: 100%;
      text-align: center;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 3;
      overflow: hidden;
    }
    .active {
      display: inline-block;
    }
    span {
      cursor: pointer;
      &.not {
        cursor: not-allowed;
      }
    }
  }

  .publish-review {
    h4 {
      font-size: 16px;
    }
  }
}
.tagbox {
  margin-top: 10px;
}
.show-audit {
  margin-top: 6px;
}
// 评论内容
.review-cont {
  padding-top: 10px;
  display: flex;
  justify-content: space-around;
  .icon-user {
    flex: 1;
    width: 30px;
    height: 30px;
    background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAxFJREFUeNrkVz2IE0EY3c3PJdHkoiKRU2KMdjZBkPNAsAtXiHpwKGLnXaegrWDjgQjXqiCICgo2whVqayNeIQaFXBTtJBFiIEVC/v/je8tO2CQ7YdeLXOHAMJPd2e/N9733fTNR+/2+shPNoexQc1lZ1Gw2lUQiofh8vqMOh2Ol1+udxeM5VVVbGH+43e7nrVbrJX4rLpdLkUUxFovZA6Yhp9O5CsOPMQe2Y2AcYxigcYw3sOYiHmVse5xMJmWgK16v94kBbPCeXurjPJ5/RjSOYV6yBVyr1czW7IWHT2dmZqxEZj/6C4Av2RIXPTF2GFDA322C2lD/BXh8SETD2KUeh0KhMSuVSuVct9sd+1DWuFmI8DxE9shyqDudjtmaWVv5CeFBbPva7bZ1jkulkpmhFsRlOdQEhlbqANfmloCDweDYAux8E3l8xWqo9Sx4B21MpGcImFyacHYXxiwDo33zeDxbSD/roYaQxhYA8DuEcp8FwgoqNn/ZmN8yioaAyYto2LXGEVWKj2/C0G4YXeU7I+ccdZAG+hKo+Uo7onRKBKuoxh2l0+nBvFgskl/NgKDA7/cvg+/reH4SYAGdzwxGcnoHgL8EKAEZ7mg0aqqhIY8jkchQFaO3XJzP57VnKCQbANloNBp7YDyGDRUCgcAWDxE9MlrnN8wQFh4zwU48JGjIOGd4GQU2eMfJe3pWr9e192I9gRkhUflsH4uCO3ZwfQKdh8Bh9F2Y94WAdA4xVcnxb7z7gvnmX5/H9AbhPgWlr8HbRcMpZHo6icbwgopPTEO8e2v7BgLj1xCyjwjloo0cFkVnHsMbgK8zIqJLVS3Um8lkruZyuWdMqe00nar1QqFwi8DxeNwcOJVKcTiCUP1kDtv11KxRfFD2GfQP4XDYPNTlcpm83iPopAJvp5FzaOTBaDkeso6EP4BUWR4V0LZukxBptVqNZbPZBSkwdnaam5zmNVavbsz9hUlXn7l/cYfWwQ9KgSGq5rRENapupFZbWkDAxyssOI4dXsLi2SmBVmHzNaYPpXn8X/x3+iPAACsjx2wEOsJ7AAAAAElFTkSuQmCC")
      no-repeat;
    -webkit-box-flex: 10;
    &::before {
      border: none;
      display: none;
    }
  }
  .review-form {
    flex: 15;
    -webkit-box-flex: 10;
    width: 600px;
    height: 200px;
    border: 1px solid #c4c9d0;
    border-radius: 4px;
  }
}
// 评论表单
.formbotm {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 4px;
  .formplugs {
    flex: 2;
  }
  .publishbtn {
    flex: 8;
    text-align: right;
  }
  .btnback {
    background-color: #009a52;
  }
}
// 评论信息
.reviewinfo {
  margin: 30px 0 10px 0;
  p {
    font-size: 16px;
    display: inline-block;
    margin-bottom: 10px;
  }
  .review-title {
    width: 100%;
    border-bottom: 1px solid #c4c9d0;
    padding-bottom: 10px;
  }
  .review {
    padding: 24px 0;
    border-bottom: 1px solid #c4c9d0;
  }
  .review-name {
    span {
      margin-left: 10px;
    }
  }
}
.morebtn {
  text-align: center;
  .button {
    margin-top: 10px;
  }
}

.dialogTitle {
  iframe {
    width: 100%;
    height: 500px;
  }
}
// 本页公共样式
.red {
  color: rgb(203, 50, 50);
}

.blue {
  color: #009a52;
  font-weight: 500;
}

.border {
  border-bottom: 1px solid #c4c9d0;
}

.pdf {
  width: 100%;
}

.article /deep/ em {
  font-style: normal;
}
[v-cloak] {
  display: none;
}
</style>
