import React from "react";
import { CheckCircle } from "lucide-react";

const VerificationSuccess = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-green-50 text-center px-4">
      {/* Animated success icon */}
      <CheckCircle className="text-green-600 w-20 h-20 mb-4 animate-bounce" />
      <h1 className="text-4xl font-extrabold text-green-700 mb-4">
        Congratulations! 🎉
      </h1>
      <p className="text-gray-700 text-lg mb-6">
        Your email has been successfully verified. You can now return to your account and enjoy all the features.
      </p>
      
      <button
        onClick={() => window.location.href = "/"}
        className="mt-4 text-blue-800 underline hover:text-blue-600"
      >
        Return to Home
      </button>
    </div>
  );
};

export default VerificationSuccess;
