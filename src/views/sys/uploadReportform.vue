<template>
  <div>
    <div class="title" style="margin-top:0px">单用户上传情况统计</div>
    <div class="block">
        <el-input class="input_user" v-model.trim="userName" clearable placeholder="用户名称" id="userName"></el-input>
        <el-date-picker
        v-model="value1"
        type="date"
        id="value1"
        placeholder="选择日期">
      </el-date-picker>
      <span>—</span>
      <el-date-picker
        v-model="value2"
        type="date"
        id="value2"
        placeholder="选择日期">
      </el-date-picker>
        <el-button icon="el-icon-search" type="primary" size="small" style="margin-left:10px;" @click="resultUserData">查询</el-button>
        <el-button type="primary" size="small" @click="exportExcel">导出</el-button>
        
    </div>
    <div style="padding: 0 20px 20px;">
      <el-table id="tb"   v-if="isShowTable"  :data="storageUserData"  style="width: 100%;">
        <el-table-column  type="index"  label="序号"  width="60px"  ></el-table-column>
        <el-table-column  prop="name"  label="用户名"></el-table-column>
        <el-table-column  prop="jjname"  label="机构名称"  width="300"></el-table-column>
        <el-table-column  label="总量">
           <template slot-scope="scope">
              <span>{{scope.row.tolalNum==null?"0":scope.row.tolalNum}}</span>
            </template>
        </el-table-column>
        <el-table-column label="知识专区">
          <el-table-column label="论文">
            <template slot-scope="scope">
              <span>{{scope.row.lunwenNum==null?"0":scope.row.lunwenNum}}</span>
            </template>
          </el-table-column>
          <el-table-column label="案例">
            <template slot-scope="scope">
              <span>{{scope.row.anliNum==null?"0":scope.row.anliNum}}</span>
            </template>
          </el-table-column>
          <el-table-column label="成果">
            <template slot-scope="scope">
              <span>{{scope.row.chenguoNum==null?"0":scope.row.chenguoNum}}</span>
            </template>
          </el-table-column>
          <el-table-column label="图书">
            <template slot-scope="scope">
              <span>{{scope.row.tushuNum==null?"0":scope.row.tushuNum}}</span>
            </template>
          </el-table-column>
          <el-table-column label="知识产权">
            <template slot-scope="scope">
              <span>{{scope.row.zhishichanquanNum==null?"0":scope.row.zhishichanquanNum}}</span>
            </template>
          </el-table-column>
          <el-table-column label="标准">
            <template slot-scope="scope">
              <span>{{scope.row.biaozhunNum==null?"0":scope.row.biaozhunNum}}</span>
            </template>
          </el-table-column>
          <el-table-column label="实验室">
            <template slot-scope="scope">
              <span>{{scope.row.shiyanshiNum==null?"0":scope.row.shiyanshiNum}}</span>
            </template>
          </el-table-column>
          <el-table-column label="图片">
            <template slot-scope="scope">
              <span>{{scope.row.tupianNum==null?"0":scope.row.tupianNum}}</span>
            </template>
          </el-table-column>
          <el-table-column label="视频">
            <template slot-scope="scope">
              <span>{{scope.row.shipingNum==null?"0":scope.row.shipingNum}}</span>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="数据专区">
          <el-table-column label="科研">
            <template slot-scope="scope">
              <span>{{scope.row.keyanNum==null?"0":scope.row.keyanNum}}</span>
            </template>
          </el-table-column>
          <el-table-column label="宏观">
            <template slot-scope="scope">
              <span>{{scope.row.hongguanNum==null?"0":scope.row.hongguanNum}}</span>
            </template>
          </el-table-column>
          <el-table-column label="金融">
            <template slot-scope="scope">
              <span>{{scope.row.jinrongNum==null?"0":scope.row.jinrongNum}}</span>
            </template>
          </el-table-column>
          <el-table-column label="物流">
            <template slot-scope="scope">
              <span>{{scope.row.wuliuNum==null?"0":scope.row.wuliuNum}}</span>
            </template>
          </el-table-column>
        </el-table-column>
      </el-table>
      <div v-else-if="isShowTable == false">数据正在努力加载中...</div>
    </div>
  </div>
</template>

<script>
  import XLSX from 'xlsx';
  import { storageInfoByUser } from "@/api/Reportform";
  export default {
    data() {
      return {
        artic:{
          userName:null
        },
        storageUserData:[],
        userName:'',
        value1: '',
        value2: '',
        isShowTable: false,
      }
    },
    mounted() {
      this.resultUserData();
    },
    methods: {
      resultUserData(){
        let that = this;
        this.artic.userName = $('#userName').val();
        this.artic.endDate = $('#value2').val();
        this.artic.beginDate =$('#value1').val();
        console.log( this.artic);
        storageInfoByUser(this.artic).then(res => {
          if(res.status == 200){
            this.isShowTable = true;
            that.storageUserData = res.data.storageInfo
          }
        });
      },
      // 导出表格
      exportExcel() {
        const tb = document.getElementById('tb');
        let sheet = XLSX.utils.table_to_sheet(tb);
        saveAs(sheet2blob(sheet), '单用户上传情况统计.xlsx');

        function saveAs(obj, fileName) {
          const a = document.createElement('a');
          document.body.appendChild(a);
          a.download = fileName || '下载';
          a.href = URL.createObjectURL(obj);
          a.click();
          setTimeout(() => {
            URL.revokeObjectURL(obj);
            document.body.removeChild(a);
          }, 100);
        };
        // 将一个sheet转成最终的excel文件的blob对象，然后利用URL.createObjectURL下载
        function sheet2blob(sheet, sheetName) {
          sheetName = sheetName || 'sheet1';
          let workbook = {
            SheetNames: [sheetName],
            Sheets: {}
          };
          workbook.Sheets[sheetName] = sheet;
          // 生成excel的配置项
          let wopts = {
            bookType: 'xlsx', // 要生成的文件类型
            bookSST: false, // 是否生成Shared String Table，官方解释是，如果开启生成速度会下降，但在低版本IOS设备上有更好的兼容性
            type: 'binary'
          };
          let wbout = XLSX.write(workbook, wopts);
          let blob = new Blob([s2ab(wbout)], {type: "application/octet-stream"});

          // 字符串转ArrayBuffer
          function s2ab(s) {
            let buf = new ArrayBuffer(s.length);
            let view = new Uint8Array(buf);
            for (let i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
            return buf;
          }

          return blob;
        }
      },
    },
  }
</script>

<style scoped rel="stylesheet/scss" lang="scss">
  .block {
    width: 100%;
    align-items: center;
    padding: 20px
  }
  .input_user{
    width: 200px;
    margin-right: 10px;
  }
  .el-date-editor.el-input, .el-date-editor.el-input__inner {
    width: 180px;
}
</style>
