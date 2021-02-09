<template>
  <div id="app">
    <router-view  v-if="isRouterAlive"/>
  </div>
</template>

<script>
  export default {
    name: 'App',
    data() {
      return {
        isRouterAlive: true
      };
    },
    provide(){ //通过v-if提供局部刷新
      return {
        reload: this.reload
      }
    },
    methods: {
      reload(){
        this.isRouterAlive = false
        this.$nextTick( function () {
          this.isRouterAlive = true
        })
      }
    },
  }
</script>

<style>
  body,html,#app{
    height:100%;
    margin:0;
    padding:0;
  }
  .numberInput input::-webkit-outer-spin-button,
  .numberInput input::-webkit-outer-spin-button,
  ::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
  input[type="number"]{
    -moz-appearance: textfield;
  }
</style>
