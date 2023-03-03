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
    <div>
      <button
        onClick={() => {
          handleLogout();
        }}
      >
        logout
      </button>
    </div>
  );
}

export default Navbar;
