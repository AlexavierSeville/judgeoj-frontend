<template>
  <div id="app">
    <template v-if="route.path.startsWith('/user')">
      <router-view />
    </template>
    <template v-else>
      <BasicLayout />
    </template>
  </div>
</template>

<style>
#app {
}
</style>
<script setup lang="ts">
import BasicLayout from "@/layouts/BasicLayout.vue";

import { onMounted } from "vue";
import { useRoute } from "vue-router"; // @ is an alias to /src

const route = useRoute();

//全局初始化函数,专门写全局单次调用的代码
const doInit = () => {
  console.log("欢迎参观我的项目");
};

onMounted(() => {
  doInit();
});
</script>
