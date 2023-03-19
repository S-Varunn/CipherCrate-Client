import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import logo from "../../assets/logo.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRightFromBracket,
  faHamburger,
} from "@fortawesome/free-solid-svg-icons";
import "./Navbar.css";

function Navbar() {
  const { setUser, setToken } = useContext(AuthContext);
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();
  const handleLogout = () => {
    setUser(null);
    setToken(null);
    navigate("/");
  };
  return (
    <section class="navigation">
      <div class="nav-container">
        <div class="nav-logo-container">
          <div className="flex">
            <img className="nav-logo" src={logo} alt="Logo" />
            <p className="ml-10 fs-xl">Cipher Crate</p>
          </div>
        </div>
        <div className={showMenu ? "nav-menu mobile-menu-link" : "nav-menu"}>
          <ul>
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
          </ul>
        </div>
        <div
          className="logout-button-container"
          onClick={() => {
            handleLogout();
          }}
        >
          <div className="logout-div">
            <p className="logout-text">Logout</p>
            <FontAwesomeIcon icon={faArrowRightFromBracket} />
          </div>
        </div>
        <div className="ham-menu">
          <FontAwesomeIcon
            icon={faHamburger}
            onClick={() => setShowMenu(!showMenu)}
          ></FontAwesomeIcon>
        </div>
      </div>
    </section>
  );
}

export default Navbar;
