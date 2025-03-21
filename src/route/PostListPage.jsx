import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import PostList from "../components/PostList";
import SideMenu from "../components/SideMenu";
import { Menu, X } from "lucide-react";

const PostListPage = () => {
    const [open, setOpen] = useState(false);

    return (
        <div className="container mx-auto px-4 md:px-8 mt-8">
            {/* Mobile Toggle Filter Button */}
            <button
                onClick={() => setOpen((prev) => !prev)}
                className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-lg shadow-md 
                transition hover:bg-blue-700 active:scale-95 md:hidden"
            >
                {open ? <X size={20} /> : <Menu size={20} />}
                {open ? "Close Filters" : "Filter & Search"}
            </button>

            <div className="flex flex-col-reverse gap-8 md:flex-row">
                {/* Post List */}
                <div className="flex-1">
                    <PostList />
                </div>

                {/* Side Menu for Filters */}
                <div
                    className={`md:static left-0 w-full md:w-1/4 p-4 md:p-0 transition-all 
                    ${open ? "block" : "hidden"} md:block md:flex-col md:gap-4 rounded-lg shadow-md md:shadow-none`}
                >
                    <SideMenu />
                </div>
            </div>
        </div>
    );
};

export default PostListPage;
