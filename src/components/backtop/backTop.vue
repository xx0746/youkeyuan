<template>
  <div>
    <span class="backtop_btn" id="to_top_btn" @click="goBack">
      <i class="el-icon-arrow-up"></i>
    </span>
  </div>
</template>

<script>
export default {
  name: 'back-top',
  props:{
    showHeight: {
      type: Number,
      default: 20
    }
  },
  data(){
    return {

    }
  },
  mounted(){
    window.addEventListener('scroll', this.scrollToTop)
  },
  methods:{
    scrollToTop() { 
  // 　　let topBtn = document.getElementById('to_top_btn');
      let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
      if (scrollTop > this.showHeight) {
        $('#to_top_btn').fadeIn(300)
      } else {
        $('#to_top_btn').fadeOut(300)
      }
    },
    goBack() {
      $("html,body").animate({scrollTop:0},500);
    }
  },
  destroyed () {
    window.removeEventListener('scroll', this.scrollToTop); 
  }
}
</script>
<style lang="scss" scoped>
.backtop_btn {
  display: block;
  width: 40px;
  height: 40px;
  line-height: 40px;
  // border-radius: 50%;
  box-shadow: 0px 0px 5px #ccc;
  position: fixed;
  bottom: 80px;
  right: 30px;
  background-color: #fff;
  text-align: center;
  font-size: 22px;
  color: #009a52;
  cursor: pointer;
  display: none;
  &:hover {
    background-color: rgb(245, 245, 245);
  }
}
</style>