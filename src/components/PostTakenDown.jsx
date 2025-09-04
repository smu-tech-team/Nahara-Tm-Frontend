import { useState } from "react";
import axios from "axios";
import { FaSadTear } from "react-icons/fa"; // Install react-icons if you don't have it

const PostTakenDown = ({ slug }) => {
    const [showAppealPopup, setShowAppealPopup] = useState(false);
    const [appealMessage, setAppealMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleAppealSubmit = async () => {
        if (!appealMessage.trim()) {
            alert("Please write something before submitting your appeal.");
            return;
        }

        try {
            setIsSubmitting(true);
            await axios.post(`https://nahara-production.up.railway.app/api/appeal/${slug}`, {
                message: appealMessage,
            });
            alert("✅ Appeal submitted successfully! We'll review it shortly.");
            setShowAppealPopup(false);
            setAppealMessage("");
        } catch (error) {
            console.error("Error submitting appeal:", error);
            alert("❌ Failed to submit appeal. Please try again later.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-gray-100">
            <div className="bg-white text-gray-800 p-8 rounded-xl shadow-lg text-center w-full max-w-lg">
                <div className="flex flex-col items-center mb-6">
                    <FaSadTear className="text-6xl text-red-400 mb-4" />
                    <h2 className="text-3xl font-bold mb-2">This Post Has Been Taken Down</h2>
                    <p className="text-gray-600">
                        This content was removed because it violated our community guidelines. 
                        If you believe this is a mistake, you can submit an appeal.
                    </p>
                </div>
                <button
                    onClick={() => setShowAppealPopup(true)}
                    className="bg-blue-600 text-white py-3 px-8 rounded-full hover:bg-blue-700 transition duration-300 font-semibold"
                >
                    Appeal
                </button>
            </div>

            {/* Appeal Popup Modal */}
            {showAppealPopup && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-8 shadow-2xl w-11/12 max-w-md">
                        <h3 className="text-2xl font-bold mb-4 text-gray-800 text-center">Submit Your Appeal</h3>
                        <textarea
                            className="w-full h-32 p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Explain why you believe this was a mistake..."
                            value={appealMessage}
                            onChange={(e) => setAppealMessage(e.target.value)}
                        />
                        <div className="flex justify-end gap-4">
                            <button
                                onClick={() => setShowAppealPopup(false)}
                                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 font-semibold"
                                disabled={isSubmitting}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAppealSubmit}
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-semibold"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Submitting..." : "Submit Appeal"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PostTakenDown;
