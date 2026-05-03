import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { getUserAvatar } from "../utils/images";

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="site-header">
      <div className="site-header__bar">
        <nav className="nav nav--left" aria-label="Primary">
          <NavLink className="nav__link" to="/" end>
            Discover
          </NavLink>
          {user && (
            <NavLink className="nav__link" to="/my-experiences">
              My Trips
            </NavLink>
          )}
          {user && (user.role === "admin" || user.role === "lead-guide") && (
            <NavLink className="nav__link" to="/admin">
              Admin
            </NavLink>
          )}
        </nav>

        <Link className="brand" to="/" aria-label="Bookit — home">
          <span className="brand__mark" aria-hidden="true">B</span>
          <span className="brand__word">
            book<em>it</em>
          </span>
        </Link>

        <nav className="nav nav--right" aria-label="Account">
          {user ? (
            <>
              <button className="nav__link" onClick={logout}>
                Sign out
              </button>
              <Link className="nav__link" to="/me">
                <img
                  className="nav__avatar"
                  src={getUserAvatar(user.photo, 60)}
                  alt=""
                />
                <span>{user.name.split(" ")[0]}</span>
              </Link>
            </>
          ) : (
            <>
              <Link className="nav__link" to="/login">
                Sign in
              </Link>
              <Link className="nav__link nav__link--cta" to="/signup">
                Join Bookit
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
