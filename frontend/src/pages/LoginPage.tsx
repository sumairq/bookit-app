import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/useAuth";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      const e = err as { response?: { data?: { message?: string } } };
      setError(e?.response?.data?.message ?? "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth">
      <aside className="auth__visual">
        <div className="auth__visual-inner">
          <span className="auth__visual-eyebrow">Bookit · Members</span>
          <h2 className="auth__visual-title">
            Welcome back to the <em>field</em>.
          </h2>
          <blockquote className="auth__visual-quote">
            “Travel is fatal to prejudice, bigotry, and narrow-mindedness, and
            many of our people need it sorely on these accounts.”
          </blockquote>
          <span className="auth__visual-cite">— Mark Twain, 1869</span>
        </div>
      </aside>

      <section className="auth__panel">
        <div className="auth__form-wrap">
          <header className="auth__head">
            <span className="auth__num">№ 01 · Sign in</span>
            <h1 className="auth__title">
              Pick up where you <em>left off</em>.
            </h1>
            <p className="auth__sub">
              Enter your details to access saved trips and bookings.
            </p>
          </header>

          {error && <p className="form__notice">{error}</p>}

          <form className="form" onSubmit={handleSubmit}>
            <div className="field">
              <label className="field__label" htmlFor="email">
                <span>Email</span>
              </label>
              <input
                id="email"
                type="email"
                className="field__input"
                placeholder="you@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="field">
              <label className="field__label" htmlFor="password">
                <span>Password</span>
                <a href="#" className="link" style={{ fontSize: "0.7rem", letterSpacing: "0.18em", borderBottom: 0, color: "var(--ember-deep)" }}>
                  Forgot?
                </a>
              </label>
              <input
                id="password"
                type="password"
                className="field__input"
                placeholder="••••••••"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button className="btn btn--ember btn--lg btn--block" disabled={loading}>
              {loading ? "Signing in…" : "Sign in"}
              <span aria-hidden="true">↗</span>
            </button>
          </form>

          <div className="auth__sso">
            <span className="auth__sso-rule" />
            <span className="auth__sso-text">or</span>
            <span className="auth__sso-rule" />
          </div>

          <p className="auth__alt">
            New to Bookit? <Link to="/signup">Create an account</Link>
          </p>
        </div>
      </section>
    </main>
  );
}
