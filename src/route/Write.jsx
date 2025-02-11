import { useEffect, useState, lazy, Suspense } from "react";
import { useUser } from "@clerk/clerk-react";

// Lazy load react-quill for performance
const ReactQuill = lazy(() => import("react-quill"));
import "react-quill/dist/quill.snow.css";

const Write = () => {
    const { isLoaded, isSignedIn } = useUser();
    const [quillLoaded, setQuillLoaded] = useState(false);
    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("");
    const [content, setContent] = useState("");
    const [description, setDescription] = useState("");
    const [images, setImages] = useState([]);
    const [isPublishing, setIsPublishing] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        setQuillLoaded(true);
    }, []);

    if (!isLoaded) return <div className="text-center text-gray-500">Loading...</div>;
    if (!isSignedIn) return <div className="text-center text-red-500">You should login</div>;

    // Handle adding more images
    const handleAddImage = () => {
        setImages([...images, ""]);
    };

    // Validate fields before publishing
    const validateForm = () => {
        const newErrors = {};
        if (!title.trim()) newErrors.title = "Title is required";
        if (!category) newErrors.category = "Please select a category";
        if (!content.trim()) newErrors.content = "Content cannot be empty";
        if (!description.trim()) newErrors.description = "Description is required";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle publishing
    const handlePublish = (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsPublishing(true);
        setTimeout(() => {
            setIsPublishing(false);
            alert("Post Published! 🎉");
        }, 2000);
    };

    return (
        <div className="max-w-2xl gap-6 flex-col flex md:h-[calc(100vh-80px)] h-[calc(100vh-64px)] 
         mx-auto p-4 bg-gray-800 shadow-lg rounded-lg">
            <h1 className="text-2xl font-bold shadow-sm mb-4 text-white">Create a New Post</h1>
            <form className="space-y-4 flex flex-col gap-6 flex-1 mb-6" onSubmit={handlePublish}>
                {/* Cover Image Button */}
                <button type="button" className="w-max px-4 py-2 shadow-sm bg-slate-600 text-white rounded-xl">
                    Add a cover image
                </button>

                {/* Post Title */}
                <input
                    type="text"
                    placeholder="News Update"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full p-2 border outline-none border-gray-300 rounded-lg text-black"
                />
                {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}

                {/* Category Selection */}
                <div className="flex items-center gap-4 text-black">
                    <label className="text-sm font-medium mb-1 text-white">Choose a category</label>
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="p-2 border border-gray-300 shadow-sm rounded-xl"
                        name="cat"
                        id=""
                    >
                        <option value="">-- Select Category --</option>
                        <option value="general">General</option>
                        <option value="sports-news">Sports News</option>
                        <option value="celebrity-news">Celebrity News</option>
                        <option value="politics">Politics</option>
                        <option value="betting-tips">Betting Tips</option>
                        <option value="hot-gist">Hot Gist</option>
                    </select>
                </div>
                {errors.category && <p className="text-red-500 text-sm">{errors.category}</p>}
                 {/* Post Description */}
                 <textarea
                    name="desc"
                    placeholder="Short description..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full p-2 border text-black  border-gray-300 rounded-lg"
                />
                {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}


        
                {/* Additional Image Uploads */}
                <div className="space-y-2">
                    {images.map((_, index) => (
                        <input
                            key={index}
                            type="file"
                            className="w-full p-2 border border-gray-300 rounded-lg text-white"
                        />
                    ))}
                    <button
                        type="button"
                        onClick={handleAddImage}
                        className="px-4 py-2 bg-gray-700 text-white rounded-lg"
                    >
                        + Add another image
                    </button>
                </div>

                {/* Rich Text Editor */}
                {quillLoaded ? (
                    <Suspense fallback={<p className="text-black">Loading editor...</p>}>
                        <ReactQuill theme="snow" value={content} onChange={setContent} className="flex-1 rounded-xl shadow-md bg-white text-black"/>
                    </Suspense>
                ) : (
                    <p className="text-gray-500">Loading editor...</p>
                )}
                {errors.content && <p className="text-red-500 text-sm">{errors.content}</p>}

                {/* Submit Button with Loading State */}
                <div></div>
                <button
                    type="submit"
                    className={`w-full p-2 rounded-lg transition  ${
                        isPublishing ? "bg-gray-500 cursor-not-allowed" : "bg-red-700 hover:bg-red-800"
                    } text-white`}
                    disabled={isPublishing}
                >
                    {isPublishing ? "Publishing..." : "Publish"}
                </button>
            </form>
        </div>
    );
};

export default Write;
