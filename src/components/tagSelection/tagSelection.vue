<template>
  <div>
      <el-select v-model="tallyValue1" placeholder="请选择标签分组" @change="tabs" :style="{width: width}">
        <el-option
          v-for="item in tallyData.classify1"
          :key="item.id"
          :label="item.typeName"
          :value="item.id"
        ></el-option>
      </el-select>

      <el-select style="margin-left: 10px;" v-model="tallyValue2" placeholder="请选择标签内容" @change="tabsTwo" :style="{width: width}">
        <el-option
          v-for="item in tallyData.classify2"
          :key="item.id"
          :label="item.labelName"
          :value="item.id"
        ></el-option>
      </el-select>
      <div class="tagbox">
        <el-tag
          v-for="tag in tags"
          :key="tag.index"
          closable
          size="small"
          :type="tag.type"
          @close="handleCloseTag(tag)"
        >{{tag.name}}</el-tag>
      </div>
  </div>
</template>

<script>
import { 
  getTagListAllData,
  getTagcontentData 
} from "@/api/manualupload";
export default {
  name: "tag-selection",
  props: {
    options: '',
    tags: {
      type: Array,
      default: []
    },
    width: {
      type: String,
      default: '180px',
    },
  },
  data() {
    return {
      // 标签选择级联下拉数据
      tallyData: {
        classify1: [],
        classify2: []
      },
      tallyValue1: "",
      tallyValue2: "",
      tallyName1: "",
      tallyName2: "",
      tagsType: "success",
      isTag: false,
    };
  },
  computed: {
    tallyValueArr() {
      let arr = []
      arr = this.tags.map(item => {
        return item.id
      })
      return arr;
    }
  },
  mounted() {
    this.getTallyData1();
  },
  methods: {
    getTallyData1() {
      getTagListAllData().then(res => {
        if (res.data.data) {
          this.tallyData.classify1 = res.data.data;
        }
      });
    },
    tabs(id) {
      this.isTag = true;
      let data = { labelTypeId: id };
      getTagcontentData(data).then(res => {
        let obj = {};
        obj = this.tallyData.classify1.find(item => {
          return item.id === id;
        });
        this.tallyName1 = obj.typeName;
        this.tallyData.classify2 = res.data.data;
      });
      this.tallyValue2 = "";
      this.tallyName2 = "";
      this.$emit("tagSelect",this.isTag)
    },
    tabsTwo(id) {
      // 判断添加的标签是否重复
      this.isTag = true;
      this.$emit("tagSelect",this.isTag)
      let temp = true;
      for (let i = 0; i < this.tags.length; i++) {
        if (id === this.tags[i].id) {
          temp = false;
        }
      }
      if (temp) {
        let obj2 = {};
        obj2 = this.tallyData.classify2.find(item => {
          return item.id === id;
        });
        this.tallyName2 = obj2.labelName;
        this.tags.push({
          name: this.tallyName1 + ":" + this.tallyName2,
          type: "success",
          id: id
        });
        console.log(this.tags)
        let arr =[];
        this.tags.forEach((item,index) => {
          arr.push(item.name)
        });
        this.$emit('tabTwoClick', this.tallyValueArr.join(","),arr.join(","));
      } else {
        this.$message.warning("不可选择重复标签");
        this.tallyName2 = "";
        this.tallyValue2 = "";
      }
    },
    handleCloseTag(tag) {
      this.tags.splice(this.tags.indexOf(tag), 1);
      this.$emit('tabTwoClick', this.tallyValueArr.join(","));
      this.tallyName2 = "";
      this.tallyValue2 = "";
    }
  }
};
</script>

<style>
</style>
