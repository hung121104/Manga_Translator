import { useState } from 'react';

const LanguageSelector = ({ onLanguageChange, currentLanguage = 'CHT' }) => {
  const [selectedLanguage, setSelectedLanguage] = useState(currentLanguage);

  const languages = {
    CHS: { name: '简体中文', flag: '🇨🇳' },
    CHT: { name: '繁體中文', flag: '🇹🇼' },
    JPN: { name: '日本語', flag: '��' },
    ENG: { name: 'English', flag: '🇺🇸' },
    KOR: { name: '한국어', flag: '🇰🇷' },
    VIN: { name: 'Tiếng Việt', flag: '🇻🇳' },
    CSY: { name: 'čeština', flag: '��' },
    NLD: { name: 'Nederlands', flag: '🇳🇱' },
    FRA: { name: 'français', flag: '�🇷' },
    DEU: { name: 'Deutsch', flag: '🇩🇪' },
    HUN: { name: 'magyar nyelv', flag: '��' },
    ITA: { name: 'italiano', flag: '��' },
    PLK: { name: 'polski', flag: '🇵🇱' },
    PTB: { name: 'português', flag: '��' },
    ROM: { name: 'limba română', flag: '🇷🇴' },
    RUS: { name: 'русский язык', flag: '🇷🇺' },
    ESP: { name: 'español', flag: '🇪🇸' },
    TRK: { name: 'Türk dili', flag: '🇹�' },
  };

  const handleLanguageChange = (languageCode) => {
    setSelectedLanguage(languageCode);
    onLanguageChange(languageCode);
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm border border-gray-200 rounded-lg p-4 shadow-lg">
      <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
        🌍 Target Language
      </h3>
      
      <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
        {Object.entries(languages).map(([code, { name, flag }]) => (
          <button
            key={code}
            onClick={() => handleLanguageChange(code)}
            className={`
              flex items-center gap-2 p-2 rounded-md text-sm font-medium transition-all duration-200
              ${selectedLanguage === code
                ? 'bg-blue-500 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-blue-100 hover:text-blue-700'
              }
            `}
          >
            <span className="text-lg">{flag}</span>
            <span className="truncate">{name}</span>
          </button>
        ))}
      </div>
      
      <div className="mt-3 text-xs text-gray-500 text-center">
        Selected: <span className="font-semibold text-gray-700">{selectedLanguage}</span>
      </div>
    </div>
  );
};

export default LanguageSelector;
