import { Sparkles } from "lucide-react";
import { saveAuthSession } from "../../core/auth";
import { composeAuthPayload } from "./composers/authPayload";
import { authSubmitLabel, isRegisterMode, shouldShowPassword } from "./helpers/authMode";
import { forgotPassword, login, register } from "./services/authService";
import { useAuthForm } from "./store/useAuthForm";

export function AuthPage({ onAuth }) {
  const { mode, setMode, form, updateField, error, setError } = useAuthForm();

  async function submit(event) {
    event.preventDefault();
    setError("");
    try {
      if (mode === "forgot") {
        await forgotPassword(form.email);
        setError("Nếu email tồn tại, hướng dẫn đặt lại mật khẩu đã được ghi nhận.");
        return;
      }
      const payload = composeAuthPayload(form);
      const out = mode === "register" ? await register(payload) : await login(payload);
      saveAuthSession(out);
      onAuth();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <main className="auth">
      <form onSubmit={submit} className="authPanel">
        <div className="authMark"><Sparkles size={22} /> Groks</div>
        <h1>Pure HTTP Grok Operations</h1>
        <p>Credential pools, partner API keys, jobs, and logs in one focused console.</p>
        {isRegisterMode(mode) && <input placeholder="Tên" value={form.name} onChange={(e) => updateField("name", e.target.value)} />}
        <input placeholder="Email" value={form.email} onChange={(e) => updateField("email", e.target.value)} />
        {shouldShowPassword(mode) && <input type="password" placeholder="Mật khẩu" value={form.password} onChange={(e) => updateField("password", e.target.value)} />}
        <button>{authSubmitLabel(mode)}</button>
        {error && <div className="notice">{error}</div>}
        <div className="authLinks">
          <button type="button" onClick={() => setMode("login")}>Đăng nhập</button>
          <button type="button" onClick={() => setMode("register")}>Đăng ký</button>
          <button type="button" onClick={() => setMode("forgot")}>Quên mật khẩu</button>
        </div>
      </form>
    </main>
  );
}
