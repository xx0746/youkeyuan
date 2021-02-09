<template>
  <div>
    <div class="block">
      <div class="block_left">{{title}}</div>
      <div class="block_right" v-for="(item,index) in namelist" :key="index">
        <div class="divInput">
          <run-input :form="item" :value="value" @onblur="onblur"></run-input>
        </div>
        <div class="divIcon">
          <i
            v-if="dialogStatus=='add' && index != 0"
            class="el-icon-close"
            @click="deleteProperty(index)"
          ></i>
        </div>

      </div>
    </div>
    <div v-if="dialogStatus=='add'" style="margin-left:14%;">
      <el-button type="primary" size="small" icon="el-icon-plus" @click="addRowName">添加</el-button>
    </div>
  </div>
</template>

<script>
import runInput from '@/components/resetUpload/runInput'
export default {
  components: {
    runInput
  },
  name: 'dyn-input',
  props: {
    title: "",
    namelist: {
      type: Array,
    },
    value: "",
    dialogStatus: ""
  },
  data() {
    return {
      temp: 0,
      isRow:false
    }
  },
  methods: {
    onblur(val) {
      this.isRow = true;
      this.$emit('RowName',this.isRow) 
      console.log(this.isRow)
      this.temp = 0;
      this.namelist.forEach(item => {
        if(val == item[this.value]) {
          this.temp++;
        }
      });
      this.temp >= 2 ? this.$message.warning(this.title + '重复！'): this.temp = 0;

    },
    addRowName() {
      console.log(this.temp);
      if(this.temp >= 2) {
        this.$message.warning(this.title + '重复！');
      } else {
        this.$emit('add', this.namelist);
      }
      this.temp = 0;
    },
    deleteProperty(index) {
      this.temp = 0;
      this.$emit('del', index, this.namelist);
    }
  },
}
</script>

<style lang="scss" scoped>
  .block{
    overflow: hidden;
    .block_left{
      float:left;
      width:10%;
      line-height:32px;
    }
    .block_right{
      float:right;
      width:86%;
      display: flex;
      align-items: center;
      margin-bottom: 20px;
      overflow: hidden;
      .divInput {
        float: left;
        width: 92%;
        .el-input {
          width: 100%;
        }
      }
      .divIcon{
        float: left;
        width: 8%;
        text-align: right;
          .el-icon-close {
            float: right;
            cursor: pointer;
            font-size: 20px;
          }
          .el-icon-close:hover {
            float: right;
            color: red;
            font-size: 20px;
          }
      }
    }
  }
</style>
