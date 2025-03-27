import { Facebook, Twitter, Instagram, Youtube } from "lucide-react";
import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import Smu from "../assert/smu_logo-removebg-preview.png"
import Smuport from "../assert/SMUSPORTNEWS-removebg-preview.png"
import SabiPredic from "../assert/SabiPredictLogo.png"
import SecurityBadge from "../components/SecurityBadge";

const Footer = () => {
    const [localTime, setLocalTime] = useState("");

    useEffect(() => {
        // Function to update time
        const updateTime = () => {
            const now = new Date();
            const userTime = new Intl.DateTimeFormat("en-US", {
                timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: true,
            }).format(now);
            setLocalTime(userTime);
        };

        // Update time every second
        updateTime();
        const interval = setInterval(updateTime, 1000);

        // Cleanup on unmount
        return () => clearInterval(interval);
    }, []);

    return (
        <footer className="bg-gray-900 text-white py-12 dark:bg-gray-800">
            <div className="max-w-7xl mx-auto px-6">
                {/* Top Section */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-10 pb-10 border-b border-gray-700">
                    {/* About Section */}
                    <div>
                        <h2 className="text-2xl font-semibold mb-4">About Us</h2>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            <span className="font-bold text-red-500">SMU</span> is a modern news platform where writers retain full ownership of their content while <span className="font-bold text-red-400">SMUTV</span> serves as a global news outlet with integrity.
                        </p>
                        <p className="text-gray-200 mt-4 text-sm">Current Time: {localTime}</p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h2 className="text-2xl font-semibold mb-4">Quick Links</h2>
                        <ul className="space-y-3">
                            <li><Link to="/disclaimer" className="hover:text-red-500 transition">Disclaimer</Link></li>
                            <li><Link to="/about-us" className="hover:text-red-500 transition">About</Link></li>
                            <li><Link to="/contact" className="hover:text-red-500 transition">Contact</Link></li>
                            <li><Link to="/report-post" className="hover:text-red-500 transition">Report post</Link></li>
                            <li><Link to="/ads" className="hover:text-red-500 transition">Advertise with us</Link></li>
                            <li><Link to="/privacy-policy" className="hover:text-red-500 transition">Privacy Policy</Link></li>
                        </ul>
                    </div>

                    {/* Partners Section */}
            <div>
    <h2 className="text-2xl font-semibold mb-4">Our Partners</h2>
    <div className="relative">
        <div className="flex overflow-x-scroll space-x-4">
            <a href="https://smutechteam.com" target="_blank" rel="noopener noreferrer">
                <img
                    src={Smu}
                    alt="SMU TECH TEAM"
                    className="w-full h-auto object-contain hover:scale-105 transform transition duration-300"
                />
            </a>
            <a href="https://smusportnews.com" target="_blank" rel="noopener noreferrer">
                <img
                    src={Smuport}
                    alt="SMU Sport News"
                    className="w-full h-auto object-contain hover:scale-105 transform transition duration-300"
                />
            </a>
            <a href="https://sabipredict.com" target="_blank" rel="noopener noreferrer">
                <img
                    src={SabiPredic}
                    alt="Sabi Predict"
                    className="w-full h-auto object-contain hover:scale-105 transform transition duration-300"
                />
            </a>
        </div>
            </div>
        </div>
                    {/* Social Media Links */}
                    <div>
                        <h2 className="text-2xl font-semibold mb-4">Stay Connected</h2>
                        <p className="text-gray-400 mb-4">Follow us on social media for the latest updates:</p>
                        <div className="flex space-x-4">
                            <Link to="#" className="hover:text-blue-500 transition"><Facebook size={24} /></Link>
                            <Link to="#" className="hover:text-sky-500 transition"><Twitter size={24} /></Link>
                            <Link to="#" className="hover:text-pink-500 transition"><Instagram size={24} /></Link>
                            <Link to="#" className="hover:text-red-500 transition"><Youtube size={24} /></Link>
                        </div>
                    </div>
                </div>

                <SecurityBadge/>
                {/* Bottom Section */}
                <div className="text-center text-sm text-gray-500 mt-8">
                    <p>&copy; {new Date().getFullYear()} SmartMediaUpdate. All Rights Reserved.<br />
                        Built and Maintained by <span className="text-red-500">SMU Tech Team</span> ❤
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
