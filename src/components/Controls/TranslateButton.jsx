// src/components/Controls/TranslateButton.jsx
import React from 'react';

const TranslateButton = ({ onClick, isLoading }) => {
  return (
    <button
      onClick={onClick}
      disabled={isLoading}
      className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg disabled:bg-gray-500"
    >
      {isLoading ? 'Translating...' : 'Translate'}
    </button>
  );
};

export default TranslateButton;
