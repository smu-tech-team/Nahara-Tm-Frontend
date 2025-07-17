import { Facebook, Twitter, Instagram, Youtube } from "lucide-react";
import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import Smu from "/smu_logo-removebg-preview.png";
import Smuport from "/SMUSPORTNEWS-removebg-preview.png";
import SabiPredic from "/SabiPredictLogo.png";
import SecurityBadge from "../components/SecurityBadge";
import RestrictedComponent from "../components/RestrictedComponent";
import DownloadApp from "../components/DownloadApp";

const Footer = () => {
    const [localTime, setLocalTime] = useState("");
    useEffect(() => {
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
        updateTime();
        const interval = setInterval(updateTime, 1000);
        return () => clearInterval(interval);
    }, []);
    return (
        <footer className="bg-gray-900 text-white py-10 dark:bg-gray-800">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 pb-8 border-b border-gray-700">
                    <div> 
                         <DownloadApp/>
                    </div>
                    <div className="pr-4">
                        <h2 className="text-xl font-semibold mb-3">Quick Links</h2>
                        <ul className="space-y-2">
                            <li><Link to="/disclaimer" className="hover:text-red-500 transition">Disclaimer</Link></li>
                            <li><Link to="/about-us" className="hover:text-red-500 transition">About Us</Link></li>
                            <li><Link to="/contact" className="hover:text-red-500 transition">Contact</Link></li>
                            <li><Link to="/report-post" className="hover:text-red-500 transition">Report post</Link></li>
                            <li><Link to="/ads" className="hover:text-red-500 transition">Advertise with us</Link></li>
                            <li><Link to="/privacy-policy" className="hover:text-red-500 transition">Privacy Policy</Link></li>
                            <li><Link to="/termsAndConditions" className="hover:text-red-500 transition">T&Cs</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold mb-3">Our Partners</h2>
                        <div className="grid grid-cols-3 gap-4">
                            <a href="https://smutechteam.com" target="_blank" rel="noopener noreferrer" className="hover:scale-105 transform transition duration-300">
                                <img src={Smu} alt="SMU TECH TEAM" className="w-full h-auto object-contain" />
                            </a>
                            <a href="https://smusportnews.com" target="_blank" rel="noopener noreferrer" className="hover:scale-105 transform transition duration-300">
                                <img src={Smuport} alt="SMU Sport News" className="w-full h-auto object-contain" />
                            </a>
                            <a href="https://sabipredict.com" target="_blank" rel="noopener noreferrer" className="hover:scale-105 transform transition duration-300">
                                <img src={SabiPredic} alt="Sabi Predict" className="w-full h-auto object-contain" />
                            </a>
                        </div>
                        <RestrictedComponent className="mt-4" />
                        <p className="text-gray-200 mt-4 text-sm ">Current Time: {localTime}</p>
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold mb-3">Stay Connected</h2>
                        <p className="text-gray-400 mb-4">Follow us on social media for the latest updates:</p>
                        <div className="flex space-x-4">
                            <Link to="#" className="hover:text-blue-500 transition"><Facebook size={20} /></Link>
                            <Link to="#" className="hover:text-sky-500 transition"><Twitter size={20} /></Link>
                            <Link to="#" className="hover:text-pink-500 transition"><Instagram size={20} /></Link>
                            <Link to="#" className="hover:text-red-500 transition"><Youtube size={20} /></Link>
                        </div>
                    </div>
                </div>
                <SecurityBadge />
                <div className="text-center text-sm text-gray-500 mt-8">
                    <p>&copy; {new Date().getFullYear()} <span className="text-red-800">NAHARA</span>. All Rights Reserved.<br />
                        Owned and Maintained by <span className="text-red-800">NAHARA Technologies plc</span> ❤
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
