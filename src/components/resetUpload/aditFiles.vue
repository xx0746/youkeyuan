<template>
  <div class="subject">
    <div class="filetree">
      <z-tree
        ref="ztree"
        class="aditfile-ztree"
        :fileTreeData="treeData.treeList"
        :isShow="false"
        :isShowNum="false"
        :isPreview="false"
        :isShowDetails="false"
        v-if="showTree"
        @treeClick="clickTreeNode"
      ></z-tree>
    </div>
    <div class="fileform">
      <el-form ref="form" :model="form" label-width="100px">
        <p v-show="fileTitle.length == 0" style="color: red;">* 请从左侧文件列表选择文件进行维护</p>
        <el-form-item label="文件" v-show="fileTitle.length != 0">
          <file-list v-if="fileShow" :data="fileTitle" class="filetitle" @onPreview="review"></file-list>
        </el-form-item>
        <el-form-item label="标签" v-if="fileShow">
          <tag-selection :tags="tags" @tabTwoClick="selectClick" width="160px"></tag-selection>
        </el-form-item>
        <el-form-item :label="item.columnName" v-for="(item, index) in form.columns" :key="index" class="adit-item info-item">
          <el-input v-model="item.value" @change="showValue" :title="item.value"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small" v-if="fileShow" @click="submitForm" >保存</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import {
  getFileInfo,
  setFileInfo,
  getLabels
} from "@/api/resource_list";
import { Loading } from 'element-ui';
import zTree from "@/components/zTree/zTree";
import tagSelection from "@/components/tagSelection/tagSelection";
import fileList from "@/components/fileList/fileList";
export default {
  name: "adit-files",
  components: { zTree, tagSelection, fileList },
  props: {
    treeData: {
      type: Object,
      default: {}
    },
    fileList: {
      type: Array,
      default: []
    },
    expandData: {
      type: Object
    }
  },
  data() {
    return {
      showTree: true,
      form: {
        dataTwo: "",
        columns: [ 
          // {label: "名称", value: "name"},
        ],
      },
      tags: [],
      fileShow: false,
      fileTitle: [],
      isSave: true,
    }
  },
  mounted() {
    console.log(this.treeData.treeList);
    // this.initform(this.treeData.treeList[0]);
  },
  methods: {
    initInfo(row) {
      let param = {
        fileId: row.id,
        menuId: this.treeData.menuId
      }
      getFileInfo(param).then(res => {
        if(res.data.code == 1) {
          this.form = res.data.data;
          // 获取标签内容
          if(this.form.labelIds !== "" && this.form.labelIds != null) {
            getLabels(this.form.labelIds).then(data => {
              if (data.data.code == 1) {
                this.tags = data.data.data.map(item => {
                  return {
                    name: item.TYPENAME,
                    type: "",
                    id: item.LABELID
                  };
                });
              }
            });
          }
        } else {
          this.$message.error(res.data.msg);
        }
      })
    },
    clickTreeNode(param, node, event) {
      let a = document.querySelectorAll('.node_name');
      if(!this.isSave) {
        this.$confirm('文件编辑信息还未保存，确定切换?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          a.forEach(item => {
            item.classList.remove('active');
          })
          let span = event.target;
          span.classList.add('active')
          this.initform(param);
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消切换'
          });
        });
      } else {
        a.forEach(item => {
          item.classList.remove('active');
        })
        let span = event.target;
        span.classList.add('active')
        this.initform(param);
      }
    },
    // 初始化函数
    initform(param) {
      console.log(param)
      this.form = {
        dataTwo: "",
        columns: []
      },
      this.tags = [];
      this.isSave = true;
      this.fileShow = false;
      // 获取文件所需参数
      this.fileList.forEach(item => {
        if(item.id == param.menuId) {
          this.initInfo(item);
          // 预览文件所需参数
          let file = {
            id: param.menuId,
            fileName: param.menuName,
            fileDir: param.menuName,
            fileUrl: item.fileUrl
          }
          this.$nextTick(_ => {
            this.fileTitle[0] = file;
            this.fileShow = true;
          })
        } else {
          this.fileTitle = [];
        }
      });
    },
    // 标签选择
    selectClick(pra) {
      this.isSave = false;
      this.form.dataTwo = pra;
      this.form.labelIds = pra;
    },
    showValue() {
      this.isSave = false;
    },
    // 抛出是否操作的校验
    isAudit() {
      return this.isSave;
    },
    submitForm() {
      this.form.menuId = this.treeData.menuId;
      setFileInfo(this.form).then(res => {
        console.log(res);
        if(res.data.code == 1) {
          this.isSave = true;
          this.$message.success('保存成功！');
        } else {
          this.$message.error(res.data.msg);
        }
        this.$emit('complete', true)
      })
    },
    // 点击预览
    review(row) {
      this.$emit('onPreview', row);
    },
  },
}
</script>

<style lang="scss" scoped>
  .subject {
    display: flex;
    justify-content: space-between;
    .filetree {
      margin-right: 20px;
    }
    .fileform {
      min-width: 50%;
      border-left: 1px solid #c4c9d0;
      padding: 0 0px 0 30px;
    }
  }
  .filetitle {
    margin-top: 6px;
  }
  .filetitle /deep/ .file_list{
    border: none;
  }
  .aditfile-ztree /deep/ .node_name {
    max-width: 280px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }

</style>


