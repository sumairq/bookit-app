import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { useAuth } from "../context/useAuth";

export default function SignupPage() {
  const navigate = useNavigate();
  const { signup } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await signup(name, email, password, passwordConfirm);
      navigate("/");
    } catch (err) {
      const e = err as { response?: { data?: { message?: string } } };
      setError(
        e?.response?.data?.message ?? "Sign up failed. Please try again.",
      );
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
            Begin your <em>field journal</em>.
          </h2>
          <blockquote className="auth__visual-quote">
            “The world is a book, and those who do not travel read only one
            page. So begin a new chapter with us.”
          </blockquote>
          <span className="auth__visual-cite">— Saint Augustine</span>
        </div>
      </aside>

      <section className="auth__panel">
        <div className="auth__form-wrap">
          <header className="auth__head">
            <span className="auth__num">№ 02 · Create account</span>
            <h1 className="auth__title">
              Become a <em>Bookit member</em>.
            </h1>
            <p className="auth__sub">
              Save trips, manage bookings, and unlock editor's picks.
            </p>
          </header>

          {error && <p className="form__notice">{error}</p>}

          <form className="form" onSubmit={handleSubmit}>
            <div className="field">
              <label className="field__label" htmlFor="name">
                <span>Full name</span>
              </label>
              <input
                id="name"
                type="text"
                className="field__input"
                placeholder="Amelia Earhart"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

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

            <div className="field__row">
              <div className="field">
                <label className="field__label" htmlFor="password">
                  <span>Password</span>
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

              <div className="field">
                <label className="field__label" htmlFor="passwordConfirm">
                  <span>Confirm</span>
                </label>
                <input
                  id="passwordConfirm"
                  type="password"
                  className="field__input"
                  placeholder="••••••••"
                  required
                  minLength={8}
                  value={passwordConfirm}
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                />
              </div>
            </div>

            <button
              className="btn btn--ember btn--lg btn--block"
              disabled={loading}
            >
              {loading ? "Creating…" : "Create account"}
              <ArrowUpRight size={16} aria-hidden="true" />
            </button>
          </form>

          <p className="auth__alt">
            Already a member? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </section>
    </main>
  );
}
