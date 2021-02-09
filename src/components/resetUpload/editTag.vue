<template>
  <div>
    <el-form ref="form" :model="form" label-width="110px" style="width:80%;margin-left:30px;">
      <el-form-item label="数据集名称">
        <input type="text"  v-model="form.dataName">
      </el-form-item>
      <el-form-item label="数据模板">
        <input type="text"  v-model="form.dataTemplate">
      </el-form-item>
      <el-form-item label="下载是否审核" label-width="120px">
        <template>
          <el-radio v-model="form.dataOne" :label="1">是</el-radio>
          <el-radio v-model="form.dataOne" :label="2">否</el-radio>
        </template>
      </el-form-item>
      <!-- <el-form-item prop="tally" label="标签">
        <tag-selection :options="datas.value" @tabTwoClick="selectClick"></tag-selection>
      </el-form-item>
      <el-form-item :label="item.columnName" v-for="(item, index) in form.columns" :key="index">
        <el-input v-model="item.value" @blur="showValue" :title="item.value"></el-input>
      </el-form-item>
      <el-form-item style="text-align: center;">
        <el-button type="primary4" style="margin-right:100px;" @click="aditFile">文件维护</el-button>
        <el-button
          type="primary"
          @click="submitForm"
        >提 交</el-button>
      </el-form-item> -->
    </el-form>
  </div>
</template>

<script>
import tagSelection from "@/components/tagSelection/tagSelection";
export default {
  components: {
    tagSelection,
  },
  props: {
    datas: {
      type: Object,
    },
  },
  data() {
    return {
      form: {
        dataName:'',
        dataTemplate:'',
        dataOne: null,
        dataTwo: "",
        dataThree: null,
        columns: [ 
          // {label: "名称", value: "name"},
        ],
      },
    }
  },
  created() {
  },
  methods: {
    // 标签选择
    selectClick(par) {
      this.form.dataTwo = par;
      console.log(this.form);
    },
  },
}
</script>

<style>

</style>
