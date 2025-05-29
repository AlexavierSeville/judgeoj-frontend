// 通用权限定义枚举.
// 菜单组件中要判断权限，权限拦截也要用到权限判断功能，所以抽离成公共方法
const ACCESS_ENUM = {
  NOT_LOGIN: "notLogin",
  USER: "user",
  ADMIN: "admin",
};

export default ACCESS_ENUM;
