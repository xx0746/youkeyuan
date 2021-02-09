<template>
  <div>
    <div :class="menuClass">
      <p class="title-size">资源目录</p>
      <p v-if="menuClass !== ''">(切换查看各目录的待审核记录)</p>
    </div>
    <el-tree
      :data="dataTree"
      :props="defaultProps"
      @node-click="handleNodeClick"
      :render-content="treeRender"
      class="trr"
      accordion
      node-key="value"
      :default-expanded-keys="[currentId]"
      highlight-current
      empty-text="正在加载中"
    ></el-tree>
  </div>
</template>

<script>
import { getLeftTreeInterface } from "@/api/resource_list";
export default {
  props: {
    isNum: {
      type: Boolean,
      default: false
    },
    isRed: {
      type: Boolean,
      default: false
    },
    menuType:{
      type:Number,
    },
    resourceCountType:{
      type:Number,
    },
    menuClass: '',
    currentNode: {
      type:[String, Number],
      default: ''
    },
  },
  data() {
    return {
      dataTree: [],
      //  树形菜单默认属性设置
      defaultProps: {
        children: "children",
        label: "label",
        disabled:'disabled',
      },
      menuId:'',
      currentId: '',
    }
  },
  mounted() {
    this.getLeftTree();
  },
  methods: {
    // 获取资源目录
    getLeftTree() {
      let s = {
        menuType: this.menuType,
        resourceCountType: this.resourceCountType,
      };
      getLeftTreeInterface(s).then(res => {
        this.dataTree = res.data.data;
        console.log(this.currentNode);
        if(this.currentNode !== '') {
          this.currentId = this.currentNode;
          this.menuId = this.currentId;
          this.menuValue = this.currentId;
        } else {
          this.menuId = this.dataTree[0].menuId;
          this.menuValue = this.dataTree[0].label;
        }
        this.doFormate(this.dataTree,[])
        this.$emit('listenToChildEvent',this.menuId,this.menuValue)
        this.dataTree.forEach(item => {
          item.parentId = item.menuId;
          if(item.children != null) {
            item.children.forEach(item1 => {
              item1.parentId = item.menuId;
              if(item1.children != null) {
                item1.children.forEach(item2 => {
                  item2.parentId = item.menuId;
                })
              }
            })
          }
        })
      });
    },
    // 点击左边树形菜单
    handleNodeClick(data) {
      this.menuId = data.menuId;
      this.menuValue = data.label;
      this.currentId = data.menuId;
      console.log(this.currentId);
      this.$emit('nodeClick', data);
    },
    treeRender(h, { node, data, store }) {
      if(this.isNum) {
        return (
          <span class='custom-tree-node'>
            <span>{node.label}</span>
            (<span style={this.isRed?'color: #ff7c7c':''}>{data.resourceCount}</span>)
          </span>);
      } else {
        return (
          <span class='custom-tree-node'>
            <span>{node.label}</span>
          </span>);
      }
    },
    // 递归整理数据
    doFormate(obj, prentIDs) {
      for(let i = 0; i < obj.length;i++) {
        obj[i].prentIDs = JSON.parse(JSON.stringify(prentIDs));
        obj[i].prentIDs.push(obj[i].menuPid);
        if (obj[i].children) {
          this.doFormate(obj[i].children,JSON.parse(JSON.stringify(obj[i].prentIDs)))
        }
      }
    },
  },
}
</script>

<style>

</style>
