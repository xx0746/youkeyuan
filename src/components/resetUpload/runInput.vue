<template>
  <div>
    <el-input v-model="innerValue" @blur="onblur"></el-input>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: String
    },
    form: {
      type: Object
    },
  },
  data() {
    return {
      
    }
  },
  computed: {
    innerValue: {
      get() {
        return this.form[this.value];
      },
      set(val) {
        this.$set(this.form, this.value, val);
      }
    },
  },
  methods: {
    onblur() {
      this.$emit('onblur', this.innerValue)
    }
  },
}
</script>

<style>

</style>
