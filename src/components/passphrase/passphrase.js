import React from "react";
import "./Passphrase.css";

function Passphrase({ value, onPassphraseChange, onSubmit, onModalClose }) {
  function handleChange(event) {
    onPassphraseChange(event.target.value);
  }
  return (
    <div className="passphrase-container">
      <h1>
        You can only enter the Passphrase once, so decide it carefully and note
        it down somewhere. The Passphrase cannot be changed nor modified. (32
        character long)
      </h1>
      <input value={value} onChange={handleChange} type="text"></input>
      <button
        onClick={(event) => {
          onSubmit(event);
          onModalClose();
        }}
        type="submit"
      >
        submit
      </button>
    </div>
  );
}

export default Passphrase;
