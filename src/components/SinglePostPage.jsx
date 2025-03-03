import Image from "../components/Image";
import { Link } from "react-router-dom";
import PostMenuActions from "./PostMenuAction";
import SearchBar from "./Search";
import Comments from "./Comments";
import { useEffect, useState } from "react";
import {  useParams } from "react-router-dom";
import axios from "axios";


const SinglePostPage = () => {

    const { postId } = useParams(); // Assuming postId is passed in the route
    const [views, setViews] = useState(0);

    useEffect(() => {
        // Fetch and update post views when the component mounts
        const updateViews = async () => {
            try {
                const response = await axios.post(`http://localhost:8087/api/post/${postId}/view`);
                setViews(response.data.views);
            } catch (error) {
                console.error("Error updating post views", error);
            }
        };
        updateViews();
    }, [postId]);

    return (
        <div className="flex flex-col gap-12 p-4 md:p-8">
            {/* Post Details */}
            <div className="flex flex-col lg:flex-row gap-8">
                {/* Left Content */}
                <div className="lg:w-3/5 flex flex-col gap-6">
                    <h1 className="text-2xl md:text-4xl xl:text-5xl font-bold leading-tight">
                        Manchester United a 'bunch of strangers',
                        <br /> says Roy Keane after FA Cup fourth-round victory over Leicester
                    </h1>
                    
                    {/* Post Meta Info */}
                    <div className="flex items-center gap-3 text-gray-500 text-sm">
                        <span>Written by</span>
                        <Link to="#" className="text-blue-700 font-semibold hover:underline">John Doe</Link>
                        <span>on</span>
                        <Link to="#" className="text-blue-700 font-semibold hover:underline">Sport News</Link>
                        <span>• 2 days ago</span>
                        <span className="ml-4 text-gray-600 dark:text-gray-400">👁️ {views} views</span>

                    </div>

                    {/* Post Intro */}
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        Football, also known as soccer, is a team sport where two teams 
                        compete to score goals by moving a ball into the opponent's net.
                         It's the most popular sport globally, with billions of viewers
                          tuning in for the World Cup every four years.
                    </p>
                </div>

                {/* Advertisement Image */}
                <div className="hidden lg:block lg:w-2/5">
                    <Image src="SMUADS.PNG.jpg" w="500" className="rounded-2xl shadow-lg" />
                </div>
            </div>

            {/* Content & Sidebar Section */}
            <div className="flex flex-col md:flex-row gap-10">
                {/* Article Content */}
                <div className="lg:w-3/5 text-lg leading-relaxed space-y-6 text-justify">
                <p>
                        Football, also known as soccer, is played with two teams aiming to 
                        score goals by kicking the ball into the opponent’s net. It is the
                         most followed sport worldwide, with an unparalleled level of 
                         excitement and fan engagement.

                         The January transfer window has barely been closed a week and Arsenal and Chelsea are among the clubs already plotting huge summer transfer moves.

                            Arsenal failed to sign a striker in January but are ready to back Mikel Arteta with some big new signings for next season, with Alexander Isak and Nico Williams among their potential targets. The Gunners are also said to be plotting a shock move for Liverpool star Diogo Jota. Chelsea had a quiet January too, and their two priorities in the summer are new forwards and a new goalkeeper. The Blues are being linked with Bournemouth star Antoine Semenyo.


                    Liverpool are said be eyeing up a potential replacement for Virgil van Dijk amid uncertainty over his future at Anfield, Manchester United are keen on Geovany Quenda and Fermin Lopez, and Arsenal could face a fight to keep hold of William Saliba amid interest from Real Madrid. Tottenham also look set for a busy summer as they continue to rebuild their squad. Follow all the latest news, gossip and rumours below!
                    </p>
                    <p>
                        Football, also known as soccer, is played with two teams aiming to 
                        score goals by kicking the ball into the opponent’s net. It is the
                         most followed sport worldwide, with an unparalleled level of 
                         excitement and fan engagement.

                         The January transfer window has barely been closed a week and Arsenal and Chelsea are among the clubs already plotting huge summer transfer moves.

                            Arsenal failed to sign a striker in January but are ready to back Mikel Arteta with some big new signings for next season, with Alexander Isak and Nico Williams among their potential targets. The Gunners are also said to be plotting a shock move for Liverpool star Diogo Jota. Chelsea had a quiet January too, and their two priorities in the summer are new forwards and a new goalkeeper. The Blues are being linked with Bournemouth star Antoine Semenyo.


                    Liverpool are said be eyeing up a potential replacement for Virgil van Dijk amid uncertainty over his future at Anfield, Manchester United are keen on Geovany Quenda and Fermin Lopez, and Arsenal could face a fight to keep hold of William Saliba amid interest from Real Madrid. Tottenham also look set for a busy summer as they continue to rebuild their squad. Follow all the latest news, gossip and rumours below!
                    </p>
                    {/* 🔹 Ad Space (In-Article Ad) */}
                    <div>
                    <h1 className="flex flex-col items-center font-bold">Advertisment</h1>

                   <div className="flex justify-center my-8">
                         <Image src="myphoto.jpg" w="300" h="250" className="rounded-lg shadow-md" />
                    </div>
                    </div>
                    <p>
                        Football, also known as soccer, is played with two teams aiming to 
                        score goals by kicking the ball into the opponent’s net. It is the
                         most followed sport worldwide, with an unparalleled level of 
                         excitement and fan engagement.

                         The January transfer window has barely been closed a week and Arsenal and Chelsea are among the clubs already plotting huge summer transfer moves.

                            Arsenal failed to sign a striker in January but are ready to back Mikel Arteta with some big new signings for next season, with Alexander Isak and Nico Williams among their potential targets. The Gunners are also said to be plotting a shock move for Liverpool star Diogo Jota. Chelsea had a quiet January too, and their two priorities in the summer are new forwards and a new goalkeeper. The Blues are being linked with Bournemouth star Antoine Semenyo.


                    Liverpool are said be eyeing up a potential replacement for Virgil van Dijk amid uncertainty over his future at Anfield, Manchester United are keen on Geovany Quenda and Fermin Lopez, and Arsenal could face a fight to keep hold of William Saliba amid interest from Real Madrid. Tottenham also look set for a busy summer as they continue to rebuild their squad. Follow all the latest news, gossip and rumours below!
                    </p>
                    <p>
                        Football, also known as soccer, is played with two teams aiming to 
                        score goals by kicking the ball into the opponent’s net. It is the
                         most followed sport worldwide, with an unparalleled level of 
                         excitement and fan engagement.

                         The January transfer window has barely been closed a week and Arsenal and Chelsea are among the clubs already plotting huge summer transfer moves.

                            Arsenal failed to sign a striker in January but are ready to back Mikel Arteta with some big new signings for next season, with Alexander Isak and Nico Williams among their potential targets. The Gunners are also said to be plotting a shock move for Liverpool star Diogo Jota. Chelsea had a quiet January too, and their two priorities in the summer are new forwards and a new goalkeeper. The Blues are being linked with Bournemouth star Antoine Semenyo.


                    Liverpool are said be eyeing up a potential replacement for Virgil van Dijk amid uncertainty over his future at Anfield, Manchester United are keen on Geovany Quenda and Fermin Lopez, and Arsenal could face a fight to keep hold of William Saliba amid interest from Real Madrid. Tottenham also look set for a busy summer as they continue to rebuild their squad. Follow all the latest news, gossip and rumours below!
                    </p>
                    <p>
                        Football, also known as soccer, is played with two teams aiming to 
                        score goals by kicking the ball into the opponent’s net. It is the
                         most followed sport worldwide, with an unparalleled level of 
                         excitement and fan engagement.
                    </p>
                    <p>
                        Major leagues such as the English Premier League and La Liga attract millions of viewers weekly. The FIFA World Cup, held every four years, remains the biggest sporting event, uniting fans globally.
                    </p>
                    <p>
                        Whether it's the skillful dribbles, stunning goals, or tactical battles, football never fails to entertain. The sport continues to evolve, captivating new generations with its rich history and competitive spirit.
                    </p>
                </div>

                {/* Sidebar Section */}
                <div className="px-4 h-max   dark:text-black text-white rounded-2xl shadow-lg sticky top-8">
                    {/* Author Section */}
                    <h2 className="text-xl  dark:text-black font-semibold mb-4">Author</h2>
                    
                    <div className="flex items-center gap-4">
                        <Image src="myphoto.jpg" className="w-14 h-14 rounded-full object-cover" w="56" h="56" />
                        <div>
                            <Link to="#" className="text-blue-400 font-semibold text-lg hover:underline">Smart</Link>
                            <p className="text-gray-400  dark:text-black text-sm">Football & Sports Analyst</p>
                        </div>
                    </div>

                    {/* Author Bio */}
                    <p className="mt-4 text-gray-400 text-sm">
                        Passionate sports writer covering football news, game strategies, and match analyses.
                    </p>

                    {/* Social Links */}
                    <div className="flex gap-3 mt-4">
                        <Link to="#">
                            <Image src="2021_Facebook_icon.svg.png" className="h-8 w-8 hover:opacity-80 transition" />
                        </Link>
                        <Link to="#">
                            <Image src="instagram.svg" className="h-8 w-8 hover:opacity-80 transition" />
                        </Link>
                    </div>

                    {/* Post Menu Actions */}
                    <div className="mt-6">
                        <h2 className="text-lg font-semibold mb-3">Actions</h2>
                        <PostMenuActions />
                    </div>

                    {/* Categories Section */}
                    <div className="mt-6  dark:text-black">
                        <h1 className="text-sm font-medium  mb-4">Categories</h1>
                        <div className="flex flex-col gap-2 text-sm">
                            <Link className="hover:underline">All</Link>
                            <Link className="hover:underline" to="">Sports News</Link>
                            <Link className="hover:underline" to="">Celebrity News</Link>
                            <Link className="hover:underline" to="">Politics</Link>  
                            <Link className="hover:underline" to="">Betting Tips</Link>
                            <Link className="hover:underline" to="">Hot Gist</Link>
                        </div>
                    </div>

                    {/* Search Section */}
                    <div className="mt-6">
                        <h1 className="text-sm font-medium   mb-4">Search</h1>
                        <SearchBar />  
                    </div>
                </div>
            </div>
            <Comments/>
        </div>
    );
};

export default SinglePostPage;
