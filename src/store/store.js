import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from "vuex-persistedstate"
Vue.use(Vuex)
const state = {
    // 搜索框信息
    searchList:{
        searchName:'',
        menuIds:'',
        parentId: ''
    },
    // 详情页需要信息
    review: {},
    // 重新上传修改
    isShowDialog: 0,
    resetUrl: 'upload',
    tableState: 'first',
    menuValue: [],
    tableValue: '2'
}
const getters = {
    getSearchList(state){
       return state.searchList
    },
}

const actions = {
    setSearchList({commit,state},value){
     commit('setSearch',value)
    },
}
const mutations = {
    setSearch(state,value){
        state.searchList = value;
    },
    setReview(state, value){
        state.review = value;
    },
    setDialog(state, value){
        state.isShowDialog = value;
    },
    setResetUrl(state, value){
        state.resetUrl = value;
    },
    setTableState(state, value){
        state.tableState = value
    },
    setMenuValue(state, value){
        state.menuValue = value
    },
    setTableValue(state, value){
        state.tableValue = value
    },
}
let store = new Vuex.Store({
    state,    // 共同维护的一个状态，state里面可以是很多个全局状态
    getters,  // 获取数据并渲染
    actions,  // 数据的异步操作
    mutations,  // 处理数据的唯一途径，state的改变或赋值只能在这里
    plugins: [createPersistedState({ //数据持久化
        storage: window.sessionStorage,
    })]
});
export default store
