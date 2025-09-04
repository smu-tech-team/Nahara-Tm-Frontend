import React from "react";
import { FacebookShareButton, TwitterShareButton, LinkedinShareButton } from "react-share";
import { FacebookIcon, TwitterIcon, LinkedinIcon } from "react-share";
import { toast } from "react-toastify";
const PostShareActions = ({ slug }) => {
  const handleShare = (platform) => {
    toast.success(`Shared on ${platform}!`);
  };
  const postUrl = ` https://nahara-production.up.railway.app/api/post/post/${slug}`; 
  return (
    <div className="p-4 dark:bg-transparent bg-transparent rounded-lg">
      <h1 className="text-lg font-semibold text-white  dark:text-black mb-4">Share this Post</h1>
      <div className="flex text-white gap-4 mt-4">
        <FacebookShareButton
          url={postUrl}
          onClick={() => handleShare("Facebook")}
        >
          <FacebookIcon size={40} round={true} />
          <span className="ml-2 text-sm dark:text-black">Facebook</span>
        </FacebookShareButton>
        <TwitterShareButton
          url={postUrl}
          onClick={() => handleShare("Twitter")}
          title="Check out this post!"
        >
          <TwitterIcon size={40} round={true} />
          <span className="ml-2 text-sm  dark:text-black">Twitter</span>
        </TwitterShareButton>
        <LinkedinShareButton
          url={postUrl}
          onClick={() => handleShare("LinkedIn")}
        >
          <LinkedinIcon size={40} round={true} />
          <span className="ml-2 text-sm   dark:text-black">LinkedIn</span>
        </LinkedinShareButton>
      </div>
    </div>
  );
};

export default PostShareActions;
