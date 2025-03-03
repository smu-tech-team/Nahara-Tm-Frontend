import PostListItem from "./PostListItem";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React from "react";

const fetchPosts = async () => {
    try {
        const res = await axios.get("http://localhost:8087/api/post/getAll-posts");
        console.log("Fetched Data:", res.data);
        return res.data;
    } catch (error) {
        console.error("Error fetching posts:", error.response ? error.response.data : error.message);
        throw new Error("Failed to fetch posts");
    }
};

const PostList = () => {
    const { isPending, error, data } = useQuery({
        queryKey: ["repoData"],
        queryFn: fetchPosts,
    });

    if (isPending) {
        return (
            <div className="flex justify-center items-center h-40">
                <div className="w-10 h-10 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-red-500 text-center">
                <p>An error has occurred: {error.message}</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-12 mb-8">
            {data.map((post) => (
                <React.Fragment key={post.id}>
                    <PostListItem key={post.id} post={post} />
                </React.Fragment>
            ))}
        </div>
    );
};

export default PostList;
