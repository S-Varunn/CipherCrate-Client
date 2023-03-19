import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import "./Passphrase.css";

function Passphrase({ value, onPassphraseChange, onSubmit, onModalClose }) {
  function handleChange(event) {
    onPassphraseChange(event.target.value);
  }
  return (
    <div className="passphrase-container">
      <div className="passphrase-info">
        <h3>Decide your passphrase!</h3>
        <p>
          You can only enter the Passphrase once, so decide it carefully and
          note it down somewhere. The Passphrase cannot be changed nor modified.
          (32 character long)
        </p>
      </div>
      <div className="passphrase-buttons">
        <div
          className="modal-close"
          onClick={() => {
            onModalClose();
          }}
        >
          <FontAwesomeIcon className="cross-button" icon={faClose} />
        </div>
        <div className="input-box">
          <input
            value={value}
            onChange={handleChange}
            type="text"
            required="required"
          ></input>
          <span>Passphrase</span>
        </div>
        <button
          className="submit-button"
          onClick={(event) => {
            onSubmit(event);
            onModalClose();
          }}
          type="submit"
        >
          Submit
        </button>
      </div>
    </div>
  );
}

export default Passphrase;
