import { Facebook, Twitter, Instagram, Youtube } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white py-10">
            <div className="max-w-6xl mx-auto px-6">
                {/* Top Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* About Section */}
                    <div>
                        <h2 className="text-xl font-semibold mb-4">About Us</h2>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            SmartMediaUpdate is your go-to platform for the latest sports news, insights, and community discussions.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h2 className="text-xl font-semibold mb-4">Quick Links</h2>
                        <ul className="space-y-2">
                            <li><Link to="/" className="hover:text-blue-500 transition">Home</Link></li>
                            <li><Link to="/about" className="hover:text-blue-500 transition">About</Link></li>
                            <li><Link to="/contact" className="hover:text-blue-500 transition">Contact</Link></li>
                            <li><Link to="/privacy-policy" className="hover:text-blue-500 transition">Privacy Policy</Link></li>
                        </ul>
                    </div>

                    {/* Social Media Links */}
                    <div>
                        <h2 className="text-xl font-semibold mb-4">Follow Us</h2>
                        <div className="flex space-x-4">
                            <Link to="#" className="hover:text-blue-500 transition"><Facebook size={22} /></Link>
                            <Link to="#" className="hover:text-blue-500 transition"><Twitter size={22} /></Link>
                            <Link to="#" className="hover:text-blue-500 transition"><Instagram size={22} /></Link>
                            <Link to="#" className="hover:text-blue-500 transition"><Youtube size={22} /></Link>
                        </div>
                    </div>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-700 my-6"></div>

                {/* Bottom Section */}
                <div className="text-center text-sm text-gray-400">
                    <p>&copy; {new Date().getFullYear()} SmartMediaUpdate. All Rights Reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
