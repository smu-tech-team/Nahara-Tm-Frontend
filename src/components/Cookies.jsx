import { useState, useEffect } from "react";

const CookieConsent = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [preferences, setPreferences] = useState({
    essential: true, // Always enabled
    analytics: false,
    marketing: false,
    ads: false,
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
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
      <div className="bg-white dark:bg-gray-900 text-black dark:text-white p-6 rounded-lg shadow-lg w-full max-w-md md:max-w-lg">
        <h2 className="text-lg sm:text-xl font-semibold mb-3">🍪 Cookie Preferences</h2>
        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
          SMART MEDIA UPDATE uses cookies to improve your experience. Customize your preferences below.
        </p>

        <div className="mt-4 space-y-3">
          <label className="flex items-center gap-3">
            <input type="checkbox" checked disabled className="h-4 w-4" />
            <span className="text-xs sm:text-sm">Essential (Always Enabled)</span>
          </label>
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={preferences.analytics}
              onChange={() =>
                setPreferences({ ...preferences, analytics: !preferences.analytics })
              }
              className="h-4 w-4"
            />
            <span className="text-xs sm:text-sm">Analytics Cookies</span>
          </label>
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={preferences.marketing}
              onChange={() =>
                setPreferences({ ...preferences, marketing: !preferences.marketing })
              }
              className="h-4 w-4"
            />
            <span className="text-xs sm:text-sm">Marketing Cookies</span>
          </label>
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={preferences.ads}
              onChange={() =>
                setPreferences({ ...preferences, ads: !preferences.ads })
              }
              className="h-4 w-4"
            />
            <span className="text-xs sm:text-sm">Ad Cookies (Restrict Ads)</span>
          </label>
        </div>

        <div className="mt-6 flex flex-col md:flex-row md:justify-between gap-3">
          <button
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm sm:text-base"
            onClick={handleReject}
          >
            Reject
          </button>
          <div className="flex flex-col md:flex-row gap-3">
            <button
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-sm sm:text-base"
              onClick={handleSavePreferences}
            >
              Save Preferences
            </button>
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm sm:text-base"
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
