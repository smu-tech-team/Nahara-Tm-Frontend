import { Link } from "react-router-dom";

const PostListItem = ({ post }) => {
    const localTime = post.createdAt
        ? new Date(post.createdAt).toLocaleString() // Converts to local time
        : "Unknown Date";

    return (
        <div className="flex flex-col gap-4 bg-gray-800 dark:bg-gray-900 text-white p-4 rounded-lg shadow-md hover:shadow-lg transition">
            {/* Image Section */}
            {post.img ? (
                <div className="w-full">
                    <img
                        src={post.img}
                        className="rounded-lg w-full h-40 object-cover" // Fixed height and adjusted layout
                        alt={`${post.title || "Post"} Image`}
                    />
                </div>
            ) : (
                <div className="w-full bg-gray-700 rounded-lg flex items-center justify-center h-40 text-gray-400">
                    <p>No Image Available</p>
                </div>
            )}

            {/* Title */}
            <Link
                to={`/${post.slug}`}
                className="text-xl font-bold hover:text-blue-400 transition"
            >
                {post.title || "Untitled Post"}
            </Link>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-2 text-gray-400 text-sm">
                <span>Written by</span>
                <Link
                    to={`/${post?.creator?.slug || "#"}`}
                    className="text-blue-400 hover:underline"
                >
                </Link>
                <Link to={`/creator/${post?.creator?.id}`}
                className="text-blue-400 hover:underline"

                >
                {post?.creator?.blogName || "Unknown Creator"}
                </Link>

                <span>on</span>
                <Link
                    to={`/posts?category=${post.category || ""}`}
                    className="text-blue-400 hover:underline"
                >
                    {post.category || "Uncategorized"}
                </Link>
                <span>•</span>
                <span>{localTime}</span>
                <span className="font-bold">views<span className="text-green-400"> {post.views}</span> </span>
            </div>

            {/* Description */}
            {post.desc && (
                <p className="text-gray-300 dark:text-gray-400 leading-relaxed line-clamp-2">
                    {post.desc}
                </p>
            )}

            {/* Read More Link */}
            <Link
                to={`/${post.slug}`}
                className="text-blue-400 hover:text-blue-300 font-medium transition"
            >
                Read More →
            </Link>
        </div>
    );
};

export default PostListItem;
