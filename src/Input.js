import React from "react";

function Input({ placeholder, type, value, onChange }) {
  return (
    <input
      placeholder={placeholder}
      type={type}
      value={value}
      onChange={onChange}
    />
  );
}

export default Input;
