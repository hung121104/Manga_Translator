// src/utils/apiDebugger.js
// Utility to debug API requests and compare with working Nuxt.js version

export const debugFormData = (formData, title = 'FormData Debug') => {
  console.group(title);
  
  let totalSize = 0;
  const entries = [];
  
  for (let [key, value] of formData.entries()) {
    entries.push({ key, value });
    
    if (value instanceof File) {
      console.log(`📁 ${key}: [File]`, {
        name: value.name,
        type: value.type,
        size: value.size,
        lastModified: value.lastModified
      });
      totalSize += value.size;
    } else {
      console.log(`📝 ${key}: "${value}"`);
      totalSize += new Blob([value]).size;
    }
  }
  
  console.log(`📊 Total entries: ${entries.length}`);
  console.log(`📏 Estimated size: ${totalSize} bytes`);
  console.log('🔍 Expected from working Nuxt.js:');
  console.log('   - 7 fields: file, mime, target_language, detector, direction, translator, size');
  console.log('   - Request size: ~1,370,726 bytes');
  console.log('   - Response: application/json (200 OK)');
  
  console.groupEnd();
  return { entries, totalSize };
};

export const compareWithNuxtJS = (formData) => {
  const expectedFields = [
    'file',
    'mime', 
    'target_language',
    'detector',
    'direction', 
    'translator',
    'size'
  ];
  
  const actualFields = [];
  for (let [key] of formData.entries()) {
    actualFields.push(key);
  }
  
  console.group('🔄 Comparison with Nuxt.js');
  
  const missing = expectedFields.filter(field => !actualFields.includes(field));
  const extra = actualFields.filter(field => !expectedFields.includes(field));
  
  if (missing.length > 0) {
    console.error('❌ Missing fields:', missing);
  }
  
  if (extra.length > 0) {
    console.warn('⚠️ Extra fields:', extra);
  }
  
  if (missing.length === 0 && extra.length === 0) {
    console.log('✅ All required fields present');
  }
  
  console.log('📋 Field comparison:');
  expectedFields.forEach(field => {
    const hasField = actualFields.includes(field);
    console.log(`  ${hasField ? '✅' : '❌'} ${field}`);
  });
  
  console.groupEnd();
  
  return { missing, extra, allFieldsPresent: missing.length === 0 && extra.length === 0 };
};

export const logRequestDetails = async (url, options) => {
  console.group('🌐 API Request Details');
  console.log('📍 URL:', url);
  console.log('🔧 Method:', options.method || 'GET');
  
  if (options.headers) {
    console.log('📋 Headers:', options.headers);
  } else {
    console.log('📋 Headers: None (letting browser set Content-Type)');
  }
  
  if (options.body instanceof FormData) {
    debugFormData(options.body, 'Request Body (FormData)');
    compareWithNuxtJS(options.body);
  }
  
  console.groupEnd();
};

export const logResponseDetails = async (response) => {
  console.group('📥 API Response Details');
  console.log('🔢 Status:', response.status, response.statusText);
  console.log('📋 Headers:', Object.fromEntries(response.headers.entries()));
  
  const contentType = response.headers.get('content-type');
  const contentLength = response.headers.get('content-length');
  
  console.log('📦 Content-Type:', contentType);
  console.log('📏 Content-Length:', contentLength);
  
  if (response.ok) {
    if (contentType?.includes('application/json')) {
      console.log('✅ Success: JSON response received');
    } else {
      console.warn('⚠️ Unexpected content type for success response');
    }
  } else {
    if (contentType?.includes('text/plain')) {
      console.error('❌ Error: Plain text response (likely error message)');
      if (contentLength === '21') {
        console.error('🚨 21-byte response detected - this matches the failing pattern!');
      }
    }
  }
  
  console.groupEnd();
};
