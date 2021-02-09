<template>
  <div>
    <select v-model="value">
      <option value="1" selected disabled style="display: none;">-- 请选择属性类型 --</option>
      <option v-for="item in dataTypeList" :value="item.TYPENAME" :key="item.id">{{ item.TYPEDESC }}</option>
    </select>
  </div>
</template>

<script>
import { getDataModelTypeList } from "@/api/datamanage";
export default {
  name: 'adit-tr',
  data(){
    return {
      value: "1",
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
      console.log(newVal);
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
}
</script>

<style>

</style>
