import React from "react";
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { saveAs } from "file-saver";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import toast from "react-hot-toast";
import { initObject } from "../../initVar";
import Navbar from "../navbar/Navbar";
import Passphrase from "../passphrase/Passphrase";
import CheckBox from "./CheckBox";
import Card from "./Card";
import { ChangeBackground } from "../helpers/ChangeBackground";
import { fileSizeFormatter } from "../Helpers";
import { aesCbc256 } from "../passphrase/Masking";
import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();
  const { globalPassphrase, setGlobalPassphrase } = useContext(AuthContext);
  const [passphrase, setPassphrase] = useState(globalPassphrase);
  const [file, setFile] = useState("");
  const [modal, setModal] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [filterTags, setFilterTags] = useState([]);

  useEffect(() => {
    ChangeBackground("login");
    setPassphrase(globalPassphrase);
    if (globalPassphrase === "" || globalPassphrase === null) setModal(true);
    else {
      fetchFileList();
      setModal(false);
    }
  }, [globalPassphrase]);

  useEffect(() => {
    console.log("In dashboard : ", filterTags);
  }, [filterTags]);

  useEffect(() => {
    if (!localStorage.getItem("userName") && !localStorage.getItem("token")) {
      // console.log(
      //   "Todo: On first login or register the state is set but time lag makes this useEffect redirect back to login"
      // );
      // console.log(
      //   "for now redirecting back to login but in future show a notification and make the redirect"
      // );

      navigate("/");
    }
  }, [navigate]);

  function fetchFileList() {
    const headers = {
      "Content-Type": "application/json",
      "x-access-token": localStorage.getItem("token"),
    };
    let email = aesCbc256(localStorage.getItem("email"));

    axios
      .post(
        `${initObject.url}/filelist`,
        {
          email,
          passphrase: aesCbc256(passphrase),
        },
        { headers }
      )
      .then((res) => {
        setFileList(res.data.fileList);
        console.log(res.data);
      });
  }
  const handleFileChange = (e) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleUploadClick = () => {
    if (!file) {
      toast.error("Choose a file to upload!");
      return;
    }
    let email = aesCbc256(localStorage.getItem("email"));
    let userName = aesCbc256(localStorage.getItem("userName"));
    let token = localStorage.getItem("token");
    const metadata = {
      name: aesCbc256(file.name),
      size: file.size,
      type: file.type,
      user: { userName, email },
      passphrase: aesCbc256(passphrase),
    };

    const fileSplits = file.name.split(".");
    const fileType = fileSplits[fileSplits.length - 1];

    let newFile = {
      filename: file.name,
      size: fileSizeFormatter(file.size),
      date: new Date().toISOString(),
      encryptedFileName: "notgenerated",
      type: fileType,
    };

    setFileList([...fileList, newFile]);
    console.log(fileList);
    console.log(newFile);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("metadata", JSON.stringify(metadata));
    axios
      .post(`${initObject.url}/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "x-access-token": token,
        },
      })
      .then((res) => {})
      .catch((err) => {});
  };

  const handlePassphraseChange = (newValue) => {
    setPassphrase(newValue);
  };
  const handleModalClose = () => {
    let email = localStorage.getItem("email");

    const headers = {
      "Content-Type": "application/json",
      "x-access-token": localStorage.getItem("token"),
    };

    if (passphrase !== null && passphrase !== "") {
      axios
        .post(
          `${initObject.url}/checkPassphrase`,
          { email: aesCbc256(email), passphrase: aesCbc256(passphrase) },
          {
            headers,
          }
        )
        .then((res) => {
          toast.success(res.data.message);
          setGlobalPassphrase(passphrase);
          let email = aesCbc256(localStorage.getItem("email"));

          axios
            .post(
              `${initObject.url}/filelist`,
              {
                email,
                passphrase: aesCbc256(passphrase),
              },
              { headers }
            )
            .then((res) => {
              setFileList(res.data.fileList);
              console.log(res.data);
            });
          setModal(false);
        })
        .catch((err) => {
          toast.error(err.response.data.message);
        });

      //
    }
  };

  const handleDownload = (fileName, originalFileName) => {
    const pp = encodeURIComponent(aesCbc256(passphrase));
    const em = encodeURIComponent(localStorage.getItem("email"));
    const fn = encodeURIComponent(fileName);
    axios
      .get(
        `${initObject.url}/download?email=${em}&passphrase=${pp}&fileName=${fn}`,
        {
          responseType: "blob",
          "x-access-token": localStorage.getItem("token"),
        }
      )
      .then((response) => {
        let binaryData = [];
        binaryData.push(response.data);
        saveAs(new Blob(binaryData), originalFileName);
      });
  };

  const filterHandler = (event) => {
    if (event.target.checked) {
      setFilterTags([...filterTags, event.target.value]);
    } else {
      setFilterTags(
        filterTags.filter((filterTag) => filterTag !== event.target.value)
      );
    }
  };

  return (
    <div className="dashboard-container">
      <Navbar setGlobalPassphrase={setGlobalPassphrase} />
      <Passphrase
        value={passphrase}
        toast={toast}
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
            <div className="dashed-border">
              <input id="file" type="file" onChange={handleFileChange} />
            </div>
            <div>
              {file ? (
                <>
                  <p className="upload-text-header">Name: {file.name}</p>
                  <p className="upload-text">Size: {file.type}</p>
                </>
              ) : (
                <p className="upload-text-header">Choose a file to upload</p>
              )}
            </div>
            <button className="weird-button" onClick={handleUploadClick}>
              Upload
            </button>
          </div>
        </div>
        <div className="file-list-container">
          <div className="options-container">
            <div className="filter-sort">
              <div className="filter">
                {fileList
                  .map((item) => item.type)
                  .filter((value, index, self) => self.indexOf(value) === index)
                  .map((value) => {
                    console.log(value);
                    return (
                      <CheckBox type={value} filterHandler={filterHandler} />
                    );
                  })}
              </div>
              <div className="sort"></div>
            </div>
          </div>
          <div className="scrollable-file-list">
            {fileList
              .filter((value) => filterTags.includes(value.type))
              .map((file, index) => {
                return (
                  <Card
                    handleDownload={handleDownload}
                    key={file.filename}
                    file={file}
                  />
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
