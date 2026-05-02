import { useState } from "react";
import { useAuth } from "../context/useAuth";
import { api } from "../api/axios";
import { Link } from "react-router-dom";
import { getUserAvatar } from "../utils/images";

const ICONS: Record<string, React.ReactNode> = {
  settings: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.9.3l-.1.1A2 2 0 1 1 4 16.9l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.9L4.1 7A2 2 0 1 1 7 4.1l.1.1a1.7 1.7 0 0 0 1.9.3h.1a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1A2 2 0 1 1 19.9 7l-.1.1a1.7 1.7 0 0 0-.3 1.9v.1a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" />
    </svg>
  ),
  briefcase: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
    </svg>
  ),
  star: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M12 2.5l2.95 6.45 7.05.62-5.35 4.7 1.6 6.93L12 17.7l-6.25 3.5 1.6-6.93L2 9.57l7.05-.62L12 2.5z" />
    </svg>
  ),
  card: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <rect x="2.5" y="6" width="19" height="13" rx="2" />
      <path d="M2.5 11h19" />
    </svg>
  ),
};

interface NavItemProps {
  to: string;
  label: string;
  icon: keyof typeof ICONS;
  active?: boolean;
}

function NavItem({ to, label, icon, active }: NavItemProps) {
  return (
    <Link
      to={to}
      className={`account__nav-link ${active ? "account__nav-link--on" : ""}`}
    >
      {ICONS[icon]}
      <span>{label}</span>
    </Link>
  );
}

export default function AccountPage() {
  const { user, setUser } = useAuth();

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [photo, setPhoto] = useState<File | null>(null);

  const [currentPassword, setCurrentPassword] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const [message, setMessage] = useState<string | null>(null);
  const [messageOk, setMessageOk] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState<string | null>(null);
  const [passwordMessageOk, setPasswordMessageOk] = useState(false);

  const [savingUser, setSavingUser] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  if (!user) return null;

  async function handleUserUpdate(e: React.FormEvent) {
    e.preventDefault();
    setSavingUser(true);
    setMessage(null);

    try {
      const form = new FormData();
      form.append("name", name);
      form.append("email", email);
      if (photo) form.append("photo", photo);

      const res = await api.patch("/users/updateMe", form);
      setUser(res.data.data.data);
      setMessageOk(true);
      setMessage("Account updated successfully.");
    } catch (err) {
      const e = err as { response?: { data?: { message?: string } } };
      setMessageOk(false);
      setMessage(e?.response?.data?.message ?? "Failed to update user.");
    } finally {
      setSavingUser(false);
    }
  }

  async function handlePasswordUpdate(e: React.FormEvent) {
    e.preventDefault();
    setSavingPassword(true);
    setPasswordMessage(null);

    try {
      await api.patch("/users/updateMyPassword", {
        passwordCurrent: currentPassword,
        password,
        passwordConfirm,
      });
      setPasswordMessageOk(true);
      setPasswordMessage("Password updated successfully.");
      setCurrentPassword("");
      setPassword("");
      setPasswordConfirm("");
    } catch (err) {
      const e = err as { response?: { data?: { message?: string } } };
      setPasswordMessageOk(false);
      setPasswordMessage(e?.response?.data?.message ?? "Password update failed.");
    } finally {
      setSavingPassword(false);
    }
  }

  return (
    <main className="account">
      <div className="container">
        <header className="account__head">
          <div>
            <span className="eyebrow eyebrow--ember">Member dashboard</span>
            <h1 className="account__title" style={{ marginTop: "0.6rem" }}>
              Hello, <em>{user.name.split(" ")[0]}</em>.
            </h1>
          </div>

          <div className="account__id">
            <img src={getUserAvatar(user.photo, 88)} alt="" />
            <div>
              <div style={{ color: "var(--ink)", fontFamily: "var(--sans)", fontWeight: 600 }}>
                {user.name}
              </div>
              <div>{user.email}</div>
            </div>
          </div>
        </header>

        <div className="account__layout">
          <nav className="account__nav" aria-label="Account">
            <span className="account__nav-title">Your account</span>
            <NavItem to="/me" label="Settings" icon="settings" active />
            <NavItem to="/my-experiences" label="My bookings" icon="briefcase" />
            <NavItem to="#" label="My reviews" icon="star" />
            <NavItem to="#" label="Billing" icon="card" />

            {user.role === "admin" && (
              <>
                <span className="account__nav-title" style={{ marginTop: "0.6rem" }}>
                  Admin
                </span>
                <NavItem to="#" label="Manage tours" icon="briefcase" />
                <NavItem to="#" label="Manage users" icon="settings" />
                <NavItem to="#" label="Manage reviews" icon="star" />
                <NavItem to="#" label="Manage bookings" icon="card" />
              </>
            )}
          </nav>

          <div className="account__main">
            {/* PROFILE PANEL */}
            <section className="account__panel">
              <header className="account__panel-head">
                <h2 className="account__panel-title">
                  <span className="account__panel-num">№ 01</span>
                  Profile details
                </h2>
                <p className="account__panel-sub">
                  How you appear to hosts and other travelers.
                </p>
              </header>

              {message && (
                <p className={`form__notice ${messageOk ? "form__notice--ok" : ""}`}>
                  {message}
                </p>
              )}

              <form className="form" onSubmit={handleUserUpdate}>
                <div className="field__row">
                  <div className="field">
                    <label className="field__label" htmlFor="name">
                      <span>Name</span>
                    </label>
                    <input
                      id="name"
                      className="field__input"
                      type="text"
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
                      className="field__input"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div className="photo-upload">
                  <img
                    className="photo-upload__avatar"
                    src={getUserAvatar(user.photo, 160)}
                    alt={user.name}
                  />
                  <div className="photo-upload__body">
                    <span className="photo-upload__caption">Profile photo</span>
                    <span className="photo-upload__filename">
                      {photo ? photo.name : "JPG, PNG · max 4 MB"}
                    </span>
                  </div>

                  <label htmlFor="photo" className="photo-upload__btn">
                    Choose file
                  </label>
                  <input
                    id="photo"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setPhoto(e.target.files?.[0] || null)}
                  />
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <button className="btn btn--ember" disabled={savingUser}>
                    {savingUser ? "Saving…" : "Save changes"}
                  </button>
                </div>
              </form>
            </section>

            <hr className="account__divider" />

            {/* PASSWORD PANEL */}
            <section className="account__panel">
              <header className="account__panel-head">
                <h2 className="account__panel-title">
                  <span className="account__panel-num">№ 02</span>
                  Change password
                </h2>
                <p className="account__panel-sub">
                  Use a strong, unique password — at least eight characters.
                </p>
              </header>

              {passwordMessage && (
                <p className={`form__notice ${passwordMessageOk ? "form__notice--ok" : ""}`}>
                  {passwordMessage}
                </p>
              )}

              <form className="form" onSubmit={handlePasswordUpdate}>
                <div className="field">
                  <label className="field__label" htmlFor="password-current">
                    <span>Current password</span>
                  </label>
                  <input
                    id="password-current"
                    className="field__input"
                    type="password"
                    required
                    minLength={8}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                </div>

                <div className="field__row">
                  <div className="field">
                    <label className="field__label" htmlFor="password">
                      <span>New password</span>
                    </label>
                    <input
                      id="password"
                      className="field__input"
                      type="password"
                      required
                      minLength={8}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>

                  <div className="field">
                    <label className="field__label" htmlFor="password-confirm">
                      <span>Confirm</span>
                    </label>
                    <input
                      id="password-confirm"
                      className="field__input"
                      type="password"
                      required
                      minLength={8}
                      value={passwordConfirm}
                      onChange={(e) => setPasswordConfirm(e.target.value)}
                    />
                  </div>
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <button className="btn btn--ghost" disabled={savingPassword}>
                    {savingPassword ? "Saving…" : "Update password"}
                  </button>
                </div>
              </form>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
