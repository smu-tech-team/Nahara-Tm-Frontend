import React, { useEffect, useState } from "react";
import { toggleLike, fetchLikeCount } from "../store/LikeService.js"; // Adjust the import path as necessary

const LikeButton = ({ postData }) => {
    const postId = postData?.id;
    const [likes, setLikes] = useState(postData?.likedBy?.length || 0);
    const [isLiked, setIsLiked] = useState(false);
    const [isLiking, setIsLiking] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        if (!postId) return;
    
        const loadLikeData = async () => {
            try {
                const { likeCount, isLiked } = await fetchLikeCount(postId);
                console.log("Like Data:", { likeCount, isLiked });
                setLikes(likeCount);
                setIsLiked(isLiked);
            } catch (error) {
                console.error("Error loading like data:", error);
                setErrorMessage("Failed to load like data.");
            }
        };
    
        loadLikeData();
    }, [postId]);
    
    const handleLikeToggle = async () => {
        if (!postId) return;

        setIsLiking(true);
        setErrorMessage(""); // Clear any existing errors

        try {
            const updatedState = await toggleLike(postId, isLiked);
            setLikes(updatedState.likeCount);
            setIsLiked(updatedState.isLiked);
        } catch (error) {
            console.error("Error toggling like:", error);
            setErrorMessage("Failed to update like status. Please try again.");
        } finally {
            setIsLiking(false);
        }
    };

    return (
        <div className="text-center">
            <button
                onClick={handleLikeToggle}
                disabled={isLiking}
                className={`flex items-center gap-2 px-4 py-2 ${
                    isLiked ? "bg-red-500 hover:bg-red-600" : "bg-blue-500 hover:bg-blue-600"
                } text-white rounded`}
            >
                {isLiking ? (isLiked ? "Unliking..." : "Liking...") : isLiked ? "★ Unlike" : "★ Like"}
            </button>
            <div className="mt-2 text-sm sm:text-base lg:text-lg font-semibold text-gray-400">
               <span className="font-bold text-green-500"> {likes}</span> {likes === 1 ? "person" : "people"} liked this post
            </div>
            {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}
        </div>
    );
};

export default LikeButton;
