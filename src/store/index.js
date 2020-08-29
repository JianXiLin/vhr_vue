import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        router:[]
    },
    mutations: {
        // 除了state参数外，只能有一个参数，即只能有一个data
        // 调用时，state参数可省略
        initRouter(state,data){
            state.router = data;
        }
    },
    actions:{

    }
})