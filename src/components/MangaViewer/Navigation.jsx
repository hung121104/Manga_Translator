// src/components/MangaViewer/Navigation.jsx
import React from 'react';

const Navigation = ({ onNext, onPrev }) => {
  return (
    <div className="flex justify-between mt-4">
      <button
        onClick={onPrev}
        className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg"
      >
        Previous
      </button>
      <button
        onClick={onNext}
        className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg"
      >
        Next
      </button>
    </div>
  );
};

export default Navigation;
