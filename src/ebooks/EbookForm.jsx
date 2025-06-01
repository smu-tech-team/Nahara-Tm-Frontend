import { useState, useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const EbookForm = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [coverImage, setCoverImage] = useState(null);
  const [coverImagePreview, setCoverImagePreview] = useState(null);
  const [pdfChapters, setPdfChapters] = useState([]);
  const [price, setPrice] = useState("");
  const [token, setToken] = useState("");
  const [userRole, setUserRole] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const editor = useEditor({
    extensions: [StarterKit, Underline, Link],
    content: "",
    editable: true,
  });

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
  }, [navigate]);

  const handleCoverImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.size <= 5 * 1024 * 1024) {
      setCoverImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setCoverImagePreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      toast.error("Cover image must be less than 5MB.");
    }
  };

  const handleChaptersUpload = (e) => {
    const files = Array.from(e.target.files);
    const validPdfs = files.filter((file) => file.type === "application/pdf");

    if (validPdfs.length !== files.length) {
      toast.error("Only PDF files are allowed.");
      return;
    }

    setPdfChapters((prev) => [...prev, ...validPdfs]);
  };

  const handleRemoveCoverImage = () => {
    setCoverImage(null);
    setCoverImagePreview(null);
  };

  const handleRemoveChapter = (index) => {
    setPdfChapters((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !description || !category || !coverImage || pdfChapters.length === 0 || !editor) {
      toast.error("All fields are required.");
      return;
    }

    if (!token) {
      toast.error("Authentication error. Please log in.");
      navigate("/login");
      return;
    }

    if (userRole !== "CREATOR") {
      toast.error("Only creators can publish ebooks.");
      return;
    }

    const content = editor.getHTML();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("type", "PDF");
    formData.append("coverImage", coverImage);
    formData.append("content", content);
    formData.append("price", price.trim() === "" ? "0.00" : price);

    pdfChapters.forEach((chapter) => {
      formData.append("pdfChapters", chapter);
    });

    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:8087/api/ebooks/create-ebook",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.success("Ebook created successfully 🎉");

      setTitle("");
      setDescription("");
      setCategory("");
      setCoverImage(null);
      setCoverImagePreview(null);
      setPdfChapters([]);
      setPrice("");
      editor.commands.clearContent();
      navigate("/ebooks");
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error("Session expired, please log in again.");
        navigate("/login");
      } else {
        console.error(error);
        toast.error("Failed to create ebook.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 mt-10 bg-white shadow-xl rounded-2xl">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Publish an Ebook</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <InputField
          label="Title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <TextareaField
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          required
        />
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 text-gray-900 shadow-sm"
            required
          >
            <option value="">Select a category</option>
            <option value="Technology">Technology</option>
            <option value="Science">Science</option>
            <option value="Education">Education</option>
            <option value="Business">Business</option>
            <option value="Lifestyle">Lifestyle</option>
          </select>
        </div>

        {/* Cover Image */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Upload Cover Image</label>
          {coverImagePreview && (
            <div className="mb-4">
              <img src={coverImagePreview} alt="Cover Preview" className="w-32 h-32 object-cover rounded-md" />
              <button
                type="button"
                onClick={handleRemoveCoverImage}
                className="mt-2 text-sm text-red-500 hover:underline"
              >
                Remove Cover Image
              </button>
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleCoverImageUpload}
            className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 text-gray-900 shadow-sm"
            required
          />
        </div>

        {/* PDF Chapters */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Upload PDF Chapters</label>
          {pdfChapters.length > 0 && (
            <ul className="space-y-2 mb-4">
              {pdfChapters.map((chapter, idx) => (
                <li key={idx} className="flex items-center justify-between text-black">
                  <span>{chapter.name}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveChapter(idx)}
                    className="text-sm text-red-500 hover:underline"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
          <input
            type="file"
            accept="application/pdf"
            multiple
            onChange={handleChaptersUpload}
            className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 text-gray-900 shadow-sm"
            required
          />
        </div>

        {/* Rich Text Editor */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Ebook Content (Rich Text Editor)</label>
          {editor ? (
            <EditorContent
              editor={editor}
              className="border rounded-lg p-4 shadow-sm min-h-[150px] prose max-w-none"
            />
          ) : (
            <p className="text-gray-500">Loading editor...</p>
          )}
        </div>

        {/* Price */}
        <InputField
          label="Price (Optional)"
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Enter price (or leave blank for free)"
          min="0"
          step="0.01"
        />

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded-lg font-semibold shadow-lg transition duration-300 ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-blue-500 to-blue-700 text-white hover:scale-105"
          }`}
        >
          {loading ? "Publishing..." : "Publish Ebook"}
        </button>
      </form>
    </div>
  );
};

// Reusable components
const InputField = ({ label, ...props }) => (
  <div>
    <label className="block text-gray-700 font-semibold mb-2">{label}</label>
    <input
      {...props}
      className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 text-gray-900 shadow-sm"
    />
  </div>
);

const TextareaField = ({ label, ...props }) => (
  <div>
    <label className="block text-gray-700 font-semibold mb-2">{label}</label>
    <textarea
      {...props}
      className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 text-gray-900 shadow-sm"
    />
  </div>
);

export default EbookForm;
