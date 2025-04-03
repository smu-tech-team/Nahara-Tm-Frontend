import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const FollowCreatorButton = ({ post }) => {
    const navigate = useNavigate();
  
    const handleFollow = () => {
      if (post?.creator?.id) {
        navigate(`/creator/${post.creator.id}`);
      } else {
        console.error("Creator ID is missing or undefined.");
        toast.error("Unable to navigate to the creator's profile.");
      }
    };
  
    if (!post || !post.creator) {
      return (
        <button
          className="px-6 py-3 bg-gray-400 text-white rounded-lg"
          disabled
        >
          Loading...
        </button>
      );
    }
  
    return (
      <button
        onClick={handleFollow}
        className="px-6 py-3 text-sm font-medium text-white bg-blue-500 rounded-lg shadow-lg hover:bg-blue-600 transition-transform transform hover:scale-105 active:scale-95 focus:outline-none focus:ring focus:ring-blue-300"
      >
        Follow Creator
      </button>
    );
  };
  
  export default FollowCreatorButton;
  