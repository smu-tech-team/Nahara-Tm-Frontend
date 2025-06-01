import React from "react";

const AdSpace = () => {
  const ads = [
    { id: 1, image: "/ad1.jpg", title: "Boost Your Brand", description: "Reach millions with our ad platform!" },
    { id: 2, image: "/ad2.jpg", title: "Exclusive Deals", description: "Get the best offers on trending products." },
    { id: 3, image: "/ad3.jpg", title: "Learn New Skills", description: "Courses from top universities at a discount!" },
    { id: 4, image: "/ad3.jpg", title: "Learn New Skills", description: "Courses from top universities at a discount!" },
  ];

  return (
    <div className="bg-gray-800 dark:bg-gray-800 p-6 rounded-lg shadow-md mt-6">
      <h3 className="text-xl font-semibold mb-4 text-center dark:text-white">Sponsored Ads</h3>

      <div className="flex overflow-x-auto space-x-4 scrollbar-hide">
        {ads.map(ad => (
          <div key={ad.id} className="min-w-[250px] bg-gray-700 dark:bg-gray-700 p-4 rounded-lg shadow-md">
            <img src={ad.image} alt={ad.title} className="w-full h-32 rounded-lg object-cover" />
            <h4 className="text-lg font-bold mt-3 dark:text-white">{ad.title}</h4>
            <p className="text-gray-500 text-sm">{ad.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdSpace;
