import React from "react";
import "./Card.css";

function Card({ file }) {
  return (
    <div className="file-card-container">
      <div className="file-image-container"></div>
      <div className="file-info">
        <div className="info-element">
          <p className="file-attrib">Name: </p>
          <p className="file-value">{file.fileName}</p>
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
    </div>
  );
}

export default Card;
