import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import FollowButton from "../components/FollowButton";
import { FaCheckCircle } from "react-icons/fa";
import Modal from "./Modal";
import PodcastList from "./PodcastList";
import EbookList from "./EbookList";

const CreatorProfile = () => {
  const { creatorId, slug } = useParams();
  const [creator, setCreator] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showFollowers, setShowFollowers] = useState(false);
  const [followers, setFollowers] = useState([]);
  const [loadingFollowers, setLoadingFollowers] = useState(false);
  const [post, setPost] = useState(null);
  const [externalUrl, setExternalUrl] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [showEbooks, setShowEbooks] = useState(false);
  const [showPodcasts, setShowPodcasts] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!slug) return;
    const fetchPost = async () => {
      try {
        const response = await axios.get(`http://localhost:8087/api/post/post/${slug}`);
        setPost(response.data);
        console.log("Fetched post:", response.data);
      } catch (error) {
        console.error("Error fetching post:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [slug]);

  useEffect(() => {
    const fetchCreatorData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8087/api/creator/creator/${creatorId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setCreator(response.data);
      } catch (error) {
        console.error("Error fetching creator data:", error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCreatorData();
  }, [creatorId, token]);

  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleOpenPopup = (url) => {
    setExternalUrl(url);
    setShowPopup(true);
  };

  const handleConfirmOpen = () => {
    if (externalUrl) {
      window.open(externalUrl, "_blank", "noopener,noreferrer");
    }
    setShowPopup(false);
  };

  const handleToggleFollowers = async () => {
    if (!showFollowers) {
      setLoadingFollowers(true);
      try {
        const response = await axios.get(
          `http://localhost:8087/api/creator/creator/${creatorId}/get-creator-followers`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (response.status === 404) throw new Error("Followers data not found");
        setFollowers(response.data.followers || []);
      } catch (error) {
        console.error("Error fetching followers:", error);
        alert("Unable to load followers. Please try again later.");
        setFollowers([]);
      } finally {
        setLoadingFollowers(false);
      }
    }
    setShowFollowers(!showFollowers);
  };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (showFollowers && !event.target.closest(".followers-dropdown")) {
        setShowFollowers(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [showFollowers]);

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
  if (!creator) return <div className="flex justify-center items-center h-screen">Creator not found.</div>;

  return (
    <div className="max-w-7xl mx-auto p-20 bg-transparent dark:bg-transparent text-gray-800 dark:text-white">
      <div className="flex flex-col items-center md:flex-row md:justify-between gap-4">
        <div className="flex-shrink-0">
          <img
            src={creator.image || "https://via.placeholder.com/150"}
            alt={creator.name}
            className="w-40 h-40 rounded-full border-4 border-blue-500 object-cover shadow-white"
          />
        </div>

        <div className="flex flex-col text-center md:text-left gap-6">
          <h1 className="text-lg sm:text-xl  text-black dark:text-white font-bold flex items-center gap-2">
            @ {creator.name}
            {creator.verified && (
              <span className="text-green-600">
                <FaCheckCircle />
              </span>
            )}
          </h1>
          <p className="mt-4 text-gray-500 dark:text-white text-sm break-words whitespace-pre-line max-w-md">
            {creator.bio}
          </p>
          {isValidUrl(creator.website) && (
            <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md flex flex-col sm:flex-row items-center sm:justify-between gap-3">
              <h1 className="text-gray-800 dark:text-white font-semibold text-lg">
                Creator Website
              </h1>
              <Link
                to={`/creator-website?url=${encodeURIComponent(creator.website)}`}
                className="text-blue-500 hover:text-blue-700 transition underline text-sm sm:text-base"
              >
                View on Our Site/App
              </Link>
              <button
                onClick={() => handleOpenPopup(creator.website)}
                className="text-blue-500 hover:text-blue-700 transition underline text-sm sm:text-base flex items-center"
              >
                Open in New Tab 🔗
              </button>
            </div>
          )}
          {showPopup && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-80 text-center">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Leaving Our Site</h2>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                  You are about to visit an external website. We have no control over its content or security.
                </p>
                <div className="mt-4 flex justify-center gap-4">
                  <button
                    onClick={() => setShowPopup(false)}
                    className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmOpen}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition"
                  >
                    OK
                  </button>
                </div>
              </div>
            </div>
          )}
          {token && <FollowButton creatorId={creatorId} token={token} />}
          <div className="flex items-center justify-center text-black dark:text-white md:justify-start gap-4 mt-4">
            <div className="flex flex-col items-center">
              <span className="text-xl font-bold">{creator.postsCount >= 1000 
              ? `${(creator.postsCount / 1000).toFixed(1)}k+`
              : creator.postsCount || "0"}</span>
              <span className="text-sm text-gray-500">Posts</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-xl font-bold">
          {creator.followersCount >= 1000
          ? `${(creator.followersCount / 1000).toFixed(1)}k+`
           : creator.followersCount || "0"}
          </span>

              <button
                className="text-sm text-blue-500 underline cursor-pointer"
                onClick={handleToggleFollowers}
              >
                Followers
              </button>
              {showFollowers && (
                <div className="mt-2 bg-white shadow-lg rounded-lg p-4 w-60 followers-dropdown">
                  <button
                    className="text-sm text-red-500 underline cursor-pointer mb-2"
                    onClick={() => setShowFollowers(false)}
                  >
                    Close
                  </button>
                  {loadingFollowers ? (
                    <p className="text-gray-500">Loading followers...</p>
                  ) : (
                    <ul>
                      {followers.length > 0 ? (
                        followers.map((follower) => (
                          <li
                            key={follower.id}
                            className="flex items-center gap-4 border-b border-gray-200 pb-2 mb-2"
                          >
                            <img
                              src={follower.image || "https://via.placeholder.com/40"}
                              alt={follower.name}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                            <span className="text-gray-800 font-medium">{follower.name}</span>
                          </li>
                        ))
                      ) : (
                        <li className="text-gray-500">No followers found.</li>
                      )}
                    </ul>
                  )}
                </div>
              )}
            </div>
            <div className="flex flex-col items-center">
              <span className="text-xl font-bold">{creator.likesCount >= 1000 ? `${(creator.likesCount / 1000).toFixed(1)}k+`
              : creator.likesCount || "0"
              }</span>
              <span className="text-sm text-gray-500">Likes</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-gray-500 dark:text-white flex flex-wrap items-center">
          Posts by:
          <span className="ml-2 px-3 py-1 text-base sm:text-lg font-thin bg-gray-700 text-white rounded-lg hover:bg-green-700 transition">
            {creator.name}
          </span>
        </h2>
       <div className="space-x-4 mb-6">
        <button onClick={() => setShowEbooks(true)} className="bg-blue-500 text-white px-4 py-2 rounded-lg">
          View Ebooks
        </button>
        <button onClick={() => setShowPodcasts(true)} className="bg-red-500 text-white px-4 py-2 rounded-lg">
          View Podcasts
        </button>
      </div>
           <Modal isOpen={showEbooks} onClose={() => setShowEbooks(false)} title="Ebooks">
          <EbookList creatorId={creatorId} onClose={() => setShowEbooks(false)} />
        </Modal>

         <Modal isOpen={showPodcasts} onClose={() => setShowPodcasts(false)} title="Podcasts">
      {creatorId ? <PodcastList creatorId={creatorId} /> : <p>Loading...</p>}
    </Modal>




        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {creator?.posts?.map((post) => (
        <div
          key={post.id}
          className="bg-white dark:bg-gray-900 shadow-lg p-4 rounded-lg transition hover:shadow-xl"
        >
                    <img
            src={post.image || "https://via.placeholder.com/300"}
            alt={post.title}
            className="w-full h-40 rounded-lg object-cover"
          />
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mt-4">{post.title}</h3>
          <h3 className="text-gray-500 mt-2">{new Date(post.createdAt).toLocaleString()}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">{post.description}</p>
          <Link
            to={post?.slug ? `/${post?.slug}` : "#"}
            className="text-lg font-bold hover:text-blue-500 text-gray-700 dark:text-gray-300 transition"
            onClick={(e) => {
              if (!post?.slug) {
                e.preventDefault();
                console.error("post.slug is undefined!", post);
              }
            }}
          >
            Read More →
          </Link>
        </div>
      ))}
    </div>
      </div>
    </div>
  );
};

export default CreatorProfile;
