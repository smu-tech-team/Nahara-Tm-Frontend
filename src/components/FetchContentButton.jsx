import React from 'react';

const FetchContentButton = ({ type, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="bg-blue-800 text-white px-4 py-2 rounded-md hover:bg-blue-800 focus:outline-none"
    >
      {`View ${type}`}
    </button>
  );
};

export default FetchContentButton;
