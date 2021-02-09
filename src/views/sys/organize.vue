<template>
  <div>
    <div class="title">组织机构图</div>
    <div id="chart-container">
      <div class="orgchart">
        <div class="titlebox">
          <div class="vessel">
            <p>邮政科学研究规划院</p>
          </div>
        </div>

        <div class="lines">
          <span class="rowline"></span>
        </div>
        <div class="lines">
          <div id="floor1">
            <div class="colline-box-right">
              <span class="rowline"></span>
            </div>
            <div>
              <div class="colline" style="width: 262px"></div>
              <div class="colline-all">
                <div class="danyuan">
                  <div class="rowline"></div>
                  <p class="node">办公室︵ 党委办公室 ︶</p>
                </div>
                <div class="danyuan">
                  <div class="rowline"></div>
                  <p class="node">科研管理部</p>
                  <div id="loor2">
                    <div>
                      <span class="rowline" style="height:32px"></span>
                    </div>
                    <div>
                      <div class="colline" style="border-top: 0px solid white;"></div>
                      <div class="colline-all">
                        <div class="danyuan">
                          <div class="rowline"></div>
                          <p
                            class="node"
                            style="height: 180px;
    background-color: #31a804;"
                          >情报信息中心</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="danyuan">
                  <div class="rowline"></div>
                  <p class="node">人力资源部︵ 党委组织部 ︶</p>
                </div>
                <div class="danyuan">
                  <div class="rowline"></div>
                  <p class="node">计划财务部</p>
                </div>
                <div class="danyuan">
                  <div class="rowline"></div>
                  <p class="node">党委党建工作部︵ 监察室 ︶</p>
                </div>
              </div>
            </div>
          </div>
          <div id="floor2">
            <div class="colline-box-left">
              <span class="rowline"></span>
            </div>
            <div>
              <div class="colline" style="margin-left: -20px;"></div>
              <div class="colline-all">
                <div class="danyuan">
                  <div class="rowline"></div>
                  <p class="node">战略规划研究中心</p>
                  <div id="loor2">
                    <div>
                      <span class="rowline"></span>
                    </div>
                    <div>
                      <div class="colline" style="width: 50px"></div>
                      <div class="colline-all">
                        <div class="danyuan">
                          <div class="rowline"></div>
                          <p class="node">战略规划研究中心</p>
                        </div>
                        <div class="danyuan">
                          <div class="rowline"></div>
                          <p class="node">企业管理研究中心</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="danyuan">
                  <div class="rowline"></div>
                  <p class="node">金融研究中心</p>
                </div>
                <div class="danyuan">
                  <div class="rowline"></div>
                  <p class="node">技术应用研究中心</p>
                  <div id="loor2">
                    <div>
                      <span class="rowline"></span>
                    </div>
                    <div>
                      <div class="colline" style="width: 50px;"></div>
                      <div class="colline-all">
                        <div class="danyuan">
                          <div class="rowline"></div>
                          <p class="node">技术应用研究中心</p>
                        </div>
                        <div class="danyuan">
                          <div class="rowline"></div>
                          <p class="node">现代物流研究中心</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="danyuan">
                  <div class="rowline"></div>
                  <p class="node width2">
                    <span>设计中心</span>
                    <span>︵ 中国邮政集团公司定额站 ︶</span>
                  </p>
                  <div id="loor2">
                    <div>
                      <span class="rowline"></span>
                    </div>
                    <div>
                      <div class="colline" style="width: 194px;"></div>
                      <div class="colline-all">
                        <div class="danyuan">
                          <div class="rowline"></div>
                          <p class="node">综合管理部</p>
                        </div>
                        <div class="danyuan">
                          <div class="rowline"></div>
                          <p class="node">设计一部</p>
                        </div>
                        <div class="danyuan">
                          <div class="rowline"></div>
                          <p class="node">设计二部</p>
                        </div>
                        <div class="danyuan">
                          <div class="rowline"></div>
                          <p class="node">设计三部</p>
                        </div>
                        <div class="danyuan">
                          <div class="rowline"></div>
                          <p class="node">中国邮政定额站</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="danyuan">
                  <div class="rowline"></div>
                  <p class="node">质量检测与标准研究中心</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import "@/assets/css2/t3.css";

export default {
  data() {
    return {};
  },
  mounted() {},
  created: function () {},
  methods: {},
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.titlebox {
  text-align: center;
}
.orgchart {
  .vessel {
    width: 300px;
    height: 60px;
    margin: 0 auto;
    border-radius: 8px;
    background-color: #ffd504;
    overflow: hidden;
    p {
      height: 50px;
      margin-top: 10px;
      font-size: 24px;
      color: #fff;
      line-height: 50px;
      background-color: #00643e;
    }
  }
  .lines {
    font-size: 0;
    text-align: center;
    display: flex;
    justify-content: center;
  }
  .linetwo {
    justify-content: center;
  }
  span {
    height: 30px;
    display: inline-block;
  }
  // 右横线
  .colline-box-right {
    position: relative;
    &:before {
      content: "";
      width: 50%;
      height: 2px;
      background-color: gray;
      position: absolute;
      top: 0;
      right: 0;
    }
  }
  // 右横线
  .colline-box-left {
    position: relative;
    &:before {
      content: "";
      width: 50%;
      height: 2px;
      background-color: gray;
      position: absolute;
      top: 0;
      left: 0;
    }
  }
  // 所有横线格式化
  .colline {
    height: 0;
    width: 100%;
    margin: 0 auto;
    vertical-align: top;
    border-top: 2px solid grey;
  }
  // 所有竖线格式化
  .rowline {
    width: 2px;
    height: 30px;
    margin: 0 auto;
    background-color: gray;
    border-left: 2px solid grey;
  }
  .colline-all {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }
  .nodeline {
    width: 40%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 0 30px;
  }
  .node {
    width: 40px;
    height: 230px;
    color: rgb(255, 255, 255);
    background-color: #009a52;
    font-size: 16px;
    line-height: 1;
    padding-top: 20px;
    vertical-align: middle;
    border-radius: 4px;
  }
  .node:hover {
    background-color: #01b15f;
  }
  .width2 {
    width: 50px;
    display: flex;
    margin-left: 100px;
  }
  #floor1 {
    width: 300px;
  }
  #floor2 {
    width: 600px;
    #loor2 {
      .node {
        height: 180px;
        background-color: #31a804;
      }
      .node:hover {
        background-color: #37c005;
      }
    }
    .danyuan {
      margin: 0 4px;
    }
  }
}
</style>
