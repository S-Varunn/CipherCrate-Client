import React, { useContext, useEffect } from "react";
import { useState } from "react";
import { initObject } from "../initVar";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Loading from "./helpers/Loading";
import logo from "../assets/logo.png";
import axios from "axios";
import { aesCbc256 } from "./passphrase/Masking";
import "./Login.css";
import Passphrase from "./passphrase/Passphrase";
import info_1 from "../assets/info_1.jpg";
import info_2 from "../assets/info_2.jpg";
import info_3 from "../assets/info_3.png";
import info_4 from "../assets/info_4.webp";

import { ChangeBackground } from "./helpers/ChangeBackground";

function Login() {
  const [signUp, setSignUp] = useState(true);
  const [modal, setModal] = useState(false);
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localPassphrase, setLocalPassphrase] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const { setPassphrase } = useContext(AuthContext);

  const images = [info_1, info_2, info_3, info_4];

  const [loadingAnimation, setLoadingAnimation] = useState(false);
  let navigate = useNavigate();

  useEffect(() => {
    ChangeBackground("login");
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (currentIndex === images.length - 1) {
        setCurrentIndex(0);
      } else {
        setCurrentIndex(currentIndex + 1);
      }
    }, 5000);

    return () => clearInterval(intervalId);
  }, [currentIndex, images.length]);

  const handleRegistration = (event) => {
    event.preventDefault();
    if (localPassphrase === "") {
      alert("Passphrase is required!");
      return;
    }
    console.log("Confirm the passphrase later:", localPassphrase);
    const encodedUserName = aesCbc256(userName);
    const encodedPassphrase = aesCbc256(localPassphrase);
    const encodedPassword = aesCbc256(password);
    const encodedEmail = aesCbc256(email);

    const headers = {
      "Content-Type": "application/json",
    };
    const body = {
      userName: encodedUserName,
      email: encodedEmail,
      password: encodedPassword,
      passphrase: encodedPassphrase,
    };
    axios
      .post(`${initObject.url}/register`, body, { headers: headers })
      .then((res) => {
        // console.log(res);
        localStorage.setItem("userName", userName);
        localStorage.setItem("email", email);
        localStorage.setItem("token", res.data.token);
        setPassphrase(localPassphrase);
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

    const encodedEmail = aesCbc256(email);
    const encodedPassword = aesCbc256(password);

    const body = {
      email: encodedEmail,
      password: encodedPassword,
    };

    axios
      .post(`${initObject.url}/signup`, body, { headers: headers })
      .then((res) => {
        localStorage.setItem("userName", res.data.userName);
        localStorage.setItem("email", email);
        localStorage.setItem("token", res.data.token);
        setLoadingAnimation(false);
        if (res.data.status === "ok") navigate("dashboard");
      })
      .catch((err) => {
        console.error(err);
      });
  };
  const handlePassphraseChange = (newValue) => {
    setLocalPassphrase(newValue);
  };
  const handleModalClose = () => {
    setModal(false);
  };

  return (
    <div className="login-container">
      <Passphrase
        value={localPassphrase}
        onPassphraseChange={handlePassphraseChange}
        onSubmit={handleRegistration}
        onModalClose={handleModalClose}
        modal={modal}
        heading="Decide your passphrase!"
        message="You can only enter the Passphrase once, so decide it carefully and
          note it down somewhere. The Passphrase cannot be changed nor modified.
          (32 character long)"
      />

      <div className="page-elements">
        <div className="login-page">
          {loadingAnimation && <Loading />}
          <div className="form">
            <div className="logo">
              <img src={logo} alt="Logo" />
              {signUp ? <h2>Login</h2> : <h2>Register</h2>}
            </div>
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
                    }}>
                    Create an account
                  </p>
                </div>
                <div className="options">
                  <p className="message">Forget password? </p>
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
                    }}>
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
                    }}>
                    Sign In
                  </p>
                </div>
              </div>
            )}
          </div>
          <div className="info-container">
            <div className="image-container trans">
              <img
                className="image trans"
                src={images[currentIndex]}
                alt="info"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
