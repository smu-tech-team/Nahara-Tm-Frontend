import { Link } from "react-router-dom";

const MainCategories = () =>{
    return(
        <div className=" hidden md:flex bg-white rounded-3xl xl:rounded-full p-4 shadow-lg items-center 
        justify-center gap-8">
            {/*Links*/} 
            <div className="text-black  flex-1 flex items-center justify-between flex-wrap">
                <Link to="/posts" className="bg-blue-800 hover:bg-blue-900 text-white rounded-full px-4 py-2">
                All Posts</Link>
                <Link to="/posts?cat=sport-news" className="hover:bg-blue-800  hover:text-white rounded-full px-4 py-2">
                Sports News</Link>
                <Link to="/posts?cat=celebrity-news" className="hover:bg-blue-800 hover:text-white rounded-full px-4 py-2">
                Celebrity News</Link>
                <Link to="/posts?cat=politice" className="hover:bg-blue-800 hover:text-white rounded-full px-4 py-2">
                Politice</Link>
                <Link to="/posts?cat=betting-tips" className="hover:bg-blue-800 hover:text-white  rounded-full px-4 py-2">
                Betting Tips</Link>
                <Link to="/posts?cat=hot-gist" className="hover:bg-blue-800 hover:text-white  rounded-full px-4 py-2">
                Hot gist</Link>
                </div>    

                <span className="text-xl font-medium text-black">|</span>
            {/*search*/} 
            <div className="bg-gray-100 p-2 rounded-full text-black flex items-center">
               <svg 
               xmlns="http://www.w3.org/2000/svg"
               viewBox="0 0 24 24"
               width="20"
               height="20"
               fill="none"
               stroke="gray"
               >
                <circle cx="10.5" cy="10.5" r="7.5"/>
                <line x1="16.5" y1="16.5" x2="22" y2="22" />
                </svg> 
                <input type="text" placeholder="search a post...." className="bg-transparent"/>

            </div>
       
            </div>
    )
}
export default MainCategories;