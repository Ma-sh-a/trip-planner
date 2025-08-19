import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../contexts/auth-context";
import "../styles/auth.css";

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");

    if (isSignUp && password !== confirmPassword) {
      return setError("Пароли не совпадают");
    }

    try {
      setLoading(true);

      if (isSignUp) {
        await signup(email, password);
      } else {
        await login(email, password);
      }

      navigate("/trips");
    } catch (error: any) {
      setError(error.message || "Произошла ошибка");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h1 className="auth-title">{isSignUp ? "Создать аккаунт" : "Вход"}</h1>

      {error && <div className="auth-error">{error}</div>}

      <form className="auth-form" onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          className="auth-input"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Пароль"
          className="auth-input"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {isSignUp && (
          <input
            type="password"
            placeholder="Подтвердите пароль"
            className="auth-input"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        )}

        <button
          type="submit"
          className="auth-button auth-button--primary"
          disabled={loading}
        >
          {loading ? "Загрузка..." : isSignUp ? "Зарегистрироваться" : "Войти"}
        </button>
      </form>

      <div className="auth-switch">
        <p>
          {isSignUp ? "Уже есть аккаунт?" : "Еще нет аккаунта?"}
          <button
            type="button"
            className="auth-switch-button"
            onClick={() => setIsSignUp(!isSignUp)}
          >
            {isSignUp ? "Войти" : "Создать"}
          </button>
        </p>
      </div>

      <p className="auth-link">
        <Link to="/" className="auth-back-link">
          ← На главную
        </Link>
      </p>
    </div>
  );
};

export default Auth;
