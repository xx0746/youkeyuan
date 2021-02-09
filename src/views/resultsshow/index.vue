<template>
  <div class="tt">
    <div class="t-top clearfix">
      <div class="time-box">
        <span class="time1"></span>
      </div>
    </div>
    <div class="main clearfix">
      <div class="left">
        <!--左边1-->
        <div class="left-top">
          <div class="module-title">
            <div class="l-h2-title">知识专区</div>
            <div class="title-center_bg"></div>
            <div class="title-right_bg"></div>
          </div>
          <div class="module-center">
            <div class="f1" style="border:none">
              <div class="f3">浏览总数</div>
              <div class="f2">{{resourceList.data1}}</div>
            </div>
            <div class="f1">
              <div class="f3">下载总数</div>
              <div class="f2">{{resourceList.data1}}</div>
            </div>
            <div class="f1">
              <div class="f3">资源总数</div>
              <div class="f2">{{resourceList.data1}}</div>
            </div>
            <div class="f1">
              <div class="f3">总记录数</div>
              <div class="f2">{{resourceList.data4}}</div>
            </div>
            <div class="f1">
              <div class="f3">本周新增</div>
              <div class="f2" style="color:#02c37f">{{resourceList.data3}}</div>
            </div>
          </div>
          <div class="module-bottom">
            <div class="bottom_bg_l"></div>
            <div class="bottom_bg_c"></div>
            <div class="bottom_bg_r"></div>
          </div>
        </div>
        <!--左边2-->
        <div class="left-center">
          <div class="module-title">
            <div class="l-h2-title">数据专区</div>
            <div class="title-center_bg"></div>
            <div class="title-right_bg"></div>
          </div>
          <div class="module-center">
            <div class="f1" style="border:none">
              <div class="f3">数据模板</div>
              <div class="f2" style="color:#f45e23">{{dataList.data2}}</div>
            </div>
            <div class="f1">
              <div class="f3">数据模板</div>
              <div class="f2" style="color:#f45e23">{{dataList.data2}}</div>
            </div>
            <div class="f1">
              <div class="f3">数据模板</div>
              <div class="f2" style="color:#f45e23">{{dataList.data2}}</div>
            </div>
            <div class="f1">
              <div class="f3">总数据集</div>
              <div class="f2" style="color:#fdb628">{{dataList.data3}}</div>
            </div>
            <div class="f1">
              <div class="f3">本周数据集</div>
              <div class="f2" style="color:#02c37f">{{dataList.data4}}</div>
            </div>
          </div>
          <div class="module-bottom">
            <div class="bottom_bg_l"></div>
            <div class="bottom_bg_c"></div>
            <div class="bottom_bg_r"></div>
          </div>
        </div>
        <!--左边3-->
        <div class="left-bottom">
          <div class="module-title">
            <div class="l-h2-title">新增数据趋势</div>
            <div class="title-center_bg"></div>
            <div class="title-right_bg"></div>
          </div>
          <div class="module-center">
            <div id="trend-chars" ref="trend"></div>
          </div>
          <div class="module-bottom">
            <div class="bottom_bg_l"></div>
            <div class="bottom_bg_c"></div>
            <div class="bottom_bg_r"></div>
          </div>
        </div>
      </div>
      <div class="right">
        <!--目录数据分布饼状图-->
        <div class="right-top">
          <div class="knowledge">
            <div class="module-title">
              <div class="r-title-right_bg"></div>
              <div class="title-center_bg"></div>
              <div class="r-h2-title">知识管理资源分布</div>
            </div>
            <div class="module-center">
              <div id="zhishiUpload-echars" ref="myChart"></div>
            </div>
            <div class="module-bottom">
              <div class="bottom_bg_l"></div>
              <div class="bottom_bg_c"></div>
              <div class="bottom_bg_r"></div>
            </div>
          </div>
          <div class="data">
            <div class="module-title">
              <div class="r-title-right_bg"></div>
              <div class="title-center_bg"></div>
              <div class="r-h2-title">数据管理资源分布</div>
            </div>
            <div class="module-center">
              <div id="shujuUpload-echars" ref="shujuUpload"></div>
            </div>
            <div class="module-bottom">
              <div class="bottom_bg_l"></div>
              <div class="bottom_bg_c"></div>
              <div class="bottom_bg_r"></div>
            </div>
          </div>
        </div>
        <div class="right-bottom">
          <div class="menus">
            <div class="module-title">
              <div class="r-title-right_bg"></div>
              <div class="title-center_bg"></div>
              <div class="r-h2-title">各部门上传数据量</div>
            </div>
            <div class="module-center">
              <div id="bumenUpload-echars" ref="bumenUpload"></div>
            </div>
            <div class="module-bottom">
              <div class="bottom_bg_l"></div>
              <div class="bottom_bg_c"></div>
              <div class="bottom_bg_r"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  var echarts = require('echarts')
  import {
    getResourceInfo,
    getDataInfo,
    getResourceFenbu,
    getDataFenbu,
    getThendData
  } from "@/api/resultShow"
  import { resultcenter } from "@/api/Reportform";
  export default {
    data() {
      return {
        resourceList: {},
        dataList: {},
      }
    },
    created() {
      this.getResourceList()
      this.getDataList()
      this.getResourceFenbuList()
      this.getDataFenbuList()
      this.uploadCount()
      this.trend()
    },
    mounted() {},
    methods: {
			option(param) {
				window.addEventListener("resize", () => {
					param.resize();
				});
			},
      getResourceList() {
        getResourceInfo().then(res => {
          if(res.data.code == 1) {
            this.resourceList = res.data.data;
          }
        })
      },
      getDataList() {
        getDataInfo().then(res => {
          if(res.data.code == 1) {
            this.dataList = res.data.data;
          }
        })
      },
      getResourceFenbuList() {
        getResourceFenbu().then(res => {
          if(res.data.code == 1) {
            let resourceChartList = res.data.data;
            let resourceData = resourceChartList.map(item => {
              if(item.resourceCount>0){
                return {value: item.resourceCount, name: item.label}
              }
            })
            
            // 知识各库资源分布情况图
            let myChart = echarts.init(document.getElementById('zhishiUpload-echars'));
            myChart.setOption({
              tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b}: {c} ({d}%)"
              },
              // 图例
              // legend: {
              //   orient: 'vertical',
              //   x: 'left',
              //   textStyle: {
              //     color: '#C3CAD9'
              //   },
              //   data:['直接访问','邮件营销','联盟广告','视频广告','搜索引擎']
              // },
              // 数据及图表类型
              series: [
              {
                name:'访问来源',
                type:'pie',
                center: ['50%', '55%'],
                radius: ['40%', '60%'],
                minAngle: 15,
                label: {
                  color: '#C3CAD9'
                },
                data:resourceData,
                startAngle:110,
              }
              ]
						})
						this.option(myChart)
          }
        })
      },
      getDataFenbuList() {
        getDataFenbu().then(res => {
          if(res.data.code == 1) {
            let dataChartList = res.data.data;
            let dataData = dataChartList.map(item => {
              if(item.resourceCount>0){
                return {value: item.resourceCount, name: item.label}
              }
              
            })
            // 数据各库资源分布情况图
            let shujuUpload = echarts.init(document.getElementById('shujuUpload-echars'));
            shujuUpload.setOption({
              tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b}: {c} ({d}%)"
              },
              series: [
                {
                  name:'访问来源',
                  type:'pie',
                  center: ['50%', '54%'],
                  radius: ['40%', '60%'],
                  minAngle: 15,
                  label: {
                    color: '#C3CAD9'
                  },
                  data:dataData,
                }
              ]
						})
						this.option(shujuUpload)
          }
        })
      },
      uploadCount() {
        let time = {
          beginDate: "",
          endDate: ""
        }
        resultcenter(time).then(res => {
          if(res.status == 200) {
            let resData = res.data.storageNum;
            let nameList = [];
            let numberList = [];
            resData.forEach(item => {
              let index = Object.keys(item)[0]
              let number = item[index][0].FILENUM
              nameList.push(index)
              numberList.push(number)
            });
            // 各部门上传数据量
            let bumenUpload = echarts.init(document.getElementById('bumenUpload-echars'));
            bumenUpload.setOption({
              color: ['#3398DB'],
              tooltip: {
                trigger: 'axis',
                axisPointer : {     // 坐标轴指示器，坐标轴触发有效
                  type : 'shadow'  // 默认为直线，可选为：'line' | 'shadow'
                }
              },
              grid: {
                left: '3%',
                right: '4%',
								bottom: '4%',
								top: '30%',
                containLabel: true
              },
              xAxis: [
                {
                  type: 'category',
                  data: nameList,
                  axisTick: {
                    alignWithLabel: true
                  },
                  axisLabel: {
										lineHeight: 15,
                    interval:0,
                    formatter: params => {
											return this.formatter(params)
										},
                    textStyle: {
                      color: '#2772AA', //坐标值得具体的颜色
                    }
                  },
                }
              ],
              yAxis: [
                {
                  type: 'value',
                  axisLabel: {
                    textStyle: {
                      color: '#2772AA',//坐标值得具体的颜色
                    }
                  },
                  splitLine: {
                    lineStyle: {
                      // 使用深浅的间隔色
                      color: ['#333']
                    }
                  },
                  splitNumber: 3, // 设置y轴以几个刻度区显示
                  // interval: 200, // 控制间隔y轴间隔的数值，会覆盖splitNumber的设置
                }
              ],
              series: [{
                // name:'直接访问',
                type:'bar',
                barWidth: '60%',
                data: numberList,
                itemStyle: {
                  normal: {
                    color: params => {
                      let colorList = [
                        '#91c7ae','#91c7ae','#91c7ae','#91c7ae','#91c7ae',
                        '#3eafe4','#3eafe4','#3eafe4','#3eafe4','#3eafe4',
                        '#3eafe4','#3eafe4','#3eafe4','#3eafe4','#3eafe4',
                      ];
                      return colorList[params.dataIndex];
                    }
                  }
                },
                emphasis: {}
              }]
						})
						this.option(bumenUpload)
          }
        })
      },
      // 数据趋势分布图
      trend() {
        getThendData().then(res => {
          if(res.data.code == 1) {
            let data = res.data.data;
            let xName = Object.keys(data);
            let ydata = xName.map(item => {
              return Number(data[item])
            })
            // 数据趋势分布图
            let trend = echarts.init(document.getElementById('trend-chars'));
            trend.setOption({
              // 控制整个坐标轴的线条区域大小
              grid: {
                width: '90%',
                height: 'auto',
                left: '3%',
                right: '5%',
                bottom: '29%',
                top: '26%',
                containLabel: true
              },
              xAxis: {
                type: 'category',
                color: '#fff',
                boundaryGap: false,
                data: xName,
                axisLabel: {
                  textStyle: {
                    color: '#2772AA', //坐标值得具体的颜色
                  }
                },
              },
              yAxis: {
                type: 'value',
                axisLabel: {
                  textStyle: {
                    color: '#2772AA', //坐标值得具体的颜色
                  }
                },
                splitLine: {
                  lineStyle: {
                    // 使用深浅的间隔色
                    color: ['#333']
                  }
                },
                splitNumber: 3,
                // interval: 200,
              },
              tooltip: {
                trigger: 'item',
                axisPointer : {    // 坐标轴指示器，坐标轴触发有效
                  type : 'line'  // 默认为直线，可选为：'line' | 'shadow'
                }
              },
              series: [{
                data: ydata,
                type: 'line',
                smooth: true,
                itemStyle: {
                  color: '#74FCFF',
                },
                lineStyle: {
                  color: '#74FCFF',
                  width: 1
                },
                areaStyle: {
                  color: {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [{
                      offset: 0, color: 'rgba(116,252,255,0.6)' // 0% 处的颜色
                    }, {
                      offset: 1, color: 'rgba(116,252,255,0)' // 100% 处的颜色
                    }],
                    global: false // 缺省为 false
                  }
                }
              }]
            })
            this.option(trend)
          }
        })
      },
      // eCharts文字过长处理换行
      formatter(params){
				var newParamsName = "";// 最终拼接成的字符串
				var paramsNameNumber = params.length;// 实际标签的个数
				var provideNumber = 5;// 每行能显示的字的个数
				var rowNumber = Math.ceil(paramsNameNumber / provideNumber);// 换行的话，需要显示几行，向上取整
				/**
				 * 判断标签的个数是否大于规定的个数， 如果大于，则进行换行处理 如果不大于，即等于或小于，就返回原标签
				 */
				// 条件等同于rowNumber>1
				if (paramsNameNumber > provideNumber) {
					/** 循环每一行,p表示行 */
					for (var p = 0; p < rowNumber; p++) {
						var tempStr = "";// 表示每一次截取的字符串
						var start = p * provideNumber;// 开始截取的位置
						var end = start + provideNumber;// 结束截取的位置
						// 此处特殊处理最后一行的索引值
						if (p == rowNumber - 1) {
							// 最后一次不换行
							tempStr = params.substring(start, paramsNameNumber);
						} else {
							// 每一次拼接字符串并换行
							tempStr = params.substring(start, end) + "\n";
						}
						newParamsName += tempStr;// 最终拼成的字符串
					}
				} else {
					// 将旧标签的值赋给新标签
					newParamsName = params;
				}
				//将最终的字符串返回
				return newParamsName
      },
    }
  }

</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .tt {
    width: 100%;
    height: 100%;
    background: url("/static/big_show/background.jpg") no-repeat center center;
    background-size: 100% 100%;
  }
  .t-top {
    height: 16%;
    background: url("/static/big_show/title.png") no-repeat center;
    background-size: auto 100%;
  }
  .main {
    height: 84%;
    padding: 0 34px;
    overflow: hidden;
  }
  .left {
    width:32.5%;
    height:100%;
    float:left;
  }
  .right {
    width:66%;
    height:100%;
    float:right;
  }
  .left-top, .left-center {
    width: 100%;
    height: 26%;
    margin-bottom: 2%;
    box-sizing: border-box;
  }
  .module-title {
    height: 60px;
    position: relative;
    overflow: hidden;
    .l-h2-title {
      height: 60px;
      width: 246px;
      color: #0EFCFF;
      font-weight: 700;
      font-size: 20px;
      padding-top: 10px;
      padding-left: 20px;
      position: absolute;
      background: url("/static/big_show/title-left_bg.png") no-repeat;
    }
    .title-center_bg {
      height: 20px;
      margin-left: 246px;
      margin-right: 20px;
      margin-top: 40px;
      background: url("/static/big_show/titile-top_bg.png") repeat-x;
    }
    .title-right_bg {
      height: 60px;
      width: 20px;
      position: absolute;
      right: 0;
      bottom: 0;
      background: url("/static/big_show/angle_bg.png") no-repeat 0 40px;
    }
  }
  .module-center {
    display: flex;
    justify-content: space-around;
    padding: 0 2%;
    color: #fff;
    border-left: 1px solid #134d71;
    border-right: 1px solid #134d71;
    background-color: #0f031e2f;
    .f1 {
      text-align: center;
      flex: 20%;
      &:nth-child(n) {
        border-left: 1px solid rgba(19,80,116,1);
      }
    }
    .f4 {
      text-align: center;
      &:nth-child(2) {
        padding: 0 5%;
        border-left: 1px solid rgba(19,80,116,1);
        border-right: 1px solid rgba(19,80,116,1);
      }
      &:nth-child(3) {
        padding-right: 5%;
        border-right: 1px solid rgba(19,80,116,1);
      }
    }
    .f3 {
      font-size: 12px;
      margin-bottom: 24%;
    }
    .f2 {
      font-size: 16px;
      line-height: 20px;
      color: #0189F3;
    }
  }
  .left-bottom {
    height: 42%;
    // overflow: hidden;
    .module-center {
      height: 64%;
      // overflow: hidden;
      #trend-chars {
        width: 100%;
        height: 160%;
      }
    }
  }
  .module-bottom {
    position: relative;
    .bottom_bg_l {
      width: 20px;
      height: 20px;
      position: absolute;
      left: 0;
      background: url("/static/big_show/angle_bg.png") no-repeat 0 -20px;
    }
    .bottom_bg_c {
      height: 20px;
      margin: 0 20px;
      background: url("/static/big_show/bottom_c_bg.png") repeat-x;
    }
    .bottom_bg_r {
      width: 20px;
      height: 20px;
      position: absolute;
      right: 0;
      top: 0;
      background: url("/static/big_show/angle_bg.png") no-repeat 0 -40px;
    }
  }
  .right-top {
    display: flex;
    justify-content: space-between;
    box-sizing: border-box;
    height: 54%;
    margin-bottom: 0.6%;
    .module-center {
      height: 70%;
      text-align: center;
    }
    .knowledge,.data {
      width: 70%;
      height: 100%;
      position: relative;
    }
    .data {
      margin-left: 20px;
    }
    .module-title {
      .r-title-right_bg {
        height: 20px;
        width: 20px;
        position: absolute;
        left: 0;
        bottom: 0;
        background: url("/static/big_show/angle_bg.png") no-repeat 0 -60px;
      }
      .title-center_bg {
        height: 20px;
        margin-right: 275px;
        margin-left: 20px;
        margin-top: 40px;
        background: url("/static/big_show/titile-top_bg.png") repeat-x;
      }
      .r-h2-title {
        height: 60px;
        width: 275px;
        color: #0EFCFF;
        font-weight: 700;
        font-size: 20px;
        padding-top: 10px;
        padding-left: 100px;
        position: absolute;
        top: 0;
        right: 0;
        background: url("/static/big_show/title-right_bg.png") no-repeat;
      }
    }
  }
  .right-bottom {
    height: 42%;
    .menus {
      height: 100%;
    }
    .module-title {
      .r-title-right_bg {
        height: 20px;
        width: 20px;
        position: absolute;
        left: 0;
        bottom: 0;
        background: url("/static/big_show/angle_bg.png") no-repeat 0 -60px;
      }
      .title-center_bg {
        height: 20px;
        margin-right: 275px;
        margin-left: 20px;
        margin-top: 40px;
        background: url("/static/big_show/titile-top_bg.png") repeat-x;
      }
      .r-h2-title {
        height: 60px;
        width: 275px;
        color: #0EFCFF;
        font-weight: 700;
        font-size: 20px;
        padding-top: 10px;
        padding-left: 100px;
        position: absolute;
        top: 0;
        right: 0;
        background: url("/static/big_show/title-right_bg.png") no-repeat;
      }
    }
    .module-center {
      height: 64%;
    }
  }

  #bumenUpload-echars {
    width: 100%;
    height: 160%;
    margin: 0 auto;
  }

</style>
