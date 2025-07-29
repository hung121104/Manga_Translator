# API FormData Integration Guide - From 500 Errors to Success

> **A comprehensive guide for fixing multipart/form-data API integration issues when migrating from working implementations (like Nuxt.js) to other frameworks (React, Vue, Angular, etc.)**

## 📋 Table of Contents

1. [Problem Overview](#problem-overview)
2. [Root Cause Analysis](#root-cause-analysis)
3. [Diagnostic Process](#diagnostic-process)
4. [Solution Framework](#solution-framework)
5. [Implementation Examples](#implementation-examples)
6. [Testing & Validation](#testing--validation)
7. [Best Practices](#best-practices)
8. [Troubleshooting Checklist](#troubleshooting-checklist)

---

## 🎯 Problem Overview

### Common Scenario
- ✅ **Working Implementation**: API works perfectly in one framework (e.g., Nuxt.js, working curl command)
- ❌ **Failing Implementation**: Same API returns 500 errors in another framework (React, Vue, Angular, vanilla JS)
- 🤔 **Assumption**: "It must be a CORS issue"
- 🔍 **Reality**: Usually FormData construction differences

### Typical Error Patterns
```
Working Request  → Status: 200 OK, Content-Type: application/json
Failing Request  → Status: 500 Error, Content-Type: text/plain, Content-Length: 21
```

---

## 🔍 Root Cause Analysis

### Primary Issues

#### 1. **Field Name Mismatches**
```javascript
// Working API expects
formData.append('target_language', value);

// But you're sending  
formData.append('language', value);     // ❌ Wrong field name
formData.append('targetLanguage', value); // ❌ Wrong casing
```

#### 2. **Incorrect Data Types**
```javascript
// API expects File object
formData.append('file', fileObject);    // ✅ Correct

// But you're sending
formData.append('file', blob);          // ❌ Blob instead of File
formData.append('file', base64String);  // ❌ String instead of File
formData.append('file', filePath);      // ❌ Path instead of File
```

#### 3. **Missing Required Fields**
```javascript
// Working implementation has all 7 fields
formData.append('file', file);
formData.append('mime', file.type);
formData.append('target_language', lang);
formData.append('detector', detector);
formData.append('direction', direction);
formData.append('translator', translator);
formData.append('size', size);

// Your implementation missing some
formData.append('file', file);
formData.append('language', lang);  // Only 2 fields - missing 5!
```

#### 4. **Wrong Default Values**
```javascript
// Working defaults
detector: 'default'
direction: 'auto'  
translator: 'gpt3.5'
size: 'L'

// Your defaults (causing validation errors)
detector: 'craft'     // ❌ API doesn't recognize this
direction: 'horizontal' // ❌ API expects 'auto'
translator: 'gpt35'    // ❌ Missing dot
size: 'small'          // ❌ API expects 'L'
```

#### 5. **Content-Type Header Issues**
```javascript
// ❌ Wrong - breaks multipart boundary
fetch(url, {
  headers: {
    'Content-Type': 'multipart/form-data'  // Don't set this!
  },
  body: formData
});

// ✅ Correct - let browser set it with boundary
fetch(url, {
  body: formData  // Browser auto-sets: multipart/form-data; boundary=----WebKit...
});
```

---

## 🔬 Diagnostic Process

### Step 1: Compare Request Headers

**Working Request:**
```
POST /api/upload HTTP/1.1
Content-Type: multipart/form-data; boundary=----WebKitFormBoundaryXXX
Content-Length: 1,370,726

Response:
Content-Type: application/json; charset=UTF-8
Status: 200 OK
```

**Failing Request:**
```
POST /api/upload HTTP/1.1  
Content-Type: multipart/form-data; boundary=----WebKitFormBoundaryYYY
Content-Length: 1,370,701  ⚠️ Different size (-25 bytes)

Response:
Content-Type: text/plain; charset=UTF-8  ⚠️ Plain text error
Content-Length: 21  ⚠️ Short error message
Status: 500 Internal Server Error
```

### Step 2: Analyze FormData Contents

```javascript
// Debug function to inspect FormData
function debugFormData(formData, title = 'FormData Debug') {
  console.group(title);
  
  const entries = [];
  for (let [key, value] of formData.entries()) {
    entries.push({ key, value });
    
    if (value instanceof File) {
      console.log(`📁 ${key}: [File]`, {
        name: value.name,
        type: value.type,
        size: value.size
      });
    } else {
      console.log(`📝 ${key}: "${value}"`);
    }
  }
  
  console.log(`📊 Total fields: ${entries.length}`);
  console.groupEnd();
  return entries;
}
```

### Step 3: Field-by-Field Comparison

```javascript
// Expected fields from working implementation
const expectedFields = [
  'file',           // File object
  'mime',           // string: 'image/jpeg'
  'target_language', // string: 'CHT'
  'detector',       // string: 'default'
  'direction',      // string: 'auto'  
  'translator',     // string: 'gpt3.5'
  'size'           // string: 'L'
];

// Validate your FormData
function validateFormData(formData, expectedFields) {
  const actualFields = [];
  for (let [key] of formData.entries()) {
    actualFields.push(key);
  }
  
  const missing = expectedFields.filter(field => !actualFields.includes(field));
  const extra = actualFields.filter(field => !expectedFields.includes(field));
  
  if (missing.length > 0) console.error('❌ Missing:', missing);
  if (extra.length > 0) console.warn('⚠️ Extra:', extra);
  
  return { missing, extra, valid: missing.length === 0 };
}
```

---

## 🛠️ Solution Framework

### Generic FormData Construction Template

```javascript
/**
 * Generic API FormData builder
 * @param {File|string} fileInput - File object or URL string
 * @param {Object} options - API-specific options
 * @param {Object} fieldMapping - Maps your field names to API field names
 */
async function buildFormData(fileInput, options, fieldMapping) {
  const formData = new FormData();
  
  // Handle File input
  let file;
  if (typeof fileInput === 'string') {
    // Convert URL to File object
    const response = await fetch(fileInput);
    const blob = await response.blob();
    file = new File([blob], 'upload.jpg', { type: blob.type });
  } else if (fileInput instanceof File) {
    file = fileInput;
  } else {
    throw new Error('Invalid file input type');
  }
  
  // Add file (always required)
  formData.append(fieldMapping.file || 'file', file);
  formData.append(fieldMapping.mime || 'mime', file.type);
  
  // Add other fields based on mapping
  Object.entries(options).forEach(([key, value]) => {
    const apiFieldName = fieldMapping[key] || key;
    formData.append(apiFieldName, value);
  });
  
  return formData;
}
```

### Framework-Specific Examples

#### React/Next.js Implementation
```javascript
import { useState } from 'react';

const useApiUpload = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  
  const uploadFile = async (file, options) => {
    setLoading(true);
    setError(null);
    
    try {
      // Build FormData using working field names
      const formData = new FormData();
      formData.append('file', file);
      formData.append('mime', file.type);
      formData.append('target_language', options.targetLanguage || 'CHT');
      formData.append('detector', options.detector || 'default');
      formData.append('direction', options.direction || 'auto');
      formData.append('translator', options.translator || 'gpt3.5');
      formData.append('size', options.size || 'L');
      
      const response = await fetch('https://api.example.com/upload', {
        method: 'POST',
        body: formData,
        // Don't set Content-Type - let browser handle it
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${await response.text()}`);
      }
      
      const data = await response.json();
      setResult(data);
      return data;
      
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  return { uploadFile, loading, result, error };
};
```

#### Vue.js Implementation
```javascript
import { ref } from 'vue';

export function useApiUpload() {
  const loading = ref(false);
  const result = ref(null);
  const error = ref(null);
  
  const uploadFile = async (file, options) => {
    loading.value = true;
    error.value = null;
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('mime', file.type);
      formData.append('target_language', options.targetLanguage || 'CHT');
      formData.append('detector', options.detector || 'default');
      formData.append('direction', options.direction || 'auto');
      formData.append('translator', options.translator || 'gpt3.5');
      formData.append('size', options.size || 'L');
      
      const response = await fetch('https://api.example.com/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${await response.text()}`);
      }
      
      result.value = await response.json();
      return result.value;
      
    } catch (err) {
      error.value = err.message;
      throw err;
    } finally {
      loading.value = false;
    }
  };
  
  return { uploadFile, loading, result, error };
}
```

#### Vanilla JavaScript Implementation
```javascript
class ApiUploader {
  constructor(apiUrl) {
    this.apiUrl = apiUrl;
  }
  
  async uploadFile(file, options = {}) {
    const formData = new FormData();
    
    // Handle different input types
    if (typeof file === 'string') {
      const response = await fetch(file);
      const blob = await response.blob();
      file = new File([blob], 'upload.jpg', { type: blob.type });
    }
    
    // Build FormData with exact field names
    formData.append('file', file);
    formData.append('mime', file.type);
    formData.append('target_language', options.targetLanguage || 'CHT');
    formData.append('detector', options.detector || 'default');
    formData.append('direction', options.direction || 'auto');
    formData.append('translator', options.translator || 'gpt3.5');
    formData.append('size', options.size || 'L');
    
    // Debug logging
    console.log('Uploading with FormData:');
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }
    
    const response = await fetch(this.apiUrl, {
      method: 'POST',
      body: formData,
    });
    
    console.log('Response:', response.status, response.statusText);
    console.log('Headers:', Object.fromEntries(response.headers.entries()));
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API Error ${response.status}: ${errorText}`);
    }
    
    return response.json();
  }
}
```

---

## 🧪 Testing & Validation

### Testing Utilities

```javascript
// 1. FormData comparison utility
function compareFormData(yourFormData, workingReference) {
  console.group('FormData Comparison');
  
  const yourFields = new Map();
  const refFields = new Map();
  
  for (let [key, value] of yourFormData.entries()) {
    yourFields.set(key, value);
  }
  
  for (let [key, value] of workingReference.entries()) {
    refFields.set(key, value);
  }
  
  // Check for differences
  for (let [key, value] of refFields) {
    if (!yourFields.has(key)) {
      console.error(`❌ Missing field: ${key}`);
    } else if (typeof value === 'string' && yourFields.get(key) !== value) {
      console.warn(`⚠️ Different value for ${key}:`, {
        yours: yourFields.get(key),
        reference: value
      });
    }
  }
  
  for (let [key] of yourFields) {
    if (!refFields.has(key)) {
      console.warn(`⚠️ Extra field: ${key}`);
    }
  }
  
  console.groupEnd();
}

// 2. Request size validator
function validateRequestSize(formData, expectedSize, tolerance = 100) {
  let totalSize = 0;
  for (let [, value] of formData.entries()) {
    if (value instanceof File) {
      totalSize += value.size;
    } else {
      totalSize += new Blob([value]).size;
    }
  }
  
  const difference = Math.abs(totalSize - expectedSize);
  if (difference > tolerance) {
    console.warn(`⚠️ Size difference: ${difference} bytes (${totalSize} vs ${expectedSize})`);
    return false;
  }
  
  console.log(`✅ Size validation passed: ${totalSize} bytes`);
  return true;
}

// 3. End-to-end test
async function testApiUpload(file, options) {
  console.group('🧪 API Upload Test');
  
  try {
    // Build FormData
    const formData = new FormData();
    formData.append('file', file);
    formData.append('mime', file.type);
    Object.entries(options).forEach(([key, value]) => {
      formData.append(key, value);
    });
    
    // Validate FormData
    debugFormData(formData);
    
    // Make request
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });
    
    // Check response
    console.log('Response Status:', response.status, response.statusText);
    console.log('Response Headers:', Object.fromEntries(response.headers.entries()));
    
    if (response.ok) {
      const result = await response.json();
      console.log('✅ Success:', result);
      return result;
    } else {
      const error = await response.text();
      console.error('❌ Error:', error);
      throw new Error(error);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    throw error;
  } finally {
    console.groupEnd();
  }
}
```

### Integration Testing

```javascript
// Test different scenarios
const testCases = [
  {
    name: 'Basic Upload',
    options: {
      target_language: 'CHT',
      detector: 'default',
      direction: 'auto',
      translator: 'gpt3.5',
      size: 'L'
    }
  },
  {
    name: 'Different Language',
    options: {
      target_language: 'ENG',
      detector: 'default',
      direction: 'auto',
      translator: 'gpt3.5',
      size: 'L'
    }
  },
  {
    name: 'Minimal Required',
    options: {
      target_language: 'CHT'
      // Test with only required field
    }
  }
];

// Run all test cases
async function runAllTests(file) {
  for (const testCase of testCases) {
    try {
      console.log(`\n🧪 Running: ${testCase.name}`);
      await testApiUpload(file, testCase.options);
      console.log(`✅ ${testCase.name} passed`);
    } catch (error) {
      console.error(`❌ ${testCase.name} failed:`, error.message);
    }
  }
}
```

---

## 📋 Best Practices

### 1. **Always Mirror Working Implementations**

```javascript
// DON'T assume field names
const options = {
  language: 'en',        // ❌ Might not match API
  fileType: 'image',     // ❌ Might not match API
  quality: 'high'        // ❌ Might not match API
};

// DO copy exact field names from working implementation
const options = {
  target_language: 'ENG', // ✅ Exact match
  detector: 'default',    // ✅ Exact match  
  size: 'L'              // ✅ Exact match
};
```

### 2. **Proper File Object Creation**

```javascript
// ❌ Wrong ways
formData.append('file', fileBlob);
formData.append('file', base64String);
formData.append('file', fileBuffer);

// ✅ Correct way
const file = new File([blob], 'filename.jpg', { 
  type: 'image/jpeg',
  lastModified: Date.now()
});
formData.append('file', file);
```

### 3. **Content-Type Header Management**

```javascript
// ❌ Don't set Content-Type for FormData
fetch(url, {
  headers: {
    'Content-Type': 'multipart/form-data'  // This breaks the boundary!
  },
  body: formData
});

// ✅ Let browser handle it
fetch(url, {
  body: formData  // Browser automatically sets: multipart/form-data; boundary=...
});
```

### 4. **Error Handling Strategy**

```javascript
async function robustApiCall(formData) {
  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      body: formData
    });
    
    // Check content type to determine how to parse error
    const contentType = response.headers.get('content-type');
    
    if (!response.ok) {
      let errorMessage;
      if (contentType?.includes('application/json')) {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.detail || 'API Error';
      } else {
        errorMessage = await response.text();
      }
      throw new Error(`HTTP ${response.status}: ${errorMessage}`);
    }
    
    return await response.json();
    
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
}
```

### 5. **Debug Mode Implementation**

```javascript
class ApiClient {
  constructor(baseUrl, debug = false) {
    this.baseUrl = baseUrl;
    this.debug = debug;
  }
  
  async upload(formData) {
    if (this.debug) {
      this.debugRequest(formData);
    }
    
    const response = await fetch(`${this.baseUrl}/upload`, {
      method: 'POST',
      body: formData
    });
    
    if (this.debug) {
      this.debugResponse(response);
    }
    
    return response;
  }
  
  debugRequest(formData) {
    console.group('🔍 Request Debug');
    console.log('FormData contents:');
    for (let [key, value] of formData.entries()) {
      console.log(`  ${key}:`, value);
    }
    console.groupEnd();
  }
  
  debugResponse(response) {
    console.group('📥 Response Debug');
    console.log('Status:', response.status, response.statusText);
    console.log('Headers:', Object.fromEntries(response.headers.entries()));
    console.groupEnd();
  }
}
```

---

## ✅ Troubleshooting Checklist

### Pre-Request Validation

```
□ All required fields present in FormData
□ Field names exactly match working implementation  
□ File objects are proper File instances (not Blobs)
□ MIME types are correctly set
□ Default values match working implementation
□ No manual Content-Type header set
□ Request size approximately matches working version
```

### Response Analysis

```
□ Check response status code (200 vs 500)
□ Verify response Content-Type (application/json vs text/plain)
□ Compare response size with working implementation
□ Log full response headers
□ Check for CORS headers (but likely not the issue)
□ Examine error message content
```

### Common Issues & Solutions

| Issue | Symptoms | Solution |
|-------|----------|----------|
| Wrong field names | 500 error, short response | Copy exact field names from working implementation |
| Missing fields | 500 error, validation message | Add all required fields to FormData |
| Wrong data types | 500 error, type validation | Use proper File objects, not Blobs/strings |
| Manual Content-Type | Malformed boundary | Remove Content-Type header, let browser set it |
| Wrong default values | 500 error, value validation | Match working implementation's default values |

### Debug Commands

```javascript
// Quick debug in browser console
const formData = new FormData();
// ... build your FormData

// Inspect contents
for (let [key, value] of formData.entries()) {
  console.log(key, ':', value);
}

// Test minimal request
fetch('/api/upload', { method: 'POST', body: formData })
  .then(r => {
    console.log('Status:', r.status);
    console.log('Headers:', [...r.headers.entries()]);
    return r.text();
  })
  .then(console.log);
```

---

## 🎯 Summary

**The key insight**: When an API works in one implementation but fails in another with 500 errors, it's almost always a FormData construction issue, not CORS.

**Success formula**:
1. **Mirror exactly** - Copy field names, values, and structure from working implementation
2. **Validate thoroughly** - Check every field name and value
3. **Debug systematically** - Compare request headers and FormData contents
4. **Test incrementally** - Add fields one by one to isolate issues

**Remember**: APIs are strict about field names, data types, and required fields. Even small differences can cause 500 errors!

---

*This guide can be adapted for any API that accepts multipart/form-data. Replace the specific field names and values with your API's requirements.*
