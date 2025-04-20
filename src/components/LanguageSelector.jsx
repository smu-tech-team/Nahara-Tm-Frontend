import React, { useState } from "react";
import axios from "axios";

const LanguageSelector = ({ content, setTranslatedContent }) => {
    const [selectedLanguage, setSelectedLanguage] = useState("en"); // Default language
    const languages = [
        { code: "en", name: "English" },
        { code: "es", name: "Spanish" },
        { code: "fr", name: "French" },
        { code: "de", name: "German" },
        { code: "zh", name: "Chinese" },
        { code: "ar", name: "Arabic" },
    ];

    const handleLanguageChange = async (languageCode) => {
      if (!content || content.trim() === "") {
          console.error("Error: Content to translate is empty!");
          return;
      }
  
      try {
          const response = await axios.post(
              "https://libretranslate.com/translate",
              {
                  q: content, // Text to translate
                  source: "en", // Source language
                  target: languageCode, // Target language
                  format: "text", // Ensures plaintext
              },
              {
                  headers: {
                      "Content-Type": "application/json", // Required for JSON payload
                  },
              }
          );
            setTranslatedContent(response.data.translatedText);
      } catch (error) {
          console.error("Error translating text:", error);
      }
  };
  
    return (
        <div className="">
            <p className="mb-2 text-gray-600">Selected Language: {languages.find(lang => lang.code === selectedLanguage)?.name}</p>
            <select
                value={selectedLanguage} // Show the currently selected language in the dropdown
                onChange={(e) => handleLanguageChange(e.target.value)}
                className="px-4 py-2 rounded-md bg-gray-200"
            >
                {languages.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                        {lang.name}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default LanguageSelector;
