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
import PostTakenDown from "./PostTakenDown";
import PostLikeButton from "./PostLikeButton";
import MarketDashboard from "./MarketDashboard";
import AdSpace from "./AdSpace";
const fetchPost = async (slug) => {
    try {
        const response = await axios.get(`https://nahara-production.up.railway.app/api/post/post/${slug}`);
        return response.data; 
    } catch (error) {
        console.error("Error fetching post:", error);
        throw new Error("Failed to fetch post");
    }
};
const SinglePostPage = () => {
    const { slug } = useParams();
    console.log("Slug from URL:", slug);
    const [views, setViews] = useState(0);
    const [message] = useState(null);
    const [postDetails, setPostDetails] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const fetchRelatedPosts = async (slug) => {
        const response = await axios.get(`https://nahara-production.up.railway.app/api/post/${slug}/related`);
        if (response.status !== 200) {
            throw new Error("Failed to fetch related posts");
        }
        return response.data;
    };
        useEffect(() => {
        if (!slug) {
            console.error("slug is undefined");
            return;
        }
        const fetchPost = async () => {
            try {
                const response = await axios.get(` https://nahara-production.up.railway.app/api/post/post/${slug}`);
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
                        `https://nahara-production.up.railway.app/api/post/${slug}/view`,
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
        if (relatedPostsError) {
        console.error("Error fetching related posts:", relatedPostsError);
        return <p className="text-gray-500">Error loading related posts.</p>;
    }
        if (isLoadingPost || isLoadingRelatedPosts) {
        return <Skeleton className="w-full h-64" />;
    }
    if (!postDetails) {
        return <p className="text-center text-gray-500">Post not found</p>;
    }      
    const localTime = postData?.createdAt ? new Date(postData.createdAt).toLocaleString() : "Unknown Date";
    if (postDetails.status === "TAKEN_DOWN") {
        return <PostTakenDown slug={slug} />;
    }
    return (
        <div className="flex flex-col gap-12 p-4 md:p-8">
            <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-3/5 flex flex-col gap-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl xl:text-5xl font-bold leading-tight">
            {postDetails.title}
                    </h1>
                    <div className="flex flex-wrap items-center gap-3 text-gray-500 text-sm">
                    <span>Written by</span>
                        <Link to={`/creator/${postDetails?.creator?.id}`} 
                        className="text-blue-700 font-semibold hover:underline"
          >
                        {postDetails?.creator?.blogName || "Unknown Creator"}
                        </Link>
                        <span>on</span>
                        <Link to="cat"
                         className="text-blue-700 font-semibold hover:underline"
                         >{postData.category}</Link>
                        <span>{localTime}</span> 
                        <span className="ml-4 text-gray-600 dark:text-gray-400">
                            👁️ {" "}
                             <span className="text-green-400">{postData.views} </span> {" "}
                        <span className="font-bold">views</span> 
                        </span>
                    </div>
                    <p className="text-gray-400 dark:text-gray-400 leading-relaxed text-sm sm:text-base">
                        {postDetails.desc}
                    </p>
                </div>
                { postDetails.img && <div className="hidden lg:block lg:w-2/5">
                   <img src={postDetails.img} width="500" className="rounded-2xl shadow-lg" />
                </div>}
            </div>

            <div className="flex flex-col md:flex-row gap-10">
                <div className="lg:w-3/5 text-base leading-relaxed space-y-6">
                <p className="text-justify">
                        {postDetails.content}
                    </p>

                  
                    <div>
                        <h1 className="text-center font-bold">Advertisment</h1>
                        <div className="flex justify-center my-8">
                            <Image src="myphoto.jpg" w="300" h="250" className="rounded-lg shadow-md" />
                        </div>
                    </div>
                </div>
                <div className="md:w-1/3 px-4 py-4 bg-white shadow-black dark:shadow-white dark:bg-black text-black dark:text-white rounded-2xl shadow-lg sticky top-8">
                    <h2 className="text-lg font-semibold mb-4">Author</h2>
                    <div className="flex items-center gap-4">
                        {postDetails.creator.blogProfile && (
                        <img
                            src={postDetails.creator.blogProfile}
                            className="w-14 h-14 rounded-full object-cover"
                            alt="Author Profile"
                        />
                        )}
                        <div>
                        <Link
                            to={`/creator/${postDetails?.creator?.id}`}
                            className="text-blue-400 font-semibold text-lg hover:underline"
                        >
                            {postDetails?.creator?.blogName ?? "Unknown Creator"}
                        </Link>
                        </div>
                    </div>
                    <p className="mt-4 text-gray-400 text-sm break-words whitespace-pre-line max-w-md">
                        {postDetails.creator.blogDescription}
                    </p>
                    <div className="flex gap-3 mt-4">
                        <Link to="#">
                            <Image src="2021_Facebook_icon.svg.png" 
                             className="h-8 w-8 hover:opacity-80 transition"
            />
                        </Link>
                        <Link to="#">
                            <Image src="instagram.svg" className="h-8 w-8 hover:opacity-80 transition" />
                        </Link>
                    </div>
                    <div className="mt-6">
                        <h2 className="text-lg font-semibold mb-3">Actions</h2>
                        <PostMenuActions
                        postId={postDetails?.id}
                        creatorId={postDetails?.id} 
                        content={postDetails?.content}
                        userId={postDetails?.id}
                        />
                    </div>
                    <div className="mt-6 ">
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
                    <div className="mt-6">
                        <h1 className="text-sm font-medium   mb-4">Search</h1>
                        <SearchBar />  
                    </div>
                </div>
            </div>
            <div className="flex flex-col gap-4 lg:flex-row lg:justify-between lg:items-center">
            <PostLikeButton
             postId={postDetails.id} 
            initialLikes={postDetails.likes?.length || 0}
            initiallyLiked={postDetails.likedByCurrentUser || false}
            post={postData}
             />
            <PostShareActions slug={slug}  />
            </div>
             <button
                onClick={() => (window.location.href =`/post/user/chatroom/${slug}`)}
                    className="relative px-6 py-3 text-sm font-medium text-white  button-color animate-gradient-flow-x
                 rounded-lg shadow-lg hover:from-red-600 hover:to-red-800 focus:outline-none focus:ring focus:ring-red-300 
                 transition-transform transform hover:scale-105 active:scale-95"
                    >
                  <span className="absolute inset-0 button-color animate-gradient-flow-x opacity-25 rounded-lg blur-lg"></span>
                    <span className="relative ">💬</span> Join Post Live Chat
                </button>

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
            <button
                onClick={() => (window.location.href = `/report-post?slug=${slug}`)} // Redirects user to report page
                className="relative px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-red-500 to-red-700
                 rounded-lg shadow-lg hover:from-red-600 hover:to-red-800 focus:outline-none focus:ring focus:ring-red-300 
                 transition-transform transform hover:scale-105 active:scale-95"
                >
                <span className="absolute inset-0 bg-red-700 opacity-25 rounded-lg blur-lg"></span>
                <span className="relative">🚨 Report Post</span>
                </button>
                 

                <div className="mt-12">
                <MarketDashboard />
                </div>

                  <div className="pt-4 pb-4">
            {message && 
            <div className="mt-4 text-sm text-gray-600">{message}</div>}
            </div>
             <Comments 
             postId={postDetails.id}
             userId={postDetails.id} />
            </div>
         <AdSpace />
            
            
        </div>
    );
};
export default SinglePostPage;
