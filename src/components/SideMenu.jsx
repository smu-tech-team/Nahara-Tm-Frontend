import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Search, Filter, ChevronRight } from "lucide-react";
import SearchBar from "../components/Search";

const SideMenu = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    const handleSortChange = (event) => {
        const sortValue = event.target.value;
        console.log("Selected Sort Option:", sortValue); // Debugging
    
        const newParams = new URLSearchParams(searchParams);
    
        if (!sortValue) {
            newParams.delete("sort");
        } else {
            newParams.set("sort", sortValue);
        }
    
        navigate(`?${newParams.toString()}`, { replace: true });
    };
    

    const handleCategoryChange = (category) => {
        console.log("Selected category:", category); // Debugging
    
        const newParams = new URLSearchParams(searchParams);
    
        if (!category || category === "all-posts") {  
            newParams.delete("category");  // Remove category from URL to fetch all posts
        } else {
            newParams.set("category", category);
        }
    
        navigate(`?${newParams.toString()}`, { replace: true });
    };
    

    const categories = [
        { name: "All Posts", path: "/posts" },
        { name: "Sports News", path: "/posts?category=sports-news" },
        { name: "Celebrity News", path: "/posts?category=celebrity-news" },
        { name: "Politics", path: "/posts?category=politics" },
        { name: "Betting Tips", path: "/posts?category=betting-tips" },
        { name: "Hot Gist", path: "/posts?category=hot-gist" },
        { name: "Football News", path: "/posts?category=football" },
        { name: "Basketball News", path: "/posts?category=basketball" },
        { name: "Tennis News", path: "/posts?category=tennis" },
    ];

    return (
        <div className="px-4 h-max sticky gap-8 top-8 mb-11 bg-black dark:bg-transparent shadow-md">
            <div>
                <h1 className="text-sm font-medium dark:text-black text-white mb-4">Search</h1>
                <div className="mt-6">
                    <SearchBar />
                </div>
            </div>

            <div className="mt-6">
                <h1 className="mt-8 mb-4 text-sm font-medium">
                    <Filter size={16} /> Filters
                </h1>
                <div className="flex flex-col gap-2 text-sm">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="radio"
                            name="sort"
                            value="newest"
                            onChange={handleSortChange}
                            className="appearance-none w-4 h-4 border-[1.5px] border-blue-800 cursor-pointer dark:text-black bg-white rounded-sm checked:bg-blue-800"
                        />
                        Newest
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="radio"
                            name="sort"
                            value="most-popular"
                            onChange={handleSortChange}
                            className="appearance-none w-4 h-4 border-[1.5px] border-blue-800 cursor-pointer dark:text-black bg-white rounded-sm checked:bg-blue-800"
                        />
                        Most Popular
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="radio"
                            name="sort"
                            value="trending"
                            onChange={handleSortChange}
                            className="appearance-none w-4 h-4 border-[1.5px] border-blue-800 cursor-pointer dark:text-black bg-white rounded-sm checked:bg-blue-800"
                        />
                        Trending
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="radio"
                            name="sort"
                            value="oldest"
                            onChange={handleSortChange}
                            className="appearance-none w-4 h-4 border-[1.5px] border-blue-800 cursor-pointer dark:text-black bg-white rounded-sm checked:bg-blue-800"
                        />
                        Oldest
                    </label>
                </div>
            </div>

            <div className="mt-6">
                <h2 className="text-sm font-medium dark:text-black text-white flex items-center gap-1">
                    Categories <ChevronRight size={16} />
                </h2>
                <div className="mt-3 space-y-2 dark:text-black hover:bg-gray-500">
                                {categories.map((category, index) => (
                    <button
                        key={index}
                        onClick={() => handleCategoryChange(category.name.toLowerCase().replace(" ", "-"))}
                        className="block px-3 py-1 rounded-lg text-gray-300 hover:text-white hover:bg-gray-800 transition"
                    >
                        {category.name}
                    </button>
                ))}
             </div>
            </div>
        </div>
    );
};

export default SideMenu;
