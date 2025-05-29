//保存用户的状态信息
// initial state
import { StoreOptions } from "vuex";
import ACCESS_ENUM from "@/access/ACCESS_ENUM";
import { UserControllerService } from "../../generated";

// const state = () => ({});

// mutations（尽量同步）,定义了更新变量的方法,用于修改状态变量
const mutations = {};

// getters
const getters = {};

// actions,执行异步操作，并触发 mutations 的更改
const actions = {};

export default {
  namespaced: true,
  state: () => ({
    loginUser: {
      userName: "未登录",
      // userRole: ACCESS_ENUM.NOT_LOGIN,
    },
  }),
  getters,
  // payload 就是给 mutation 或 action 带过去的"数据包"
  mutations: {
    updateUser(state, payload) {
      state.loginUser = payload;
    },
  },
  actions: {
    async getLoginUser({ commit, state }, payload) {
      // 从远程获取当前登录用户
      const res = await UserControllerService.getLoginUserUsingGet();
      console.log("拿到后端返回的用户数据是", res);
      if (res.code === 0) {
        // done 改为从远程获取登录信息
        commit("updateUser", res.data);
      } else {
        commit("updateUser", {
          // 把 state.loginUser 对象的所有属性“拆开”并放到一个新对象中
          ...state.loginUser,
          // 只改变userRole，不改变其他属性
          userRole: ACCESS_ENUM.NOT_LOGIN,
        });
      }
    },
  },
} as StoreOptions<any>;
