<template>
  <div class="monitor-body">
    <div class="title">性能监控</div>
    <div class="filter-container r-menu" style="margin-top:20px;margin-left:20px;margin-right:20px">
      <div class="monitor">
        <el-select v-model="value" placeholder="cpu性能监测" :span="4">
          <el-option
            v-for="item in property"
            :key="item.value"
            :label="item.name"
            :value="item.value">
          </el-option>
        </el-select>
        <el-button type="primary" size="small" icon="el-icon-search" @click="getWarningInfo">查询</el-button>
      </div>
      <div class="monitor-chart">
        <div v-show="value == 0" id="cpu" style="width: 900px;margin: 0 auto;margin-top: 20px;"></div>
        <div v-show="value == 1" id="disk"></div>
        <div v-show="value == 2" id="memory" style="width: 900px;margin: 0 auto;margin-top: 20px;"></div>
        <p>{{titleName}}</p>
      </div>
      <el-dialog
        title="查询信息"
        :visible.sync="centerDialogVisible"
        width="50%"
        center>
        <el-table
          border stripe
          :data="tableList.rows"
          style="width: 100%"
          @selection-change="handleSelectionChange"
          :header-cell-style="{
              'background-color': '#f5f7fa',
              'color': 'rgb(103, 194, 58)',
               }"
        >
          <el-table-column
            prop="SYSTEM_SYS_CPU"
            label="Cpu占用率"
            width="120">
          </el-table-column>
          <el-table-column
            prop="SYSTEM_SYS_MEMORIES"
            label="内存占用率"
            width="120">
          </el-table-column>
          <el-table-column
            prop="SYSTEM_SYS_DISKS"
            label="磁盘占用率"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="SYSTEM_CREATE_TIME"
            label="警告时间"
            show-overflow-tooltip>
          </el-table-column>
        </el-table>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import {
  getCpuInfomation,
  getWarningInfoData
} from '@/api/login';
import moment from 'moment';
import echarts from "echarts";
export default {
  data() {
    return {
      // 列表数据条件
      pagesList: {
        pageNumber: 1,
        pageSize: 10
      },
      // 列表数据拉取
      tableList: {

      },
      // 性能监控
      timer: null,
      property: [
        {name: 'cpu性能监控', value: 0},
        {name: '磁盘检测', value: 1},
        {name: '内存检测', value: 2},
      ],
      value: 0,
      titleName: "cpu性能监控",
      // cpu监控
      option: {
        title: {
          text: "Cpu/Rom性能监控",
          x:'center',
        },
        xAxis: {
            type: 'category',
            data: []
        },
        yAxis: {
            type: 'value'
        },
        series: [{
            data: [],
            type: 'line'
        }]
      },
      // 磁盘监控
      diskList: {
        title: {
          text: '磁盘用量检测',
          x:'center'
        },
        color: ["#01BD55", "#03814A",'#FFD502'],
        tooltip: {
          trigger: 'item',
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
          orient: 'vertical',
          left: 'right',
          data: ['磁盘内存总量','磁盘内存剩余','磁盘已使用']
        },
        series: [{
          name: '磁盘状态',
          type: 'pie',
          radius : '55%',
          center: ['50%', '50%'],
          data:[
            {value: null, name:'磁盘已使用'},
            {value: null, name:'磁盘总量'},
            {value: null, name:'磁盘剩余'},
          ],
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }]
      },
      // 内存监控
      memory: {
        title: {
          text: "内存性能监控",
          x:'center',
        },
        xAxis: {
            type: 'category',
            data: []
        },
        yAxis: {
            type: 'value'
        },
        series: [{
            data: [],
            type: 'line'
        }]
      },
      // 查询
      centerDialogVisible: false,
      // 查询弹出框
      multipleSelection: []
    }
  },
  created() {
    this.getCpuInfo();
  },
  watch: {
    value(newValue, oldValue) {
      this.titleName = this.property[newValue].name;
    }
  },
  mounted() {
    const that = this;
    clearInterval(this.timer);
    this.timer = setInterval(function() {
      that.getCpuInfo();
      let time = new Date();
      time = moment(time).format('HH:mm:ss');
      if(that.option.xAxis.data.length > 5) {
        that.option.xAxis.data.shift();
        that.memory.xAxis.data.shift();
      }
      that.option.xAxis.data.push(time);
      that.memory.xAxis.data.push(time);
    },60000)
  },
  methods: {
    // 获取数据
    async getCpuInfo() {
      let res = await getCpuInfomation()
      console.log(res.data);
      if(this.option.series[0].data.length > 5) {
        this.option.series[0].data.shift();
      }
      this.option.series[0].data.push(Math.floor(res.data.cpu * 100));
      const styleOption = {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#6a7985"
            }
          }
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
      };
      this.option = {...this.option, ...styleOption}
      let cpuChart = echarts.init(document.getElementById("cpu"));
      cpuChart.setOption(this.option);
      // 磁盘监控
      let diskData = this.diskList.series[0].data;
      diskData[0].value = res.data.used;
      diskData[1].value = res.data.total;
      diskData[2].value = res.data.free;
      let diskChart = echarts.init(document.getElementById("disk"));
      diskChart.setOption(this.diskList);
      // 内存监控
      if(this.memory.series[0].data.length > 5) {
        this.memory.series[0].data.shift();
      }
      this.memory.series[0].data.push(res.data.rom);
      this.memory = {...this.memory, ...styleOption}
      let memoryChart = echarts.init(document.getElementById("memory"));
      memoryChart.setOption(this.memory);
    },
    async getWarningInfo() {
      this.centerDialogVisible = true;
      const res = await getWarningInfoData(this.pagesList);
      console.log(res);
      this.tableList = res.data.data;
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    }
  },
  beforeDestroy() {
    clearInterval(this.timer)
    this.timer = null
    this.value = 0
    this.titleName = "cpu性能监控"
    // cpu监控
    this.option = {
      title: {
        text: "Cpu/Rom性能监控",
        x:'center',
      },
      xAxis: {
          type: 'category',
          data: []
      },
      yAxis: {
          type: 'value'
      },
      series: [{
          data: [],
          type: 'line'
      }]
    },
    // 磁盘监控
    this.diskList = {
      title: {
        text: '磁盘用量检测',
        x:'center'
      },
      tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c} ({d}%)"
      },
      legend: {
        orient: 'vertical',
        left: 'right',
        data: ['磁盘内存总量','磁盘内存剩余','磁盘已使用']
      },
      series: [{
        name: '磁盘状态',
        type: 'pie',
        radius : '55%',
        center: ['50%', '60%'],
        data:[
          {value: null, name:'磁盘已使用'},
          {value: null, name:'磁盘总量'},
          {value: null, name:'磁盘剩余'},
        ],
        itemStyle: {
          emphasis: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }]
    }
  }
};
</script>

<style ref="stylesheet/scss" lang="scss" scoped>
  canvas{
    width:900px;
    height: 400px !important;
  }
.filter-container {
  .monitor {
    display: flex;
    height: 32px;
    .el-input__inner {
      width: 100px;
    }
    .el-button {
      margin-left: 14px;
    }
  }
  .monitor-chart {
    margin: 20px auto;
    p {
      font-size: 16px;
      text-align: center;
    }
  }
}

#cpu {
  width: 100%;
  height: 400px;
}

#memory {
  width: 900px;
  height: 400px;
}

#disk {
  width: 400px;
  height: 400px;
  margin: 0 auto;
}

</style>
