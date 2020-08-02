import React, { useRef } from "react";
import PropTypes from "prop-types";
import PetButton from "./PetButton";

function getFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

function UploadButton({ onFile, disabled = false }) {
  const ref = useRef();

  const onChange = async () => {
    if (ref.current.files && ref.current.files[0]) {
      const image = await getFile(ref.current.files[0]);
      onFile(image);
    }
  };

  return (
    <>
      <PetButton
        type="photo"
        disabled={disabled}
        onClick={() => {
          ref.current.click();
        }}
      />
      <input
        type="file"
        ref={ref}
        hidden
        onChange={(e) => {
          onChange(e.target.files);
        }}
      />
    </>
  );
}

UploadButton.prototypes = {
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
};

export default UploadButton;
