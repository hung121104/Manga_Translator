// src/components/ApiTester.jsx
import React, { useState } from 'react';
import { uploadImage } from '../services/translationService';
import { debugFormData, compareWithNuxtJS } from '../utils/apiDebugger';

const ApiTester = () => {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setResult(null);
      setError(null);
    }
  };

  const testWithWorkingOptions = async () => {
    if (!file) {
      setError('Please select a file first');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      // Use exact same options as working Nuxt.js version
      const options = {
        target_language: 'CHT',
        detector: 'default',
        direction: 'default',
        translator: 'gpt3.5',
        size: 'L',
      };

      console.log('🧪 Testing with working Nuxt.js options:', options);
      const result = await uploadImage(file, options);
      setResult(result);
    } catch (err) {
      console.error('❌ Test failed:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const debugFormDataManually = () => {
    if (!file) {
      setError('Please select a file first');
      return;
    }

    const formData = new FormData();
    const options = {
      target_language: 'CHT',
      detector: 'default',
      direction: 'default',
      translator: 'gpt3.5',
      size: 'L',
    };

    formData.append('file', file);
    formData.append('mime', file.type);
    formData.append('target_language', options.target_language);
    formData.append('detector', options.detector);
    formData.append('direction', options.direction);
    formData.append('translator', options.translator);
    formData.append('size', options.size);

    debugFormData(formData, '🔍 Manual FormData Debug');
    compareWithNuxtJS(formData);
  };

  const testMinimalRequest = async () => {
    if (!file) {
      setError('Please select a file first');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      // Test with absolutely minimal required fields
      const formData = new FormData();
      formData.append('file', file);
      formData.append('mime', file.type);
      formData.append('target_language', 'CHT');
      formData.append('detector', 'default');
      formData.append('direction', 'default');
      formData.append('translator', 'gpt3.5');
      formData.append('size', 'L');

      console.log('🧪 Testing minimal request...');
      debugFormData(formData, 'Minimal Request FormData');

      const response = await fetch('https://api.cotrans.touhou.ai/task/upload/v1', {
        method: 'PUT',
        body: formData,
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      if (response.ok) {
        const result = await response.json();
        setResult(result);
      } else {
        const errorText = await response.text();
        setError(`${response.status}: ${errorText}`);
      }
    } catch (err) {
      console.error('❌ Minimal test failed:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-gray-800 text-white rounded-lg">
      <h2 className="text-2xl font-bold mb-4">🔧 API Debugging Tool</h2>
      
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">
          Select Test Image:
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-500"
        />
        {file && (
          <p className="mt-2 text-sm text-gray-400">
            Selected: {file.name} ({file.type}, {file.size} bytes)
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <button
          onClick={debugFormDataManually}
          disabled={!file}
          className="px-4 py-2 bg-yellow-600 hover:bg-yellow-500 disabled:bg-gray-600 rounded-lg"
        >
          🔍 Debug FormData
        </button>
        
        <button
          onClick={testMinimalRequest}
          disabled={!file || isLoading}
          className="px-4 py-2 bg-orange-600 hover:bg-orange-500 disabled:bg-gray-600 rounded-lg"
        >
          🧪 Test Minimal
        </button>
        
        <button
          onClick={testWithWorkingOptions}
          disabled={!file || isLoading}
          className="px-4 py-2 bg-green-600 hover:bg-green-500 disabled:bg-gray-600 rounded-lg"
        >
          ✅ Test Working Options
        </button>
      </div>

      {isLoading && (
        <div className="mb-4 p-4 bg-blue-900 rounded-lg">
          <p className="text-blue-200">🔄 Testing API...</p>
        </div>
      )}

      {error && (
        <div className="mb-4 p-4 bg-red-900 rounded-lg">
          <p className="text-red-200 font-bold">❌ Error:</p>
          <p className="text-red-300">{error}</p>
        </div>
      )}

      {result && (
        <div className="mb-4 p-4 bg-green-900 rounded-lg">
          <p className="text-green-200 font-bold">✅ Success!</p>
          <pre className="text-green-300 text-sm mt-2 whitespace-pre-wrap">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}

      <div className="mt-6 p-4 bg-gray-700 rounded-lg">
        <h3 className="text-lg font-bold mb-2">📋 Debug Instructions:</h3>
        <ol className="list-decimal list-inside space-y-2 text-sm text-gray-300">
          <li>Select an image file using the file input above</li>
          <li>Click "🔍 Debug FormData" to inspect the form data structure</li>
          <li>Click "🧪 Test Minimal" to test with the exact required fields</li>
          <li>Click "✅ Test Working Options" to test with Nuxt.js options</li>
          <li>Check the browser console for detailed logs</li>
          <li>Compare request/response headers with your Nuxt.js project</li>
        </ol>
        
        <div className="mt-4 p-3 bg-gray-600 rounded">
          <p className="text-sm font-medium">🎯 Expected from working Nuxt.js:</p>
          <ul className="text-xs text-gray-400 mt-1 space-y-1">
            <li>• Request size: ~1,370,726 bytes</li>
            <li>• Response: application/json (200 OK)</li>
            <li>• 7 form fields: file, mime, target_language, detector, direction, translator, size</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ApiTester;
