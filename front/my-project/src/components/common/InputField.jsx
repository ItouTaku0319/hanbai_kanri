import React from "react";

const InputField = ({ label, type = "text", value, onChange, className = "", rightElement }) => {
  return (
    <div className={`flex items-center space-x-2 w-full ${className}`}>
      <label className="w-24 text-right text-sm font-medium">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        className={`px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          className === "full" ? "flex-1" : `w-${className}`
        }`}
      />
      {rightElement && <div>{rightElement}</div>}
    </div>
  );
};

export default InputField;
