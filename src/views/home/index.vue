<template>
  <div class="index-container">
    <div class="title">
    <span>
      <img src='/static/index/logo.png' style="width:250px;margin-top:10px;margin-left:30px">
    </span>
    <span class="svg-container svg-container_login" style="color:white;width:80px;height:30px;margin-top:20px;margin-right:40px;float:right">
      <svg-icon icon-class="user" style="float:left"/><div style="font-size:16px;float:left;line-height: 30px">登录</div>
    </span>
    </div>

    <div style="margin-top:6%">
      <el-input   class="search" v-model="input" placeholder="请输入内容"></el-input>
      <el-button class="button lv" type="">搜索</el-button>
      <!-- <div style="margin-right:15%;color:white;float:right;margin-top:20px">高级搜索></div> -->
    </div>

    <div style="margin-top:9%">
      <div class="fed1 fed">
      </div>

      <div class="fed2 fed">

      </div>

      <a href="#/resbsearch">
      <div class="fed3 fed">

      </div>
      </a>

      <a href="#/resbsearch">
      <div class="fed4 fed">
      </div>
      </a>


      <div class="fed5 fed">

      </div>
      <a href="/sys">
        <div class="fed6 fed">

        </div>
      </a>
    </div>
    <div style="height:15%;clear:both"></div>

    <!-- <div >
      <div class="bot" style="margin-left:14%">关于我们</div>
      <div class="bot">联系我们</div>
      <div class="bot">加入我们</div>
      <div class="bot">订阅</div>
      <div class="bot">法律声明</div>
      <div class="bot" style="border:none;">友情链接</div>
    </div> -->

    <div>

    </div>


  </div>


</template>


<script>

  export default {
    data() {
      return {
        input: '',
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" >

</style>

<style rel="stylesheet/scss" lang="scss" scoped>
  .el-input__inner{
    height:40px;
    border-radius: 0;
    border:none;
    font-size:20px;
  }

  .index-container {
    background-image: url('/static/index/back.png');
    background-repeat:no-repeat;
    background-size:100% 100%;
    -moz-background-size:100% 100%;
    height: 100%;
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
    font-size:20px;
    border:none;
    height:51px;
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
    background:#343337;
    background: rgba(0,0,0,.5);
    height:70px;

  }

</style>
