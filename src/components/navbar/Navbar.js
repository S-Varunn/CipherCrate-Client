import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "./Navbar.css";

function Navbar() {
  const { setUser, setToken } = useContext(AuthContext);
  const navigate = useNavigate();
  const handleLogout = () => {
    setUser(null);
    setToken(null);
    navigate("/");
  };
  return (
    <section class="navigation">
      <div class="nav-container">
        <div class="brand">
          <a href="#!">Logo</a>
        </div>
        <nav>
          <div class="nav-mobile">
            <a id="navbar-toggle" href="#!">
              <span></span>
            </a>
          </div>
          <ul class="nav-list">
            <li>
              <a href="#!">Home</a>
            </li>
            <li>
              <a href="#!">About</a>
            </li>

            <li>
              <a href="#!">Portfolio</a>
            </li>

            <li>
              <a href="#!">Contact</a>
            </li>
            <button
              className="logout-button"
              onClick={() => {
                handleLogout();
              }}
            >
              Logout
            </button>
          </ul>
        </nav>
      </div>
    </section>
  );
}

export default Navbar;
