import { useState, useEffect, useRef } from "react";
import { fetchAdminItems, performAdminAction } from "../store/adminApi";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { ActionTypes } from "../store/actionTypes.js"; // Import ActionTypes enum

export default function AdminActions() {
  const [items, setItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingAction, setLoadingAction] = useState("");
  const [pendingAction, setPendingAction] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Adjust this value for pagination
  const undoTimeout = useRef(null);
  const pendingUndo = useRef({ ids: [], actionType: "" });

  useEffect(() => {
    loadItems();
    return () => clearTimeout(undoTimeout.current); // Cleanup on unmount
  }, []);

  const loadItems = async () => {
    try {
      const data = await fetchAdminItems();
      setItems(data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load items.");
    }
  };

  const handleSelect = (id) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedItems.length === filteredItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredItems.map((item) => item.id));
    }
  };

  const confirmAction = (actionType) => {
    if (selectedItems.length === 0) {
      toast.error("No items selected!");
      return;
    }
    setPendingAction(actionType);
  };

  const proceedWithAction = () => {
    if (!pendingAction) return;

    const actionType = pendingAction;
    const backupItems = [...items];
    const idsToDelete = [...selectedItems];

    setItems((prev) => prev.filter((item) => !idsToDelete.includes(item.id)));
    setSelectedItems([]);
    setPendingAction(null);

    pendingUndo.current = { ids: idsToDelete, actionType };

    toast.custom((t) => (
      <div className="flex flex-col gap-2 bg-white p-4 rounded-lg shadow">
        <span className="font-semibold">
          {idsToDelete.length} item(s) will be {formatAction(actionType)}.
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => {
              clearTimeout(undoTimeout.current);
              setItems(backupItems);
              toast.dismiss(t.id);
              toast.success("Undo successful!");
              pendingUndo.current = {};
            }}
            className="bg-blue-600 bg-gradient-to-r from-red-800 to-blue-800 hover:bg-blue-700 text-white px-3 py-1 rounded"
          >
            Undo
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="bg-gray-300 hover:bg-gray-400 text-black px-3 py-1 rounded"
          >
            Close
          </button>
        </div>
      </div>
    ), { duration: 6000 });

    undoTimeout.current = setTimeout(async () => {
      if (pendingUndo.current.ids.length > 0) {
        try {
          setIsLoading(true);
          setLoadingAction(actionType);
          await performAdminAction(actionType, idsToDelete);
          toast.success("Action finalized.");
          pendingUndo.current = {};
        } catch (error) {
          console.error(error);
          toast.error("Action failed, restoring items.");
          setItems(backupItems);
        } finally {
          setIsLoading(false);
          setLoadingAction("");
        }
      }
    }, 6000);
  };

  const formatAction = (actionType) => {
    switch (actionType) {
      case ActionTypes.DELETE_PODCAST:
        return "deleted Podcast";
      case ActionTypes.DELETE_EBOOK:
        return "deleted Ebook";
      case ActionTypes.DELETE_POST:
        return "deleted Post";
      case ActionTypes.TAKEDOWN_PODCAST:
        return "taken down Podcast";
      case ActionTypes.TAKEDOWN_EBOOK:
        return "taken down Ebook";
      case ActionTypes.TAKEDOWN_POST:
        return "taken down Post";
      default:
        return "performed an unknown action";
    }
  };

  const filteredItems = items.filter((item) =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const actionButtons = [
    { label: "Delete Podcast", type: ActionTypes.DELETE_PODCAST },
    { label: "Delete Ebook", type: ActionTypes.DELETE_EBOOK },
    { label: "Delete Post", type: ActionTypes.DELETE_POST },
    { label: "Take Down Podcast", type: ActionTypes.TAKEDOWN_PODCAST },
    { label: "Take Down Ebook", type: ActionTypes.TAKEDOWN_EBOOK },
    { label: "Take Down Post", type: ActionTypes.TAKEDOWN_POST },
  ];

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Manage Content</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 mb-4">
        {actionButtons.map((button) => (
          <button
            key={button.type}
            onClick={() => confirmAction(button.type)}
            disabled={isLoading && loadingAction === button.type}
            className=" bg-gradient-to-r from-red-800 to-blue-800 hover:bg-blue-700 text-white py-2 px-4 rounded"
          >
            {isLoading && loadingAction === button.type
              ? "Processing..."
              : button.label}
          </button>
        ))}
      </div>
      <div className="flex flex-col md:flex-row justify-between mb-4">
        <input
          type="text"
          placeholder="Search by title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 rounded px-4 py-2 mb-2 md:mb-0 md:mr-4 w-full md:w-1/2"
        />
        <button
          onClick={handleSelectAll}
          className=" bg-gradient-to-r from-red-800 to-blue-800 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded"
        >
          {selectedItems.length === filteredItems.length ? "Unselect All" : "Select All"}
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg overflow-hidden shadow">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-6 text-left">Select</th>
              <th className="py-3 px-6 text-left">Title</th>
              <th className="py-3 px-6 text-left">Type</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {currentItems.map((item) => (
                <motion.tr
                  key={item.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="border-b"
                >
                  <td className="py-3 px-6">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item.id)}
                      onChange={() => handleSelect(item.id)}
                      className="h-5 w-5"
                    />
                  </td>
                  <td className="py-3 px-6">{item.title}</td>
                  <td className="py-3 px-6 capitalize">{item.type}</td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>

        {filteredItems.length === 0 && (
          <p className="text-center text-gray-500 py-6">No items found.</p>
        )}
      </div>
      <div className="flex justify-center mt-6">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-300 rounded-l"
        >
          Prev
        </button>
        <span className="px-4 py-2">{currentPage} of {totalPages}</span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-300 rounded-r"
        >
          Next
        </button>
      </div>
      {pendingAction && (
        <div className="mt-6">
          <button
            onClick={proceedWithAction}
            className="bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded"
          >
            Confirm Action
          </button>
        </div>
      )}
    </div>
  );
}
