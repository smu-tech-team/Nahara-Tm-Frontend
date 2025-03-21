import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Bookmark, Trash2, Edit, UserPlus, Loader2 } from "lucide-react";
import axios from "axios";
import {jwtDecode} from "jwt-decode"; // Correct import for jwt-decode
import { toast } from "react-toastify";

const PostMenuActions = ({ postId, creatorId, slug }) => {
  const [isSaved, setIsSaved] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);
  const [loadingFollow, setLoadingFollow] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false); // Follow state
  const token = localStorage.getItem("token");

  
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
        const decoded = jwtDecode(token);
        setUserId(decoded?.userId?.toString() || null);
        setUserRole(decoded?.roles?.[0] || null);
    } catch (error) {
        console.error("Error decoding token:", error);
    }
}, []);
;

  // Check if the post is already saved
  useEffect(() => {
    if (!userId || !postId) return;

    const fetchSavedPosts = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8087/api/user/saved?userId=${userId}`
        );
        setIsSaved(response.data.some((post) => post?._id === postId));
      } catch (error) {
        console.error("Error fetching saved posts:", error);
      }
    };

    fetchSavedPosts();
  }, [userId, postId]);

  // Handle Save Post
  const handleSavePost = async () => {
    if (!postId) {
      console.error("Error: postId is undefined.");
      toast.error("Unable to save post. Missing post information.");
      return;
    }

    setLoadingSave(true);
    try {
      if (isSaved) {
        await axios.delete(`http://localhost:8087/api/user/saved/${postId}`);
      } else {
        await axios.patch(`http://localhost:8087/api/user/save-post/${postId}`);
      }
      setIsSaved(!isSaved);
      toast.success(isSaved ? "Post removed from saved!" : "Post saved successfully!");
    } catch (error) {
      console.error("Error saving post:", error.response?.data || error.message);
      toast.error("An error occurred while saving the post.");
    } finally {
      setLoadingSave(false);
    }
  };

  // Handle Follow Creator
  const handleFollowCreator = async () => {
     if (!token) {
          alert("Please log in to follow creators.");
          return;
        }
    
        try {
          setLoadingFollow(true); // Disable button while processing
          const endpoint = isFollowing
            ? `http://localhost:8087/api/creator/unfollow/${creatorId}`
            : `http://localhost:8087/api/creator/follow/${creatorId}`;
    
          await axios.post(endpoint, {}, { headers: { Authorization: `Bearer ${token}` } });
    
          // Optionally re-fetch the follow status
          const followStatusResponse = await axios.get(
            `http://localhost:8087/api/creator/follow-status/${creatorId}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setIsFollowing(followStatusResponse.data.isFollowing);
        } catch (error) {
          console.error("Error updating follow status:", error.response?.data || error.message);
        } finally {
          setLoadingFollow(false); // Re-enable button
        }
      };

  // Handle Edit Post
  const handleEditPost = () => {
    if (!postId) {
      console.error("Error: postId is undefined.");
      toast.error("Unable to edit post. Missing post information.");
      return;
    }

    navigate(`/edit-post/${postId}`);
  };

  // Handle Delete Post
  const handleDeletePost = async () => {
    if (!slug || !userId) {
      console.error("Error: slug or userId is undefined.");
      toast.error("Unable to delete post. Missing required information.");
      return;
    }

    setLoadingDelete(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Error: No authentication token found.");
        toast.error("Unauthorized action. Please log in.");
        return;
      }

      await axios.delete(`http://localhost:8087/api/post/delete/${slug}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Post deleted successfully!");
    } catch (error) {
      console.error("Error deleting post:", error.response?.data || error.message);
      toast.error("An error occurred while deleting the post.");
    } finally {
      setLoadingDelete(false);
    }
  };

  // Render Actions
  return (
    <div className="p-4 dark:text-black text-white w-60">
      <h1 className="text-lg font-semibold mb-3 border-b border-gray-700 pb-2">
        Actions
      </h1>

      {userRole === "CREATOR" && userId === creatorId ? (
    <>
        {/* Actions for Creators */}
        <div
            className="flex items-center gap-3 cursor-pointer hover:text-yellow-500 transition"
            onClick={handleEditPost}
        >
            <Edit size={20} />
            <span className="text-sm dark:text-black font-medium">Edit Post</span>
        </div>

        <div
            className="flex items-center gap-3 cursor-pointer hover:text-red-500 transition mt-3"
            onClick={handleDeletePost}
        >
            {loadingDelete ? (
                <Loader2 size={20} className="animate-spin" />
            ) : (
                <Trash2 size={20} />
            )}
            <span className="text-sm dark:text-black font-medium">
                Delete this Post
            </span>
        </div>
    </>
) : userRole === "USER" ? (
    <>
        {/* Actions for Users */}
        <div
            className="flex items-center gap-3 cursor-pointer hover:text-blue-500 transition"
            onClick={handleSavePost}
        >
            {loadingSave ? (
                <Loader2 size={20} className="animate-spin" />
            ) : (
                <Bookmark size={20} />
            )}
            <span className="text-sm font-medium">
                {isSaved ? "Unsave Post" : "Save this Post"}
            </span>
        </div>

        <div
            className="flex items-center gap-3 cursor-pointer hover:text-green-500 transition mt-3"
            onClick={handleFollowCreator}
        >
            {loadingFollow ? (
                <Loader2 size={20} className="animate-spin" />
            ) : (
                <UserPlus size={20} />
            )}
            <span className="text-sm dark:text-black font-medium">
                Follow Creator
            </span>
        </div>
    </>
) : (
    <p className="text-gray-400 text-sm">No actions available.</p>
)}
</div>
  );
};

export default PostMenuActions;
