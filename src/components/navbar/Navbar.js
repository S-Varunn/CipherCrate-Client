import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRightFromBracket,
  faHamburger,
} from "@fortawesome/free-solid-svg-icons";
import "./Navbar.css";

function Navbar({ setGlobalPassphrase }) {
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.clear();
    setGlobalPassphrase("");
    navigate("/");
  };
  return (
    <section className="navigation">
      <div className="nav-container">
        <div className="nav-logo-container">
          <div className="nav-logo-info flex">
            <img className="nav-logo" src={logo} alt="Logo" />
            <p className="ml-10 fs-xl">Cipher Crate</p>
          </div>
        </div>
        <div className={showMenu ? "nav-menu mobile-menu-link" : "nav-menu"}>
          <ul>
            <li key="home">
              <a href="#!">Home</a>
            </li>
            <li key="about">
              <a href="#!">About</a>
            </li>

            <li key="portfolio">
              <a href="#!">Portfolio</a>
            </li>

            <li key="contact">
              <a href="#!">Contact</a>
            </li>
          </ul>
        </div>
        <div className="logout-button-container">
          <div className="logout-div">
            <p className="logout-text">Logout</p>
            <FontAwesomeIcon
              className="cursor"
              icon={faArrowRightFromBracket}
              onClick={() => {
                handleLogout();
              }}
            />
          </div>
        </div>
        <div className="ham-menu">
          <FontAwesomeIcon
            icon={faHamburger}
            onClick={() => setShowMenu(!showMenu)}></FontAwesomeIcon>
        </div>
      </div>
    </section>
  );
}

export default Navbar;
