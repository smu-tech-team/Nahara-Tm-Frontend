import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { FaBan, FaExclamationCircle, FaUserAltSlash } from "react-icons/fa";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useNavigate } from "react-router-dom";

const CreatorManagement = () => {
    const [creators, setCreators] = useState([]);
    const [filteredCreators, setFilteredCreators] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [size] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate(); 
    const [showModal, setShowModal] = useState(false);
    const [selectedCreatorId, setSelectedCreatorId] = useState(null);
    const [selectedDuration, setSelectedDuration] = useState("ONE_WEEK");
    const suspensionDurations = ["ONE_WEEK", "TWO_WEEKS", "THREE_WEEKS", "ONE_MONTH"];
    const [suspensionReason, setSuspensionReason] = useState("");
    const fetchCreators = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`http://localhost:8087/api/admin/creators?page=${page}&size=${size}`);
            setCreators(response.data.content);
            setFilteredCreators(response.data.content);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error("Error fetching creators:", error);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchCreators();
    }, [page, size]);
 const handleSuspend = async () => {
    if (!selectedCreatorId || !selectedDuration || !suspensionReason.trim()) {
        alert("Please provide all suspension details.");
        return;
    }
    try {
        await axios.post("http://localhost:8087/api/admin/suspend-creator", {
            creatorId: selectedCreatorId,
            duration: selectedDuration,
            reason: suspensionReason,
        });
        alert("Creator suspended successfully!");
        setShowModal(false);
        setSuspensionReason(""); // clear reason
        fetchCreators();
    } catch (error) {
        console.error("Error suspending creator:", error);
        alert("Failed to suspend creator.");
    }
};
    const openSuspendModal = (id) => {
    setSelectedCreatorId(id);
    setSelectedDuration("ONE_WEEK");
    setShowModal(true);
};
    const handleBan = async (id) => {
        try {
            await axios.put(`/api/admin/creators/${id}/ban`);
            alert("Creator banned successfully!");
        } catch (error) {
            console.error("Error banning creator:", error);
            alert("Failed to ban creator.");
        }
    };
    const handleWarn = (creatorId) => {
        navigate(`/admin/messages/${creatorId}`); 
    };
    const handleSearch = async (event) => {
        const term = event.target.value;
        setSearchTerm(term);
        if (term.trim() === "") {
            const response = await axios.get(`http://localhost:8087/api/admin/creators?page=${page}&size=${size}`);
            setFilteredCreators(response.data.content);
            return;
        }
        try {
            const response = await axios.get(`http://localhost:8087/api/creator/creators/search?query=${term}`);
            setFilteredCreators(response.data);
        } catch (error) {
            console.error("Error searching creators:", error);
            alert("Failed to fetch search results.");
        }
    };
    return (
        <div className="p-6 bg-gradient-to-r from-blue-50 to-blue-100 min-h-auto rounded">
            <h1 className="text-3xl font-extrabold text-blue-700 mb-6">Admin Dashboard</h1>
            <div className="mb-6">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={handleSearch}
                    placeholder="Search creators by name..."
                    className="w-full px-4 py-2 border border-blue-300 text-gray-600 rounded-lg shadow focus:ring focus:ring-blue-500 focus:outline-none"
                />
            </div>
            <div className="mb-8">
                <h2 className="text-xl font-bold text-blue-800 mb-4">Creators</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {loading ? (
                        Array.from({ length: 6 }).map((_, index) => (
                            <div key={index} className="p-4 bg-white rounded-lg shadow-md">
                                <Skeleton height={128} className="mb-4 rounded-md" />
                                <Skeleton height={20} width={`80%`} className="mb-2" />
                                <div className="flex justify-between mt-4">
                                    <Skeleton width={70} height={30} />
                                    <Skeleton width={70} height={30} />
                                    <Skeleton width={70} height={30} />
                                </div>
                            </div>
                        ))
                    ) : (
                        filteredCreators.map((creator) => (
                            <motion.div
                                key={creator.id}
                                className="p-4 bg-gray-800 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                <img
                                    src={creator.blogProfile || "https://via.placeholder.com/150"}
                                    alt={creator.blogName}
                                    className="w-full h-32 object-cover rounded-md mb-4"
                                />
                                <h2 className="text-lg font-semibold text-gray-200">
                                    {creator.blogName}
                                </h2>
                                <p className="text-sm text-gray-400">ID: {creator.id}</p>
                                <div className="flex justify-between mt-4">
                                {showModal && (
                                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
                                        <h2 className="text-xl font-bold mb-4">Suspend Creator</h2>
                                        <label className="block mb-2 text-gray-700">Select Duration:</label>
                                        <select
                                            className="w-full p-2 border border-gray-300 rounded mb-4"
                                            value={selectedDuration}
                                            onChange={(e) => setSelectedDuration(e.target.value)}
                                        >
                                            {suspensionDurations.map((duration) => (
                                                <option key={duration} value={duration}>
                                                    {duration.replace("_", " ")}
                                                </option>
                                            ))}
                                        </select>
                                        <label className="block mb-2 text-gray-700">Reason:</label>
                                        <textarea
                                            className="w-full p-2 border border-gray-300 rounded mb-4"
                                            rows={3}
                                            value={suspensionReason}
                                            onChange={(e) => setSuspensionReason(e.target.value)}
                                            placeholder="Enter reason for suspension"
                                        />
                                        <div className="flex justify-end space-x-2">
                                            <button
                                                onClick={() => setShowModal(false)}
                                                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                onClick={handleSuspend}
                                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                            >
                                                Confirm
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                                        <button
                                        onClick={() => openSuspendModal(creator.id)}
                                        className="flex items-center px-3 py-1 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                                    >
                                        <FaUserAltSlash className="mr-2" />
                                        Suspend
                                    </button>
                                    <button
                                        onClick={() => handleBan(creator.id)}
                                        className="flex items-center px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600"
                                    >
                                        <FaBan className="mr-2" />
                                        Ban
                                    </button>
                                    <button
                                        onClick={() => handleWarn(creator.id)}
                                        className="flex items-center px-3 py-1 bg-blue-800 text-white rounded-lg hover:bg-blue-600"
                                    >
                                        <FaExclamationCircle className="mr-2" />
                                        Message
                                    </button>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>
            </div>
            <div className="mt-6 flex justify-center items-center space-x-4">
                <button
                    disabled={page === 0}
                    onClick={() => setPage(page - 1)}
                    className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 disabled:opacity-50"
                >
                    Previous
                </button>
                <span className="text-gray-700 font-medium">
                    Page {page + 1} of {totalPages}
                </span>
                <button
                    disabled={page + 1 >= totalPages}
                    onClick={() => setPage(page + 1)}
                    className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 disabled:opacity-50"
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default CreatorManagement;
