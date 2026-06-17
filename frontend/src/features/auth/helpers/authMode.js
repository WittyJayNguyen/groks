export function authSubmitLabel(mode) {
  if (mode === "register") return "Đăng ký";
  if (mode === "forgot") return "Gửi yêu cầu";
  return "Đăng nhập";
}

export function isRegisterMode(mode) {
  return mode === "register";
}

export function shouldShowPassword(mode) {
  return mode !== "forgot";
}
