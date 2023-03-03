import React, { useContext } from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { initObject } from "../initVar";
import Navbar from "./navbar/Navbar";
import { AuthContext } from "../context/AuthContext";

function Dashboard() {
  const { token, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [file, setFile] = useState("");

  useEffect(() => {
    console.log(token, user);
    if (!user && !token) {
      console.log(
        "Todo: On first login or register the state is set but time lag makes this useEffect redirect back to login"
      );
      console.log(
        "for now redirecting back to login but in future show a notification and make the redirect"
      );

      navigate("/");
    }
  }, [token, user, navigate]);

  const handleFileChange = (e) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleUploadClick = () => {
    if (!file) {
      return;
    }

    const data = new FormData();
    data.append("file", file);

    const headers = {
      "content-type": file.type,
      "content-length": `${file.size}`, // 👈 Headers need to be a string
    };

    axios
      .post(`${initObject.url}/upload`, data, { headers: headers })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <div className="dashboard-container">
      <Navbar />
      <div className="upload-file">
        <div>
          <input type="file" onChange={handleFileChange} />

          <div>{file && `${file.name} - ${file.type}`}</div>

          <button onClick={handleUploadClick}>Upload</button>
        </div>
      </div>
      <div className="show-uploaded-files"></div>
    </div>
  );
}

export default Dashboard;
