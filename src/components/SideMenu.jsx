import { Search, Filter, ChevronRight } from "lucide-react"; // Modern Icons
import { Link } from "react-router-dom";

const SideMenu = () => {

    const categories = [
        { name: "All Posts", path: "/posts" },
        { name: "Sports News", path: "/posts?cat=sports-news" },
        { name: "Celebrity News", path: "/posts?cat=celebrity-news" },
        { name: "Politics", path: "/posts?cat=politics" },
        { name: "Betting Tips", path: "/posts?cat=betting-tips" },
        { name: "Hot Gist", path: "/posts?cat=hot-gist" },
    ];
    return (
        <div className="px-4 h-max sticky gap-8 top-8 mb-11 bg-black  shadow-md">
            {/* 🔍 Search Section */}
            <div>
                <h1 className="text-sm font-medium text-white mb-4">Search</h1>
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search posts..."
                        className="w-full p-2 pr-10 border border-gray-700 rounded-md text-white placeholder-gray-400"
                    />
                    <Search className="absolute right-3 top-2 text-gray-400" size={18} />
                </div>
            </div>

            {/* 🔎 Filter Section (Expandable for future features) */}
            <div className="mt-6">
                <h1 className="mt-8 mb-4 textsm font-medium">
                    <Filter size={16} /> Filters
                </h1>
                <div className="flex flex-col gap-2 text-sm">
                <label htmlFor="" className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" 
                    name="sort" 
                    value="newest"
                     className="appearance-none w-4 h-4 border-[1.5px]
                      border-blue-800 cursor-pointer  bg-white rounded-sm checked:bg-blue-800"
                      />
                      Newest
                </label>
                <label htmlFor="" className="flex items-center gap-2 cursor-pointer">
                    <input type="radio"
                     name="sort" 
                     value="most-popular"
                     className="appearance-none w-4 h-4 border-[1.5px]
                      border-blue-800 cursor-pointer bg-white rounded-sm checked:bg-blue-800"
                      />
                      Most Popular
                </label>
                <label htmlFor="" className="flex items-center gap-2 cursor-pointer">
                    <input type="radio"
                     name="sort"
                      value="trending"
                     className="appearance-none w-4 h-4 border-[1.5px]
                      border-blue-800 cursor-pointer  bg-white rounded-sm checked:bg-blue-800"
                      />
                      Trending
                </label>
                <label htmlFor="" className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" 
                    name="sort"
                     value="oldest"
                     className="appearance-none w-4 h-4 border-[1.5px]
                      border-blue-800 cursor-pointer  bg-white rounded-sm checked:bg-blue-800"
                      />
                      Oldest
                </label>

                </div>
                <p className="text-gray-400 text-xs mt-1">Customize your feed</p>
            </div>

            {/* 📂 Categories */}
            <div className="mt-6">
            {/* 📂 Categories Header */}
            <h2 className="text-sm font-medium text-white flex items-center gap-1">
                Categories <ChevronRight size={16} />
            </h2>

            {/* Category Links */}
            <div className="mt-3 space-y-2">
                {categories.map((category, index) => (
                    <Link
                        key={index}
                        to={category.path}
                        className="block px-3 py-1 rounded-lg text-gray-300 hover:text-white hover:bg-gray-800 transition"
                    >
                        {category.name}
                    </Link>
                ))}
            </div>
            </div>
        </div>
    );
};

export default SideMenu;
