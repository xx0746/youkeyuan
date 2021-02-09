<template>
    <div>
        <div class="title" style="margin-top:0px">访问查询统计</div>
        <div class="block">
            <div style="margin-right:20px">时间范围:</div>
            <div>
                <el-date-picker
                        v-model="value1"
                        type="date"
                        id="value1"
                        :picker-options="startDatePicker"
                        placeholder="选择日期">
                </el-date-picker>
                <span>—</span>
                <el-date-picker
                        v-model="value2"
                        type="date"
                        id="value2"
                        :picker-options="endDatePicker"
                        placeholder="选择日期">
                </el-date-picker>
                <el-button icon="el-icon-search" type="primary" size="small" style="margin-left:10px"
                           @click="resultcenterdata">查询
                </el-button>
                <el-button type="primary" size="small" @click="exportExcel">导出</el-button>
            </div>
        </div>
        <div style="padding: 0 20px 20px;">
            <el-table
                    id="table"
                    border
                    :summary-method="getSummaries"
                    show-summary
                    v-if="isShowTable"
                    :data="ReportformData"
                    style="width: 100%;"
                    fit
                    highlight-current-row
                    :header-cell-style="{'background-color': '#f5f7fa','color': 'rgb(103, 194, 58)'}">
                <el-table-column type="index" label="序号" width="60px"></el-table-column>
                <el-table-column prop="orgName" label="机构名称" width="300"></el-table-column>
                <el-table-column label="访问人次" prop="loginNum"></el-table-column>
                <el-table-column label="查询次数" prop="searchCount"></el-table-column>
            </el-table>
            <div v-else-if="isShowTable == false">数据正在努力加载中...</div>
        </div>
    </div>
</template>

<script>
    import XLSX from 'xlsx';
    import {accessQuery} from "@/api/Reportform";

    export default {
        data() {
            return {
                ReportformData: [],
                artic: {
                    beginDate: '',
                    endDate: ''
                },
                value1: '',
                value2: '',
                isShowTable: false,
                startDatePicker: this.beginDate(), //开始时间
                endDatePicker: this.processDate(), //结束时间
            }
        },
        mounted() {
            this.resultcenterdata();
        },
        watch: {
            ReportformData: {
                immediate: true,
                async handler() {
                    await this.$nextTick(); //根据实际选择延迟调用
                    const tds = document.querySelectorAll('#table .el-table__footer-wrapper tr>td');
                    if (this.isShowTable) {
                        tds[0].style.textAlign = 'center'
                        tds[0].colSpan = 2
                        tds[1].remove()
                    }
                }
            }
        },
        methods: {
            //定义时间范围
            beginDate() {
                const self = this
                return {
                    disabledDate(time) {
                        if (self.value2) {  //如果结束时间不为空，则小于结束时间
                            return new Date(self.value2).getTime() < time.getTime()
                        } else {
                            // return time.getTime() > Date.now()//开始时间不选时，结束时间最大值小于等于当天
                        }
                    }
                }
            },
            getSummaries(param) {
                const {columns, data} = param
                const sum = []
                columns.forEach((column, index) => {
                    if (index === 0) {
                        sum[index] = '合计'
                        return
                    }
                    const values = data.map(item => Number(item[column.property]));
                    if (!values.every(value => isNaN(value))) {
                        sum[index] = values.reduce((prev, curr) => {
                            const value = Number(curr);
                            if (!isNaN(value)) {
                                return prev + curr;
                            } else {
                                return prev;
                            }
                        }, 0);
                        sum[index] += '';
                    } else {
                        sum[index] = '';
                    }
                })
                return sum
            },
            //定义时间范围
            processDate() {
                const self = this
                return {
                    disabledDate(time) {
                        if (self.value1) {  //如果开始时间不为空，则结束时间大于开始时间
                            return new Date(self.value1).getTime() > time.getTime()
                        } else {
                            // return time.getTime() > Date.now()//开始时间不选时，结束时间最大值小于等于当天
                        }
                    }
                }
            },
            resultcenterdata() {
                this.isShowTable = false;
                let that = this;
                this.artic.endDate = $('#value2').val();
                this.artic.beginDate = $('#value1').val();
                accessQuery(this.artic).then(res => {
                    if (res.data.data) {
                        this.ReportformData = res.data.data;
                        this.isShowTable = true;
                    } else {
                        this.$message.error(res.data.msg);
                    }
                });
            },
            // 导出表格
            exportExcel() {
                const tb = document.getElementById('table');
                let sheet = XLSX.utils.table_to_sheet(tb);
                saveAs(sheet2blob(sheet), '访问查询统计.xlsx');

                function saveAs(obj, fileName) {
                    const a = document.createElement('a');
                    document.body.appendChild(a);
                    a.download = fileName || '下载';
                    a.href = URL.createObjectURL(obj);
                    a.click();
                    setTimeout(() => {
                        URL.revokeObjectURL(obj);
                        document.body.removeChild(a);
                    }, 100);
                };

                // 将一个sheet转成最终的excel文件的blob对象，然后利用URL.createObjectURL下载
                function sheet2blob(sheet, sheetName) {
                    sheetName = sheetName || 'sheet1';
                    let workbook = {
                        SheetNames: [sheetName],
                        Sheets: {}
                    };
                    workbook.Sheets[sheetName] = sheet;
                    // 生成excel的配置项
                    let wopts = {
                        bookType: 'xlsx', // 要生成的文件类型
                        bookSST: false, // 是否生成Shared String Table，官方解释是，如果开启生成速度会下降，但在低版本IOS设备上有更好的兼容性
                        type: 'binary'
                    };
                    let wbout = XLSX.write(workbook, wopts);
                    let blob = new Blob([s2ab(wbout)], {type: "application/octet-stream"});

                    // 字符串转ArrayBuffer
                    function s2ab(s) {
                        let buf = new ArrayBuffer(s.length);
                        let view = new Uint8Array(buf);
                        for (let i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
                        return buf;
                    }

                    return blob;
                }
            },
        },
    }
</script>

<style scoped rel="stylesheet/scss" lang="scss">
    .block {
        display: flex;
        align-items: center;
        padding: 20px
    }
</style>
