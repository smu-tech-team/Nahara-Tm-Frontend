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
    const pageSize = 10;

    // Use useCallback to prevent function recreation
    const loadMorePosts = useCallback(async (newPage) => {
        try {
            console.log("Loading posts for page:", newPage);
            
            // Simulate delay with setTimeout
            setTimeout(async () => {
                const data = await fetchPosts({ page: newPage, size: pageSize, searchParams });

                if (data.length < pageSize) {
                    setHasMore(false);
                }

                setPosts((prevPosts) => (newPage === 0 ? data : [...prevPosts, ...data]));
                setPage(newPage + 1); // Increment page correctly
            }, 600); // Artificial delay of 1.5 seconds
        } catch (error) {
            console.error("Error fetching posts:", error);
        }
    }, [searchParams]); // Depend only on searchParams to avoid unnecessary re-creation

    // Fetch posts on mount & when search params change
    useEffect(() => {
        setPosts([]); // Reset posts when params change
        setHasMore(true);
        setPage(0);
        loadMorePosts(0);
    }, [searchParams, loadMorePosts]); // ✅ Include loadMorePosts

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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {posts.length > 0 ? (
                    posts.map((post) => <PostListItem key={post._id || post.slug} post={post} />)
                ) : (
                    <p className="text-center text-gray-500">No posts found.</p>
                )}
                </div>

        </InfiniteScroll>
    );
}    

export default PostList;
