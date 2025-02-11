import PostList from "../components/PostList";
import SideMenu from "../components/SideMenu";
import { useState } from 'react';
import { Menu, X } from "lucide-react"; // Modern icons for better UX


const PostListPage = () => {
    const [open, setOpen] = useState(false);


    return (
        <div className="container mx-auto mt-8">
            <h1 className="mb-8 text-2xl ">⚽ Sports News</h1>
            <button onClick={() =>setOpen((prev) => !prev)} 
            className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-lg shadow-md 
            transition hover:bg-blue-700 active:scale-95 md:hidden">              
              {open ? <X size={20} /> : <Menu size={20} />}
                {open ? "Close Filters" : "Filter & Search"}

                </button>    
            <div className="flex flex-col-reverse gap-8 md:flex-row">
            <div className=" mt-5" > 
                <PostList/>
            </div>
           {/* Side Menu (Filters & Search) */}
           <div className={`md:static  left-0 w-max md:w-auto  p-4 md:p-0 transition-all 
                ${open ? "block" : "hidden"} md:block md:flex-col md:gap-4 rounded-lg shadow-md md:shadow-none`}>
                    <SideMenu  />
                </div>

            </div>
        </div>
    );
    }

export default PostListPage;



