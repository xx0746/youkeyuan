<template>
  <div style="background-color:rgb(0, 154, 82);width: 100%; height:170px; text-align: center;">
      <div style="padding-top: 32px;box-sizing: border-box;color: white;font-size: 15px;">
        <p>版权所有:邮政科学研究规划院</p>
        <p style="padding:4px 0px 20px 0px;">Copyright &copy;2019 Postal Scientific Research and Planning Academy. All rights reserved.</p>
        <ul class="footer-list">
          <li class="youqing">友情链接:</li>
          <li><a href="https://www.wind.com.cn" target="_blank">Wind</a></li>
          <li><a href="http://www.cnki.net" target="_blank">知网</a></li>
          <li><a href="http://www.wanfangdata.com.cn" target="_blank">万方</a></li>
          <li><a href="https://www.jstor.org" target="_blank">Jstor</a></li>
          <li><a href="https://www.ebsco.com" target="_blank">EBSCO</a></li>
          <li><a href="http://viewswire.eiu.com/index.asp" target="_blank">EIU</a></li>
        </ul>
        <ul class="footer-list">
          <li><a href="http://www.spb.gov.cn" target="_blank">国家邮政局</a></li>
          <li><a href="http://www.stats.gov.cn" target="_blank">国家统计局</a></li>
          <li><a href="https://www.sac.net.cn" target="_blank">中国证券业协会</a></li>
          <li><a href="http://www.pbc.gov.cn" target="_blank">中国人民银行</a></li>
          <li><a href="http://www.eastmoney.com" target="_blank">东方财富网</a></li>
          <li><a href="https://report.iresearch.cn" target="_blank">艾瑞网</a></li>
        </ul>
      </div>
  </div>
</template>

<script>
export default {
  components:{},
  props:{},
  data(){
    return {
    }
  },
  watch:{},
  computed:{},
  methods:{},
  created(){},
  mounted(){}
}
</script>
<style lang="scss" scoped>
.footer-list{
  width: 740px;
  margin: 0 auto;
  margin-bottom: 10px;
  display: flex;
  justify-content: center;
  // transform: translateX(70px);
  li{
    padding: 0 10px;
    border-right: 1px solid #fff;
    height: 15px;
    line-height: 15px;
    a {
      color: #fff;
    }
    
  }
  li:last-child{
    border-right: none;
  }
  li:first-child.youqing {
    border-right: none;
  }
}
</style>