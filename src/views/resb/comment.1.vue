<template>
  <div class="comment">
    <div class="top">
      <div class="title" style="border:none;background:transparent">
        <a href="#/resbsearch">
          <img src="/static/index/s2.png" style="width:450px;margin-top:10px;margin-left:150px;">
        </a>

        <div
          class="topbar-account topbar-btn"
          style="margin-top:10px;margin-right:40px;position:relative;float:right;cursor: pointer;"
        >
          <login-out></login-out>
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
              <a>{{item.NOTICE_INFO}}</a>
            </li>
          </ul>
        </div>
      </div>
      <div class="article">
        <el-button size="mini" type="primary" onclick="javascript :history.go(-1);">返回上一层</el-button>
        <h1>{{artic.name}}</h1>
        <div class="article-load">
          <span class="green">
            <i class="el-icon-download green1"></i>
            <span @click="downArtic">下载</span>
          </span>
          <span class="green">
            <i class="el-icon-star-off green1"></i>
            <span @click="addfavoritespage()" v-show="Collectionicon">{{Collectionpage}}</span>
            <span v-show="Collectionicons" @click="DELETEfavoritespage()">{{Collectionpages}}</span>
          </span>
        </div>
        <hr>
        <!-- 文章内容 -->
        <div class="article-content">
          <z-tree :fileTreeData="TableData" v-if="showTree" @treeClick="clickTreeNode"></z-tree>

          <p style="font-size:16px;">
            所属资源库:
            <span>{{artic.menuName}}</span>
          </p>
          <br>
          <p style="font-size:16px;">
            上传时间:
            <span>{{artic.createTime}}</span>
          </p>
          <!-- <p>导师: <span class="blue">无名</span></p> -->
        </div>
        <!-- 我要评论 -->
        <div class="publish-review">
          <h4 style="font-size:20px;color:rgba(0,153,85,1);">我要评论</h4>
          <div class="review-cont">
            <span class="icon-user"></span>
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
              <!--<span>{{item.createTime | momentTime('MM月DD日 HH:mm')}}</span>-->
            </div>
            <div>{{item.COMMENTCONTENT}}</div>
          </div>
          <!-- <el-row class="morebtn">
            <el-button type="primary" class="button">查看更多</el-button>
          </el-row>-->
        </div>
      </div>
    </div>
    <footer-view></footer-view>
    <!-- <el-dialog class="dialogTitle" title="文件预览" :visible.sync="showPdf">
      <div v-if="showPdfSrc">
        <iframe :src="src">
          This browser does not support PDFs. Please download the PDF to view it: < a href=" " rel="external nofollow" >Download PDF</a>
        </iframe>
      </div>
        <div v-else>文件加载中</div>
    </el-dialog>-->
    <footer-view></footer-view>
  </div>
</template>

<script>
import footerView from '@/views/home/footerView';
import loginOut from "@/components/loginOut";
import zTree from "@/components/zTree/zTree";
import {
  getArticleInfo,
  submitArticleInfo,
  searchInterface,
  Isfavorites,
  addfavorites,
  fileAddInterface,
  getNewsInfoList,
  DELETEfavorites
} from "@/api/search";
import {
  getSubscribeInfo,
  addSubscribeInfo,
  delSubscribeInfo
} from "@/api/ressubscribe";
import { getCommentPreviewList, getCommentPreview } from "@/api/comment";
import { fileMoreDownLoad } from "@/api/resource_list";
import { downloadFile } from "@/utils/utile";
import * as elValidate from "@/utils/elValidate";
export default {
  components: { loginOut, pdf, zTree ,footerView },
  data() {
    return {
      showPdfSrc: false,
      Collection: {},
      Collectionicon: false,
      Collectionicons: false,
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
        labelIds: ""
      },
      searchName: "",
      searchKeyRegion: "1",
      reviewForm: {
        desc: ""
      },
      reviewFormrul: {
        desc: [
          // {validator:elValidate.elNumberSize,trigger: ['blur', 'change']},
        ]
      },
      artic: {
        flag: 2,
        menuId: "",
        fileId: "",
        menuName: "暂无数据",
        createTime: "暂无数据",
        idx: 0,
        id: null,
        fileState: 1
      },
      // 获取最新消息栏信息参数
      theLatestWord: {
        userId: 1,
        pageSize: 5,
        pageNumber: 1
      },
      // 默认订阅状态
      state: null,
      // 获评论信息
      articinfo: [],
      total: 0,
      TableData: [],
      dialogTableVisible: false,
      // pdf文件变量
      // src: "/static/index/pdf实验.pdf",
      src: "",
      showPdf: false,
      showTree: false,
      downList:{}
    };
  },
  created() {
    // this.src = pdf.createLoadingTask(this.src)
    // this.getIsfavorites();
    // console.log(this.$route.query.NAME,'DCDCDS');
  },
  computed: {
    getReviewInfo() {
      return this.$store.state.review;
    }
  },
  mounted() {
    this.getPageInfo();
    this.getIsfavorites();
    this.getNewsInfo();
    // this.getSubscribe();
    this.getShow();
    this.showTree = true;
  },
  destroyed() {
    this.showTree = false;
  },
  methods: {
    // 获取最新消息
    async getNewsInfo() {
      const res = await getNewsInfoList(this.theLatestWord);
      let {
        data: {
          data: { rows },
          code
        }
      } = res;
      if (code == 1) {
        this.theLatesNews = rows;
      }
    },
    //取消收藏
    DELETEfavoritespage() {
      var that = this;
      this.Collection.menuId = this.getReviewInfo.menuId;
      this.Collection.fileId = this.getReviewInfo.id;
      // this.artic.title =  this.artic.NAME.split(".")[0];
      console.log(this.Collection, "scdsc");
      DELETEfavorites(this.Collection).then(res => {
        if (res.data.code == 1) {
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
      console.log(this.Collection, "scdsc");
      addfavorites(this.Collection).then(res => {
        if (res.data.code == 1) {
          that.getIsfavorites();
        }
      });
    },
    //获取收藏状态
    getIsfavorites() {
      var that = this;
      let param = {
        menuId: this.artic.menuId,
        fileId: this.getReviewInfo.id
      };
      Isfavorites(param).then(res => {
        if (res.data.code == 1) {
          that.Collectionpages = "取消收藏";
          that.Collectionicon = false;
          that.Collectionicons = true;
        } else if (res.data.code == -1) {
          that.Collectionpage = "收藏";
          that.Collectionicon = true;
          that.Collectionicons = false;
        }
      });
    },
    // 获取文章详情页面信息
    getPageInfo() {
      this.artic = { ...this.artic, ...this.getReviewInfo };
      // 获取评论信息
      getArticleInfo(this.artic).then(res => {
        if (res.data.code == 1) {
          let articsInfo = res.data.data;
          this.articinfo = articsInfo;
          this.total = this.articinfo.length;
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    search() {
      console.log(this.searchKeyRegion, "sskncks");
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
            searchType: 1
          }
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
            searchType: 2
          }
        });
      }
    },
    submitForm(formName) {
      let _that = this;
      this.$refs[formName].validate(valid => {
        if (this.reviewForm.desc.length < 5) {
          return _that.$message({
            message: "提交信息不能少于5个字符",
            type: "warning"
          });
        }
        let data = {
          menuId: this.artic.menuId,
          resourceId: this.artic.id,
          commentContent: this.reviewForm.desc
        };
        if (valid) {
          submitArticleInfo(data).then(res => {
            if (res.data.code == 1) {
              _that.$message({
                message: "评论成功,请等待审核",
                type: "success"
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
      console.log(this.artic);
      let data = {
        fileIds: `${this.artic.menuId}-${this.artic.id}`,
        page: 1,
        type: 2
      };
      fileMoreDownLoad(data).then(res => {
        console.log(res);
        if (res.data.code == 0) {
          this.$confirm(`${res.data.msg}是否提交下载申请？`, "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
            .then(() => {
              let s = res.data.data;
              let a = s.split("-");
              this.downList.fileId = a[1];
              this.downList.menuId = a[0];
              this.downList.flag = 1;
              fileAddInterface(this.downList).then(res => {
                if (res.data.code == 1) {
                  this.$message({
                    type: "success",
                    message: "申请已提交！"
                  });
                }
              });
            })
            .catch(() => {
              this.$message({
                type: "info",
                message: "已取消下载"
              });
            });
        } else if (res.data.code == 4) {
          for (let i = 0; i < res.data.data.length; i++) {
            downloadFile(res.data.data[i]);
          }
        } else if (res.data.code == 1) {
          this.$message.warning(res.data.msg);
        } else if (res.data.code == 2) {
          this.$confirm(`${res.data.msg}是否重新提交下载申请？`, "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
            .then(() => {
              console.log(this.downList);
              fileAddInterface(this.downList).then(res => {
                if (res.data.code == 1) {
                  this.$message({
                    type: "success",
                    message: "申请已提交！"
                  });
                }
              });
            })
            .catch(() => {
              this.$message({
                type: "info",
                message: "已取消下载"
              });
            });
        }
      });
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
    // 预览
    getShow() {
      this.artic.FLAG = 2;
      this.artic.fileState = 1;
      this.artic.fileId = this.getReviewInfo.id;
      getCommentPreviewList(this.artic).then(res => {
        let srcs = res.data.data.path;
        let fileids = res.data.data.ids;
        let pathList = srcs.map(item => {
          return item.split("/");
        });
        console.log(pathList);
        let arr1 = [];
        let i = 2;
        arr1[0] = { id: 1, pId: 0, name: pathList[0][0] };
        for (let j = 1; j < 5; j++) {
          if (j == 1) {
            pathList.forEach((item, index) => {
              item.forEach((item1, index1) => {
                if (index1 == 1) {
                  console.log(item[pathList[index].length - 1]);
                  arr1.push({ id: i, pId: 1, name: item1 });
                  i++;
                }
              });
            });
          } else if (j == 2){
            pathList.forEach((item, index) => {
              item.forEach((item1, index1) => {
                if (index1 == 2) {
                  arr1.push({ id: i, pId: index + 2, name: item1 });
                  i++;
                }
              });
            });
          }
        }
        this.TableData = arr1;

        // let fileName = arr1[2].value.lastIndexOf(".");//取到文件名开始到最后一个点的长度
        // let fileNameLength = arr1[2].value.length;//取到文件名长度
        // let fileFormat = arr1[2].value.substring(fileName + 1, fileNameLength);
        // console.log(fileNameLength);
        // console.log(fileName);
        // console.log(fileFormat);
        // var arr2 = [];
        //   for(var i = 0;i<arr1.length;i++){
        //     arr2.push(arr1[i].value.substr(0,8));
        //     console.log(arr2,'123')
        //     this.TableData = arr1;
        //   }

        // this.dialogTableVisible = true;
        // console.log(srcs.split("?")[0]);
        // srcs = srcs.split("?")[0];
        // let zhui = srcs.substring(srcs.lastIndexOf(".")+1,srcs.length).toLowerCase();
        // if(zhui != "jpg" && zhui != ""){

        // }
        // this.src = srcs;
        // this.showPdf = true;
        // console.log(this.src);
      });
    },
    // 点击文件列表目录树节点
    clickTreeNode(val) {
      console.log(val);
    },
    // 预览
    review(val) {
      this.showPdf = true;
      this.artic.idx = val.idx;
      this.artic.fileState = 1;
      getCommentPreview(this.artic).then(res => {
        console.log(res.data);
        if (res.data.code == 1) {
          this.src = res.data.data;
          // this.src = pdf.createLoadingTask(res.data.data);
          this.showPdfSrc = true;
          let fileName = this.src.lastIndexOf("."); //取到文件名开始到最后一个点的长度
          let fileNameLength = this.src.length; //取到文件名长度
          let fileFormat = this.src.substring(fileName + 1, fileNameLength); //后缀名
          let fileText = /\.(doc|docx|xls|xlsx|csv|ppt|pptx|pdf|txt|tif|tiff|db|zip|rar|psd|wps|et|ett|jpg|png)(\?.*)?$/.test(fileFormat);
          if (!fileText) {
            this.showPdf = false;
            this.$message.warning(`以.${fileFormat}结尾的文件类型不支持预览`);
          }
        } else {
          this.$message.warning(res.data.msg);
        }
      });
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.comment {
  // height: 100%;
  background-color: #f2f2f2;
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
      color: rgba(12, 12, 12, 1);
      margin-right: 20px;
      margin-bottom: 10px;
    }
  }
}
.preview > ul > li:hover {
  color: rgba(0, 129, 72, 1);
}
.green {
  margin-right: 22px;
  box-sizing: border-box;
  font-size: 16px;
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
  height: 300px;
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
  margin: -50px auto 0;
  justify-content: space-between;
  margin-bottom: 30px;
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
  /*border: 1px solid #999;*/
  h1 {
    text-align: center;
    font-family: "微软雅黑 Light";
    color: #333;
  }
  .author {
    text-align: center;
    margin: 14px 0;
  }

  .article-load {
    text-align: right;
    margin-bottom: 10px;
    i {
      font-weight: 600;
    }
    span {
      cursor: pointer;
    }
    .el-icon-edit-outline {
      margin-left: 10px;
    }
  }
  .article-content {
    padding: 30px 0px;
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
      margin-bottom: 16px;
    }
  }
}
// 评论内容
.review-cont {
  padding: 20px 0;
  border-top: 1px solid #009a52;
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
    border: 1px solid #999;
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
  margin: 10px 0;
  p {
    font-size: 18px;
    display: inline-block;
    margin-bottom: 10px;
  }
  .review-title {
    width: 100%;
    border-bottom: 1px solid #999;
    padding-bottom: 20px;
  }
  .review {
    padding: 24px 0;
    border-bottom: 1px solid #999;
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
  color: rgb(51, 153, 211);
}

.border {
  border-bottom: 1px solid #999;
}

.pdf {
  width: 100%;
}
</style>
