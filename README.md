# Manga Translator - React Web Application

Web application for translating manga pages in real-time using AI-powered translation services. Built with React, Vite, and Tailwind CSS. Project made in my free time.

## Features

### **Multi-Language Translation**
- **18 supported languages** including Vietnamese (Tiếng Việt) and English
- Interactive language selector with country flags
- Real-time language switching

### **Advanced Image Processing**
- **Zoom and Pan** controls for detailed viewing
- **Canvas-based rendering** for translation overlays
- **File upload** support for local manga pages
- **WebSocket integration** for real-time translation progress


### **Developer Features**
- **Comprehensive API debugging** tools
- **Error handling** with detailed logging
- **FormData validation** utilities
- **Testing components** for API integration

## Supported Languages

| Code | Language | Flag |
|------|----------|------|
| CHS | 简体中文 (Simplified Chinese) | 🇨🇳 |
| CHT | 繁體中文 (Traditional Chinese) | 🇹🇼 |
| JPN | 日本語 (Japanese) | 🇯🇵 |
| **ENG** | **English** | 🇺🇸 |
| KOR | 한국어 (Korean) | 🇰🇷 |
| **VIN** | **Tiếng Việt (Vietnamese)** | 🇻🇳 |
| CSY | čeština (Czech) | 🇨🇿 |
| NLD | Nederlands (Dutch) | 🇳🇱 |
| FRA | français (French) | 🇫🇷 |
| DEU | Deutsch (German) | 🇩🇪 |
| HUN | magyar nyelv (Hungarian) | 🇭🇺 |
| ITA | italiano (Italian) | 🇮🇹 |
| PLK | polski (Polish) | 🇵🇱 |
| PTB | português (Portuguese) | 🇵🇹 |
| ROM | limba română (Romanian) | 🇷🇴 |
| RUS | русский язык (Russian) | 🇷🇺 |
| ESP | español (Spanish) | 🇪🇸 |
| TRK | Türk dili (Turkish) | 🇹🇷 |

## Quick Start

### Prerequisites

- **Node.js** (version 16 or higher)
- **npm** or **yarn** package manager
- Modern web browser with WebSocket support

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/hung121104/Manga_Translator.git
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:3000
   ```

```

## How It Works

### 1. **Image Upload & Processing**
```javascript
// Upload image to translation API
const uploadResult = await uploadImage(fileOrUrl, options);
```

### 2. **Real-time Translation Tracking**
```javascript
// WebSocket connection for progress updates
const socket = createTranslationSocket(taskId, onMessage);
```

### 3. **Canvas-based Rendering**
```javascript
// Overlay translation mask on original image
const finalImage = await renderTranslation(originalImage, translationMask);
```

### 4. **Language Selection**
```javascript
const options = {
  target_language: selectedLanguage, // VIN, ENG, CHT, etc.
  detector: 'default',
  direction: 'default',
  translator: 'gpt3.5',
  size: 'L'
};
```

## API Integration

This project integrates with the **cotrans API** (https://github.com/VoileLabs/cotrans) for manga translation:

- **API Endpoint**: `https://api.cotrans.touhou.ai`
- **WebSocket**: `wss://api.cotrans.touhou.ai`
- **Method**: Multipart form data upload
- **Real-time updates** via WebSocket connection

### API Requirements
```javascript
// Required FormData fields
formData.append('file', fileObject);           // Image file
formData.append('mime', file.type);            // MIME type
formData.append('target_language', language);  // Target language code
formData.append('detector', 'default');        // Text detection method
formData.append('direction', 'default');       // Reading direction
formData.append('translator', 'gpt3.5');       // Translation engine
formData.append('size', 'L');                  // Output size
```

## Usage Guide

### **Basic Translation Workflow**

1. Load Images**: Click "Manga Viewer" to access the image viewer
2. Select Language**: Click "Language" button and choose your target language (Vietnamese or English)
3. Translate**: Click the "Translate" button to start translation
4. Monitor Progress**: Watch real-time progress updates
5. View Results**: Toggle between original and translated images

### **Advanced Features**

- Zoom Controls**: Use +/- buttons or mouse wheel for zooming
- Pan Support**: Drag to pan around zoomed images
- Navigation**: Use arrow buttons to navigate between pages
- Debug Mode**: Click "Debug API" for detailed request analysis

## Technical Implementation

### **Based on manga-image-translator**

This project incorporates techniques and concepts from the excellent [manga-image-translator](https://github.com/zyddnys/manga-image-translator) project:

- **Text detection algorithms** for identifying text regions in manga
- **Translation workflow patterns** for processing manga pages
- **Image rendering techniques** for overlaying translated text
- **Multi-language support** structure and implementation

### **Key Technical Features**

- **React 19.1.0** with modern hooks and context
- **Vite 7.0.4** for fast development and building
- **Tailwind CSS 4.1.11** for responsive styling
- **WebSocket API** for real-time communication
- **Canvas API** for image manipulation
- **FormData API** for multipart uploads

### **Error Handling & Debugging**

```javascript
// Comprehensive API debugging
import { logRequestDetails, logResponseDetails } from '../utils/apiDebugger.js';

// Request validation
const validation = validateFormData(formData, expectedFields);
if (!validation.valid) {
  console.error('FormData validation failed:', validation.missing);
}

// Response analysis
await logResponseDetails(response);
```

## Troubleshooting

### **Common Issues**

#### **500 API Errors**
- ✅ **Check FormData fields**: Ensure all 7 required fields are present
- ✅ **Verify field names**: Use exact field names (e.g., `target_language` not `language`)
- ✅ **File object validation**: Ensure proper File objects, not Blobs

#### **Translation Fails**
- ✅ **Language code**: Verify language code is supported (VIN for Vietnamese, ENG for English)
- ✅ **Image format**: Ensure image is in supported format (JPEG, PNG)
- ✅ **Network connection**: Check WebSocket connectivity

#### **UI Issues**
- ✅ **Browser compatibility**: Use modern browser with ES6+ support
- ✅ **CORS settings**: Ensure proper CORS configuration for API calls

### **Debug Tools**

Use the built-in API tester:
```bash
# In the application
1. Click "🔧 Debug API" button
2. Upload test image
3. Review FormData contents
4. Analyze request/response headers
```

## Development

### **Adding New Languages**

1. **Update language list** in `LanguageSelector.jsx`:
   ```javascript
   const languages = {
     // Add new language
     NEW: { name: 'New Language', flag: '🏳️' }
   };
   ```

2. **Test with API** to ensure language code is supported

### **Customizing Translation Options**

Modify translation parameters in `MangaViewer.jsx`:
```javascript
const options = {
  target_language: selectedLanguage,
  detector: 'default',      // or 'craft', 'ctd'
  direction: 'default',     // or 'auto', 'horizontal', 'vertical'
  translator: 'gpt3.5',     // or 'google', 'youdao', 'baidu'
  size: 'L'                 // or 'S', 'M'
};
```

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgments

- **[manga-image-translator](https://github.com/zyddnys/manga-image-translator)** - For inspiration and technical foundations
- **[cotrans API](https://github.com/VoileLabs/cotrans)** - For translation services (credit to VoileLabs)

## Support

If you encounter any issues or have questions:

1. **Check the troubleshooting section** above
2. **Use the built-in debug tools** for API issues
3. **Open an issue** on GitHub with detailed information

---

**Happy translating!**
