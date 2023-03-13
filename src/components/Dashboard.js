import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { initObject } from "../initVar";
import Navbar from "./navbar/Navbar";
import { ChangeBackground } from "./helpers/ChangeBackground";

function Dashboard() {
  const navigate = useNavigate();
  const [file, setFile] = useState("");
  const [fileList, setFileList] = useState("");

  useEffect(() => {
    ChangeBackground("dashboard");
    console.log("dbody", document.getElementById("background-image"));
    let email = localStorage.getItem("email");
    if (localStorage.getItem("userName") && localStorage.getItem("token"))
      axios
        .get(
          `${initObject.url}/filelist`,
          { email },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then((res) => {
          setFileList(res.data.fileList);
          console.log(res.data.fileList);
        });
    if (!localStorage.getItem("userName") && !localStorage.getItem("token")) {
      console.log(
        "Todo: On first login or register the state is set but time lag makes this useEffect redirect back to login"
      );
      console.log(
        "for now redirecting back to login but in future show a notification and make the redirect"
      );

      navigate("/");
    }
  }, [navigate]);

  const handleFileChange = (e) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleUploadClick = () => {
    if (!file) {
      return;
    }
    let email = localStorage.getItem("email");
    let userName = localStorage.getItem("userName");
    const metadata = {
      name: file.name,
      type: file.type,
      user: { userName, email },
    };
    console.log(metadata);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("metadata", JSON.stringify(metadata));
    const response = axios.post(`${initObject.url}/upload`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    console.log(response.data);
  };

  return (
    <div className="dashboard-container">
      <Navbar />
      <div>
        <div className="show-uploaded-files">
          <ul>
            <li>
              Fugiat non ex voluptate fugiat excepteur reprehenderit ad
              consequat do consequat voluptate quis.
            </li>
            <li>
              Fugiat non ex voluptate fugiat excepteur reprehenderit ad
              consequat do consequat voluptate quis.
            </li>
            <li>
              Fugiat non ex voluptate fugiat excepteur reprehenderit ad
              consequat do consequat voluptate quis.
            </li>
            <li>
              Fugiat non ex voluptate fugiat excepteur reprehenderit ad
              consequat do consequat voluptate quis.
            </li>
          </ul>
        </div>

        <div className="upload-file">
          <div>
            <input type="file" onChange={handleFileChange} />

            <div>{file && `${file.name} - ${file.type}`}</div>

            <button onClick={handleUploadClick}>Upload</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
