import { logRequestDetails, logResponseDetails } from '../utils/apiDebugger.js';

const API_BASE_URL = 'https://api.cotrans.touhou.ai'; //credit to VoileLabs https://github.com/VoileLabs/cotrans
const WS_BASE_URL = 'wss://api.cotrans.touhou.ai'; //credit to VoileLabs https://github.com/VoileLabs/cotrans

export const uploadImage = async (fileOrUrl, options) => {
  const formData = new FormData();
  
  // Handle File object or URL string
  let file;
  if (typeof fileOrUrl === 'string') {
    const response = await fetch(fileOrUrl);
    const blob = await response.blob();

    // Create a proper File object with correct name and type
    file = new File([blob], 'image.jpg', { type: blob.type });
  } else {
    file = fileOrUrl;
  }

  // CRITICAL: Use exact field names and order as Nuxt.js working version
  formData.append('file', file);
  formData.append('mime', file.type);
  formData.append('target_language', options.target_language); // Fixed: was options.language
  formData.append('detector', options.detector);
  formData.append('direction', options.direction);
  formData.append('translator', options.translator);
  formData.append('size', options.size);

  // Debug the request
  const url = `${API_BASE_URL}/task/upload/v1`;
  const requestOptions = {
    method: 'PUT',
    body: formData,
    // DON'T set Content-Type header - let browser set it with boundary this shit take me three hours to figure it out
  };
  
  await logRequestDetails(url, requestOptions);

  const response = await fetch(url, requestOptions);

  // Debug the response
  await logResponseDetails(response);

  if (!response.ok) {
    // Get the actual error response
    const contentType = response.headers.get('content-type');
    let errorData;
    if (contentType && contentType.includes('application/json')) {
      errorData = await response.json();
    } else {
      errorData = await response.text();
    }
    console.error('API Error:', errorData);
    throw new Error(typeof errorData === 'string' ? errorData : (errorData.detail || 'Image upload failed'));
  }

  const uploadResult = await response.json();
  console.log('📤 Upload result:', uploadResult);
  
  // If result is immediately available, return it
  if (uploadResult.result) {
    return {
      taskId: uploadResult.id,
      status: 'completed',
      result: uploadResult.result
    };
  }
  
  // Otherwise, return task info for WebSocket tracking
  return {
    taskId: uploadResult.id,
    status: uploadResult.status || 'pending',
    result: null
  };
};

export const createTranslationSocket = (taskId, onMessage) => {
  const socket = new WebSocket(`${WS_BASE_URL}/task/${taskId}/event/v1`);

  socket.addEventListener('message', (event) => {
    const data = JSON.parse(event.data);
    console.log('📡 WebSocket message:', data);
    onMessage(data);
  });

  socket.addEventListener('open', () => {
    console.log('🔌 WebSocket connected for task:', taskId);
  });

  socket.addEventListener('close', () => {
    console.log('🔌 WebSocket disconnected for task:', taskId);
  });

  socket.addEventListener('error', (error) => {
    console.error('❌ WebSocket error:', error);
  });

  return socket;
};

// Complete translation workflow - matches Nuxt.js implementation
export const translateImageComplete = async (fileOrUrl, options, onProgress) => {
  try {
    // Step 1: Upload image
    onProgress?.({ status: 'uploading', message: 'Uploading image...' });
    const uploadResult = await uploadImage(fileOrUrl, options);
    
    // Step 2: If result is immediate, render it
    if (uploadResult.result) {
      onProgress?.({ status: 'rendering', message: 'Rendering translation...' });
      const finalImage = await renderTranslation(fileOrUrl, uploadResult.result.translation_mask);
      return { success: true, translatedImageUrl: finalImage, taskId: uploadResult.taskId };
    }
    
    // Step 3: Wait for translation via WebSocket
    onProgress?.({ status: 'pending', message: 'Waiting for translation...' });
    
    return new Promise((resolve, reject) => {
      const socket = createTranslationSocket(uploadResult.taskId, async (data) => {
        try {
          if (data.type === 'pending') {
            onProgress?.({ 
              status: 'pending', 
              message: `Pending (${data.pos} in queue)` 
            });
          } else if (data.type === 'status') {
            onProgress?.({ 
              status: 'processing', 
              message: data.status 
            });
          } else if (data.type === 'result') {
            socket.close();
            onProgress?.({ status: 'rendering', message: 'Rendering translation...' });
            
            // Render the translation
            const finalImage = await renderTranslation(fileOrUrl, data.result.translation_mask);
            resolve({ 
              success: true, 
              translatedImageUrl: finalImage, 
              taskId: uploadResult.taskId 
            });
          } else if (data.type === 'error') {
            socket.close();
            reject(new Error(`Translation error: ${data.error_id || 'Unknown error'}`));
          } else if (data.type === 'not_found') {
            socket.close();
            reject(new Error('Task not found'));
          }
        } catch (error) {
          socket.close();
          reject(error);
        }
      });
    });
    
  } catch (error) {
    console.error('❌ Translation failed:', error);
    throw error;
  }
};

// Render translation mask over original image 
export const renderTranslation = async (originalImageSource, translationMaskUrl) => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // Load original image
    const originalImg = new Image();
    originalImg.crossOrigin = 'anonymous';
    
    originalImg.onload = () => {
      canvas.width = originalImg.width;
      canvas.height = originalImg.height;
      
      // Draw original image
      ctx.drawImage(originalImg, 0, 0);
      
      // Load and draw translation mask
      const maskImg = new Image();
      maskImg.crossOrigin = 'anonymous';
      
      maskImg.onload = () => {
        // Draw translation mask on top
        ctx.drawImage(maskImg, 0, 0);
        
        // Convert to blob and create URL
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            resolve(url);
          } else {
            reject(new Error('Failed to render translation'));
          }
        }, 'image/png');
      };
      
      maskImg.onerror = () => reject(new Error('Failed to load translation mask'));
      maskImg.src = translationMaskUrl;
    };
    
    originalImg.onerror = () => reject(new Error('Failed to load original image'));
    
    // Handle different image sources
    if (typeof originalImageSource === 'string') {
      originalImg.src = originalImageSource;
    } else if (originalImageSource instanceof File) {
      originalImg.src = URL.createObjectURL(originalImageSource);
    } else {
      reject(new Error('Invalid image source'));
    }
  });
};
