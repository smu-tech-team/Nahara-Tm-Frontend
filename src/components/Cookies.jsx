import { useState, useEffect } from "react";

const CookieConsent = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [preferences, setPreferences] = useState({
    essential: true, // Always enabled
    analytics: false,
    marketing: false,
    ads: false, // Restrict Ads
  });

  useEffect(() => {
    const savedPreferences = localStorage.getItem("cookiePreferences");
    if (!savedPreferences) {
      setIsOpen(true);
    } else {
      const parsedPreferences = JSON.parse(savedPreferences);
      if (
        !parsedPreferences.analytics &&
        !parsedPreferences.marketing &&
        !parsedPreferences.ads
      ) {
        // If all optional cookies are false, re-show the popup
        setIsOpen(true);
      }
    }
  }, []);

  const handleAcceptAll = () => {
    const allPreferences = { essential: true, analytics: true, marketing: true, ads: true };
    localStorage.setItem("cookiePreferences", JSON.stringify(allPreferences));
    setPreferences(allPreferences);
    setIsOpen(false);
  };

  const handleReject = () => {
    localStorage.setItem("cookiePreferences", JSON.stringify({ essential: true }));
    setPreferences({ essential: true, analytics: false, marketing: false, ads: false });
    setIsOpen(false);
  };

  const handleSavePreferences = () => {
    localStorage.setItem("cookiePreferences", JSON.stringify(preferences));
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white dark:bg-gray-900 text-black dark:text-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-xl font-semibold">🍪 Cookie Preferences</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          SMART MEDIA UPDATE use cookies to improve your experience. You can customize your preferences below.
        </p>

        <div className="mt-4 space-y-2">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked disabled /> Essential (Always Enabled)
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={preferences.analytics}
              onChange={() =>
                setPreferences({ ...preferences, analytics: !preferences.analytics })
              }
            />
            Analytics Cookies
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={preferences.marketing}
              onChange={() =>
                setPreferences({ ...preferences, marketing: !preferences.marketing })
              }
            />
            Marketing Cookies
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={preferences.ads}
              onChange={() =>
                setPreferences({ ...preferences, ads: !preferences.ads })
              }
            />
            Ad Cookies (Restrict Ads)
          </label>
        </div>

        <div className="mt-4 flex justify-between">
          <button
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            onClick={handleReject}
          >
            Reject
          </button>
          <div className="flex gap-3">
            <button
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              onClick={handleSavePreferences}
            >
              Save Preferences
            </button>
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              onClick={handleAcceptAll}
            >
              Accept All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
