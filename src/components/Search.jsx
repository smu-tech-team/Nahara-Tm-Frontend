import { Search as SearchIcon } from "lucide-react";

const SearchBar = () => {
    return (
        <div className="flex items-center bg-gray-800 text-white p-3 rounded-full shadow-md w-full md:w-2/5">
            {/* Search Icon */}
            <SearchIcon size={22} className="text-gray-400" />

            {/* Search Input */}
            <input
                type="text"
                placeholder="Search for posts..."
                className="bg-transparent outline-none shadow-white text-white   w-full px-2"
            />
        </div>
    );
};

export default SearchBar;
