import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logo.png";

const eyeIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const eyeOffIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
  </svg>
);

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [authError, setAuthError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    setAuthError("");
    let hasError = false;
    if (!email.trim()) { setEmailError(true); hasError = true; } else setEmailError(false);
    if (!password.trim()) { setPasswordError(true); hasError = true; } else setPasswordError(false);
    if (hasError) return;

    setLoading(true);
    try {
      login(email, password);
      navigate("/dashboard");
    } catch (e) {
      setAuthError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-start justify-center"
      style={{ background: "#e8e8e8", fontFamily: "'Noto Sans', 'Segoe UI', sans-serif", paddingTop: "80px" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;500;600;700&display=swap');
        .login-card { animation: cardIn 0.45s cubic-bezier(0.22, 1, 0.36, 1) both; }
        @keyframes cardIn {
          from { opacity: 0; transform: translateY(18px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .input-field { transition: border-color 0.18s, box-shadow 0.18s; }
        .input-field:focus { border-color: #2d7a2d !important; box-shadow: 0 0 0 3px rgba(45,122,45,0.13); outline: none; }
        .input-error { border-color: #e53e3e !important; }
        .btn-login { transition: background 0.18s, transform 0.12s, box-shadow 0.18s; }
        .btn-login:hover:not(:disabled) { background: #236023; box-shadow: 0 4px 18px rgba(45,122,45,0.28); transform: translateY(-1px); }
        .btn-login:active:not(:disabled) { transform: translateY(0); }
        .link-green { color: #2d7a2d; transition: color 0.15s; }
        .link-green:hover { color: #1a5c1a; text-decoration: underline; }
        .checkbox-custom { accent-color: #2d7a2d; width: 15px; height: 15px; cursor: pointer; flex-shrink: 0; }
        .spinner { width: 18px; height: 18px; border: 2px solid rgba(255,255,255,0.4); border-top-color: #fff; border-radius: 50%; animation: spin 0.7s linear infinite; display: inline-block; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      <div className="login-card bg-white rounded-2xl shadow-lg" style={{ width: "100%", maxWidth: 380, padding: "40px 36px 36px" }}>
        <div className="text-center mb-6">
          <img src={logo} alt="logo" className="mx-auto block mb-3 w-13 h-14" />
          <h1 className="text-2xl font-bold text-gray-900 mb-1" style={{ letterSpacing: "-0.3px" }}>Вход</h1>
          <p className="text-sm text-gray-500">Войдите в свой аккаунт</p>
        </div>

        {/* Общая ошибка авторизации */}
        {authError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm text-center">
            {authError}
          </div>
        )}

        {/* Email */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email или телефон <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={email}
            onChange={e => { setEmail(e.target.value); if (e.target.value) setEmailError(false); setAuthError(""); }}
            placeholder="example@mail.com или +7..."
            className={`input-field w-full px-3 py-2.5 rounded-lg border text-sm text-gray-800 bg-white placeholder-gray-400 ${emailError ? "input-error" : "border-gray-300"}`}
          />
          {emailError && <p className="text-xs text-red-500 mt-1">Введите email или телефон</p>}
        </div>

        {/* Password */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Пароль <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={e => { setPassword(e.target.value); if (e.target.value) setPasswordError(false); setAuthError(""); }}
              placeholder="Введите пароль"
              className={`input-field w-full px-3 py-2.5 pr-10 rounded-lg border text-sm text-gray-800 bg-white placeholder-gray-400 ${passwordError ? "input-error" : "border-gray-300"}`}
            />
            <button type="button" onClick={() => setShowPassword(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
              {showPassword ? eyeOffIcon : eyeIcon}
            </button>
          </div>
          {passwordError && <p className="text-xs text-red-500 mt-1">Введите пароль</p>}
        </div>

        {/* Remember + Forgot */}
        <div className="flex items-center justify-between mb-5">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input type="checkbox" className="checkbox-custom" checked={remember} onChange={e => setRemember(e.target.checked)} />
            <span className="text-sm text-gray-600">Запомнить меня</span>
          </label>
          <button type="button" className="link-green text-sm font-medium bg-transparent border-none p-0 cursor-pointer">
            Забыли пароль?
          </button>
        </div>

        {/* Submit */}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading}
          className="btn-login w-full py-2.5 rounded-lg text-white font-semibold text-sm flex items-center justify-center gap-2"
          style={{ background: "#2d7a2d", border: "none", cursor: loading ? "not-allowed" : "pointer" }}
        >
          {loading ? <span className="spinner" /> : null}
          {loading ? "Входим..." : "Войти"}
        </button>

        {/* Register */}
        <div className="text-center mt-5">
          <p className="text-sm text-gray-500">
            Ещё нет аккаунта?{" "}
            <button type="button" onClick={() => navigate("/role-selection")} className="link-green font-medium bg-transparent border-none p-0 cursor-pointer">
              Зарегистрироваться
            </button>
          </p>
        </div>
      </div>
            {/* Быстрый вход для разработки */}
      {import.meta.env.DEV && (
        <div className="mt-6 pt-4 border-t border-gray-100">
          <p className="text-xs text-gray-400 text-center mb-2">Быстрый вход (только в dev)</p>
          <div className="flex flex-col gap-2">
            {[
              { label: "Войти как волонтёр", email: "volunteer@test.com" },
              { label: "Войти как куратор",  email: "curator@test.com"   },
              { label: "Войти как владелец", email: "owner@test.com"     },
            ].map(({ label, email }) => (
              <button
                key={email}
                type="button"
                onClick={() => { login(email, "1234"); navigate("/dashboard"); }}
                className="w-full py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}