// src/components/TranslationDisplay.jsx
import React from 'react';

const TranslationDisplay = ({ translationResult }) => {
  if (!translationResult) {
    return null;
  }

  if (translationResult.error) {
    return (
      <div className="mt-4 p-4 bg-red-900 text-white rounded-lg">
        <p className="font-bold">Error:</p>
        <p>{translationResult.error}</p>
      </div>
    );
  }

  // Assuming translationResult has a structure like { translated_text: "..." }
  // You might need to adjust this based on your actual API response structure
  return (
    <div className="mt-4 p-4 bg-gray-800 text-white rounded-lg">
      <h3 className="text-lg font-bold mb-2">Translation Result:</h3>
      {translationResult.translated_text ? (
        <p className="text-left whitespace-pre-wrap">{translationResult.translated_text}</p>
      ) : (
        <pre className="text-left whitespace-pre-wrap">{JSON.stringify(translationResult, null, 2)}</pre>
      )}
    </div>
  );
};

export default TranslationDisplay;
