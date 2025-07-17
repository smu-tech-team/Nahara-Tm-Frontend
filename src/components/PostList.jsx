import React, { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";
import PostListItem from "./PostListItem";

const fetchPosts = async ({ page, size, searchParams }) => {
    const searchParamObj = Object.fromEntries([...searchParams]);
    const fullUrl = `http://localhost:8087/api/post/getAll-posts?${new URLSearchParams({
        ...searchParamObj,
        page,
        size,
    })}`;
    
    console.log("Fetching Posts from URL:", fullUrl);
    
    const res = await axios.get(fullUrl);
    console.log("Backend Response:", res.data);
    
    return res.data;
};
const PostList = () => {
    const [searchParams] = useSearchParams();
    const [posts, setPosts] = useState([]);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [isOnline, setIsOnline] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const pageSize = 10;

     useEffect(() => {
    const updateStatus = () => setIsOnline(navigator.onLine);
    updateStatus(); 
    window.addEventListener("online", updateStatus);
    window.addEventListener("offline", updateStatus);

    return () => {
      window.removeEventListener("online", updateStatus);
      window.removeEventListener("offline", updateStatus);
    };
  }, []);

 const reloadPosts = async () => {
  setLoading(true);
  setError(null);
  try {
    setPosts([]);
    setHasMore(true);
    setPage(0);
    await loadMorePosts(0);
  } catch (err) {
    setError("Failed to reload posts. Please try again.");
    console.error("Reload error:", err);
  } finally {
    setLoading(false);
  }
};

    const loadMorePosts = useCallback(
  async (newPage) => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchPosts({ page: newPage, size: pageSize, searchParams });

      if (data.length < pageSize) {
        setHasMore(false);
      }
      setPosts((prevPosts) => (newPage === 0 ? data : [...prevPosts, ...data]));
      setPage(newPage + 1);
    } catch (error) {
      setError("Failed to fetch posts. Please check your network.");
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  },
  [searchParams]
);

    useEffect(() => {
        setPosts([]); 
        setHasMore(true);
        setPage(0);
        loadMorePosts(0);
    }, [searchParams, loadMorePosts]); 
    return (
        <InfiniteScroll
            dataLength={posts.length}
            next={() => loadMorePosts(page)}
            hasMore={hasMore}
            loader={<p className="text-center text-gray-500">Loading...</p>}
            endMessage={
                posts.length > 0 && !hasMore ? (
                    <p className="text-center text-green-600 font-semibold mt-4 animate-bounce">
                        Posts done loading
                    </p>
                ) : null
            }
        >
           <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {posts.length > 0 ? (
        posts.map((post) => <PostListItem key={post._id || post.slug} post={post} />)
      ) : (
                <div className="col-span-full flex flex-col items-center justify-center py-12">
        <img
            src={isOnline ? "/notfound.webp" : "/offline.webp"}
            alt={isOnline ? "No posts(404)" : "No network"}
            className="w-64 h-64 object-contain mb-6"
        />
        {loading ? (
            <p className="text-center text-blue-500 font-semibold mb-4 animate-pulse">Loading posts...</p>
        ) : (
            <p className="text-center text-gray-500 text-lg mb-4">
            {error || (isOnline ? "No posts found. Check back later!" : "You're offline. Please check your internet connection.")}
            </p>
        )}
        <button
            onClick={reloadPosts}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow-sm transition disabled:opacity-50"
        >
            {loading ? "Refreshing..." : "Refresh"}
        </button>
        </div>

      )}
    </div>

        </InfiniteScroll>
        
    );
}    

export default PostList;
