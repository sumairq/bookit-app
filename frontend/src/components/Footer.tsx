export default function Footer() {
  return (
    <footer className="footer">
      {/* Logo */}
      <div className="footer__logo">
        <img src="/img/logo-green.png" alt="Natour logo" />
      </div>

      {/* Navigation links */}
      <ul className="footer__nav">
        <li>
          <a href="#">About us</a>
        </li>
        <li>
          <a href="#">Download apps</a>
        </li>
        <li>
          <a href="#">Become a guide</a>
        </li>
        <li>
          <a href="#">Careers</a>
        </li>
        <li>
          <a href="#">Contact</a>
        </li>
      </ul>

      {/* Copyright */}
      <p className="footer__copyright">&copy; by Sumair Qaisar.</p>
    </footer>
  );
}
