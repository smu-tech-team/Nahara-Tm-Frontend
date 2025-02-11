import { Link } from "react-router-dom";
import MainCategories from "../components/MainCategpries";
import FeaturedPost from "../components/FeaturePost";
import PostList from "../components/PostList";

const Homepage = () => {
  return (
    <div className="mt-4 flex flex-col gap-4">
      {/*   BREADCRUMB */}
      <div className="flex gap-2">
        <Link to="/">Home</Link>
        <span className="font-bold">.</span>
        <span className="text-blue-800">News and Bets</span>

      </div>
      {/*   INTRODUCTION */}
      <div className="flex items-center justify-between">
      {/* titles */}
      <div className="">
        <h1 className="text-gray-800 text-2xl md:text-5xl lg:text-6xl font-bold pt-3">
          Your partner in legit news</h1>
        <p className="mt-8 text-md md:text-xl"></p>
        <p className="font-bold text-gray-300">Smart Media Update Tv. <br></br>
          Is part of SMU Sport News<br></br> your 
          number one place for legit news.</p>
      </div>
      {/* animated button */}
      <Link to="write" className="hidden md:block relative">
      <svg
  viewBox="0 0 200 200"
  width="200"
  height="200"
  className="text-lg tracking-wider animate-spin animatedButton"

>
  <path
    id="circlePath"
    fill="none"
    d="M 100, 100 m-75 0 a 75, 75 0 1,1 150,0 a 75,75 0 1,1 -150,0"
  />
 <text>
  <textPath href="#circlePath" startOffset="0%" fill="white">Write your story .</textPath>
  <textPath href="#circlePath" startOffset="50%"  fill="white">Share your idea .</textPath>
</text>
</svg>
<button className="absolute top-0 left-0 right-0 bottom-0 m-auto w-20 h-20 bg-red-600 rounded-full flex items-center justify-center">
<svg
xmlns="http://www.w3.org/2000/svg"
viewBox="0 0 24 24"
width="50"
height="50"
fill="none"
stroke="white"
strokeWidth="2"
>
  <line x1="6" y1="18" x2="18" y2="6"/>
  <polyline points="9 6 18 6 18 15"/>
</svg>

</button>

      </Link>
      </div>
      {/* Categories */}
      <MainCategories/>
      {/* FEATURED POSTS */}
      <FeaturedPost/>
      {/*   POST LIST */}
      <div className="">
        <h1 className="my-8 text-2xl text-gray-600">Recent Posts</h1>
        <PostList/>
      </div>
    </div>
  );
}   

export default Homepage;