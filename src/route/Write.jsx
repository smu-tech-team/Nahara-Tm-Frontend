import { useEffect, useState, lazy, Suspense, useRef } from "react";
const ReactQuill = lazy(() => import("react-quill"));
import "react-quill/dist/quill.snow.css";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import {jwtDecode} from "jwt-decode"; // Properly import jwt-decode

const Write = () => {
    const [user, setUser] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const [token, setToken] = useState("");
    const [coverImage, setCoverImage] = useState(null);
    const fileInputRef = useRef(null);



   const fetchUserInfo = async () => {
  try {
    const storedToken = localStorage.getItem("token"); // Retrieve token
    if (!storedToken) {
      console.error("No token found in localStorage");
      return;
    }

    const response = await axios.get("http://localhost:8087/api/creator/creators", {
      headers: {
        Authorization: `Bearer ${storedToken}`, // Send token in the header
      },
    });

    console.log("Full API Response:", response.data);

    if (!response.data || !response.data.token) {
      console.error("Error: Token is missing in response");
      return;
    }

    const token = response.data.token;
    setToken(token);

    const decodedToken = jwtDecode(token);
    setUser(response.data);
    setUserRole(decodedToken.roles ? decodedToken.roles[0] : null);
  } catch (error) {
    console.error("Error fetching user info:", error);
  }
};

useEffect(() => {
  fetchUserInfo();
}, []);

    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("");
    const [content, setContent] = useState("");
    const [description, setDescription] = useState("");
    const [images, setImages] = useState([]);
    const [isPublishing, setIsPublishing] = useState(false);
    const [errors, setErrors] = useState({});

    const mutation = useMutation({
        mutationFn: async (newPost) => {
            return axios.post('http://localhost:8087/api/post/create-post', newPost, {
                headers: { Authorization: `Bearer ${token}` },
            });
        },
        onSuccess: () => {
            setIsPublishing(false);
            alert("Post Published! 🎉");
        },
        onError: (error) => {
            setIsPublishing(false);
            alert(`Error publishing post: ${error.message}`);
        }
    });

    if (!user) return <div className="text-center text-red-500">You should log in</div>;
    if (userRole !== "CREATOR") return <div className="text-center text-red-500">You are not allowed to create posts</div>;

    const handleAddImage = () => {
        setImages([...images, ""]);
    };

    const validateForm = () => {
        const newErrors = {};
        if (!title.trim()) newErrors.title = "Title is required";
        if (!category) newErrors.category = "Please select a category";
        if (!content.trim()) newErrors.content = "Content cannot be empty";
        if (!description.trim()) newErrors.description = "Description is required";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handlePublish = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
    
        if (!coverImage) {
            setErrors((prev) => ({ ...prev, coverImage: "Feature image is required" }));
            return;
        }
    
        setIsPublishing(true);
    
        const formData = new FormData();
        formData.append("title", title);
        formData.append("category", category);
        formData.append("content", content);
        formData.append("description", description);
        formData.append("slug", title.toLowerCase().replace(/\s+/g, "-"));
        formData.append("coverImage", coverImage); // Ensure this is included
        formData.append("featureImage", coverImage); // Ensure correct key
        images.forEach((image, index) => formData.append(`image${index}`, image));
    
        mutation.mutate(formData);
    };

    const handleCoverImageClick = () => {
        fileInputRef.current.click();
    };

    const handleCoverImageChange = (e) => {
        if (e.target.files.length > 0) {
            setCoverImage(e.target.files[0]);
            setErrors((prev) => ({ ...prev, coverImage: "" })); // Clear error on selection
        }
    };
    

    return (
        <div className="max-w-2xl mt-8 gap-6 flex-col flex md:h-[calc(100vh-80px)] h-[calc(100vh-64px)] 
         mx-auto p-4 bg-gray-100 dark:bg-gray-900 shadow-lg rounded-lg">
            <h1 className="text-2xl font-bold shadow-sm mb-4 text-gray-800 dark:text-white">Create a New Post</h1>
            <form className="space-y-4 flex flex-col gap-6 flex-1 mb-6" onSubmit={handlePublish}>
                <button type="button" onClick={handleCoverImageClick} className="w-max px-4 py-2 shadow-sm bg-gray-700 text-white rounded-xl">
                    Add a cover image
                </button>
                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleCoverImageChange}
                />
                {coverImage && (
                    <img src={URL.createObjectURL(coverImage)} alt="Cover Preview" className="w-full h-40 object-cover rounded-lg" />
                )}

<input
                    type="text"
                    placeholder="News Update"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full p-2 border outline-none border-gray-300 rounded-lg text-gray-900 dark:text-white dark:bg-gray-800"
                    name="title"
                />
                {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}

                <div className="flex items-center gap-4">
                    <label className="text-sm font-medium mb-1 text-gray-800 dark:text-white">Choose a category</label>
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="p-2 border border-gray-300 shadow-sm rounded-xl text-gray-900 dark:text-white dark:bg-gray-800"
                        name="category"
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

                <textarea
                    name="description"
                    placeholder="Short description..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full p-2 border text-gray-900 dark:text-white border-gray-300 rounded-lg dark:bg-gray-800"
                />
                {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}

                <div className="space-y-2">
                    {images.map((_, index) => (
                        <input
                            key={index}
                            type="file"
                            onChange={(e) => {
                                const newImages = [...images];
                                newImages[index] = e.target.files[0];
                                setImages(newImages);
                            }}
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

                <Suspense fallback={<p className="text-gray-800 dark:text-white">Loading editor...</p>}>
                    <ReactQuill 
                        theme="snow" 
                        value={content} 
                        onChange={setContent} 
                        className="flex-1 rounded-xl shadow-md bg-white dark:bg-gray-800 dark:text-white text-black"
                    />
                </Suspense>
                {errors.content && <p className="text-red-500 text-sm">{errors.content}</p>}

                <button
                    type="submit"
                    className={`w-full px-4 py-2 bg-blue-500 text-white rounded-lg ${isPublishing ? "opacity-50" : ""}`}
                    disabled={isPublishing}
                >
                    {isPublishing ? "Publishing..." : "Publish"}
                </button>
            </form>
        </div>
    );
};

export default Write;
