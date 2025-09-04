import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminAppeals = () => {
  const [appeals, setAppeals] = useState([]);
  const [selectedAppeal, setSelectedAppeal] = useState(null);

  useEffect(() => {
    const fetchAppeals = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("https://nahara-production.up.railway.app/api/appeal/all", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAppeals(res.data);
      } catch (err) {
        console.error("Error fetching appeals", err);
      }
    };
    fetchAppeals();
  }, []);

  const handleRestore = async (appealId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(`https://nahara-production.up.railway.app/api/appeal/${appealId}/restore`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAppeals((prev) => prev.filter((a) => a.id !== appealId));
      setSelectedAppeal(null);
    } catch (err) {
      console.error("Restore failed", err);
    }
  };
  

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-blue-800">Post Appeals</h2>
      {!selectedAppeal ? (
        <div className="grid gap-4">
          {appeals.map((appeal) => (
            <div
              key={appeal.id}
              className="p-4 border border-gray-200 rounded hover:bg-gray-100 cursor-pointer"
              onClick={() => setSelectedAppeal(appeal)}
            >
              <p><strong>Slug:</strong> {appeal.postSlug}</p>
              <p className="text-sm text-gray-500">{new Date(appeal.submittedAt).toLocaleString()}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-gray-800 dark:bg-gray-300 p-6 rounded shadow-md">
          <h3 className="text-xl font-bold mb-2">Appeal Details</h3>
          <p><strong>Post Slug:</strong> {selectedAppeal.postSlug}</p>
          <p className="mt-2 text-gray-700">{selectedAppeal.message}</p>
          <div className="flex gap-4 mt-6">
            <button
              onClick={() => handleRestore(selectedAppeal.id)}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Restore Post
            </button>
            <button
              onClick={() => setSelectedAppeal(null)}
              className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
            >
              Back to List
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAppeals;
