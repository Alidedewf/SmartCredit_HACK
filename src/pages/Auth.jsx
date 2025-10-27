import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import s from "./Auth.module.css";
import { apiRequest } from "../api";
import { saveToken, saveUser } from "../lib/auth";

export default function Auth() {
  const [mode, setMode] = useState("login"); // "login" | "register"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // поля профиля — уйдут в profile_data
  const [form, setForm] = useState({
    income: "",
    monthly_payments: "",
    credit_history: "no_issues",
    job_experience_years: "",
    age: "",
    income_proof: "official",
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // ================= Регистрация =================
  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // приводим типы к нужным
      const body = {
        email: email.trim(),
        password,
        role: "CLIENT",
        profile_data: {
          income: parseFloat(form.income),                 // float64
          monthly_payments: parseFloat(form.monthly_payments), // float64
          credit_history: String(form.credit_history),     // string
          job_experience_years: parseFloat(form.job_experience_years), // float64
          age: parseInt(form.age, 10),                     // int
          income_proof: String(form.income_proof),         // string
        },
      };

      // отправляем единый POST /auth/register
      const res = await apiRequest("/auth/register", "POST", body);

      // если бэк вернул токен — сохраняем и сразу пускаем на главную
      if (res?.access_token) {
        saveToken(res.access_token);
        saveUser({ email: body.email });
        navigate("/");
        return;
      }

      // фолбэк: некоторые бэки не выдают токен на регистрацию — логинимся сами
      const loginRes = await apiRequest("/auth/login", "POST", {
        email: body.email,
        password: body.password,
      });
      saveToken(loginRes.access_token);
      saveUser({ email: body.email });
      navigate("/");
    } catch (err) {
      // стараемся показать понятное сообщение
      setError(
        (err && err.message) ||
          "Ошибка регистрации. Проверьте корректность данных."
      );
    }
  };

  // ================= Вход =================
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await apiRequest("/auth/login", "POST", {
        email: email.trim(),
        password,
      });
      saveToken(res.access_token);
      saveUser({ email: email.trim() });
      navigate("/");
    } catch (err) {
      setError(
        (err && err.message) ||
          "Ошибка входа. Проверьте email/пароль и попробуйте снова."
      );
    }
  };

  return (
    <div className={s.page}>
      <div className={s.card}>
        <h1 className={s.logo}>SmartCredit</h1>
        <p className={s.subtitle}>
          {mode === "login" ? "Добро пожаловать" : "Создайте аккаунт"}
        </p>

        <form
          onSubmit={mode === "login" ? handleLogin : handleRegister}
          className={s.form}
        >
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
          <input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete={mode === "login" ? "current-password" : "new-password"}
          />

          {mode === "register" && (
            <>
              <input
                type="number"
                name="income"
                placeholder="Доход (₸)"
                value={form.income}
                onChange={handleChange}
                required
                step="0.01"
                min="0"
              />
              <input
                type="number"
                name="monthly_payments"
                placeholder="Ежемесячные платежи (₸)"
                value={form.monthly_payments}
                onChange={handleChange}
                required
                step="0.01"
                min="0"
              />
              <div className={s.selectWrapper}>
                <select
                name="credit_history"
                value={form.credit_history}
                onChange={handleChange}
                required
                >
                    <option value="no_issues">Без просрочек</option>
                    <option value="minor_issues">Мелкие просрочки</option>
                    <option value="major_issues">Серьёзные просрочки</option>
                    </select>
                    </div>
              <input
                type="number"
                name="job_experience_years"
                placeholder="Стаж (лет)"
                value={form.job_experience_years}
                onChange={handleChange}
                required
                step="0.1"
                min="0"
              />
              <input
                type="number"
                name="age"
                placeholder="Возраст"
                value={form.age}
                onChange={handleChange}
                required
                min="18"
              />
              <div className={s.selectWrapper}>
  <select
    name="income_proof"
    value={form.income_proof}
    onChange={handleChange}
    required
  >
    <option value="official">Официальное подтверждение</option>
    <option value="indirect">Непрямое подтверждение</option>
    <option value="verbal">Со слов клиента</option>
  </select>
</div>
            </>
          )}

          {error && <div className={s.error}>{error}</div>}

          <button type="submit" className={s.btn}>
            {mode === "login" ? "Войти" : "Зарегистрироваться"}
          </button>
        </form>

        <div className={s.switch}>
          {mode === "login" ? (
            <>
              Нет аккаунта?{" "}
              <span onClick={() => setMode("register")}>Регистрация</span>
            </>
          ) : (
            <>
              Уже есть аккаунт?{" "}
              <span onClick={() => setMode("login")}>Войти</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
