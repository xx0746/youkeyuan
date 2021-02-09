<template>
  <div>
    <el-form ref="form" :model="form" :rules="rules" label-width="130px">
      <el-form-item label="所属资源目录">
        <el-cascader
          :options="options"
          change-on-select
          @change="sel"
          v-model="values"
        ></el-cascader>
      </el-form-item>
      <el-form-item label="文件列表">
        <file-list
          v-show="filesList.length !== 0"
          :data="filesList"
          @onPreview="review"
          class="file-list">
        </file-list>
        <el-button type="primary" v-show="!isEqual" size="mini" class="aditFile" @click="aditFile">文件维护</el-button>
      </el-form-item>
      <el-form-item label="下载是否审核">
        <template>
          <el-radio-group v-model="form.dataOne" @change="showValue">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="2">否</el-radio>
          </el-radio-group>
        </template>
      </el-form-item>
      <el-form-item v-show="isEqual" label="是否保留原有数据">
        <template>
          <el-radio-group v-model="form.isSave" @change="showValue">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="2">否</el-radio>
          </el-radio-group>
          <span style="color: red; margin-left: 24px;">* 如果保留原有数据，请修改标题。</span>
        </template>
      </el-form-item>
      <el-form-item prop="title" label="标题">
        <el-input v-model="form.title" :title="form.title" @change="showValue('title')"></el-input>
      </el-form-item>
      <el-form-item prop="tally" label="标签">
        <tag-selection :options="datas.value" :tags="tags" @tabTwoClick="selectClick"></tag-selection>
      </el-form-item>
      <el-form-item :label="item.columnName" v-for="(item, index) in form.columns" :key="index" class="info-item">
        <el-input v-model="item.value" @change="showValue('item')" :title="item.value"></el-input>
      </el-form-item>
    </el-form>
    <div class="elfooter">
      <el-button
        class="btn-width"
        type="primary4"
        size="small"
        @click="cancel"
        style="margin-right:50px;"
        >取消</el-button>
      <el-button
        class="btn-width"
        type="primary"
        size="small"
        @click="submitForm"
      >提交</el-button>
    </div>
  </div>
</template>

<script>
import {
  getFromMenuId
} from "@/api/resetReupload";
import {
  getlabelListAllData,
} from "@/api/manualupload";
import {
  getreSourceFiles,
  getRcodeInfo,
  setRcodeInfo,
  getColumns,
  getLabels
} from "@/api/resource_list";
import { Loading } from 'element-ui';
import { debounce } from '@/utils/Debounce'
import fileList from "@/components/fileList/fileList";
import tagSelection from "@/components/tagSelection/tagSelection";
export default {
  components: {
    fileList,
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
        dataOne: null,
        dataTwo: "",
        dataThree: null,
        columns: [ 
          // {label: "名称", value: "name"},
        ],
      },
      isEqual: false,
      isAdit: false,
      isChangeMenu: false,
      values: [],
      initmenuArr: '',
      tags: [],
      menuId: null,
      options: [],
      filesList: [],
      rules: {
        title: [
          {required: true, message: '标题名称不能为空！', trigger: 'blur'}
        ]
      }
    }
  },
  created() {
    this.getLeftTreeData();
    this.initFrom();
  },
  methods: {
    // 获取
    getLeftTreeData() {
      getlabelListAllData().then(res => {
        this.options = res.data.data[0].children;
      });
    },
    initFrom() {
      getRcodeInfo(this.datas).then(res => {
        if (res.data.code == 1) {
          let resObj = res.data.data;
          this.menuId = resObj.menuId;
          this.form = resObj;
          this.form.isSave = 1;
          if(resObj.dataThree == null) return this.$message.warning("所属资源目录层级为空，此条数据有误！");
          // 获取所属资源目录
          getFromMenuId(resObj.dataThree).then(result => {
            if(result.data.code == 1) {
              this.values = result.data.data.menuArray.split(",").map(item => {
                return Number(item);
              });
              this.initmenuArr = result.data.data.menuArray;
            } else {
              this.$message.error(result.data.msg);
            }
          })
          // 获取文件列表
          let filesParam = {
            menuId: resObj.dataThree,
            resourceId: this.datas.resourceId,
            type: this.datas.type
          };
          getreSourceFiles(filesParam).then(res => {
            if (res.data.code == 1) {
              this.filesList = res.data.data;
            } else {
              this.$message.error(res.data.msg);
            }
          });
          // 获取标签内容
          if(resObj.dataTwo !== "") {
            getLabels(resObj.dataTwo).then(data => {
              if (data.data.code == 1) {
                if(data.data.data != null) {
                  this.tags = data.data.data.map(item => {
                    return {
                      name: item.TYPENAME,
                      type: "",
                      id: item.LABELID
                    };
                  });
                }
              }
            });
          }
        } else {
          this.$message.warning(res.data.msg);
        }
      });
    },
    sel() {
      console.log(this.values);
      debounce(() => {
        if(this.initmenuArr == this.values.join(',')) {
          console.log(this.values.join(','),this.initmenuArr);
          this.$nextTick(_=> {
            this.isEqual = false
          })
        }
        if(this.isAdit) {
          this.$confirm('文件编辑信息还未保存，确定切换所属资源目录?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.getColumnsFn();
            this.isAdit = false;
          })
        } else {
          this.getColumnsFn();
        }
        this.isChangeMenu = true;
      }, 500)
    },
    getColumnsFn() {
      this.isAdit = false;
      this.form.columns = [];
      let dataThree = this.values[this.values.length-1];
      if(dataThree !== this.form.dataThree) {
        this.isEqual = true;
        this.form.dataThree = this.values[this.values.length-1];
        getColumns(this.form).then(res => {
          console.log(res);
          if(res.data.code == 1) {
            this.form.columns = res.data.data;
            if(this.form.columns.length == 0) {
              this.$message.warning("您所选择的目录属性为空！")
            }
          } else {
            this.$message.warning(res.data.msg);
          }
        })
      }
    },
    showValue(val) {
      // 检测是否编辑过输入框
      this.isAdit = true;
    },
    isAditInfo() {
      if(this.isAdit || this.isChangeMenu) {
        return true;
      } else {
        return false;
      }
    },
    // 点击预览
    review(row) {
      this.$emit('onPreview', row);
    },
    // 标签选择
    selectClick(par) {
      this.isAdit = true;
      this.form.dataTwo = par;
      console.log(this.form);
    },
    // 点击维护文件
    aditFile() {
      this.$emit("aditFile",this.datas, this.filesList, this.menuId);
    },
    cancel() {
      this.$emit('complete', false)
      // this.$message({
      //   type: 'success',
      //   message: '已取消编辑！'
      // });
    },
    submitForm() {
      setRcodeInfo(this.form).then(res => {
        if(res.data.code == 1) {
          this.$message.success('保存成功！');
          this.$emit('complete', true);
        } else {
          this.$message.error(res.data.msg);
        }
      })
    }
  },
}
</script>

<style scoped lang="scss">
  .aditFile{
    margin-top: 20px;
  };
  .elfooter {
    text-align: center !important;
    display: flex;
    justify-content: center;
  }
</style>
