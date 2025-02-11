import { Bookmark, Trash2 } from "lucide-react";

const PostMenuActions = () => {
    return (
        <div className="p-4  text-white w-60">
            <h1 className="text-lg font-semibold mb-3 border-b border-gray-700 pb-2">Actions</h1>
            
            {/* Save Post Action */}
            <div className="flex items-center gap-3 cursor-pointer hover:text-blue-500 transition">
                <Bookmark size={20} />
                <span className="text-sm font-medium">Save this Post</span>
            </div>

            {/* Delete Post Action */}
            <div className="flex items-center gap-3 cursor-pointer hover:text-red-500 transition mt-3">
                <Trash2 size={20} />
                <span className="text-sm font-medium">Delete this Post</span>
            </div>
        </div>
    );
};

export default PostMenuActions;
