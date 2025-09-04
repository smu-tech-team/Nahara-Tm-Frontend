import { v4 as uuidv4 } from "uuid"; // Install with `npm install uuid`

const BASE_URL = "https://nahara-production.up.railway.app/api/post"; // API base URL

// Get user ID (anonymous or logged-in)
export const getUserId = () => {
    let userId = localStorage.getItem("userId");

    if (!userId) {
        // Generate and save a guest user ID
        userId = `guest-${uuidv4()}`;
        localStorage.setItem("userId", userId);
    }

    return userId;
};

// Fetch like count for a post
export const fetchLikeCount = async (postId) => {
    try {
        if (!postId) throw new Error("Post ID is missing");

        const userId = getUserId(); // Include user ID in the request
        const response = await fetch(`${BASE_URL}/${postId}/like-count?userId=${userId}`);

        if (!response.ok) {
            console.error(`Failed to fetch like count for post ${postId}. Status: ${response.status}`);
            throw new Error(`Failed to fetch like count: ${response.status}`);
        }

        const data = await response.json();
        return {
            likeCount: Number.isFinite(data.likeCount) ? data.likeCount : 0,
            isLiked: data.isLiked ?? false,
        };
    } catch (error) {
        console.error("Error fetching like count:", error.message);
        return { likeCount: 0, isLiked: false }; // Default values on error
    }
};

export const toggleLike = async (postId, isLiked) => {
    const userId = getUserId(); 
    const endpoint = `${BASE_URL}/${postId}/${isLiked ? "unlike" : "like"}?userId=${userId}`;

    try {
        const response = await fetch(endpoint, {
            method: isLiked ? "DELETE" : "POST", // DELETE to unlike, POST to like
            headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
            console.error(`Failed to toggle like status for post ${postId}. Status: ${response.status}`);
            throw new Error(`Failed to toggle like. Status: ${response.status}`);
        }

        const updatedData = await response.json();
        return {
            likeCount: Number.isFinite(updatedData.likeCount) ? updatedData.likeCount : 0,
            isLiked: updatedData.isLiked ?? false,
        };
    } catch (error) {
        console.error("Error toggling like:", error.message);
        throw error;
    }
};
