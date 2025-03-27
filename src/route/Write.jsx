import { useEffect, useState, lazy, Suspense, useRef } from "react";
const ReactQuill = lazy(() => import("react-quill"));
import "react-quill/dist/quill.snow.css";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import {jwtDecode} from "jwt-decode"; // Properly import jwt-decode
import { toast } from "react-toastify";
import DOMPurify from "dompurify";
const Write = () => {
    const [user, setUser] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const [token, setToken] = useState("");
    const [coverImage, setCoverImage] = useState(null);
    const [videoFile, setVideoFile] = useState(null);
    const fileInputRef = useRef(null);
    const videoFileInputRef = useRef(null);
    const [isEditorLoaded, setIsEditorLoaded] = useState(false);
    const [sportsSubcategory, setSportsSubcategory] = useState("");

        useEffect(() => {
    setIsEditorLoaded(true);
        }, []);



    

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

const handleAddVideoLink = () => {
    const videoUrl = prompt("Enter Video URL:");
    if (videoUrl) {
        setContent((prev) => prev + `<p><iframe className="ql-video" src="${videoUrl}"/></p>`);
        toast.success("Video link added successfully!");
    }
};

const handleVideoUpload = (event) => {
    const file = event.target.files[0];
    if (file && !["video/mp4", "video/webm", "video/ogg"].includes(file.type)) {
        toast.error("Invalid video format. Only MP4, WebM, and OGG are allowed.");
        return;
    }
    setVideoFile(file);
    toast.success("Video uploaded successfully!");
};

    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("general");
    const [content, setContent] = useState("");
    const [description, setDescription] = useState("");
    const [images, setImages] = useState([]);
    const [isPublishing, setIsPublishing] = useState(false);
    const [errors, setErrors] = useState({});
    const quillRef = useRef(null); // Reference to Quill


    const mutation = useMutation({
        mutationFn: async (newPost) => {
            return axios.post('http://localhost:8087/api/post/create-post', newPost, {
                headers: { Authorization: `Bearer ${token}` },
            });
        },
        onSuccess: () => {
            setIsPublishing(false);
            toast.success("Post Published Successfully! 🎉");

            // Reset form fields
            setTitle("");
            setCategory("general"); // Reset category
            setContent("");
            setDescription("");
            setCoverImage(null);
            setVideoFile(null);
            setImages([]);

            // Reset file inputs
            if (fileInputRef.current) fileInputRef.current.value = "";
            if (videoFileInputRef.current) videoFileInputRef.current.value = "";
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
    const handleContentChange = (html) => {
        setContent(DOMPurify.sanitize(html)); // Sanitize input
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

        if (!title || !content  || !description || !category) {
            toast.error("All fields are required");
            return;
        }
    
    
        if (!coverImage) {
            toast.error("Please upload a cover image");
            return;
        }
        const plainTextContent = getPlainText(); // Extract text before sending


        
     
        setIsPublishing(true);

        const hashtags = generateHashtags(`${title} ${description}`);

        const formData = new FormData();
        formData.append("title", title);
        formData.append("category", category || "general"); // Ensure it's always set
        formData.append("description", description);
        formData.append("slug", generateSlug(title));
        formData.append("coverImage", coverImage); // Ensure this is included
        formData.append("featureImage", coverImage); // Ensure correct key
        formData.append("content", plainTextContent + "\n\n" + hashtags.join(" ")); // Store only text
        images.forEach((image, index) => formData.append(`image${index}`, image));
        if (videoFile) {
            formData.append("videoFile", videoFile);
        }
       
    
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
    const generateHashtags = (text) => {
        if (!text) return [];
    
        const words = text
            .toLowerCase()
            .match(/\b(\w+)\b/g) // Extract words
            .filter(word => word.length > 3) // Remove short words
            .slice(0, 5); // Limit to 5 hashtags
    
        return words.map(word => `#${word.replace(/[^a-zA-Z0-9]/g, "")}`);
    };
   

    const getPlainText = () => {
        if (quillRef.current) {
            return quillRef.current.getEditor().getText(); // Extract plain text
        }
        return "";
    };

    const handleCategoryChange = (e) => {
        setCategory(e.target.value);
        console.log("Selected Category:", e.target.value);
    };
    
      
    const generateSlug = (title) => {
        return title.toLowerCase()
            .replace(/[^a-z0-9\s-]/g, "") // Remove special characters
            .replace(/\s+/g, "-") // Replace spaces with dashes
            .trim();
    };
    

    

    return (
        <div className="max-w-2xl mt-8 mb-8 gap-6 flex-col flex md:h-[calc(150vh-80px)] h-[calc(130vh-64px)] 
         mx-auto p-4 bg-gray-100 dark:bg-gray-900 shadow-lg rounded-lg">
            <h1 className="text-2xl font-bold shadow-sm mb-4 text-gray-800 dark:text-white">Create a New Post</h1>
            <form className="space-y-4 flex flex-col gap-6 flex-1 mb-6" onSubmit={handlePublish}>
            <button
        type="button"
        onClick={() => fileInputRef.current.click()}
        className="w-max px-4 py-2 shadow-sm bg-gray-700 text-white rounded-xl"
    >
        Add a cover (Image/Video)
    </button>
    <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*,video/*"
        onChange={(e) => {
            const file = e.target.files[0];
            if (!file) return;
            
            const isVideo = file.type.startsWith("video/");
            setCoverImage(isVideo ? null : file);
            setVideoFile(isVideo ? file : null);
        }}
    />
               {/* Cover Preview */}
             {(coverImage || videoFile) && (
        <div className="relative mt-4 w-40 h-30 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
            {/* Remove Button */}
            <button
                type="button"
                onClick={() => {
                    setCoverImage(null);
                    setVideoFile(null);
                    fileInputRef.current.value = "";
                }}
                className="absolute top-2 right-2 bg-red-500 text-white text-sm px-2 py-1 rounded-lg"
            >
                Remove
            </button>

            {/* Show Image or Video */}
            {coverImage && (
                <img
                    src={URL.createObjectURL(coverImage)}
                    alt="Cover Preview"
                    className="w-full h-full object-cover"
                />
            )}
            {videoFile && (
                <video
                    controls
                    className="w-full h-full object-cover"
                >
                    <source src={URL.createObjectURL(videoFile)} type={videoFile.type} />
                    Your browser does not support the video tag.
                </video>
            )}
        </div>
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

                <div className="flex flex-col gap-4">
                        {/* Main Category Dropdown */}
                                                <label className="text-sm font-medium mb-1 text-gray-800 dark:text-white">Choose a category</label> 
                        <select value={category} onChange={handleCategoryChange} className="p-2 border border-gray-300 shadow-sm rounded-xl text-gray-900 dark:text-white dark:bg-gray-800" > 
                        <option value="general">General</option> 
                        <option value="sports-news">Sports News</option>
                         <option value="celebrity-news">Celebrity News</option>
                          <option value="politics">Politics</option> 
                          <option value="betting-tips">Betting Tips</option> 
                        <option value="hot-gist">Hot Gist</option>
                         </select>
                          </div> {errors.category && <p className="text-red-500 text-sm">{errors.category}</p>}

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

                {isEditorLoaded && (
                     <Suspense fallback={<p className="text-gray-800 dark:text-white">Loading editor...</p>}>                            
                <ReactQuill 
                ref={quillRef} 
                theme="snow" 
                value={content} 
                onChange={handleContentChange} 
                className="rounded-xl shadow-md bg-white  dark:bg-gray-500 dark:text-white text-black"
                style={{ height: "300px", overflowY: "auto" }} // Set a fixed height
            />
                </Suspense>
            )}
                {errors.content && <p className="text-red-500 text-sm">{errors.content}</p>}
                               {/* Video Section */}
                               <div className="flex items-center gap-4">
                                <button type="button" onClick={handleAddVideoLink} className="bg-blue-500 text-white px-3 py-1 rounded-lg text-sm">
                                    + Add Video Link
                                </button>

                                <input
                                    type="file"
                                    accept="video/*"
                                    ref={videoFileInputRef}
                                    className="hidden"
                                    onChange={handleVideoUpload}
                                />
                                <button type="button" onClick={() => videoFileInputRef.current.click()} className="bg-green-500 text-white px-3 py-1 rounded-lg text-sm">
                                    Upload Video
                                </button>
                            </div>
                            {videoFile && <p className="text-green-600">Selected Video: {videoFile.name}</p>}


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
