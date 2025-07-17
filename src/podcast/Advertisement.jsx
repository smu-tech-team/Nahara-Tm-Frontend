const Advertisement = () => (
  <div className="mt-16 bg-white dark:bg-gray-800 rounded-lg p-6 text-center shadow-md">
    <h3 className="text-xl font-bold text-gray-800 dark:text-white">📢 Advertisement</h3>
    <p className="text-gray-600 dark:text-gray-300 mt-2">
      Your Ad Here — promote your brand, product, or event!
    </p>
    <img
      src="/ad-banner.jpg"
      alt="Ad banner"
      className="mx-auto mt-4 w-full max-h-40 object-cover rounded-md"
    />
  </div>
);

export default Advertisement;
