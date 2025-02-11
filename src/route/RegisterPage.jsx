import { SignUp } from "@clerk/clerk-react";
import { motion } from "framer-motion";
import Image from "../components/Image";

const RegisterPage = () => {
    return (
        <div className="relative flex items-center justify-center h-[calc(100vh-80px)] overflow-hidden bg-black">
            {/* Animated Background with News SVG */}
            <motion.div 
                initial={{ scale: 1.2, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="absolute inset-0 flex items-center justify-center"
            >
                <Image
                    src="livesreem.webp"  // Replace with your SVG path
                    alt="News Background"
                    className="w-full h-full object-cover opacity-30 animate-bounce"

                />
            </motion.div>

            {/* Blue Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-900 via-black to-blue-900 opacity-70"></div>

            {/* Registration Form */}
            <motion.div 
                initial={{ y: 50, opacity: 0 }} 
                animate={{ y: 0, opacity: 1 }} 
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative z-10 bg-red-800 dark:bg-gray-900 p-6 md:p-10 rounded-3xl shadow-2xl"
            >
                <SignUp signInUrl="/login" />
            </motion.div>
        </div>
    );
};

export default RegisterPage;
