import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import "./Passphrase.css";

function Passphrase({
  value,
  toast,
  onPassphraseChange,
  onSubmit,
  onModalClose,
  heading,
  message,
  modal,
}) {
  function handleChange(event) {
    onPassphraseChange(event.target.value);
  }

  return (
    <div className={`modal-container ${modal ? "show" : "hide"}`}>
      <div className="passphrase-container">
        <div className="passphrase-info">
          <h3>{heading}</h3>
          <p>{message}</p>
        </div>
        <div className="passphrase-buttons">
          <div
            className="modal-close"
            onClick={() => {
              onModalClose();
            }}>
            <FontAwesomeIcon className="cross-button" icon={faClose} />
          </div>
          <div className="input-box">
            <input
              value={value}
              onChange={handleChange}
              type="text"
              required="required"></input>
            <span>Passphrase</span>
          </div>
          <button
            className="submit-button"
            onClick={(event) => {
              if (!value.length === 32) {
                toast.error("Passphrase must be at least 32 characters");
              }
              onSubmit(event);
            }}
            type="submit">
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}

export default Passphrase;
