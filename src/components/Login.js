import React, { useContext } from "react";
import { useState } from "react";
import { initObject } from "../initVar";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Loading from "./loading/Loading";
import logo from "../assets/logo.png";
import axios from "axios";
import { aesCbc256 } from "./passphrase/Masking";
import "./Login.css";
import Passphrase from "./passphrase/Passphrase";

function Login() {
  const { setToken, setUser } = useContext(AuthContext);
  const [signUp, setSignUp] = useState(true);
  const [modal, setModal] = useState(false);
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passphrase, setPassphrase] = useState("");

  const [loadingAnimation, setLoadingAnimation] = useState(false);
  let navigate = useNavigate();

  const handleRegistration = (event) => {
    event.preventDefault();
    if (passphrase === "") {
      alert("Passphrase is required!");
      return;
    }
    console.log("Confirm the passphrase later:", passphrase);

    const encodedPassphrase = aesCbc256(passphrase);
    const encodedPassword = aesCbc256(password);

    console.log("encrypted password: ", encodedPassphrase); // result is 9EF/QLpR+o/KrVueiI4L0g==

    const headers = {
      "Content-Type": "application/json",
    };
    const body = {
      userName,
      email,
      password: encodedPassword,
      passphrase: encodedPassphrase,
    };
    axios
      .post(`${initObject.url}/register`, body, { headers: headers })
      .then((res) => {
        console.log(res);
        setUser({ userName, email });
        setToken(res.data.token);

        navigate("/dashboard");
      })
      .catch((err) => {
        console.error(err);
      });
  };
  const handleSignIn = (event) => {
    event.preventDefault();
    setLoadingAnimation(true);
    const headers = {
      "Content-Type": "application/json",
    };

    const encodedPassword = aesCbc256(password);

    const body = {
      email,
      password: encodedPassword,
    };
    axios
      .post(`${initObject.url}/signup`, body, { headers: headers })
      .then((res) => {
        setUser({ email, userName: res.data.userName });
        setToken(res.data.token);
        setLoadingAnimation(false);
        if (res.data.status === "ok") navigate("dashboard");
      })
      .catch((err) => {
        console.error(err);
      });
  };
  const handlePassphraseChange = (newValue) => {
    setPassphrase(newValue);
  };
  const handleModalClose = () => {
    setModal(false);
  };
  return (
    <div className="login-container">
      {modal && (
        <Passphrase
          value={passphrase}
          onPassphraseChange={handlePassphraseChange}
          onSubmit={handleRegistration}
          onModalClose={handleModalClose}
        />
      )}

      <div className="login-page">
        {loadingAnimation && <Loading />}
        <div className="logo">
          <img src={logo} alt="Logo" />
        </div>
        <div className="form">
          <h2>Login</h2>
          {signUp ? (
            <div>
              <form onSubmit={handleSignIn}>
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                />
                <button className="main_button">Log in</button>
              </form>
              <div className="options">
                <p className="message">Not registered? </p>
                <p
                  className="link"
                  onClick={(e) => {
                    setSignUp(false);
                    setEmail("");
                    setPassword("");
                    setUserName("");
                  }}
                >
                  Create an account
                </p>
              </div>
              <div className="options">
                <p className="message">Forgot your password? </p>
                <p className="link">Click here to reset it</p>
              </div>
            </div>
          ) : (
            <div>
              <form>
                <input
                  type="text"
                  placeholder="Username"
                  value={userName}
                  onChange={(e) => {
                    setUserName(e.target.value);
                  }}
                />
                <input
                  type="email"
                  value={email}
                  placeholder="Email"
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                />
                <button
                  className="main_button"
                  onClick={(event) => {
                    event.preventDefault();
                    setModal(true);
                  }}
                >
                  Register
                </button>
              </form>
              <div className="options">
                <p className="message">Have an account? </p>
                <p
                  className="link"
                  onClick={() => {
                    setSignUp(true);
                    setEmail("");
                    setPassword("");
                    setUserName("");
                  }}
                >
                  Sign In
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Login;
