import router from "@/router";
import store from "@/store";
import ACCESS_ENUM from "@/access/ACCESS_ENUM";
import checkAccess from "@/access/checkAccess";

// 全局前置路由守卫：在每次路由跳转前执行。to是目标路由，from是来源路由，next是控制跳转的方法
router.beforeEach(async (to, from, next) => {
  console.log("登录用户信息", store.state.user.loginUser);
  // 仅管理员可见,
  // meta 是 Vue Router 给每条路由专门预留的一个“自定义信息”字段,在routes.ts中定义了。
  // 判断当前路由是否需要管理员权限
  // 如果 meta 存在，就继续取 access
  // 如果 meta 是 undefined，直接返回 undefined，程序不会崩
  // if (to.meta?.access === "canAdmin") {
  //   // 如果当前用户不是管理员角色，则放行（可以根据需求改为跳转其他页面）
  //   if (store.state.user.loginUser?.role !== "admin") {
  //     next("/noAuth");
  //     return;
  //   }
  // }

  let loginUser = store.state.user.loginUser;

  // 如果之前没登录过，自动登录
  if (!loginUser || !loginUser.userRole) {
    // 加await是为了等用户登录之后，再执行后续的代码
    await store.dispatch("user/getLoginUser");
    loginUser = store.state.user.loginUser;
  }
  const needAccess = (to.meta?.access as string) ?? ACCESS_ENUM.NOT_LOGIN;
  console.log(needAccess);
  // 如果要跳转的页面需要登录
  if (needAccess !== ACCESS_ENUM.NOT_LOGIN) {
    console.log("1");
    // 如果没登录，跳转登录页
    if (
      !loginUser ||
      !loginUser.userRole ||
      loginUser.userRole === ACCESS_ENUM.NOT_LOGIN
    ) {
      next(`/user/login?redirect=${to.fullPath}`);
      return;
    }
    // 如果登录了，检查权限
    if (!checkAccess(loginUser, needAccess)) {
      next("/noAuth");
    }
  }

  next();
  // console.log(to);
});
