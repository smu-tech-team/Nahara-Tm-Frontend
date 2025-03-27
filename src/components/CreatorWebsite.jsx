import { useSearchParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { ArrowLeft } from "lucide-react"; // Modern back icon

export default function CreatorWebsite() {
    const [searchParams] = useSearchParams();
    const websiteUrl = searchParams.get("url");
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    return (
        <div className="w-full h-screen bg-gray-50 flex flex-col">
            {/* Top Navbar */}
            <div className="bg-white shadow-md px-6 py-3 flex items-center justify-between sticky top-0 z-50">
                <button 
                    onClick={() => navigate(-1)} 
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition"
                >
                    <ArrowLeft size={20} />
                    <span className="font-medium">Back to App</span>
                </button>
                <h1 className="text-lg font-semibold text-gray-800">Creator&apos;s Website</h1>
                <div></div> {/* Placeholder for spacing */}
            </div>

            {/* Iframe Section */}
            <div className="flex-1 flex items-center justify-center">
                {websiteUrl ? (
                    <>
                        {loading && (
                            <div className="absolute top-1/2 transform -translate-y-1/2 text-gray-500">
                                Loading website...
                            </div>
                        )}
                        <iframe
                            src={websiteUrl}
                            className="w-full h-full border-0 rounded-lg shadow-lg"
                            allowFullScreen
                            onLoad={() => setLoading(false)}
                        ></iframe>
                    </>
                ) : (
                    <div className="text-center text-red-500 mt-20">
                        <p className="text-lg font-medium">⚠ Invalid URL</p>
                        <p className="text-gray-500 mt-1">The creator&apos;s website link is missing or incorrect.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
