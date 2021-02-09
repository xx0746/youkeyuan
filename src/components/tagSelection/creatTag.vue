<template>
<div>
  <div class="block">
    <div class="block_left" >标签: </div>
    <div class="block_right" v-for="(item, index) in formdata" :key="index">
      <el-row>
          <el-select v-model="item.labelTypeId" @change="itemChange(item)" filterable placeholder="可搜索标签分组" style="float:left;width:30%;margin-right:10px;">
            <el-option
              v-for="item1 in list"
              :key="item1.id"
              :label="item1.typeName"
              :value="item1.id">
            </el-option>
          </el-select>
          <el-input v-model="item.labelName" @change="onblur(item)" placeholder="请输入标签名称" style="float:left;width:60%;"></el-input>
          <i
            v-if="editState == '添加标签' && index != 0"
            class="el-icon-close"
            @click="deleteTag(item, index)"
          ></i>
      </el-row>
    </div>
  </div>  
    <div v-if="editState == '添加标签'" style="margin-left:10%">
      <el-button type="primary" size="small" icon="el-icon-plus" @click="addRowName">添加</el-button>
    </div>
</div>
</template>

<script>
export default {
  name: 'creat-tag',
  props: {
    list: {
      type: Array,
      default: []
    },
    editState: {
      type: String,
      default: "添加标签"
    },
    formdata: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      temp: 0,
      isLabelName: false
    }
  },
  mounted() {
    console.log(this.formdata);
  },
  methods: {
    deleteTag(val, index) {
      this.formdata.splice(index, 1);
      this.onblur(val);
      this.$emit('del', index, this.formdata);
    },
    addRowName() {
      if(this.temp >= 2) {
        this.$message.warning('相同标签分组下，标签名称重复！');
      } else {
        this.$emit('add', this.formdata);
        this.temp = 0
      }
    },
    itemChange(val) {
      this.onblur(val);
    },
    onblur(val) {
      this.isLabelName = true;
      console.log(val);
      this.temp = 0;
      this.formdata.forEach((item) => {
        if(val.labelName == item.labelName) {
          if(val.labelTypeId == item.labelTypeId) {
            this.temp++;
          }
        }
      });
      this.temp >= 2 && val.labelName != '' ? this.$message.warning('相同标签分组下，标签名称重复！'): this.temp = 0;
      this.$emit('labelName', this.isLabelName);
      console.log(this.isLabelName)
    }
  },
}
</script>

<style lang="scss" scoped>
  .el-icon-close {
    cursor: pointer;
    font-size: 20px;
    vertical-align: middle;
  }
  .el-icon-close:hover {
    color: red;
    font-size: 20px;
  }
  .block{
    overflow: hidden;
    line-height: 32px;
  }
  .block_left{
    float:left;
    width:10%;
  }
  .block_right{
    float:right;
    width:90%;
    margin-bottom: 20px;
    overflow: hidden;
  }
  .block_right i {
    float:right;
    margin-top: 8px;
  }
</style>
