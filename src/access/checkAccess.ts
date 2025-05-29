import ACCESS_ENUM from "@/access/ACCESS_ENUM";

/**
 * 通用检查权限（判断当前用户是否具有某个权限）
 * @param loginUser 当前登录用户
 * @param needAccess 需要有的权限
 * @returns boolean 是否有权限
 */
const checkAccess = (loginUser: any, needAccess = ACCESS_ENUM.NOT_LOGIN) => {
  // 判断当前用户是否具有某个权限 (默认为未登录)
  const loginUserAccess = loginUser?.userRole ?? ACCESS_ENUM.NOT_LOGIN;
  if (needAccess === ACCESS_ENUM.NOT_LOGIN) {
    return true;
  }

  // 如果需要用户登录之后才能访问
  if (needAccess === ACCESS_ENUM.USER) {
    // todo 改为从远程获取登录信息
    if (loginUserAccess === ACCESS_ENUM.NOT_LOGIN) {
      // 未登录,无权限
      return false;
    }
    return true;
  }

  // 如果需要管理员权限
  if (needAccess === ACCESS_ENUM.ADMIN) {
    // todo 改为从远程获取登录信息
    if (loginUserAccess !== ACCESS_ENUM.ADMIN) {
      return false;
    }
  }
  return true;
};

export default checkAccess;
