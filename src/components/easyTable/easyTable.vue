<template>
  <div>
    <!-- 自定义模型表格 -->
    <v-table
      is-horizontal-resize
      style="width:100%;color:#333;text-align:center;"
      :columns="option"
      :table-data="tableData"
      row-click-color="#DFF1E8"
      :cell-edit-done="cellEditDone"
      @on-custom-comp="customCompFunc"
    ></v-table>
    <el-button v-if="add" class="add-btn" type="primary" size="small" icon="el-icon-plus" @click="addRowInfo">添加</el-button>
  </div>
</template>

<script>
import {
  getDataModelTypeList,
} from "@/api/datamanage";
import Debounce from '@/utils/Debounce'
import Vue from 'vue'
// 引入样式
import 'vue-easytable/libs/themes-base/index.css'
// 导入 table 和 分页组件
import { VTable } from 'vue-easytable';
export default {
  name: "easyTable",
  components:{
    VTable,
  },
  provide() {
    return {
      value: this.knowledge
    }
  },
  props:{
    isdefault: {
      type: Array,
      default: () => {
        return ['','1',0]
      }
    },
    add: {
      type: Boolean,
      default: false
    },
    options: {
      type: Array,
      default: _=> {
        return []
      }
    },
    //easyTable表格渲染数据
    tableData: {
      type: Array,
      default: _=> {
        return []
      }
    }
  },
  data(){
    return {
      knowledge: {
        value: '1',
        value1: 0,
      },
      //easyTable表格渲染的每一列
      columns:  [
        {field: 'columnComment', title:'属性名称', width: 100, titleAlign: 'center',columnAlign:'center',isEdit:true,isResize:true},
        {field: 'columnType', title: '属性类型', width: 150, titleAlign: 'center',columnAlign:'center',componentName:'adit-tr',isResize:true},
        {field: 'columnLength', title: '属性长度', width: 150, titleAlign: 'center',columnAlign:'center',componentName:'adit-length',isResize:true},
        {field: 'columnDesc', title: '属性描述', width: 150, titleAlign: 'center',columnAlign:'center',isEdit:true,isResize:true},
        {field: 'adit', title: '操作',width: 80, titleAlign: 'center',columnAlign:'center',componentName:'table-operation',isResize:true}
      ],
    }
  },
  computed: {
    option() {
      if(this.options.length == 0) {
        return this.columns
      } else {
        let arr = this.options.map((item, index) => {
          return {...this.columns[index], ...item}
        })
        return arr
      }
    }
  },
  mounted() {
    this.knowledge.value = this.isdefault[1];
    this.knowledge.value1 = this.isdefault[2];
  },
  methods:{
    // 单元格编辑回调
    cellEditDone(newValue,oldValue,rowIndex,rowData,field){
      this.tableData[rowIndex][field] = newValue;
      if(field !== 'columnComment') {
        if(this.tableData[rowIndex].columnType == "") {
          this.$message.warning("请先选择属性类型！");
        }
      }
      this.$emit('celledit', newValue)
    },
    // 单元格编辑处理函数
    customCompFunc(params){
      if (params.type === 'delete'){ // do delete operation
        this.removeTemple(params)
      } else if(params.type === 'select'){
        this.tableData[params.index].columnType = params.rowVlaue;
        if(params.rowVlaue != 'Varchar') {
          this.tableData[params.index].columnLength = '';
        }
      } else if(params.type === 'length') {
        this.tableData[params.index].columnLength = params.rowVlaue;
      }
      this.$emit('newDataList',this.tableData)
    },
    // 删除一条模板
    removeTemple(row) {
      this.$confirm("确定删除该条信息?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
      .then(() => {
        // 删除回调
        this.$emit('removecell', row)
        this.tableData.splice(row.index, 1);
        this.$message({
          type: "success",
          message: "删除成功!"
        });
      })
      .catch(() => {
        this.$message({
          type: "info",
          message: "已取消删除"
        });
      });
    },
    addRowInfo() {
      let obj = {
        columnComment: "",
        columnLength: "",
        columnType: "",
        columnDesc: "",
        state: 1
      };
      this.tableData.push(obj);
    },
  },
}
// 自定义列组件
Vue.component('table-operation',{
  // template:`<span>
  //           <i style="color:red;cursor:pointer;" @click="deleteRow(rowData,index)" class="el-icon-delete"></i>
  //         </span>`,
    template:`<el-button
                type="primary2"
                size="mini"
                @click="deleteRow(rowData,index)"
              >删除</el-button>`,
  props:{
    rowData:{
      type:Object
    },
    field:{
      type:String
    },
    index:{
      type:Number
    }
  },
  methods:{
    deleteRow(){
      // 参数根据业务场景随意构造
      let params = {type:'delete',index:this.index, rowData:this.rowData};
      this.$emit('on-custom-comp',params);
    }
  }
});
Vue.component('adit-tr',{
  template:`<select v-model="value">
              <option value="1" selected disabled style="display: none;">-- 请选择属性类型 --</option>
              <option v-for="item in dataTypeList" :value="item.TYPENAME" :key="item.id">{{ item.TYPEDESC }}</option>
            </select>`,
  inject: ['value'],
  data(){
    return {
      value: this.value.value,
      dataTypeList:[]
    }
  },
  props:{
    rowData:{
      type:Object
    },
    field:{
      type:String
    },
    index:{
      type:Number
    }
  },
  watch: {
    value(newVal, oldVal) {
      console.log(newVal)
      let params = {type:'select',index:this.index, rowData:this.rowData, rowVlaue: newVal};
      this.$emit('on-custom-comp',params)
    }
  },
  mounted() {
    this.getDataModelType()
  },
  methods: {
    // 获取属性类型
    async getDataModelType() {
      const res = await getDataModelTypeList();
      const {
        data: { data, code, msg }
      } = res;
      if (code == 1) {
        this.dataTypeList = data;
      } else {
        this.$message.warning(msg);
      }
    },
  },
});
Vue.component('adit-length',{
  template:`<el-input v-model="input" :disabled="isdisa" @change="getValue"></el-input>`,
  inject: ['value'],
  data(){
    return {
      input: this.value.value1,
      isdisa: true
    }
  },
  props:{
    rowData:{
      type:Object
    },
    field:{
      type:String
    },
    index:{
      type:Number
    }
  },
  watch: {
    'rowData.columnType': {   
      handler:function(newVal,oldVal){
        if(newVal === 'Varchar') {
          this.isdisa = false;
        } else {
          this.isdisa = true;
          this.input = null;
        }
      },
      deep:true,
      immediate: true
    }
  },
  methods: {
    getValue() {
      let reg = /^[0-9]+.?[0-9]*$/
      if (!reg.test(this.input) || this.input <= 0) {
          this.input = null;
          this.$message.error("属性长度必须为正整数！");
      } else {
        let params = {type:'length',index:this.index, rowData:this.rowData, rowVlaue: this.input};
        this.$emit('on-custom-comp',params)
      }
    },
  },
})
</script>
<style lang="scss" scoped>
</style>