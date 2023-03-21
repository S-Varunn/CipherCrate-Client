import React from "react";
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { initObject } from "../../initVar";
import Navbar from "../navbar/Navbar";
import Passphrase from "../passphrase/Passphrase";
import Card from "./Card";
import { ChangeBackground } from "../helpers/ChangeBackground";
import { aesCbc256 } from "../passphrase/Masking";
import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();
  const { passphrase, setPassphrase } = useContext(AuthContext);
  const [file, setFile] = useState("");
  const [modal, setModal] = useState(passphrase ? false : true);
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    ChangeBackground("login");
    let email = aesCbc256(localStorage.getItem("email"));
    console.log(email);

    // if (localStorage.getItem("userName") && localStorage.getItem("token")) {
    //   console.log("In here");
    //   axios.get(`${initObject.url}/filelist/${email}`).then((res) => {
    //     setFileList(res.data);
    //     console.log(res.data);
    //   });
    // }
    let fileList = [
      {
        fileName: "records.pdf",
        date: "2023-03-04T10:22:21.042Z",
        size: "1788704",
        fileType: "pdf",
      },
      {
        fileName: "nezuko-chan.pdf",
        date: "2023-03-04T10:22:21.042Z",
        size: "1788704",
        fileType: "ppt",
      },
      {
        fileName: "buta-san.pdf",
        date: "2023-03-04T10:22:21.042Z",
        size: "1788704",
        fileType: "doc",
      },
    ];
    setFileList(fileList);
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
    let token = localStorage.getItem("token");
    const metadata = {
      name: file.name,
      type: file.type,
      user: { userName, email },
      token,
    };
    const formData = new FormData();
    formData.append("file", file);
    formData.append("metadata", JSON.stringify(metadata));
    axios.post(`${initObject.url}/upload`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        "x-access-token": token,
      },
    });
  };

  const handlePassphraseChange = (newValue) => {
    setPassphrase(newValue);
  };
  const handleModalClose = () => {
    let email = localStorage.getItem("email");
    // let userName = localStorage.getItem("userName");
    let token = localStorage.getItem("token");

    if (passphrase !== null && passphrase !== "") {
      axios
        .post(
          `${initObject.url}/checkPassphrase`,
          { email: aesCbc256(email), passphrase: aesCbc256(passphrase) },
          {
            headers: {
              "Content-Type": "application/json",
              "x-access-token": token,
            },
          }
        )
        .then((res) => {
          if (res.data.status === "ok") {
            alert("Good pp");
            setModal(false);
          } else alert("Bad pp, try again");
        });

      //
    }
  };

  console.log("Passphrase", passphrase);

  return (
    <div className="dashboard-container">
      <Navbar setPassphrase={setPassphrase} />
      <Passphrase
        value={passphrase}
        onPassphraseChange={handlePassphraseChange}
        onSubmit={handleModalClose}
        onModalClose={handleModalClose}
        modal={modal}
        heading="Enter your passphrase"
        message="We persist your passphrase only for the session!"
      />
      <div className="main-container">
        <div className="upload-file">
          <div>
            <input id="file" type="file" onChange={handleFileChange} />

            <div>{file && `${file.name} - ${file.type}`}</div>

            <button onClick={handleUploadClick}>Upload</button>
          </div>
        </div>
        <div className="file-list-container">
          {fileList.map((file) => {
            return <Card key={file.fileName} file={file} />;
          })}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
