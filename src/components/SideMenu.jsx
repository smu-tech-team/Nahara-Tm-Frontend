import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Filter, ChevronRight, Sparkles } from "lucide-react";
import SearchBar from "../components/Search";

const SideMenu = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    const handleSortChange = (event) => {
        const sortValue = event.target.value;
        const newParams = new URLSearchParams(searchParams);

        if (!sortValue) {
            newParams.delete("sort");
        } else {
            newParams.set("sort", sortValue);
        }

        navigate(`?${newParams.toString()}`, { replace: true });
    };

    const handleCategoryChange = (category) => {
        const newParams = new URLSearchParams(searchParams);

        if (!category || category === "all-posts") {
            newParams.delete("category");
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
        <aside className="p-4 h-max sticky top-8 mb-11 bg-black dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-700">
            <div>
                <h1 className="text-base font-semibold text-white mb-3 flex items-center gap-2">
                    <Sparkles className="text-yellow-400" size={18} /> Discover
                </h1>
                <SearchBar />
            </div>

            <div className="mt-6">
                <h2 className="text-base font-semibold text-white flex items-center gap-2">
                    <Filter size={16} /> Sort By
                </h2>
                <div className="flex flex-col gap-2 mt-3 text-sm">
                    {["newest", "most-popular", "trending", "oldest"].map((sort) => (
                        <label
                            key={sort}
                            className="flex items-center gap-2 cursor-pointer text-white hover:text-blue-400 transition"
                        >
                            <input
                                type="radio"
                                name="sort"
                                value={sort}
                                onChange={handleSortChange}
                                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 rounded-sm"
                            />
                            {sort.replace("-", " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                        </label>
                    ))}
                </div>
            </div>

            <div className="mt-8">
                <h2 className="text-base font-semibold text-white flex items-center gap-1">
                    <ChevronRight size={16} /> Categories
                </h2>
                <div className="mt-3 flex flex-col gap-2">
                    {categories.map((category, index) => (
                        <button
                            key={index}
                            onClick={() => handleCategoryChange(category.name.toLowerCase().replace(/\s+/g, "-"))}
                            className="px-3 py-2 rounded-md text-sm text-white bg-gray-800 hover:bg-blue-700 hover:text-white transition duration-200 text-left"
                        >
                            {category.name}
                        </button>
                    ))}
                </div>
            </div>

            <div className="mt-10 text-center">
                <Link
                    to="/submit"
                    className="inline-block w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-2 px-4 rounded-lg hover:scale-105 transition-transform"
                >
                    Submit a Post
                </Link>
            </div>
        </aside>
    );
};

export default SideMenu;
