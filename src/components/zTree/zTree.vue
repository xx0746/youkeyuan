<template>
  <div id="areaTree">
    <div class="box-title">
      <span class="fa fa-refresh" @click="freshArea">{{title}}</span>
      <span class="fa fa-refresh" v-show="isShowNum">文件数({{countNum}})</span>
    </div>
    <div class="tree-box">
      <div class="zTreeDemoBackground left">
          <ul id="fileTree" class="ztree"></ul>
      </div>
    </div>
  </div>
</template>

<script>
import "../../plugins/zTree/js/jquery.ztree.core.min.js";
import "../../plugins/zTree/js/jquery.ztree.excheck.min.js";
import "../../plugins/zTree/js/jquery.ztree.exedit.min.js";
export default {
  name: "zTree",
  props: {
    fileTreeData: {
      type: Array
    },
    isShow: {
      type: Boolean,
      default: true
    },
    title: {
      type: String,
      default: '文件列表'
    },
    countNum: 0,
    isShowNum: {
      type: Boolean,
      default: true
    },
    isPreview: {
      type: Boolean,
      default: true
    },
    isShowOne: false,
    isShowDetails: false,
  },
  data(){
    return{
      setting:{
        data:{
          key: {
            name: "menuName",
            checked: "checked"
          },
          simpleData:{
            enable: true,
            idKey: "menuId",
            pIdKey: "menuPid",
            rootPId: 0
          }
        },
        check: {
          enable: this.isShow,
          chkStyle: "checkbox",
          chkboxType: { "Y": "ps", "N": "ps" }
        },
        callback: {
          beforeClick: this.zTreeBeforeClick,
          onClick: this.zTreeOnClick,
          onCheck: this.zTreeOnCheck
        },
        view: {
          addDiyDom: this.addDiyDom
        }
      },
      zNodes:[
        // 需要的数据格式
        // {id:1, pId:0, name: "父节点1"},
        // {id:11, pId:1, name: "子节点1"},
        // {id:12, pId:1, name: "子节点2"}
      ],
      resultArr: [],
      urlArr: [],
      url: 'http://132.10.10.42:8012/onlinePreview?url='
    }
  },
  computed: {
    treeObj() {
      return $.fn.zTree.getZTreeObj("fileTree");
    }
  },
  watch: {
    fileTreeData(newval, oldval) {
      this.$nextTick(_ => {
        this.zNodes = newval;
        this.freshArea()
      })
    },
  },
  mounted(){
    this.$nextTick(_ => {
      this.fileTreeData.forEach(item => {
        item.checked = false;
      })
      this.zNodes = this.fileTreeData;
      this.freshArea();
    })
  },
  methods:{
    freshArea(){
      $.fn.zTree.init($("#fileTree"), this.setting, this.zNodes);
      if(this.isShowOne) {
        let a = document.querySelectorAll('.node_name');
        console.log(a);
        // a[0].classList.add('active');
      }
    },
    // 树节点点击事件
    zTreeOnClick(event, treeId, treeNode) {
      let span = event.target;
      span.classList.remove('tree_focus')
      span.parentNode.classList.remove('remove-tree_focus')
      if(treeNode.fileUrl != null && span.className == 'node_name') {
        let type = 'notxt';
        let value = treeNode.fileUrl.toLocaleLowerCase()
        // let fileText = /\.(txt)(\.*)?$/.test(value)
        // if(fileText && this.isPreview) {
        //   type = 'txt'
        //   this.getPreview(treeNode.menuName, treeNode.fileUrl);
        // } else {
        //   type = 'notxt'
        //   this.$emit("treeClick", treeNode, this.treeObj, event);
        // }
        this.$emit("treeClick", treeNode, this.treeObj, event);
        span.classList.add('tree_focus')
      } else {
        span.parentNode.classList.add('remove-tree_focus')
      }
    },
    zTreeOnCheck(event, treeId, treeNode) {
      this.resultArr = [];
      this.urlArr = [];
      let treeObj = $.fn.zTree.getZTreeObj("fileTree");
      let nodes = treeObj.getCheckedNodes(true);
      nodes.forEach(item => {
        console.log(item);
        this.resultArr.push(item.menuId);
        this.urlArr.push({fileUrl: item.fileUrl, name: item.menuName});
      })
      this.$emit("treeCheck", this.resultArr, this.urlArr);
    },
    getPreview(name, href) {
      let a = document.createElement("a"), //创建a标签
      e = document.createEvent("MouseEvents"); //创建鼠标事件对象
      e.initEvent("click", false, false); //初始化事件对象
      a.href = href; //设置地址
      a.target = "_blank";
      a.dispatchEvent(e); //给指定的元素，执行事件click事件
    },
    addDiyDom(treeId, treeNode) {
      let that = this;
      if(this.isShowDetails) {
        let aObj = $("#" + treeNode.tId + "_a");
        if ($("#diyBtn_space_"+treeNode.menuId).length>0) return;
        if(treeNode.menuId > 20) {
          let editStr = "<span id='diyBtn_space_" +treeNode.menuId+ "' class='details_btn' > <i class='el-icon-document'></i> </span>";
          aObj.append(editStr);
          let btn = $("#diyBtn_space_"+treeNode.menuId);
          if (btn) btn.bind("click", _=>{this.$emit("treeDiy", treeNode.menuId, treeNode)});
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  #areaTree{
    border:1px solid #e5e5e5;
    margin-bottom: 20px;
    border-radius: 4px;
    overflow: hidden;
  }
  .box-title{
    text-align: left;
    height: 24px;
    padding: 0 12px;
    display: flex;
    justify-content: space-between;
    border-radius: 3px 3px 0 0;
    background-color: #f5f5f5;
  }
  .box-title .fa{
    line-height: 24px;
  }
  .ztree /deep/ .node_name {
    font-size: 12px;
    display: inline-block;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .ztree /deep/ .details_btn {
    font-size: 12px;
    margin-left: 4px;
    color: #009A52;
    display: inline-block;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    position: absolute;
    right: 32px;
    &:hover {
      color: #090CF5;
    }
  }
</style>
