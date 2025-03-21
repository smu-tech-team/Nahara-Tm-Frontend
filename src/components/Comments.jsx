import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";
import Comment from "../components/Comment";
import Image from "../assert/anonymous-8291223_1280.webp";

// Function to fetch comments
const fetchComments = async (postId) => {
  try {
    const response = await axios.get(`http://localhost:8087/api/comments/get-comments/${postId}`);
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error("Error fetching comments:", error);
    return [];
  }
};

const Comments = ({ postId }) => {
  const [commentText, setCommentText] = useState(""); // State for the input field
  const [currentPage, setCurrentPage] = useState(1); // State for pagination
  const commentsPerPage = 7; // Number of comments to show per page
  const queryClient = useQueryClient();

  // Fetch comments
  const { isLoading, error, data = [] } = useQuery({
    queryKey: ['comments', postId],
    queryFn: () => fetchComments(postId),
    enabled: !!postId, // Only fetch if postId exists
  });

  // Add comment mutation
  const mutation = useMutation({
    mutationFn: async (newComment) => {
      const token = localStorage.getItem("token");
      return axios.post(
        `http://localhost:8087/api/comments/add-comment/${postId}`,
        newComment,
        { headers: { Authorization: `Bearer ${token}` } }
      );
    },
    onMutate: async (newComment) => {
      await queryClient.cancelQueries(['comments', postId]);
      const previousComments = queryClient.getQueryData(['comments', postId]);
      queryClient.setQueryData(['comments', postId], (oldComments = []) => [
        { 
          _id: Math.random().toString(36).substring(2, 9), 
          userImage: Image, 
          userName: "You", 
          desc: newComment.desc, 
          createdAt: new Date().toISOString(), 
        },
        ...oldComments,
      ]);
      return { previousComments };
    },
    onError: (error, _newComment, context) => {
      toast.error("Failed to add comment");
      if (context?.previousComments) {
        queryClient.setQueryData(['comments', postId], context.previousComments);
      }
    },
    onSuccess: () => {
      toast.success("Comment added successfully!");
      setCommentText("");
      queryClient.invalidateQueries(['comments', postId]);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!commentText.trim()) {
      toast.error("Comment cannot be empty!");
      return;
    }
    mutation.mutate({ desc: commentText });
  };

  // Calculate pagination
  const totalComments = data.length;
  const indexOfLastComment = currentPage * commentsPerPage;
  const indexOfFirstComment = indexOfLastComment - commentsPerPage;
  const currentComments = data.slice(indexOfFirstComment, indexOfLastComment); // Paginated comments
  const commentsLeft = totalComments - indexOfLastComment;

  // Delete comment mutation
  const deleteMutation = useMutation({
    mutationFn: async (commentId) => {
      if (!commentId) throw new Error("Comment ID is required for deletion.");
      const token = localStorage.getItem("token");
      return axios.delete(
        `http://localhost:8087/api/comments/delete-comment/${commentId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
    },  
    onMutate: async (commentId) => {
      await queryClient.cancelQueries(["comments", postId]);
      const previousComments = queryClient.getQueryData(["comments", postId]);
      queryClient.setQueryData(
        ["comments", postId],
        (old) => old.filter((comment) => comment._id !== commentId)
      );
      return { previousComments };
    },
    onError: (error, commentId, context) => {
      toast.error("Failed to delete comment");
      if (context?.previousComments) {
        queryClient.setQueryData(["comments", postId], context.previousComments);
      }
    },
    onSuccess: () => {
      toast.success("Comment deleted successfully!");
      queryClient.invalidateQueries(["comments", postId]);
    },
  });

  const handleDelete = (commentId) => {
    if (!commentId) {
      console.error("Comment ID is undefined or null");
      return;
    }
    deleteMutation.mutate(commentId);
  };
  
  const handleNextPage = () => {
    if (indexOfLastComment < totalComments) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">Something went wrong: {error.message}</p>;

  return (
    <div className="flex flex-col gap-8 lg:w-3/5 mb-12">
      <h1 className="text-xl text-gray-500 underline pt-3">Comments</h1>

      {/* Comment Form */}
      <form onSubmit={handleSubmit} className="flex items-center gap-4 w-full">
        <input
          type="text"
          name="desc"
          placeholder="Write a comment..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          className="w-full p-3 rounded-xl border dark:text-black text-black border-gray-500"
        />
        <button
          type="submit"
          className="bg-blue-800 px-4 py-3 text-white font-medium rounded-lg"
          disabled={mutation.isLoading}
        >
          {mutation.isLoading ? "Sending..." : "Send"}
        </button>
      </form>

      {/* Comments List */}
      {data.length === 0 ? (
        <p className="text-gray-500">No comments yet. Be the first to comment!</p>
      ) : (
        <div>
         {currentComments.map((comment) => (
                <Comment
                    key={comment._id || comment.createdAt} // Fallback to createdAt if _id is missing
                    _id={comment._id} // Pass the unique ID
                    userImage={comment.userImage}
                    userName={comment.userName}
                    desc={comment.desc}
                    createdAt={comment.createdAt}
                    {...comment}
                  onDelete={handleDelete}
                />
                ))}

          {/* Pagination */}
          <div className="flex items-center justify-between mt-4">
            <button
              onClick={handlePreviousPage}
              className={`px-4 py-2 text-white font-medium rounded-lg ${currentPage === 1 ? "bg-gray-400 cursor-not-allowed" : "bg-blue-800"}`}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span className="text-sm text-gray-500">
              {commentsLeft > 0
                ? `${commentsLeft} more comment${commentsLeft === 1 ? "" : "s"}`
                : "No more comments"}
            </span>
            <button
              onClick={handleNextPage}
              className={`px-4 py-2 text-white font-medium rounded-lg ${indexOfLastComment >= totalComments ? "bg-gray-400 cursor-not-allowed" : "bg-blue-800"}`}
              disabled={indexOfLastComment >= totalComments}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Comments;
