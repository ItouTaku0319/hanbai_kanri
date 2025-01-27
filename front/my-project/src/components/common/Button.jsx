import React from "react";

const CommonButton = ({ label, type = "default", onClick, disabled = false }) => {
  // ボタンのスタイルをタイプ別に設定
  const buttonStyles = {
    default: "bg-gray-500 hover:bg-gray-600",
    primary: "bg-blue-500 hover:bg-blue-600 w-full",
    danger: "bg-red-500 hover:bg-red-600",
    success: "bg-green-500 hover:bg-green-600",
  };

  return (
    <button
      className={`px-4 py-2 text-white rounded-lg focus:outline-none ${buttonStyles[type]} ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      }`}
      onClick={onClick}
      disabled={disabled}
    >
      {label}
    </button>
  );
};

export default CommonButton;
