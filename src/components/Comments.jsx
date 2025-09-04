import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";
import Comment from "../components/Comment";
import Image from "/anonymous-8291223_1280.webp";
import {jwtDecode} from "jwt-decode";
import { v4 as uuidv4 } from "uuid";

const fetchComments = async (postId) => {
  try {
    const response = await axios.get(`https://nahara-production.up.railway.app/api/comments/get-comments/${postId}`);
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error("Error fetching comments:", error);
    return [];
  }
};

const Comments = ({ postId, comments }) => {
  const [commentText, setCommentText] = useState(""); 
  const [currentPage, setCurrentPage] = useState(1); 
  const commentsPerPage = 7; 
  const queryClient = useQueryClient();

  const { isLoading, error, data = [] } = useQuery({
    queryKey: ['comments', postId],
    queryFn: () => fetchComments(postId),
    enabled: !!postId, 
  });

  const mutation = useMutation({
    mutationFn: async (newComment) => {
      const token = localStorage.getItem("token");
      return axios.post(
        `https://nahara-production.up.railway.app/api/comments/add-comment/${postId}`,
        newComment,
        {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
          }
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

  const token = localStorage.getItem("token");
  let userId = `anonymous-${uuidv4()}`;

  if (token) {
    try {
      const decoded = jwtDecode(token);
      userId = decoded?.userId || userId; // `userId` must be in JWT claims
    } catch {
      console.warn("Invalid token, falling back to anonymous");
    }
  }

  mutation.mutate({ desc: commentText, userId });
};

  const totalComments = data.length;
  const indexOfLastComment = currentPage * commentsPerPage;
  const indexOfFirstComment = indexOfLastComment - commentsPerPage;
  const currentComments = data.slice(indexOfFirstComment, indexOfLastComment); 
  const commentsLeft = totalComments - indexOfLastComment;

  const deleteMutation = useMutation({
    mutationFn: async (commentId) => {
      if (!commentId) throw new Error("Comment ID is required for deletion.");
      const token = localStorage.getItem("token");
      return axios.delete(
        `https://nahara-production.up.railway.app/api/comments/delete-comment/${commentId}`,
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

  const handleDelete = (postId, commentId) => {
    if (!commentId || !postId) {
      console.error("Post ID or Comment ID is missing");
      return;
    }
    console.log(`Deleting comment with ID: ${commentId} from post with ID: ${postId}`);
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

      {data.length === 0 ? (
        <p className="text-gray-500">No comments yet. Be the first to comment!</p>
      ) : (
        <div>
         {currentComments.map((comment) => (
                <Comment
                    key={comment._id || comment.createdAt} 
                    _id={comment._id}  
                    postId={postId}  
                    comments={comments || []}  
                    userImage={comment.userImage}
                    userName={comment.userName}
                    desc={comment.desc}
                    createdAt={comment.createdAt}
                    {...comment}
                  onDelete={handleDelete}
                />
                ))}

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