import { Link } from "react-router-dom";
import Image from "./Image";

const PostListItem = () => {
    return (
        <div className="flex flex-row gap-6 w-full bg-gray-800 dark:bg-transparent text-white dark:bg-gray-900
         dark:text-gray-800 p-4 rounded-2xl shadow-lg hover:shadow-xl dark:shadow-black transition">
            {/* Image */}
            <div className="w-1/3">
                <Image src="SmartLogoMain.png" className="rounded-2xl object-cover" w="730" />
            </div>
            {/* Details */}
            <div className="flex flex-col gap-4 w-2/3">
                <Link to="/test" className="text-2xl font-semibold hover:text-blue-400 transition">
                    Another test
                </Link>
                <div className="flex items-center gap-2 dark:text-gray-600 text-gray-300 text-sm">
                    <span>Written</span>
                    <Link className="text-blue-400 hover:underline">John Doe</Link>
                    <span>on</span>
                    <Link className="text-blue-400 hover:underline">Sport News</Link>
                    <span>2 days ago</span>
                </div>
                <p className="text-gray-300 dark:text-gray-800 items-center">
                    Best in football and new games. Football, also known as soccer or association 
                    football, is a team sport where two teams compete to score goals by moving a 
                    ball into the other team's net. It's the most popular sport in the world, 
                    with billions of viewers watching the World Cup every four years.
                </p>
                {/* Read More Link */}
                <Link to="/test" className="text-blue-400 hover:text-blue-300 font-semibold animate-pulse">
                    Read More →
                </Link>
            </div>
        </div>
    );
};

export default PostListItem;
