import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Bookmark, Trash2, Edit, Loader2 } from "lucide-react";
import axios from "axios";
import {jwtDecode} from "jwt-decode";
import { toast } from "react-toastify";
import FollowCreatorButton from "./FollowCreatorButton ";

const PostMenuActions = ({ postId, slug }) => {
  const [postDetails, setPostDetails] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [userId, setUserId] = useState(null);
  const token = localStorage.getItem("token");

  const navigate = useNavigate();

  useEffect(() => {
    if (!token) return;

    try {
      const decoded = jwtDecode(token);
      setUserId(decoded?.userId?.toString() || null);
      setUserRole(decoded?.roles?.[0] || null);
    } catch (error) {
      console.error("Error decoding token:", error);
    }
  }, [token]);

  useEffect(() => {
    if (!postId) return;

    const fetchPostDetails = async () => {
      if (!postId) return;
    
      try {
        console.log("Fetching post details for Post ID:", postId);
        
        const response = await axios.get(`https://nahara-production.up.railway.app/api/post/${postId}`, {
          params: {
            category: Math.random().toString(36).substring(2, 10),
            blogName: Math.random().toString(36).substring(2, 10),
            searchQuery: Math.random().toString(36).substring(2, 10),
            sort: Math.random().toString(36).substring(2, 10),
            featured: false,
            page: Math.floor(Math.random() * 100),
            size: Math.floor(Math.random() * 100),
            q: Math.random().toString(36).substring(2, 10),
            limit: Math.floor(Math.random() * 100),
          },
        });
    
        console.log("Fetched post details:", response.data);
        setPostDetails(response.data);
      } catch (error) {
        console.error("Error fetching post details:", error.response?.data || error.message);
        toast.error(
          error.response?.data?.message || "Failed to fetch post details. Please try again later."
        );
      }
    };
    
    fetchPostDetails();
  }, [postId]);      
  const handleSavePost = async () => {
    if (!postId) {
      toast.error("Unable to save post. Missing post information.");
      return;
    }

    setLoadingSave(true);
    try {
      if (isSaved) {
        await axios.delete(`https://nahara-production.up.railway.app/api/user/saved/${postId}`);
      } else {
        await axios.patch(`https://nahara-production.up.railway.app/api/user/save-post/${postId}`);
      }
      setIsSaved(!isSaved);
      toast.success(isSaved ? "Post removed from saved!" : "Post saved successfully!");
    } catch (error) {
      console.error("Error saving post:", error);
      toast.error("An error occurred while saving the post.");
    } finally {
      setLoadingSave(false);
    }
  };

  const handleEditPost = () => {
    if (!postId) {
      toast.error("Unable to edit post. Missing post information.");
      return;
    }
    navigate(`/edit-post/${postId}`);
  };

  const handleDeletePost = async () => {
    if (!slug || !userId) {
      toast.error("Unable to delete post. Missing required information.");
      return;
    }

    setLoadingDelete(true);
    try {
      await axios.delete(`https://nahara-production.up.railway.app/api/post/delete/${slug}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Post deleted successfully!");
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error("An error occurred while deleting the post.");
    } finally {
      setLoadingDelete(false);
    }
  };

  return (
    <div className="p-4 text-black dark:text-white w-60">
      <h1 className="text-lg font-semibold mb-3 border-b border-gray-700 pb-2">Actions</h1>

      {userRole === "CREATOR" && (
        <>
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
            <span className="text-sm dark:text-black font-medium">Delete this Post</span>
          </div>
        </>
      )}

      {userRole === "USER" && (
        <>
          <div
            className="flex items-center gap-3 cursor-pointer hover:text-blue-500 transition mt-3"
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

          {/* Follow Button */}
          <div className="mt-3">
            {postDetails && <FollowCreatorButton post={postDetails} />}
          </div>
        </>
      )}

      {userRole !== "CREATOR" && userRole !== "USER" && (
        <p className="text-gray-400 text-sm">No actions available.</p>
      )}
    </div>
  );
};

export default PostMenuActions;
