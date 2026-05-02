import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="site-footer__top">
          <div>
            <p className="footer-mast">
              Pack lighter,<br />
              <em>arrive deeper.</em>
            </p>
            <p className="eyebrow" style={{ marginTop: "1.4rem", color: "rgba(241,236,225,0.55)" }}>
              Issue No. 042 — Spring / Summer
            </p>
          </div>

          <div className="footer-col">
            <h4 className="footer-col__title">Explore</h4>
            <ul>
              <li><Link to="/">All experiences</Link></li>
              <li><a href="#">By city</a></li>
              <li><a href="#">By season</a></li>
              <li><a href="#">Editor's picks</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4 className="footer-col__title">Bookit</h4>
            <ul>
              <li><a href="#">Our manifesto</a></li>
              <li><a href="#">Become a host</a></li>
              <li><a href="#">Press kit</a></li>
              <li><a href="#">Careers</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4 className="footer-col__title">Help</h4>
            <ul>
              <li><a href="#">Contact</a></li>
              <li><a href="#">Privacy</a></li>
              <li><a href="#">Terms</a></li>
              <li><a href="#">Refunds</a></li>
            </ul>
          </div>
        </div>

        <div className="site-footer__bottom">
          <span>© {new Date().getFullYear()} Bookit Editions</span>
          <span>Printed on the open web · Made for the curious</span>
        </div>
      </div>
    </footer>
  );
}
