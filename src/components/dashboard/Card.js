import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDownload,
  faFilePdf,
  faFileZipper,
  faFileWord,
  faFileImage,
} from "@fortawesome/free-solid-svg-icons";
import { faFilePowerpoint } from "@fortawesome/free-regular-svg-icons";
import "./Card.css";

function Card({ file, handleDownload }) {
  const fileSplits = file.filename.split(".");
  const fileType = fileSplits[fileSplits.length - 1];
  return (
    <div className="file-card-container">
      <div className="file-image-container">
        <FontAwesomeIcon className="mime-type-icon" icon={faFilePdf} />
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
          <p className="file-value">{fileType}</p>
        </div>
      </div>
      <div className="download-icon-container">
        <FontAwesomeIcon
          onClick={() => {
            handleDownload(file.encryptedFileName, file.filename);
          }}
          className="download-icon"
          icon={faDownload}
        />
      </div>
    </div>
  );
}

export default Card;
