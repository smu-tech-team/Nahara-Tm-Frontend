import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Bookmark, Trash2, Edit, UserPlus, Loader2 } from "lucide-react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const PostMenuActions = ({ postId, userId, creatorId, postContent }) => {
  const [isSaved, setIsSaved] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);
  const [loadingFollow, setLoadingFollow] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();

  // Decode Token to Get Role
  useEffect(() => {
    const getUserRole = () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const decoded = jwtDecode(token);
          setUserRole(decoded.roles ? decoded.roles[0] : null);
        } catch (error) {
          console.error("Error decoding token:", error);
        }
      }
    };

    getUserRole();
  }, []);

  // Check if the post is already saved
  useEffect(() => {
    if (!userId) return;
    const fetchSavedPosts = async () => {
      try {
        const response = await axios.get(`http://localhost:8087/api/user/saved?userId=${userId}`);
        setIsSaved(response.data.some((post) => post.id === postId));
      } catch (error) {
        console.error("Error fetching saved posts:", error);
      }
    };
    fetchSavedPosts();
  }, [userId, postId]);

  const handleEditPost = () => {
    if (!postContent) {
      console.error("Error: No content available for editing");
      return;
    }
    // Save post content to localStorage (or use context/state)
    localStorage.setItem("editPost", JSON.stringify(postContent));
    navigate("/write");
  };

  // Handle Save / Unsave Post
  const handleSavePost = async () => {
    if (!postId) {
      console.error("Error: postId is undefined");
      return;
    }

    setLoadingSave(true);
    try {
      if (isSaved) {
        await axios.delete(`http://localhost:8087/api/user/saved/${postId}`, { data: { userId } });
      } else {
        await axios.post(`http://localhost:8087/api/user/saved/${postId}`, { userId });
      }
      setIsSaved(!isSaved);
    } catch (error) {
      console.error("Error saving post:", error);
    }
    setLoadingSave(false);
  };

  // Handle Follow Creator
  const handleFollowCreator = async () => {
    setLoadingFollow(true);
    try {
      await axios.post(`http://localhost:8087/api/creator/${creatorId}/follow/${userId}`);
      alert("Followed successfully!");
    } catch (error) {
      console.error("Error following creator:", error);
    }
    setLoadingFollow(false);
  };

  // Handle Delete Post
  const handleDeletePost = async () => {
    setLoadingDelete(true);
    try {
      await axios.delete(`http://localhost:8087/api/post/delete/${postId}`);
      alert("Post deleted successfully!");
    } catch (error) {
      console.error("Error deleting post:", error);
    }
    setLoadingDelete(false);
  };

  return (
    <div className="p-4 dark:text-black text-white w-60">
      <h1 className="text-lg font-semibold mb-3 border-b border-gray-700 pb-2">Actions</h1>

      {/* If user is a CREATOR, show Edit and Delete Post buttons */}
      {userRole === "CREATOR" && userId === creatorId ? (
        <>
          {/* Edit Post */}
          <div
            className="flex items-center gap-3 cursor-pointer hover:text-yellow-500 transition"
            onClick={handleEditPost}
          >
            <Edit size={20} />
            <span className="text-sm dark:text-black font-medium">Edit Post</span>
          </div>

          {/* Delete Post */}
          <div
            className="flex items-center gap-3 cursor-pointer hover:text-red-500 transition mt-3"
            onClick={handleDeletePost}
          >
            {loadingDelete ? <Loader2 size={20} className="animate-spin" /> : <Trash2 size={20} />}
            <span className="text-sm dark:text-black font-medium">Delete this Post</span>
          </div>
        </>
      ) : userRole === "USER" ? (
        <>
          {/* Save / Unsave Post */}
          <div
            className="flex items-center gap-3 cursor-pointer hover:text-blue-500 transition"
            onClick={handleSavePost}
          >
            {loadingSave ? <Loader2 size={20} className="animate-spin" /> : <Bookmark size={20} />}
            <span className="text-sm font-medium">{isSaved ? "Unsave Post" : "Save this Post"}</span>
          </div>

          {/* Follow Creator */}
          <div
            className="flex items-center gap-3 cursor-pointer hover:text-green-500 transition mt-3"
            onClick={handleFollowCreator}
          >
            {loadingFollow ? <Loader2 size={20} className="animate-spin" /> : <UserPlus size={20} />}
            <span className="text-sm dark:text-black font-medium">Follow Creator</span>
          </div>
        </>
      ) : null}
    </div>
  );
};

export default PostMenuActions;
