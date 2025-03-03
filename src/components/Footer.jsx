import { Facebook, Twitter, Instagram, Youtube } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect } from "react";

const Footer = () => {
    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://images.dmca.com/Badges/DMCABadgeHelper.min.js";
        script.async = true;
        document.body.appendChild(script);
    }, []);

    return (
        <footer className="bg-gray-900 text-white py-10 dark:bg-gray-600">
            <div className="max-w-6xl border-r-4 mx-auto px-6">
                {/* Top Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* About Section */}
                    <div>
                        <h2 className="text-xl font-semibold mb-4">About Us</h2>
                        <p className="text-gray-400 text-sm leading-relaxed">
                        <span className="font-bold text-red-600">SMU</span> is an online news platform that allows writers to retain ownership of their articles and get
                         compensation, while <span className="font-bold text-red-500">SMUTV</span> serves as a legitimate news outlet for all writers.                       
                          </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h2 className="text-xl font-semibold mb-4">Quick Links</h2>
                        <ul className="space-y-2">
                            <li><Link to="/disclaimer" className="hover:text-blue-500 transition">Disclaimer</Link></li>
                            <li><Link to="/about-us" className="hover:text-blue-500 transition">About</Link></li>
                            <li><Link to="/contact" className="hover:text-blue-500 transition">Contact</Link></li>
                            <li><Link to="/report-post" className="hover:text-blue-500 transition">Report post</Link></li>
                            <li><Link to="/ads" className="hover:text-blue-500 transition">Advertise with us</Link></li>
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

                {/* DMCA Badge */}
                <div className="text-center text-green-400 my-4">
                <a href="//www.dmca.com/Protection/Status.aspx?ID=81a566d0-06bc-4029-a130-0da6412863cb" title="DMCA.com Protection Status" class="dmca-badge">
                 <img src ="https://images.dmca.com/Badges/dmca_protected_sml_120m.png?ID=81a566d0-06bc-4029-a130-0da6412863cb" 
                 alt="DMCA.com Protection Status" /></a>  
                 <script src="https://images.dmca.com/Badges/DMCABadgeHelper.min.js"> 
                 </script>
                </div>

                {/* Bottom Section */}
                <div className="text-center text-sm text-gray-400">
                    <p>&copy; {new Date().getFullYear()} SmartMediaUpdate. All Rights Reserved.<br></br>
                        Designed and developed by SMU TECH TEAM
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
