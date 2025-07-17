import React from "react";

const AdSpace = () => {
  const ads = [
    { id: 1, image: "/Copilot.png", title: "Boost Your Brand", description: "Reach millions with our ad platform!" },
    { id: 2, image: "/Rebranded.jpg", title: "Exclusive Deals", description: "Get the best offers on trending products." },
    { id: 3, image: "/smuads2.jpg", title: "Learn New Skills", description: "Courses from top universities at a discount!" },
    { id: 4, image: "/smuads.jpg", title: "Learn New Skills", description: "Courses from top universities at a discount!" },
     { id: 5, image: "/Copilot.png", title: "Boost Your Brand", description: "Reach millions with our ad platform!" },
    { id: 6, image: "/Rebranded.jpg", title: "Exclusive Deals", description: "Get the best offers on trending products." },
    { id: 7, image: "/smuads2.jpg", title: "Learn New Skills", description: "Courses from top universities at a discount!" },
    { id: 8, image: "/smuads.jpg", title: "Learn New Skills", description: "Courses from top universities at a discount!" },
     { id: 9, image: "/Copilot.png", title: "Boost Your Brand", description: "Reach millions with our ad platform!" },
    { id: 10, image: "/Rebranded.jpg", title: "Exclusive Deals", description: "Get the best offers on trending products." },
    { id: 10, image: "/smuads2.jpg", title: "Learn New Skills", description: "Courses from top universities at a discount!" },
    { id: 12, image: "/smuads.jpg", title: "Learn New Skills", description: "Courses from top universities at a discount!" },
  ];

  return (
    <div className=" p-6 rounded-lg shadow-md mt-6 mb-6 ">
      <h3 className="text-xl font-semibold mb-4 text-center dark:text-white">Sponsored Ads</h3>

      <div className="flex overflow-x-auto space-x-4 scrollbar-hide">
        {ads.map(ad => (
          <div key={ad.id} className="min-w-[200px]  p-4 rounded-lg shadow-md">
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
