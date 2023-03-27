import React, { useContext, useEffect } from "react";
import { useState } from "react";
import { initObject } from "../initVar";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import toast, { Toaster } from "react-hot-toast";
import Loading from "./helpers/Loading";
import logo from "../assets/logo.png";
import axios from "axios";
import validator from "validator";
import { aesCbc256 } from "./passphrase/Masking";
import "./Login.css";
import Passphrase from "./passphrase/Passphrase";
import info_0 from "../assets/info_1.jpg";
import info_1 from "../assets/info_2.jpg";
import info_2 from "../assets/info_3.png";
import info_3 from "../assets/info_4.webp";
import Carousel from "better-react-carousel";

import { ChangeBackground } from "./helpers/ChangeBackground";

function Login() {
  const [signUp, setSignUp] = useState(true);
  const [modal, setModal] = useState(false);
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localPassphrase, setLocalPassphrase] = useState("");
  const [loadingAnimation, setLoadingAnimation] = useState(false);
  const { setGlobalPassphrase } = useContext(AuthContext);

  const description = [
    "Protect your files with ease, featuring secure storage and reliable encryption for ultimate peace of mind",
    "Streamline your workflow and eliminate hassle with our user-friendly app, designed for effortless use and low maintenance",
    "Fortify your data with our cutting-edge system, featuring unbreakable encryption for unparalleled data confidentiality",
    "Highly secure and 2FA enabled",
  ];

  let navigate = useNavigate();

  useEffect(() => {
    console.log("In login : ", modal);
  }, [modal]);

  useEffect(() => {
    ChangeBackground("login");
  }, []);

  const validate = () => {
    if (userName.length == 0 || email.length == 0 || password.length == 0) {
      toast.error("Email or Password cannot be empty");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      toast.error("Incorrect email format");
      return false;
    }
    if (
      !validator.isStrongPassword(password, {
        minLength: 8,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
    ) {
      toast.error(
        "Passwords needs to be at least 8 characters and have 1 Uppercase, 1 Number and 1 Symbol"
      );
      return false;
    }
    return true;
  };
  const handleRegistration = (event) => {
    event.preventDefault();

    if (localPassphrase === "" || localPassphrase.length != 32) {
      toast.error("Passphrase is required and needs to be 32 Characters long!");
      return;
    }
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
        localStorage.setItem("userName", userName);
        localStorage.setItem("email", email);
        localStorage.setItem("token", res.data.token);
        setGlobalPassphrase(localPassphrase);
        setModal(false);
        toast.success(res.data.message);
        navigate("/dashboard");
      })
      .catch((err) => {
        toast.error(err.response.data.message);
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
        toast.success("Successfully signed in!");
        setLoadingAnimation(false);
        navigate("dashboard");
      })
      .catch((err) => {
        toast.error(err.response.data.message);
        console.error(err.response);
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
        toast={toast}
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
                  <p className="message">Forgot password? </p>
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
                      if (validate()) setModal(true);
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
            <div className="image-container">
              <Carousel
                cols={1}
                rows={1}
                gap={1}
                autoplay={3000}
                loop
                showDots
                hideArrow
                dotColorActive="#2196F3"
                maxLength={"100px"}
                containerClassName="image-carousel">
                <Carousel.Item>
                  <div className="flex center">
                    <img className="image" src={info_0} alt="info" />
                  </div>
                  <p className="info-text">{description[0]}</p>
                </Carousel.Item>
                <Carousel.Item>
                  <div className="flex center">
                    <img className="image" src={info_1} alt="info" />
                  </div>
                  <p className="info-text">{description[1]}</p>
                </Carousel.Item>
                <Carousel.Item>
                  <div className="flex center">
                    <img className="image" src={info_2} alt="info" />
                  </div>
                  <p className="info-text">{description[2]}</p>
                </Carousel.Item>
                <Carousel.Item>
                  <div className="flex center">
                    <img className="image" src={info_3} alt="info" />
                  </div>
                  <p className="info-text">{description[3]}</p>
                </Carousel.Item>
              </Carousel>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
