<template>
  <span>
    <i :class="iconType" :title="title" v-if="styleType == 'icon'" @click="onclick"></i>
    <el-button :size="size" :type="type" v-else-if="styleType == 'btn'" @click="onclick">
      <slot>按钮</slot>
    </el-button>
  </span>
</template>

<script>
export default {
  props:{
    styleType: {
      default: 'icon', // icon | btn
    },
    iconType: {
      default: 'icon-return', // 图标类型
    },
    text: {
      default: '按钮', // 按钮文字内容
    },
    size: {
      default: 'mini',
    },
    type: {
      default: 'primary2'
    },
  },
  data(){
    return {
      
    }
  },
  watch:{},
  computed:{
    title() {
      switch (this.iconType) {
        case 'icon-details': return '详情';
        case 'icon-download': return '下载';
        case 'icon-return': return '撤回';
        case 'icon-audit': return '审核';
        case 'icon-list': return '列表';
        case 'icon-unpass_reason': return '驳回原因';
        case 'icon-edit': return '修改';
        case 'icon-pass': return '通过';
        case 'icon-unpass': return '驳回';
        case 'icon-check_reason': return '查看原因';
        case 'icon-del': return '删除';
        case 'icon-reset_password': return '重置密码';
        case 'icon-edit_prop': return '维护属性';
        case 'icon-check': return '查看';
        case 'icon-preview': return '预览';
        case 'icon-control_author': return '配置权限';
        case 'icon-edit_role': return '角色修改';
        case 'icon-right': return '确定';
        case 'icon-close': return '关闭';
        default: break;
      }
    }
  },
  methods:{
    onclick(row) {
      this.$emit('click', row)
    }
  },
  created(){},
  mounted(){}
}
</script>
<style lang="scss" scoped>
i {
  font-size: 20px;
  margin: 0 4px;
  cursor: pointer;
}
i:hover {
  color: #009955;
}
</style>