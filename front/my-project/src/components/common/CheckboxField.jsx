import React from "react";

const CheckboxField = ({ label, checked, onChange }) => {
  return (
    <label className="flex items-center space-x-1 whitespace-nowrap">
      <input type="checkbox" checked={checked} onChange={onChange} className="w-4 h-4" />
      <span>{label}</span>
    </label>
  );
};


export default CheckboxField;
