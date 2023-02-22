import React from "react";
import { useState, useEffect } from "react";
import { initObject } from "../initVar";
import logo from "../assets/logo.png";
import axios from "axios";
import "./Login.css";

function Login() {
  const [signUp, setSignUp] = useState(true);
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    // action on update of movies
  }, [signUp, userName, email, password]);

  const handleRegistration = async (event) => {
    event.preventDefault();
    const headers = {
      "Content-Type": "application/json",
    };
    const body = {
      userName,
      email,
      password,
    };
    await axios
      .post(`${initObject.url}/register`, body, { headers: headers })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.error(err);
      });
  };
  const handleSignIn = async (event) => {
    event.preventDefault();
    const headers = {
      "Content-Type": "application/json",
    };
    const body = {
      email,
      password,
    };
    await axios
      .post(`${initObject.url}/signup`, body, { headers: headers })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.error(err);
      });
  };
  return (
    <div className="login-page">
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
