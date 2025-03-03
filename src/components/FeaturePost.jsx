import Image from "./image";
import { Link } from "react-router-dom";

const FeaturedPost = () => {
    return (
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* LEFT SECTION - Main Featured Post */}
            <div className="lg:col-span-1 flex flex-col gap-4">
                {/* IMAGE */}
                <Image src="SmartLogoMain.png" className="rounded-3xl dark:shadow-black  object-cover w-full" w="895" />
                
                {/* Details */}
                <div className="flex items-center gap-4 text-gray-300">
                    <h1 className="font-semibold text-lg">01.</h1>
                    <Link to="/sports-news" className="text-blue-400 hover:underline">Sports News</Link>
                    <span className="text-gray-500  dark:text-gray-800 text-sm">2 days ago</span>
                </div>

                {/* Title */}
                <Link to="/test" className="text-2xl lg:text-3xl font-semibold hover:text-blue-400 transition">
                    We are running some testing at this point.
                </Link>
            </div>

            {/* MIDDLE SECTION - Other Posts */}
            <div className="lg:col-span-2 flex flex-col gap-6">
                {[...Array(3)].map((_, index) => (
                    <div key={index} className="flex gap-4">
                        <div className="w-1/3 aspect-video">
                            <Image 
                                src="Smartmedia3.png" 
                                className="rounded-3xl object-cover w-full h-full"
                                w="298"
                            />
                        </div>                    
                        {/* Details and Title */}
                        <div className="w-2/3">
                            <div className="flex items-center gap-4 text-gray-300 text-sm lg:text-base mb-2">
                                <h1 className="font-semibold">0{index + 2}.</h1>
                                <Link to="/sports-news" className="text-blue-400 hover:underline">Sports News</Link>
                                <span className="text-gray-500">2 days ago</span>
                            </div>
                            <Link to="/test" className="text-lg lg:text-xl font-medium hover:text-blue-400 transition">
                                We are still running the testing now
                            </Link>
                        </div>
                    </div>
                ))}
            </div>

            {/* RIGHT SECTION - Ads */}
            <div className="lg:col-span-1 flex flex-col gap-8">
                <h2 className="text-lg font-bold dark:text-gray-600 text-gray-300">Sponsored Ads</h2>
                
                {/* Ads */}
                {[
                    { img: "SMUADS2.PNG.jpg", text: "Sabipredict is your number one prediction and free prediction site." },
                    { img: "SMUADS.PNG.jpg", text: "Exclusive deals for sports fans!" }
                ].map((ad, idx) => (
                    <div key={idx} className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow-lg">
                        <Image src={ad.img} className="w-full h-[180px] rounded-lg object-cover" />
                        <p className="text-gray-600 dark:text-gray-300 text-sm mt-2">{ad.text}</p>
                        <Link to="/promo" className="text-blue-500 text-sm mt-2 inline-block hover:underline">
                            {idx === 0 ? "Learn More →" : "Shop Now →"}
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FeaturedPost;
