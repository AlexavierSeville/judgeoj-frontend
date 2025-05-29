<template>
  <a-row id="globalHeader" align="center" :wrap="false">
    <a-col flex="auto">
      <a-menu
        mode="horizontal"
        :selected-keys="selectKeys"
        @menu-item-click="doMenuClick"
      >
        <a-menu-item
          key="0"
          :style="{ padding: 0, marginRight: '7px' }"
          disabled
        >
          <div class="title-bar">
            <img class="logo" src="../assets/yuan.png" alt="" />
          </div>
        </a-menu-item>
        <!-- 遍历路由数组 routes，动态生成菜单项 -->
        <!--注意v-for和v-if不要一起用，因为v-for要先执行，会循环渲染所有的元素-->
        <!--所以要先在routes.ts给路由新增一个标志位，用于判断路由是否显示、隐藏-->
        <!--携带的Meta中没有hideInMenu就展示-->
        <a-menu-item
          v-for="item in visibleRoutes"
          :key="item.path"
          :style="{ fontSize: '20px' }"
        >
          {{ item.name }}
        </a-menu-item>
      </a-menu>
    </a-col>
    <a-col flex="100px">
      <div>
        <!--
        ?. 可选链:store.state.user?.loginUser意思是：如果 user 存在，再去取 loginUser,
        如果 user 是 undefined 或 null，就直接返回 undefined，而不会报错！
        ?? 空值合并:如果前面得到的是 null 或 undefined，那么用右边的 "未登录" 作为默认值。
        -->
        {{ store.state.user?.loginUser?.userName ?? "未登录" }}
      </div>
    </a-col>
  </a-row>
</template>

<!--setup是vue3的写法-->
<script setup lang="ts">
import { routes } from "@/router/routes";
import { useRouter } from "vue-router";
import { computed, ref } from "vue";
import { useStore } from "vuex";
import checkAccess from "@/access/checkAccess";

//使用vue-router组件实现路由跳转
const router = useRouter();
//获取路由信息
//const route = useRoute();
//默认为主页
const selectKeys = ref(["/"]);
//获取到存储的用户状态信息
const store = useStore();
// const loginUser = store.state.user.loginUser;  // 这里取的是"一个固定的值",而不是响应式变化的值。就不会触发 computed 重新计算了

//展示在菜单的路由数组
// 使用 computed 是为了保证：
//  - 当登录用户（loginUser）发生变化时，visibleRoutes 自动重新计算
//  - 如果用户从未登录 -> 登录成功（或角色变化），菜单能自动刷新
//  - computed 有缓存机制，依赖的数据不变时不会重新计算，性能更高
const visibleRoutes = computed(() => {
  return routes.filter((item, index) => {
    if (item.meta?.hideInMenu) {
      return false;
    }
    // todo 根据权限过滤菜单
    if (!checkAccess(store.state.user.loginUser, item.meta?.access as string)) {
      return false;
    }
    return true;
  });
});

// 默认主页
const selectedKeys = ref(["/"]);

//路由跳转后，更新选中的菜单项
// to：即将跳转到的路由对象（目标页面）
// from：当前离开的路由对象（来源页面）
// failure：跳转过程中是否发生错误（通常忽略）
router.afterEach((to, from, failure) => {
  // 更新选中的菜单项，选中当前跳转到的路由路径
  selectKeys.value = [to.path];
});

//参数 key 被显式标注为 string 类型，这是 TypeScript 的特性，提供静态类型检查。
const doMenuClick = (key: string) => {
  //指定跳转的路径
  router.push(key);
};

// 延迟 3 秒后，调用 user 模块的 action，更新登录用户信息
// setTimeout(() => {
//   //派发 action "user/getLoginUser"，传递新的用户信息
//   store.dispatch("user/getLoginUser", {
//     userName: "管理员元仔",
//     userRole: ACCESS_ENUM.ADMIN,
//   });
// }, 3000);

// alert(store.state.user?.loginUser?.userName);
</script>

<style scoped>
.title-bar {
  align-items: center;
}

.logo {
  height: 70px;
}
</style>
