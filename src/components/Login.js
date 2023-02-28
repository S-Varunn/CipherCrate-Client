import React from "react";
import { useState } from "react";
import { initObject } from "../initVar";
import { useNavigate } from "react-router-dom";
import Loading from "./loading/Loading";
import logo from "../assets/logo.png";
import axios from "axios";
import "./Login.css";

function Login() {
  const [signUp, setSignUp] = useState(true);
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loadingAnimation, setLoadingAnimation] = useState(false);
  let navigate = useNavigate();

  const handleRegistration = (event) => {
    event.preventDefault();
    const headers = {
      "Content-Type": "application/json",
    };
    const body = {
      userName,
      email,
      password,
    };
    axios
      .post(`${initObject.url}/register`, body, { headers: headers })
      .then((res) => {
        console.log(res);
        navigate("passphrase");
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
    const body = {
      email,
      password,
    };
    axios
      .post(`${initObject.url}/signup`, body, { headers: headers })
      .then((res) => {
        localStorage.setItem("token", res.data.token);
        setLoadingAnimation(false);
        navigate("dashboard");
      })
      .catch((err) => {
        console.error(err);
      });
  };
  return (
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
            <p className="message">
              Not registered?{" "}
              <a
                className="pointer"
                onClick={(e) => {
                  setSignUp(false);
                  setEmail("");
                  setPassword("");
                  setUserName("");
                }}
              >
                Create an account
              </a>
            </p>
            <p className="message">
              Forgot your password?{" "}
              <a className="pointer">Click here to reset it</a>
            </p>
          </div>
        ) : (
          <div>
            <form onSubmit={handleRegistration}>
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
              <button className="main_button">Register</button>
            </form>
            <p className="message">
              Have an account?{" "}
              <a
                className="pointer"
                onClick={() => {
                  setSignUp(true);
                  setEmail("");
                  setPassword("");
                  setUserName("");
                }}
              >
                Sign In
              </a>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Login;
