<template>
<div>
  <div v-if="styleType == 'dataSet'">
    <el-col :span="24"   v-for="(item, index) in formdataSet" :key="index">
      <el-form-item label="选择要整合的数据集" prop="dataSet">
        <el-autocomplete
          class="inline-input"
          v-model="item.dataSet"
          :fetch-suggestions="querySearchData"
          placeholder="请输入或选择数据集"
          @select="handleSelect"
          clearable
        ></el-autocomplete>
        <i class="el-icon-close"  @click="deleteDataSet(item, index)"></i>
      </el-form-item>
    </el-col>
  </div>
  <div v-else-if="styleType == 'field'">
    <el-col :span="24" v-for="(item, index) in formdata" :key="index">
      <el-form-item label="选择数据集字段" prop="field">
        <el-select v-model="item.field" placeholder="请选择数据集字段">
          <el-option-group
              v-for="group in fields"
              :key="group.label"
              :label="group.label">
              <el-option
                v-for="item in group.options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-option-group>
        </el-select>
        <i class="el-icon-close"  @click="deleteField(item, index)"></i>
      </el-form-item>
    </el-col>
  </div>
  <div v-else-if="styleType == 'chars'">
    <el-col :span='24' class="chars-box" v-for="(item,index) in charsList" :key="index">
      <span class="chars">替换原有字符</span><el-input v-model="item.originalchar"  placeholder="请输入内容"/><span class="chars-replace">为</span><el-input v-model="item.replacechar" placeholder="请输入内容"/> <i class="el-icon-close"  @click="deleteChars(item, index)"></i>
    </el-col>
  </div>
</div>
</template>
<script>
export default {
  props:{
    styleType: {
      default: 'dataSet', // icon | btn
    },
    formdataSet:{
      type: Array,
      default() {
        return []
      }
    },
    formdata:{
      type: Array,
      default() {
        return []
      }
    },
    fields:{
      type: Array,
      default() {
        return []
      }
    },
    dataSetfield:{
      type: Array,
      default() {
        return []
      }
    },
    charsList:{
      type: Array,
      default() {
        return []
      }
    },
  },
  data() {
    return {
      restaurantsData:[],
    }
    
  },
  mounted(){
  },
  methods: {
    querySearchData(queryString, cb) {
      this.restaurantsData = this.dataSetfield;
      var restaurantsData = this.restaurantsData;
      var results = queryString ? restaurantsData.filter(this.createFilter(queryString)) : restaurantsData;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createFilter(queryString) {
      return (restaurant) => {
        return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
      };
    },
    deleteDataSet(val, index){
      this.$emit('deleteDataSet', index, this.formdataSet);
    },
    deleteField(val, index){
      this.$emit('deleteField', index, this.formdata);
    },
    handleSelect(item) {
      console.log(item);
    },
    deleteChars(val, index){
      this.$emit('deleteChars', index, this.charsList);
    }
  }
}
</script>
<style  rel="stylesheet/scss" lang="scss" scoped>
.el-icon-close{
  font-size: 20px;
  color:red;
  padding-left: 10px;
  vertical-align: sub;
}
.chars-main{
  overflow: hidden;
  .chars-box{
    margin: 10px 0;
    .chars{
      padding: 0 10px 0 0;
      line-height: 32px;
    }
    .chars-replace{
      padding: 0 10px;
      line-height: 32px;
    }
  }
}
</style>    