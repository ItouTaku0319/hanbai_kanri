import React from "react";

const SearchRow = ({ children, cols = 2 }) => {
  return (
    <div className={`grid grid-cols-${cols} gap-x-4 gap-y-2 w-full items-center`}>
      {React.Children.toArray(children).map((child, index) => (
        <div key={index} className="flex w-full">
          {child}
        </div>
      ))}
    </div>
  );
};

export default SearchRow;
