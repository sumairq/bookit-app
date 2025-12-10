import { useState } from "react";
import { useAuth } from "../context/useAuth";
import { api } from "../api/axios";
import { Link } from "react-router-dom";

export default function AccountPage() {
  const { user, setUser } = useAuth() as any;

  // FORM STATE: user data
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [photo, setPhoto] = useState<File | null>(null);

  // FORM STATE: password change
  const [currentPassword, setCurrentPassword] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  // FEEDBACK
  const [message, setMessage] = useState<string | null>(null);
  const [passwordMessage, setPasswordMessage] = useState<string | null>(null);

  // Loading states
  const [savingUser, setSavingUser] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  // ---------------------------
  // HANDLE USER DATA UPDATE
  // ---------------------------
  async function handleUserUpdate(e: React.FormEvent) {
    e.preventDefault();
    setSavingUser(true);
    setMessage(null);

    try {
      const form = new FormData();
      form.append("name", name);
      form.append("email", email);
      if (photo) form.append("photo", photo);

      const res = await api.patch("/api/v1/users/me", form);
      setUser(res.data.data.data);

      setMessage("Account updated successfully!");
    } catch (err: any) {
      setMessage(err?.response?.data?.message || "Failed to update user.");
    } finally {
      setSavingUser(false);
    }
  }

  // ---------------------------
  // HANDLE PASSWORD UPDATE
  // ---------------------------
  async function handlePasswordUpdate(e: React.FormEvent) {
    e.preventDefault();
    setSavingPassword(true);
    setPasswordMessage(null);

    try {
      await api.patch("/api/v1/users/updateMyPassword", {
        passwordCurrent: currentPassword,
        password,
        passwordConfirm,
      });

      setPasswordMessage("Password updated successfully!");

      // clear form
      setCurrentPassword("");
      setPassword("");
      setPasswordConfirm("");
    } catch (err: any) {
      setPasswordMessage(
        err?.response?.data?.message || "Password update failed."
      );
    } finally {
      setSavingPassword(false);
    }
  }

  return (
    <main className="main">
      <div className="user-view">
        {/* ------------------------------------- */}
        {/* LEFT SIDEBAR NAVIGATION */}
        {/* ------------------------------------- */}
        <nav className="user-view__menu">
          <ul className="side-nav">
            <NavItem link="/me" text="Settings" icon="settings" active={true} />
            <NavItem link="/my-tours" text="My bookings" icon="briefcase" />
            <NavItem link="#" text="My reviews" icon="star" />
            <NavItem link="#" text="Billing" icon="credit-card" />
          </ul>

          {/* ADMIN SECTION */}
          {user?.role === "admin" && (
            <div className="admin-nav">
              <h5 className="admin-nav__heading">Admin</h5>

              <ul className="side-nav">
                <NavItem link="#" text="Manage tours" icon="map" />
                <NavItem link="#" text="Manage users" icon="users" />
                <NavItem link="#" text="Manage reviews" icon="star" />
                <NavItem link="#" text="Manage bookings" icon="briefcase" />
              </ul>
            </div>
          )}
        </nav>

        {/* ------------------------------------- */}
        {/* RIGHT CONTENT AREA */}
        {/* ------------------------------------- */}
        <div className="user-view__content">
          {/* UPDATE USER DATA */}
          <div className="user-view__form-container">
            <h2 className="heading-secondary ma-bt-md">
              Your account settings
            </h2>

            {message && <p className="message">{message}</p>}

            <form className="form form-user-data" onSubmit={handleUserUpdate}>
              <div className="form__group">
                <label className="form__label" htmlFor="name">
                  Name
                </label>
                <input
                  id="name"
                  className="form__input"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="form__group ma-bt-md">
                <label className="form__label" htmlFor="email">
                  Email address
                </label>
                <input
                  id="email"
                  className="form__input"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="form__group form__photo-upload">
                <img
                  className="form__user-photo"
                  src={`/img/users/${user.photo}`}
                  alt={user.name}
                />

                <input
                  id="photo"
                  className="form__upload"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setPhoto(e.target.files?.[0] || null)}
                />

                <label htmlFor="photo">Choose new photo</label>
              </div>

              <div className="form__group right">
                <button
                  className="btn btn--small btn--green"
                  disabled={savingUser}
                >
                  {savingUser ? "Saving..." : "Save settings"}
                </button>
              </div>
            </form>
          </div>

          <div className="line">&nbsp;</div>

          {/* UPDATE PASSWORD */}
          <div className="user-view__form-container">
            <h2 className="heading-secondary ma-bt-md">Password change</h2>

            {passwordMessage && <p className="message">{passwordMessage}</p>}

            <form
              className="form form-user-password"
              onSubmit={handlePasswordUpdate}
            >
              <div className="form__group">
                <label className="form__label" htmlFor="password-current">
                  Current password
                </label>
                <input
                  id="password-current"
                  className="form__input"
                  type="password"
                  required
                  minLength={8}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </div>

              <div className="form__group">
                <label className="form__label" htmlFor="password">
                  New password
                </label>
                <input
                  id="password"
                  className="form__input"
                  type="password"
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div className="form__group ma-bt-lg">
                <label className="form__label" htmlFor="password-confirm">
                  Confirm password
                </label>
                <input
                  id="password-confirm"
                  className="form__input"
                  type="password"
                  required
                  minLength={8}
                  value={passwordConfirm}
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                />
              </div>

              <div className="form__group right">
                <button
                  className="btn btn--small btn--green btn--save-password"
                  disabled={savingPassword}
                >
                  {savingPassword ? "Saving..." : "Save password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}

/* -------------------------------------------
   NAV ITEM COMPONENT
------------------------------------------- */
function NavItem({
  link,
  text,
  icon,
  active,
}: {
  link: string;
  text: string;
  icon: string;
  active?: boolean;
}) {
  return (
    <li className={active ? "side-nav--active" : ""}>
      <Link to={link}>
        <svg>
          <use xlinkHref={`/img/icons.svg#icon-${icon}`} />
        </svg>
        {text}
      </Link>
    </li>
  );
}
