import { createStore } from "vuex";
import user from "@/store/user";

export default createStore({
  mutations: {},
  actions: {},
  //引入用户状态模块,之后就可以使用它了
  modules: {
    user,
  },
});
