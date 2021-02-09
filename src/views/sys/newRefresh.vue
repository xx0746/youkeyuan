<template>

</template>

<script>
    export default {
       mounted(){
        if(this.$route.query.type==1){
          this.$router.push({
            path:'/dynamic/publish',
          })
        }else if(this.$route.query.type==2){
          this.$router.push({
            path:'/notice/publish',
          })
        }else if(this.$route.query.type==3){
          this.$router.push({
            path:'/rotationchart/ImageRelease',  //图文发布
          })
        }
       }
    }
</script>

<style scoped>

</style>
