import { useEffect, useState, useRef } from "react";
import "react-quill/dist/quill.snow.css";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import DOMPurify from "dompurify";
import { useNavigate } from "react-router-dom";
import RichTextEditor from "../components/RichTextEditor";
import AdSpace from "../components/AdSpace";

const Write = () => {
  const [userRole, setUserRole] = useState(null);
  const [token, setToken] = useState("");
  const [coverImage, setCoverImage] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const fileInputRef = useRef(null);
  const videoFileInputRef = useRef(null);
  const quillRef = useRef(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("general");
  const [content, setContent] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const [isPublishing, setIsPublishing] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      try {
        const decoded = jwtDecode(storedToken);
        setUserRole(decoded?.roles?.[0] || "");
      } catch (error) {
        console.error("Invalid token:", error);
        toast.error("Session invalid. Please log in again.");
        navigate("/login");
      }
    } else {
      toast.error("No token found. Please log in.");
      navigate("/login");
    }
    setLoading(false);
  }, [navigate]);

  const mutation = useMutation({
    mutationFn: async (newPost) => {
      return axios.post("http://localhost:8087/api/post/create-post", newPost, {
        headers: { Authorization: `Bearer ${token}` },
      });
    },
    onSuccess: () => {
      setIsPublishing(false);
      toast.success("Post Published Successfully! 🎉");
      setTitle("");
      setCategory("general");
      setContent("");
      setDescription("");
      setCoverImage(null);
      setVideoFile(null);
      setImages([]);
      if (fileInputRef.current) fileInputRef.current.value = "";
      if (videoFileInputRef.current) videoFileInputRef.current.value = "";
    },
    onError: (error) => {
      setIsPublishing(false);
      toast.error(`Error publishing post: ${error.message}`);
    },
  });

  if (loading) return <div>Loading...</div>;
  if (!token) return <div className="text-center text-red-500">Authentication error</div>;
  if (userRole !== "CREATOR") return <div className="text-center text-red-500">You are not allowed to create posts</div>;

  const handleContentChange = (html) => {
    setContent(DOMPurify.sanitize(html));
  };

  const handleAddImage = () => {
    setImages([...images, ""]);
  };

  const handleVideoUpload = (event) => {
    const file = event.target.files[0];
    if (file && !["video/mp4", "video/webm", "video/ogg"].includes(file.type)) {
      toast.error("Invalid video format.");
      return;
    }
    setVideoFile(file);
    toast.success("Video uploaded successfully!");
  };

  const handlePublish = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    if (!coverImage) {
      toast.error("Please upload a cover image");
      return;
    }

    setIsPublishing(true);
    const plainTextContent = getPlainText();
    const hashtags = generateHashtags(`${title} ${description}`);
    const formData = new FormData();
    formData.append("title", title);
    formData.append("category", category);
    formData.append("description", description);
    formData.append("slug", generateSlug(title));
    formData.append("coverImage", coverImage);
    formData.append("featureImage", coverImage);
    formData.append("content", plainTextContent + "\n\n" + hashtags.join(" "));
    images.forEach((img, idx) => formData.append(`image${idx}`, img));
    if (videoFile) formData.append("videoFile", videoFile);
    mutation.mutate(formData);
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

  const generateSlug = (text) => {
    return text.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").trim();
  };

  const getPlainText = () => {
    if (quillRef.current) {
      return quillRef.current.getEditor().getText();
    }
    return "";
  };

  const generateHashtags = (text) => {
    if (!text) return [];
    const words = text
      .toLowerCase()
      .match(/\b(\w+)\b/g)
      .filter((word) => word.length > 3)
      .slice(0, 5);
    return words.map((word) => `#${word.replace(/[^a-zA-Z0-9]/g, "")}`);
  };

  return (
    <div className="max-w-2xl mt-8 mb-8 gap-6 flex-col flex md:h-[calc(150vh-80px)] h-[calc(130vh-64px)] mx-auto p-4 bg-transparent dark:bg-gray-900 shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold shadow-sm mb-4 text-gray-800 dark:text-white">Create a New Post</h1>
      <form className="space-y-4 flex flex-col gap-6 flex-1 mb-6" onSubmit={handlePublish}>
        <button type="button" onClick={() => fileInputRef.current.click()} className="w-max px-4 py-2 shadow-sm bg-gray-700 text-white rounded-xl">
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
        {(coverImage || videoFile) && (
          <div className="relative mt-4 w-40 h-30 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
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
            {coverImage && <img src={URL.createObjectURL(coverImage)} alt="Cover Preview" className="w-full h-full object-cover" />}
            {videoFile && <video controls className="w-full h-full object-cover"><source src={URL.createObjectURL(videoFile)} type={videoFile.type} />Your browser does not support the video tag.</video>}
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

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Short description of the post"
          className="w-full p-2 border outline-none border-gray-300 rounded-lg text-gray-900 dark:text-white dark:bg-gray-800"
        ></textarea>
        {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full p-2 border outline-none border-gray-300 rounded-lg text-gray-900 dark:text-white dark:bg-gray-800"
        >
          <option value="general">General</option>
          <option value="sports">Sports</option>
          <option value="politics">Politics</option>
          <option value="entertainment">Entertainment</option>
        </select>
        {errors.category && <p className="text-red-500 text-sm">{errors.category}</p>}

        <RichTextEditor value={content} onChange={handleContentChange} quillRef={quillRef} />
        {errors.content && <p className="text-red-500 text-sm">{errors.content}</p>}

        <button
          type="submit"
          disabled={isPublishing}
          className="w-full p-3  button-color animate-gradient-flow-x text-white rounded-lg hover:bg-blue-700"
        >
          {isPublishing ? "Publishing..." : "Publish Post"}
        </button>
      </form>
    </div>
  );
};

export default Write;
