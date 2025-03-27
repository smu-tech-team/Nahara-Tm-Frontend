import Image from "../components/Image";
import { Link } from "react-router-dom";
import PostMenuActions from "./PostMenuAction";
import SearchBar from "./Search";
import Comments from "./Comments";
import { useEffect, useState,  } from "react";
import {  useParams } from "react-router-dom";
import axios from "axios";
// import { Helmet } from 'react-helmet';
import { useQuery } from "@tanstack/react-query";
import PostCard from "../components/PostCard";
import  Skeleton  from "../components/Skelete";
import PostShareActions from "./PostShareActions";




const fetchPost = async (slug) => {
    try {
        const response = await axios.get(`http://localhost:8087/api/post/post/${slug}`);
        return response.data; // ✅ Return the data
    } catch (error) {
        console.error("Error fetching post:", error);
        throw new Error("Failed to fetch post"); // ✅ Throw an error so React Query can handle it
    }
};

const SinglePostPage = () => {
    const { slug } = useParams();
    console.log("Slug from URL:", slug);
    const [views, setViews] = useState(0);
    const [likes, setLikes] = useState(0);
    const [isLiking, setIsLiking] = useState(false);
    const [likeMessage, setLikeMessage] = useState('');;
    const [message] = useState(null);
    const [postDetails, setPostDetails] = useState(null);
    const [isLoading, setIsLoading] = useState(true); // Loading state


    const fetchRelatedPosts = async (slug) => {
        const response = await axios.get(`http://localhost:8087/api/post/${slug}/related`);
        if (response.status !== 200) {
            throw new Error("Failed to fetch related posts");
        }
        return response.data;
    };
    
    // Fetch post data and update views
    useEffect(() => {
        if (!slug) {
            console.error("slug is undefined");
            return;
        }

        const fetchPost = async () => {
            try {
                const response = await axios.get(` http://localhost:8087/api/post/post/${slug}`);
                setPostDetails(response.data); // ✅ Now this will work
                console.log("Fetched post:", response.data);
            } catch (error) {
                console.error("Error fetching post:", error);
            } finally {
                setIsLoading(false);
            }
        };

    

        const updateViews = async () => {
            const viewedPosts = JSON.parse(localStorage.getItem("viewedPosts")) || [];
            if (!viewedPosts.includes(slug)) {
                try {
                    const response = await axios.post(
                        `http://localhost:8087/api/post/${slug}/view`,
                        {},
                        { withCredentials: true }
                    );
                    setViews(response.data.views); // ✅ Correct state update
                    localStorage.setItem("viewedPosts", JSON.stringify([...viewedPosts, slug]));
                    console.log("Updated views:", response.data);
                } catch (error) {
                    console.error("Error updating views:", error);
                }
            }
        };

        fetchPost();
        updateViews();
    }, [setPostDetails, slug]);

    useEffect(() => {
        if (postDetails) {
            setViews(postDetails.views); // Ensure views are updated correctly
        }
    }, [postDetails]);
    
       

    const handleLike = async () => {
        if (!postData?.id) return;
        setIsLiking(true);
        try {
            const response = await axios.post(`http://localhost:8087/api/post/${postData.id}/like`);
            setLikes(response.data.likes || 0);
            setLikeMessage("Post liked!");
        } catch (error) {
            console.error("Error liking post:", error);
            setLikeMessage("Failed to like post.");
        } finally {
            setIsLiking(false);
        }
    };
        useEffect(() => {
            const script = document.createElement("script");
            script.src = "https://images.dmca.com/Badges/DMCABadgeHelper.min.js";
            script.async = true;
            document.body.appendChild(script);
        }, []);


        
        

    const { 
        isLoading: isLoadingRelatedPosts, 
        error: relatedPostsError, 
        data: relatedPosts = [] 
    } = useQuery({
        queryKey: ['relatedPosts', slug],
        queryFn: () => fetchRelatedPosts(slug),
        enabled: !!slug,
    });
    
    const { 
        isLoading: isLoadingPost, 
        data: postData 
    } = useQuery({
        queryKey: ['post', slug],
        queryFn: () => fetchPost(slug),
        enabled: !!slug,
    });
    
    // Handle errors for related posts separately
    if (relatedPostsError) {
        console.error("Error fetching related posts:", relatedPostsError);
        return <p className="text-gray-500">Error loading related posts.</p>;
    }
    
    // Handle loading and data states for main post and related posts
    if (isLoadingPost || isLoadingRelatedPosts) {
        return <Skeleton className="w-full h-64" />;
    }
    
    if (!postDetails) {
        return <p className="text-center text-gray-500">Post not found</p>;
    }      
    const localTime = postData?.createdAt ? new Date(postData.createdAt).toLocaleString() : "Unknown Date";



    return (
        <div className="flex flex-col gap-12 p-4 md:p-8">
            {/* Post Details */}
            <div className="flex flex-col lg:flex-row gap-8">
                {/* Left Content */}
                <div className="lg:w-3/5 flex flex-col gap-6">
               
                    <h1 className="text-2xl md:text-4xl xl:text-5xl font-bold leading-tight">
                        {postDetails.title}
                    </h1>
                    {/* Post Meta Info */}
                    <div className="flex items-center gap-3 text-gray-500 text-sm">
                        <span>Written by</span>
                        <Link to={`/creator/${postDetails?.creator?.id}`} 
                         className="text-blue-700 font-semibold hover:underline">
                        {postDetails?.creator?.blogName || "Unknown Creator"}
                        </Link>
                        <span>on</span>
                        <Link to="cat" className="text-blue-700 font-semibold hover:underline">{postData.category}</Link>
                        <span>{localTime}</span> {/* Displays proper local time */}
                        <span className="ml-4 text-gray-600 dark:text-gray-400">👁️ <span className="text-green-400">{postData.views} </span>
                        <span className="font-bold">views</span> 
                        </span>
                    </div>
                    {/* Post Intro */}
                    <p className="text-gray-400 dark:text-gray-400 leading-relaxed">
                        {postDetails.desc}
                    </p>
                </div>

                {/* Advertisement Image */}
                { postDetails.img && <div className="hidden lg:block lg:w-2/5">
                   <img src={postDetails.img} width="500" className="rounded-2xl shadow-lg" />
                </div>}
            </div>

            {/* Content & Sidebar Section */}
            <div className="flex flex-col md:flex-row gap-10">
                {/* Article Content */}
                <div className="lg:w-3/5 text-lg leading-relaxed space-y-6 text-justify">
                <p>
                        {postDetails.content}
                    </p>

                    {/* 🔹 Ad Space (In-Article Ad) */}
                    <div>
                    <h1 className="flex flex-col items-center font-bold">Advertisment</h1>

                   <div className="flex justify-center my-8">
                         <Image src="myphoto.jpg" w="300" h="250" className="rounded-lg shadow-md" />
                    </div>
                    </div>
                </div>
                
                    {/* Message */}
                    {message && <div className="mt-4 text-sm text-gray-600">{message}</div>}
                {/* Sidebar Section */}
                <div className="px-4 h-max   dark:text-black text-white rounded-2xl shadow-lg sticky top-8">
                    {/* Author Section */}
                    <h2 className="text-xl  dark:text-black font-semibold mb-4">Author</h2>
                    
                    <div className="flex items-center gap-4">
                    
                    {postDetails.creator.blogProfile && <img src={postDetails.creator.blogProfile} className="w-14 h-14 
                    rounded-full object-cover" width="56" height="56" />}
                        <div>
                            <Link to={`/creator/${postDetails?.creator?.id}`} 
                            className="text-blue-400 font-semibold text-lg hover:underline">
                            {postDetails?.creator?.blogName ?? "Unknown Creator"}

                            </Link>
                        </div>
                    </div>

                    <p className="mt-4 text-gray-400 text-sm break-words whitespace-pre-line max-w-md">
                        {postDetails.creator.blogDescription}
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
                        <PostMenuActions
                        postId={postDetails?.id}
                        creatorId={postDetails?.id} // Ensure this exists
                        content={postDetails?.content}
                        userId={postDetails?.id}
                        />

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
            <PostShareActions slug={slug}  />
            <button
                onClick={() => (window.location.href = `/report-post?slug=${slug}`)} // Redirects user to report page
                className="relative px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-red-500 to-red-700 rounded-lg shadow-lg hover:from-red-600 hover:to-red-800 focus:outline-none focus:ring focus:ring-red-300 transition-transform transform hover:scale-105 active:scale-95"
                >
                <span className="absolute inset-0 bg-red-700 opacity-25 rounded-lg blur-lg"></span>
                <span className="relative">🚨 Report Post</span>
                </button>






              {/* Related Posts Section */}
              {/* Related Posts in the Middle of Content */}
              <div className="my-10">
                <h2 className="text-xl md:text-2xl font-semibold mb-6 text-center pt-30 border-b-2 border-gray-300 dark:border-gray-700">
                    Related Posts
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                    {isLoadingRelatedPosts ? (
                    <Skeleton className="w-full h-48" />
                    ) : relatedPosts.length > 0 ? (
                    relatedPosts.map((post) => (
                        <Link key={post.id} to={`/${post.slug}`} className="block">
                        <PostCard 
                         src={post.img}
                         alt={post.title}
                        post={post}
                         />
                        
                        <p className="text-xs text-gray-300 dark:text-gray-800 mt-2 line-clamp-1">
                        {post.category}
                        </p>
                        </Link>
                    ))
                    ) : (
                    <p className="text-gray-500">No related posts found.</p>
                    )}
                </div>
               

                            
                  {/* Your existing post content */}
                  <div className="pt-4 pb-4">
                  <button
                onClick={handleLike}
                disabled={isLiking}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
            {isLiking ? 'Liking...' : '★ Like'}
                <span >{likes}</span>
            </button>
            {likeMessage && <p>{likeMessage}</p>}
            {/* Your existing post content */}
                    {/* Message */}
            {message && <div className="mt-4 text-sm text-gray-600">{message}</div>}
            </div>
             <Comments 
             postId={postDetails.id}
             userId={postDetails.id} />
             
            </div>
        </div>

    
    );
};

export default SinglePostPage;
