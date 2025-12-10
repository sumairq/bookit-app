import { Link } from "react-router-dom";
import { useAuth } from "../context/useAuth";

interface User {
  name: string;
  photo: string;
}

interface HeaderProps {
  user?: User | null;
  onLogout?: () => void;
}

export default function Header({ onLogout }: HeaderProps) {
  const { user } = useAuth();
  return (
    <header className="header">
      {/* Left navigation */}
      <nav className="nav nav--tours">
        <Link className="nav__el" to="/">
          All tours
        </Link>
      </nav>

      {/* Logo */}
      <div className="header__logo">
        <img src="/img/logo-white.png" alt="Natours logo" />
      </div>

      {/* User navigation */}
      <nav className="nav nav--user">
        {user ? (
          <>
            {/* Log out button */}
            <button className="nav__el nav__el--logout" onClick={onLogout}>
              Log out
            </button>

            {/* User profile */}
            <Link className="nav__el" to="/me">
              <img
                className="nav__user-img"
                src={`/img/users/${user.photo}`}
                alt={`Photo of ${user.name}`}
              />
              <span>{user.name.split(" ")[0]}</span>
            </Link>
          </>
        ) : (
          <>
            <Link className="nav__el" to="/login">
              Log in
            </Link>
            <Link className="nav__el nav__el--cta" to="/signup">
              Sign up
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}
