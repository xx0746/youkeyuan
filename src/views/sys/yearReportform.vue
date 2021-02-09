<template>
  <div>
    <div class="title" style="margin-top:0px">年度入库情况统计</div>
    <div class="block">
      <div style="margin-right:20px">年份:</div>
      <div>
        <el-date-picker
          v-model="value1"
          type="year"
          id="yearvalue"
          placeholder="选择年份">
        </el-date-picker>
        <el-button icon="el-icon-search" type="primary" size="small" style="margin-left:10px" @click="resultcenterdata">查询</el-button>
        <el-button type="primary" size="small" @click="exportExcel()">导出</el-button>
      </div>
    </div>
    <div style="padding: 0 20px 20px;">
      <el-table
        v-if="isShowTable"
        :data="ReportformData"
        id="tb"
        style="width: 100%;" class="a">
        <el-table-column
          type="index"
          label="序号"
          width="60px"
          >
        </el-table-column>
        <el-table-column
          prop="name"
          label="机构名称"
          width="260">
        </el-table-column>
        <el-table-column v-for="(item, index) in formHeader" :key="index" :label="item.MENUNAME">
          <el-table-column :prop="item.MENUNAME + '.FILENUM'" label="入库文件总量"  width="120"></el-table-column>
          <el-table-column :prop="item.MENUNAME + '.FILESIZE'" label="存储大小"></el-table-column>
        </el-table-column>
      </el-table>
      <div v-else-if="isShowTable == false">数据正在努力加载中...</div>
    </div>
  </div>
</template>
<script>
  import XLSX from 'xlsx';
  // import FileSaver from 'file-saver';
  import { storageInfoByYear } from "@/api/Reportform";

  import 'blob.js'
  export default {
    data(){
      return{
        artic:{
          year:null
        },
        formHeader:[],
        ReportformData:[],
        header:[],
        value1: '',
        value2: '',
        isShowTable: false
      }
    },
    mounted(){
      this.resultcenterdata();
    },
    methods:{
      resultcenterdata(){
        this.artic.year = $('#yearvalue').val();
        storageInfoByYear(this.artic).then(res => {
          console.log(res);
          if(res.status == 200) {
            let arr = [];
            let downloadNum =res.data.storageInfo;
            console.log(downloadNum,'1111')
            arr = downloadNum.map(item => {
              let name = Object.keys(item)[0];
              let children = item[name];
              let obj = {name: name};
              children.forEach(item1 => {
                obj[item1.MENUNAME] = item1;
              })
              return obj;
            });
            console.log(arr);
            arr.splice(arr.length - 1, 1);
            this.ReportformData = arr;
            // 此步骤只是为了取到二级表头的表头文本内容，进行循环渲染，跟机构无关
            this.formHeader = downloadNum[0][arr[0].name];
            console.log(this.formHeader)
            this.isShowTable = true;
          } else {
            this.$message.error(res.data.msg);
          }
        });
      },
      exportExcel(){
        const tb = document.getElementById('tb');
        let sheet = XLSX.utils.table_to_sheet(tb);
        saveAs(sheet2blob(sheet), '年度入库情况统计.xlsx');

        function saveAs(obj, fileName) {
          const a = document.createElement('a');
          document.body.appendChild(a);
          a.download = fileName || '下载';
          a.href = URL.createObjectURL(obj);
          console.log(a);
          a.click();
          setTimeout(()=> {
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
            let blob = new Blob([s2ab(wbout)], {type:"application/octet-stream"});
            // 字符串转ArrayBuffer
            function s2ab(s) {
                let buf = new ArrayBuffer(s.length);
                let view = new Uint8Array(buf);
                for (let i=0; i!=s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
                return buf;
            }
            return blob;
        }
      },
    }
  }
</script>

<style scoped rel="stylesheet/scss" lang="scss">
  .block{display: flex;align-items: center;padding: 20px}
</style>
