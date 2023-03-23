import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDownload,
  faFilePdf,
  faFileZipper,
  faFileWord,
  faFileImage,
} from "@fortawesome/free-solid-svg-icons";
import { faFilePowerpoint, faFile } from "@fortawesome/free-regular-svg-icons";
import "./Card.css";

function Card({ file, handleDownload }) {
  const [cardType, setCardType] = useState({});

  useEffect(() => {
    fileIconSelect();
  }, []);
  const fileIconSelect = () => {
    if (file.type)
      switch (file.type) {
        case "pdf":
          setCardType({
            color: "#ff3131",
            icon: faFilePdf,
          });
          break;
        case "pptx":
        case "ppt":
          setCardType({
            color: "yellow",
            icon: faFilePowerpoint,
          });
          break;
        case "doc":
        case "docx":
        case "word":
          setCardType({
            color: "blue",
            icon: faFileWord,
          });
          break;
        case "svg":
        case "jpg":
        case "jpeg":
        case "png":
        case "gif":
          setCardType({
            color: "#3cb4ff",
            icon: faFileImage,
          });
          break;
        case "mp3":
        case "mp4":
          // setImg(mp3);
          break;
        case "zip":
          setCardType({
            color: "brown",
            icon: faFileZipper,
          });
          break;
        default:
          setCardType({
            color: "green",
            icon: faFile,
          });
      }
  };
  return (
    <div
      className="file-card-container"
      style={{ borderLeft: "4px solid " + cardType.color }}
    >
      <div className="file-image-container">
        <FontAwesomeIcon
          className="mime-type-icon"
          icon={cardType.icon}
          style={{ color: cardType.color }}
        />
      </div>
      <div className="file-info">
        <div className="info-element">
          <p className="file-attrib">Name: </p>
          <p className="file-value">{file.filename}</p>
        </div>
        <div className="info-element">
          <p className="file-attrib">Size:</p>
          <p className="file-value">{file.size}</p>
        </div>
        <div className="info-element">
          <p className="file-attrib">Uploaded At:</p>
          <p className="file-value">{file.date}</p>
        </div>
        <div className="info-element">
          <p className="file-attrib">Type:</p>
          <p className="file-value">{file.type}</p>
        </div>
      </div>
      <div className="download-icon-container">
        <FontAwesomeIcon
          className={
            file.encryptedFileName === "notgenerated"
              ? "download-icon events-none"
              : "download-icon"
          }
          onClick={() => {
            handleDownload(file.encryptedFileName, file.filename);
          }}
          icon={faDownload}
        />
      </div>
    </div>
  );
}

export default Card;
