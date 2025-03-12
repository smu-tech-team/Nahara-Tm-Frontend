import { Link,  } from "react-router-dom";
// import { format } from "timeago.js";

const PostListItem = ({ post }) => {
  const localTime = new Date(post.createdAt).toLocaleString(); // Converts to local time


  

  return (
    <div className="flex flex-col md:flex-row gap-6 w-full bg-gray-800 dark:bg-gray-900 text-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition">
      {/* Image Section */}
      {post.img && (
        <div className="w-full md:w-1/3">
          <img src={post.img} className="rounded-xl object-cover w-full h-48 md:h-56" alt="Post" />
        </div>
      )}

      {/* Details Section */}
      <div className="flex flex-col gap-3 md:w-2/3">
        <Link to={`/${post.slug}`} className="text-2xl font-semibold hover:text-blue-400 transition">
          {post.title}
        </Link>

        {/* Meta Info */}
        <div className="flex flex-wrap items-center gap-2 text-gray-400 text-sm">
          <span>Written by</span>
          <Link to="#" className="text-blue-400 hover:underline">
            {post?.creator?.blogName || "Unknown Creator"}
          </Link>
          <span>on</span>
          <Link to="#" className="text-blue-400 hover:underline">{post.category}</Link>
          <span>•</span>
          <span>{localTime}</span> {/* Displays proper local time */}
        </div>

        {/* Description */}
        <p className="text-gray-300 dark:text-gray-400 leading-relaxed">
          {post.desc}
        </p>

        {/* Read More Link */}
        <Link to={`/${post.slug}`} className="text-blue-400 hover:text-blue-300 font-semibold transition">
          Read More →
        </Link>
      </div>
    </div>
  );
};

export default PostListItem;
