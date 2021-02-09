<template>
  <div>
    <div class="title">资源更新记录</div>

    <div class="filter-container r-menu" style="margin-top:20px;margin-left:20px;margin-right:20px">
      <el-input style="width: 200px;" class="filter-item" placeholder="请输入资源名称"></el-input>
      <el-button type="primary" size="small" icon="el-icon-search" style="margin-left:10px">查询</el-button>

      <el-table
        :data="list"
        row-key="id"
        style="margin-top:20px;"

        border
        fit
        highlight-current-row
        :header-cell-style="{
              'background-color': '#f5f7fa',
              'color': 'rgb(103, 194, 58)',
               }"
      >
        <el-table-column type="selection" align="center" width="55"></el-table-column>

        <el-table-column align="center" width="60px" label="序号">
          <template slot-scope="scope">
            <span>{{scope.$index+1}}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="资源名称">
          <template slot-scope="scope">
            <div style="text-align:left;">{{scope.row.title}}</div>
          </template>
        </el-table-column>

        <el-table-column align="center" label="所属资源库">
          <template slot-scope="scope">
            <span>{{scope.row.sendTime}}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="上传日期">
          <template slot-scope="scope">
            <span>{{scope.row.author}}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="操作" fixed="right">
          <template>
            <i class="el-icon-download" style="color:#009A52"></i>
            <i class="el-icon-delete" style="color:red;margin-left:20px"></i>
          </template>
        </el-table-column>
      </el-table>

      <div class="block">
        <el-pagination
          style="text-align: center"
          :page-sizes="[100, 200, 300, 400]"
          :page-size="100"
          layout="total, sizes, prev, pager, next, jumper"
          :total="400"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
// import API from '../../api/api_enterprise'
export default {
  data() {
    return {
      list: [
        {
          author: "易车车",
          imgBannerUrl:
            "http://140.143.209.80/group1/M00/00/02/rBUQEVu9yOmARpOGAAX2e0TG8rI627.png",
          praiseNum: 15,
          informationId: 17,
          title: "关注校园交通安全全顺校车安心相伴",
          informationTypeName: "校车",
          informationType: 2,
          sendTime: "2018-10-10",
          commentNum: 0,
          informationBrief:
            "不符合“专用" +
            "校车标准”的校车，一律不得核发检验合格标志，禁止运载小学生和幼儿",
          state: "显示",
          commodityUrl:
            "https://dafrok.github.io/vue-baidu-map/#/zh/bmaplib/lushu",
          thumbnailUrl:
            "http://140.143.209.80/group1/M00/00/02/rBUQEVu9yOCAC7ugAAX2e0TG8rI954.png",
          lookNum: 171
        },
        {
          author: "平安校车",
          imgBannerUrl:
            "http://140.143.209.80/group1/M00/00/02/rBUQEVu9yVSAAX43AABp8ZptUdc791.jpg",
          praiseNum: 6,
          informationId: 18,
          title: "马云谈乡村教育:邀企业家做校舍校车计划",
          informationTypeName: "校车",
          informationType: 2,
          sendTime: "2018-10-10",
          commentNum: 0,
          informationBrief:
            "017马云乡村教师奖年度颁奖典礼”今日在海南三亚举办，马云等出席将为100位2017年度获奖教师现场颁奖",
          state: "显示",
          thumbnailUrl:
            "http://140.143.209.80/group1/M00/00/02/rBUQEVu9yVGAJvAbAABp8ZptUdc322.jpg",
          lookNum: 106
        },
        {
          author: "平安校车",
          imgBannerUrl:
            "http://140.143.209.80/group1/M00/00/02/rBUQEVu91XGADAZRAAgrrAFlEdw188.png",
          praiseNum: 6,
          informationId: 20,
          title: "大黄车校车的发展史",
          informationTypeName: "校车",
          informationType: 2,
          sendTime: "2018-10-10",
          commentNum: 0,
          informationBrief:
            "早在汽车发明之前，美国就有了专门接送学生的马拉校车。顾名思义，也就是我们所谓的马车了。第一个生产校车的公司叫做Wayne Works，在1837年就开始生产了一种可以乘坐25个小孩子的马车，专门用来接送学生。在1886年前后，人们就称这种马车为“School cars”或“School trucks”了。",
          state: "显示",
          commodityUrl: "",
          thumbnailUrl:
            "http://140.143.209.80/group1/M00/00/02/rBUQEVu91P2AR3VhAAgrrAFlEdw642.png",
          lookNum: 94
        },
        {
          author: "嘟嘟校车",
          imgBannerUrl:
            "http://140.143.209.80/group1/M00/00/03/rBUQEVwluGeAUCEkAADEVaUhg1A425.jpg",
          praiseNum: 2,
          informationId: 27,

          title: "育儿焦虑成灾，90％的父母踩坑！",
          informationTypeName: "教育",
          informationType: 1,
          sendTime: "2018-12-28",
          commentNum: 0,
          informationBrief: "根据儿童思维的发展来陪伴孩子成长",
          state: "显示",
          commodityUrl:
            "https://dafrok.github.io/vue-baidu-map/#/zh/bmaplib/lushu",
          thumbnailUrl:
            "http://140.143.209.80/group1/M00/00/03/rBUQEVwluAaAFzYJAAEeMdYPBmQ929.jpg",
          lookNum: 53
        }
      ],
      listQuery: {
        pageNumber: 1,
        title: "",
        limit: 10
      },
      total: null
    };
  },
  created: function() {},
  mounted() {
  },
  methods: {
  }
};
</script>
<style scoped>

.device-table {
  overflow-x: scroll;
}
.icon_sub {
  display: block;
  margin-top: 6px;
}
.line_date {
  text-align: center;
}

.lv {
  border: none;
  background: #009a52;
  color: white;
}

.lv:hover {
  color: white;
  background: #127714;
}
</style>
