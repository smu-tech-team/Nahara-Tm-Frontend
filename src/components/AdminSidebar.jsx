import { useState } from "react";
import { Link } from "react-router-dom";
import { Home, Settings, Users, LogOut, ChevronLeft, ChevronRight } from "lucide-react";

export default function AdminSidebar() {
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <div className={`fixed h-full bg-gray-900 text-white shadow-lg transition-all ${isOpen ? "w-64" : "w-16"} flex flex-col`}>
      {/* Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="absolute top-4 right-2 text-white"
      >
        {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
      </button>

      {/* Admin Logo */}
      <div className="flex items-center justify-center mt-5">
        <span className="text-lg font-bold">{isOpen ? "Admin Panel" : "AP"}</span>
      </div>

      {/* Navigation Links */}
      <nav className="mt-6 flex-grow space-y-4">
        <Link to="/admin/dashboard" className="flex items-center gap-3 p-3 hover:bg-gray-700 rounded-md">
          <Home size={20} />
          {isOpen && <span>Dashboard</span>}
        </Link>
        <Link to="/admin/users" className="flex items-center gap-3 p-3 hover:bg-gray-700 rounded-md">
          <Users size={20} />
          {isOpen && <span>Manage Users</span>}
        </Link>
        <Link to="/admin/settings" className="flex items-center gap-3 p-3 hover:bg-gray-700 rounded-md">
          <Settings size={20} />
          {isOpen && <span>Settings</span>}
        </Link>
      </nav>

      {/* Logout Button */}
      <div className="mt-auto p-3">
        <button className="flex items-center gap-3 bg-red-500 p-2 rounded-md w-full hover:bg-red-600">
          <LogOut size={20} />
          {isOpen && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
}
