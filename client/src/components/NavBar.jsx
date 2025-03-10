import { Link } from "react-router-dom";
import "../styles/NavBar.css";

const NavBar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <h1>Ink & Ivory</h1>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/artists">Artists</Link></li>
          <li><Link to="/gallery">Gallery</Link></li>
          <li><Link to="/contact">Contact</Link></li>
        </ul>
      </div>
    </nav>
  );
};

export default NavBar;
