import React, { useEffect, useState } from "react";
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
    const [page, setPage] = useState(0); // Start at 1 (change from 0)
    const [hasMore, setHasMore] = useState(true);
    const pageSize = 10;

    const loadMorePosts = async (newPage) => {
        try {
            console.log("Loading posts for page:", newPage);
            const data = await fetchPosts({ page: newPage, size: pageSize, searchParams });

            if (data.length < pageSize) {
                setHasMore(false);
            }

            setPosts((prevPosts) => (newPage === 0 ? data : [...prevPosts, ...data]));
            setPage(newPage + 0);
        } catch (error) {
            console.error("Error fetching posts:", error);
        }
    };

    // Fetch posts on mount & when search params change
    useEffect(() => {
        setPosts([]); // Reset posts when params change
        setHasMore(true);
        setPage(0); // Start from page 1
        loadMorePosts(0); // Fetch first set of posts
    }, [searchParams]);

    return (
        <InfiniteScroll
            dataLength={posts.length}
            next={() => loadMorePosts(page)}
            hasMore={hasMore}
            loader={<p>Loading...</p>}
        >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {posts.length > 0 ? (
                    posts.map((post) => <PostListItem key={post._id} post={post} />)
                ) : (
                    <p className="text-center text-gray-500">No posts found.</p>
                )}
            </div>
        </InfiniteScroll>
    );
};

export default PostList;
