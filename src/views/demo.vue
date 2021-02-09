<!-- 一个上传事例文件 -->
<template>
    <div>
        <global-uploader         
        v-loading="loading"
        :element-loading-text="progress"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"></global-uploader>
        <el-button @click="sendFile" class="send-btn">导入</el-button>
        <el-button @click="dialogVisible = true" class="send-btn">弹出</el-button>
        <el-dialog
            title="上传修改"
            :visible.sync="dialogVisible"
            width="60%"
            :before-close="handleClose">
            <reset-upload></reset-upload>
        </el-dialog>
    </div>
</template>

<script>
    import Bus from "@/components/uploader/js/bus";
    import globalUploader from "@/components/uploader/globalUploader.vue";
    import resetUpload from "@/components/resetUpload/resetUpload.vue";
    export default {
        components: {
            globalUploader, resetUpload
        },
        data() {
            return {
                loading: false,
                progress: '0%',
                dialogVisible: true
            }
        },
        mounted() {
            // 文件选择后的回调
            Bus.$on('fileAdded', (res) => {
                // console.log('文件已选择',res);
            });
            // 文件上传成功的回调
            Bus.$on('fileSuccess', (res) => {
                console.log('文件上传成功', res);
            });
            Bus.$on('fileComplete', () => {
                // console.log('全部文件上传完成了');
                this.loading = false;
            });
            Bus.$on('fileProgress', (result) => {
               this.progress = result + '%';
            });
        },
        computed: {},
        methods: {
            upload(par) {
                // 打开文件选择框
                Bus.$emit('openUploader', {
                    type : par  // 传入的参数
                })
            },
            sendFile() {
                this.loading = true;
                Bus.$emit("submitFile");
            },
            dialoag() {

            }
        },
        destroyed() {
            Bus.$off('fileAdded');
            Bus.$off('fileSuccess');
            Bus.$off('fileComplete');
            Bus.$off('fileProgress');
        },
    }
</script>

<style scoped lang="scss">
.send-btn {
    margin-left: 700px;
}

</style>
