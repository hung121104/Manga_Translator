// src/App.jsx
import React, { useState } from 'react';
import MangaViewer from './components/MangaViewer/MangaViewer';
import ApiTester from './components/ApiTester';
import './App.css';

function App() {
  const [showDebugger, setShowDebugger] = useState(false);

  return (
    <div className="App">
      {/* Debug toggle button */}
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={() => setShowDebugger(!showDebugger)}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg shadow-lg"
        >
          {showDebugger ? '🖼️ Manga Viewer' : '🔧 Debug API'}
        </button>
      </div>

      {/* Conditional rendering */}
      {showDebugger ? (
        <div className="min-h-screen bg-gray-900 py-8">
          <ApiTester />
        </div>
      ) : (
        <MangaViewer />
      )}
    </div>
  );
}

export default App;