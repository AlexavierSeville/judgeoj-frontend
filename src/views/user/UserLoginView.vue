<template>
  <div id="userLoginView">
    <div style="max-width: 480px; margin: 0 auto; text-align: center">
      <h2 style="margin-bottom: 37px">欢迎登录</h2>
    </div>

    <a-form
      style="max-width: 480px; margin: 0 auto"
      auto-label-width
      label-align="left"
      :model="form"
      @submit="handleSubmit"
    >
      <a-form-item field="userAccount" label="账号">
        <a-input v-model="form.userAccount" placeholder="请输入账号" />
      </a-form-item>
      <a-form-item field="userPassword" tooltip="密码不少于八位" label="密码">
        <a-input-password
          v-model="form.userPassword"
          placeholder="请输入密码"
        />
      </a-form-item>
      <a-form-item>
        <a-button
          html-type="submit"
          type="primary"
          style="width: 100%; display: block; margin: 0 auto"
        >
          登录
        </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import message from "@arco-design/web-vue/es/message";
import { UserControllerService, UserLoginRequest } from "../../../generated";
import { useRouter } from "vue-router";
import { useStore } from "vuex";

const router = useRouter();
const store = useStore();

/**
 * 表单数据
 */
const form = reactive({
  userAccount: "",
  userPassword: "",
  //根据userLoginUsingPost()需要的参数规范校验
} as UserLoginRequest);

/**
 * 表单提交
 */
const handleSubmit = async () => {
  const res = await UserControllerService.userLoginUsingPost(form);
  if (res.code === 0) {
    // 先获取到用户登录状态信息，再回主页
    await store.dispatch("user/getLoginUser");
    // alert("登录成功" + JSON.stringify(res.data));
    router.push({
      path: "/",
      //设置了 replace: true，就不会在浏览器的历史记录中新增一条记录，而是用新的地址替换当前这条记录。
      // 在登录成功后，通常希望用户后退不要回到登录页，所以这里用了 replace: true。
      replace: true,
    });
  } else {
    message.error("登录失败" + res.message);
  }
  // alert(JSON.stringify(form));
};
</script>
