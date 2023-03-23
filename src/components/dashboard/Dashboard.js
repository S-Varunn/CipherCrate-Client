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
import SearchBar from "./SearchBar";
import Card from "./Card";
import { ChangeBackground } from "../helpers/ChangeBackground";
import { fileSizeFormatter } from "../Helpers";
import { aesCbc256 } from "../passphrase/Masking";
import noData from "../../assets/no-data.svg";
import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();
  const { globalPassphrase, setGlobalPassphrase } = useContext(AuthContext);
  const [passphrase, setPassphrase] = useState(globalPassphrase);
  const [file, setFile] = useState("");
  const [modal, setModal] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [filterTags, setFilterTags] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [keyword, setKeyword] = useState("");

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
    let filtered = fileList.filter((list) => {
      return `${list.filename.toLowerCase()}`.includes(keyword.toLowerCase());
    });
    if (filterTags.length > 0)
      filtered = filtered.filter((value) => filterTags.includes(value.type));

    setFilteredList(filtered);
  }, [filterTags, keyword]);

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

  const updateKeyword = (keyword) => {
    setKeyword(keyword);
  };

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
      });
  }
  const handleFileChange = (e) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleUploadClick = async () => {
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

    const formData = new FormData();
    formData.append("file", file);
    formData.append("metadata", JSON.stringify(metadata));
    // const promise = await

    // console.log(promise);

    toast.promise(
      axios
        .post(`${initObject.url}/upload`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            "x-access-token": token,
          },
        })
        .then((res) => {
          let currentFileList = [...fileList, newFile];
          setFileList(currentFileList);
          fetchFileList();
          return { message: "File uploaded successfully!", success: true };
        })
        .then((data) => {
          return { message: data.message, success: true };
        }),
      {
        loading: "Encrypting and uploading your file... Please wait...",
        success: "File has been successfully uploaded!",
        error: (error) => `${error.response.data.message}`,
      }
    );
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
            });
          setModal(false);
        })
        .catch((err) => {
          toast.error(err.response.data.message);
        });
    }
  };

  const handleDownload = (fileName, originalFileName) => {
    const pp = encodeURIComponent(aesCbc256(passphrase));
    const em = encodeURIComponent(localStorage.getItem("email"));
    const fn = encodeURIComponent(fileName);
    const promise = axios
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
    toast.promise(promise, {
      loading: "Initiating download! Please wait...",
      success: "Download Successful!",
      error: "Error when downloading file :(",
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

  // filteredList = fileList.filter((value) => filterTags.includes(value.type));

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
        <div className="main-info-container">
          <div className="search-bar-container">
            <SearchBar keyword={keyword} onChange={updateKeyword} />
          </div>
          <div className="file-list-container">
            <div className="options-container">
              <div className="filter-sort">
                <div className="filter">
                  <p className="filter-header">Filter</p>
                  <div
                    className={
                      fileList.length !== 0
                        ? "filter-empty display-none"
                        : "filter-empty"
                    }>
                    <p className="error-text">No filters yet!</p>
                  </div>
                  <div
                    className={
                      fileList.length === 0
                        ? "filter-checkboxes display-none"
                        : "filter-checkboxes"
                    }>
                    {fileList
                      .map((item) => item.type)
                      .filter(
                        (value, index, self) => self.indexOf(value) === index
                      )
                      .map((value) => {
                        return (
                          <CheckBox
                            type={value}
                            filterHandler={filterHandler}
                          />
                        );
                      })}
                  </div>
                </div>
                <div className="sort"></div>
              </div>
            </div>
            <div
              className={
                fileList.length !== 0
                  ? "file-not-found-container display-none"
                  : "file-not-found-container"
              }>
              <div className="flex-center">
                <img className="file-not-found" src={noData} />
                <p className="error-text">
                  Welcome {localStorage.getItem("userName")}! Get started by
                  uploading a file ;)
                </p>
              </div>
            </div>
            <div
              className={
                fileList.length === 0
                  ? "scrollable-file-list display-none"
                  : "scrollable-file-list"
              }>
              {(filterTags.length == 0 && keyword.length == 0
                ? fileList
                : filteredList
              ).map((file, index) => {
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
    </div>
  );
}

export default Dashboard;
