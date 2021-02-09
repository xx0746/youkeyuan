<template>
  <div class="comment">
    <!-- 组件：回到顶部 -->
		<back-top></back-top>
    <div class="top">
      <div class="sys_nav" style="border:none;background:transparent">
        <a href="#/resbsearch" class="sysname">
          <img src="/static/index/logo.png" style="width:250px;margin-top:10px;margin-left:30px">
          <span>•&nbsp;科研资源数据平台</span>
        </a>
        <div class="topbar-account topbar-btn" style="margin-right:40px;position:relative;float:right;cursor: pointer;">
          <login-out></login-out>
        </div>
      </div>

      <!--<div class="searchline">-->
        <!--<el-input class="search" v-model="searchList.searchName" placeholder="请输入内容"></el-input>-->
        <!--<el-button class="button lv" type="primary" @click="search">检索</el-button>-->
      <!--</div>-->
    </div>
    <div class="content">
      <div class="article">
        <el-button size="small" type="primary"  @click="go()">
          返回
        </el-button>

        <!--<h1>{{getTitle}}</h1>-->
        <!-- <p class="author">刘远龙</p> -->
        <h2 v-show="this.$route.query.status==1" class="articletitle">{{detailsdata.title}}</h2>
        <h2 v-show="this.$route.query.status==2" class="articletitle">{{detailsnew.title}}</h2>
        <h2 v-show="this.$route.query.status==3" class="articletitle">{{imagesdetails.title}}</h2>
        <div class="article-load">
          <span class="blue" v-show="this.$route.query.status==1">上传人：{{detailsdata.userName}}</span>
          <span class="blue" v-show="this.$route.query.status==1">{{detailsdata.createTime}}</span>
          <span class="blue" v-show="this.$route.query.status==2">上传人：{{detailsnew.userName}}</span>
          <span class="blue" v-show="this.$route.query.status==2">{{detailsnew.createTime}}</span>
          <span class="blue" v-show="this.$route.query.status==3">上传人：{{imagesdetails.createUser}}</span>
          <span class="blue" v-show="this.$route.query.status==3">{{imagesdetails.createTime}}</span>
        </div>
        <hr class="line_hr">
        <!-- 文章内容 -->
        <div class="article-content"  v-if="isShowTable"  v-cloak>
          <div v-cloak class="pageimage-box">
            <!--<div v-show="this.$route.query.status==1">-->
              <!--{{detailsdata.content}}-->
            <!--</div>-->
            <!--<div v-show="this.$route.query.status==2">-->
              <!--{{detailsnew.content}}-->
            <!--</div>-->
            <div class="pageimage" v-cloak v-show="this.$route.query.status==1" v-html="contentpages">

            </div>
            <div class="pageimage" v-cloak v-show="this.$route.query.status==1" >
              <p  style="margin-bottom: 10px;"  v-show="originalLinkeddata">欢迎点击原文链接了解更多详情》</p>
              <a :href="detailsdata.originalLinked" class="originalLinked"  target="_blank">{{detailsdata.originalLinked}}</a>
            </div>

            <div class="pageimage" v-cloak v-show="this.$route.query.status==2"  v-html="contentnews" >

            </div>
            <div class="pageimage" v-cloak v-show="this.$route.query.status==2" >
              <p style="margin-bottom: 10px;"  v-show="originalLinkeddata">欢迎点击原文链接了解更多详情》</p>
              <a :href="detailsnew.originalLinked" class="originalLinked" target="_blank" style="">{{detailsnew.originalLinked}}</a>
            </div>
            <div class="pageimage" v-cloak v-show="this.$route.query.status==3"  v-html="imagesdetails.content" >

            </div>
            <div class="pageimage" v-cloak v-show="this.$route.query.status==3" >
              <p  style="margin-bottom: 10px;" v-show="originalLinkeddata">欢迎点击原文链接了解更多详情》</p>
              <a :href="imagesdetails.originalLinked" class="originalLinked"  target="_blank">{{imagesdetails.originalLinked}}</a>
            </div>
          </div>

        </div>
        <div v-else-if="isShowTable == false">数据正在努力加载中...</div>
        <div class="article-enclosure" v-show="this.fileindex>0">
          <div> 附件 (<span>{{fileindex}}</span>)</div>
          <hr class="line_hr"/>
          <div>
            <ul class="enclosurelist">
              <li @click="getDown(item.id)" v-for="(item,index) in sysNoticeFiles" :key="index">{{item.fileName}}</li>
            </ul>
          </div>
        </div>
        <div class="article-enclosure" v-show="this.fileindex1>0">
          <div>附件 (<span>{{fileindex1}}</span>)</div>
          <hr class="line_hr"/>
          <div>
            <ul class="enclosurelist">
              <li @click="getDown(item.id)" v-for="(item,index) in sysDynamicFiles" :key="index">{{item.fileName}}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <footer>
      <footer-view></footer-view>
    </footer>

  </div>
</template>
<script>
  import footerView from '@/views/home/footerView';
  import loginOut from "@/components/loginOut"
  import backTop from "@/components/backtop/backTop"
  import {
    getArticleInfo,
    submitArticleInfo,
    searchInterface,
    systemNoticeDetail,
    getsystemDynamicDetail,
    imageTextDetail,
    systemNoticeFilesDown,
    systemDynamicFilesDown
  } from "@/api/search";
  import {
    getSubscribeInfo,
    addSubscribeInfo,
    delSubscribeInfo
  } from '@/api/ressubscribe'
  import { downloadFile } from "@/utils/utile";
  import { fileMoreDownLoad } from "@/api/resource_list";
  import * as elValidate from '@/utils/elValidate'
  export default {
    components: { loginOut , footerView, backTop},
    data() {
      return {
        originalLinkeddata:false,
        isShowTable: false,
        artic: {
          flag: 2,
        },
        contentpages:{},
        content:{},
        contentnews:{},
        imagesdetails:{},
        detailsdata:[],
        fileindex:'',
        fileindex1:'',
        detailsnew:[],
        sysDynamicFiles:[],
        sysNoticeFiles:[],
        id:this.$route.query.id,
        ids:this.$route.query.id,
        pageId: null,
        searchList: {
          searchName: '',
          pageNumber: 1,
          limit: 10,
          menuIds: "",
          labelIds: ""
        },
        reviewForm: {
          desc:"",
        },
        reviewFormrul: {
          desc: [
            // {validator:elValidate.elNumberSize,trigger: ['blur', 'change']},
          ]
        },

        // 默认订阅状态
        state: null,
        // 获评论信息
        articinfo: [],
        total:0,
        // pdf文件变量
        // src: "/static/index/pdf实验.pdf",
        src: "",
        showPdf:false
      }
    },
    created() {
      // this.getPageInfo();
      // this.getSubscribe();
      this.detailsnews();
    },
    computed: {
      getTitle: function() {
        let title = this.artic.NAME.split(".")[0];
        return title;
      }
    },
    methods: {
      getDown(id) {
        // 下载
        const _that = this;
        this.artic.id = id;
        if(this.$route.query.status==1){
          systemNoticeFilesDown(this.artic).then(res => {
            console.log(res);
            if(res.data.data.length==1){
              downloadFile(res.data.data[0]);
            }else{
              for (let i = 0; i < res.data.data.length; i++) {
                downloadFile(res.data.data[i]);
              }
            }
          });
        }else if(this.$route.query.status==2){
          systemDynamicFilesDown(this.artic).then(res => {
            console.log(res);
              if(res.data.data.length==1){
                downloadFile(res.data.data[0]);
            }else{
              for(let i = 0; i < res.data.data.length; i++) {
                downloadFile(res.data.data[i]);
              }
            }
          });
        }


      },

      // 获取动态要闻
      detailsnews() {
       if(this.$route.query.status==1){
         systemNoticeDetail(this.id).then(res => {
           if (res.data.code == 1) {
             this.isShowTable = true;
             this.detailsdata = res.data.data.sysNotice;
             if( res.data.data.sysNotice.originalLinked!==null){
               this.originalLinkeddata = true;
             }
             this.contentpages =res.data.data.sysNotice.content;
             this.sysNoticeFiles = res.data.data.sysNoticeFiles;

            if(res.data.data.sysNoticeFiles.length!==[]){
              for(var i = 0;i<res.data.data.sysNoticeFiles.length;i++){
                this.fileindex = res.data.data.sysNoticeFiles.length;
              }
            }

           }
         });
       }else if(this.$route.query.status==2){
         getsystemDynamicDetail(this.id).then(res => {
           if (res.data.code == 1) {
             this.isShowTable = true;
             this.detailsnew = res.data.data.sysDynamic;
             this.contentnews =res.data.data.sysDynamic.content;
             this.sysDynamicFiles = res.data.data.sysDynamicFiles;
             if(res.data.data.sysDynamic.originalLinked!==null){
               this.originalLinkeddata = true;
             }
             console.log(res.data.data.sysDynamicFiles.length)
             if(res.data.data.sysDynamicFiles!==[]){
               console.log(111)
               for(var i = 0;i< res.data.data.sysDynamicFiles.length;i++){
                 console.log(res.data.data.sysDynamicFiles.length)
                 this.fileindex1 =res.data.data.sysDynamicFiles.length;
               }
             }
           }
         });
       }else if(this.$route.query.status==3){
         console.log(this.ids)
         imageTextDetail(this.ids).then(res => {
           if (res.data.code == 1) {
             this.isShowTable = true;
             this.imagesdetails = res.data.data;
             this.content = res.data.data;
             if(res.data.data.originalLinked!==""){
               this.originalLinkeddata = true;
             }
             // this.detailsnew = res.data.data.sysDynamic;
             // this.contentnews =res.data.data.sysDynamic.content;
             // console.log(res,'ssss')
             // if(res.data.data.sysNoticeFiles==[]){
             //   for(var i = 0;i<res.data.data.sysNoticeFiles.length;i++){
             //     console.log(res.data.data.sysNoticeFiles.length)
             //     this.fileindex = res.data.data.sysNoticeFiles.length;
             //
             //   }
             // }

             //

           }
         });
       }

      },
      go(){
        this.$router.push({
          path:'/resbsearch'
        })
      },
      // 获取文章详情页面信息
      getPageInfo() {
        // console.log(this.$route.query.data);
        this.artic = this.$route.query.data;
        console.log(this.artic);
        // 获取评论信息
        getArticleInfo(this.artic).then(res => {
          console.log(res);
          if (res.data.code == 1) {
            let articsInfo = res.data.data
            this.articinfo = articsInfo
            this.total = this.articinfo.length;
          } else {
            return false;
          }
        });
      },

      search(){
        searchInterface(this.searchList).then(res=>{
          console.log(res);
          if(res.data.code == 1){
            this.total = res.data.data.data.total;
            this.searchTable = res.data.data.data.rows;
            this.$router.push({ path: "/resbindex" });
          }else{
            return false;
          }
        });
      },
      // submitForm(formName) {
      //   let _that = this;
      //   this.$refs[formName].validate((valid) => {
      //     if(this.reviewForm.desc.length <= 5) {
      //       return _that.$message({
      //         message: '提交信息不能少于5个字符',
      //         type: 'warning'
      //       })
      //     };
      //     let data = {
      //       menuId : this.artic.menuId,
      //       resourceId :this.artic.id,
      //       commentContent :this.reviewForm.desc
      //     }
      //     if (valid) {
      //       submitArticleInfo(data).then(res => {
      //         if(res.data.code == 1) {
      //           _that.$message({
      //             message: '恭喜你，提交成功',
      //             type: 'success'
      //           });
      //           this.reviewForm.desc = "";
      //           this.getPageInfo()
      //         }
      //       })
      //     } else {
      //       console.log('error submit!!');
      //       return false;
      //     }
      //   });
      // },
      showText() {
        $("#showText").css("display", "none");
        $(".art-text").addClass("active");
      },
    }
  };
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .originalLinked{ color: blue;font-size: 18px}
  /*.originalLinked:hover{ color: blue;}*/
  .articletitle{
    text-align: center;
    font-family: "微软雅黑 Light";
    color:#333;
    font-weight: 400;
    padding: 20px 0;
    font-size: 26px;
  }
  .enclosurelist>li:hover{
    color:#009a52;
  }
  .enclosurelist>li{
    color: #2c3e50;
    cursor: pointer;
  }
  .comment {
    // height: 100%;
    background-color:#F2F2F2;

  }
  [v-cloak] {
    display: none !important;
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

  .searchline {
    margin-top: 3.5%;
    .search {
      margin-left: 15%;
      border-radius: 0;
      border: none;
      width: 60%;
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
    width: 100%;
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
      border-top: 1px solid #D4DBE4;
    }
    h2 {
      padding: 20px 0 20px 20px;
      color: #009a52;
      font-size: 18px;
    }
    ul,li {
      padding: 0;
      margin: 0;
    }
    li {
      margin: 10px 0 10px 10px;
      list-style:disc;
      a {
        color: #333;
      }
    }
  }

  // 右侧文章内容样式
  .article {
    width: 85%;
    padding: 30px;
    background-color: #fff;
    margin: 0 auto;
    border: 1px solid #c4c9d0;
    border-top: 3px solid #009a52;
    min-height: 800px;
    /*display: inline-block;*/
    .el-icon-arrow-left{font-size: 20px;font-weight: bold;}
    h1 {
      text-align: center;
      font-family: "微软雅黑 Light";
      color:#333;
    }
    .author {
      text-align: center;
      margin: 14px 0;
    }

    .article-load {
      width: 100%;
      display: flex;
      justify-content: space-between;
      padding: 6px 0;
      span {
        width:15%;
        cursor: pointer;
        display: inline-block;
        &:nth-child(even) {
          text-align: right;
        }
      }
      .el-icon-edit-outline {
        margin-left: 10px;
      }
    }
    .article-content {
      padding: 30px 50px;
      // div:nth-of-type(1){overflow-y:scroll;}
      .art-text {
        width: 100%;
        text-align: center;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 3;
        overflow: hidden;
      }
      .pageimage-box {
        // height: 600px;
        // overflow: hidden;
        font-size: 16px;
      }
      .pageimage{
        padding-top: 20px;
        width: 100%;
        overflow-y:visible !important;
        p {
          width: 100%;
          img {
            display: block;
            width: 800px;
            margin: 0 auto;
            // height: 100%;
          }
        }
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
    .article-enclosure{
      div:nth-of-type(1){
        padding: 20px 0px;
        font-size: 18px;
      }
      div:nth-of-type(2){
        padding: 20px;
        .enclosurelist{
          width: 100%;
          /*display: flex;*/
          padding-left: 30px;
          /*justify-content: flex-start;*/
          li{
            /*width: 10%;*/
            font-size: 16px;
            padding-bottom: 5px;
            a {
              color: blue;
              &:hover {
                color: #009a52;
              }
            }
          }
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
    border-top: 1px solid rgb(203, 50, 50);
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
      background-color: rgb(203, 50, 50);
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
   font-weight: 500;
  }

  .border {
    border-bottom: 1px solid #999;
  }

  .pdf {
    width: 100%;
  }
  // hr分割线样式 
  .line_hr{
    background-color:#c4c9d0; 
    height:1px; 
    border:none;
  }

</style>
