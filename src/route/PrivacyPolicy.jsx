import { motion } from "framer-motion";

const PrivacyPolicy = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="p-6 max-w-3xl mx-auto bg-gray-100 mt-6 mb-6 dark:bg-gray-900 rounded-lg shadow-lg"
    >
      <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-white">Privacy Policy</h1>
      <p className="mt-4 text-gray-600 dark:text-gray-300">
        Welcome to Smart Media Update (SMU Sport News). Your privacy is important to us. This policy explains how we collect, use, and protect your information.
      </p>

      <div className="mt-6 space-y-4 text-gray-700 dark:text-gray-300">
        <h2 className="text-xl font-semibold">Information We Collect</h2>
        <p>We may collect personal data such as your name, email address, phone number, and browsing activity when you interact with our website.</p>

        <h2 className="text-xl font-semibold">How We Use Your Information</h2>
        <ul className="list-disc list-inside">
          <li>To improve our services and provide personalized content</li>
          <li>To communicate updates, newsletters, and promotional offers</li>
          <li>To enhance website security and prevent fraud</li>
          <li>To comply with legal and regulatory requirements</li>
        </ul>

        <h2 className="text-xl font-semibold">Data Protection</h2>
        <p>We take appropriate security measures to protect your personal data from unauthorized access, alteration, or disclosure.</p>

        <h2 className="text-xl font-semibold">Cookies and Tracking Technologies</h2>
        <p>
          We use cookies and similar tracking technologies to enhance your browsing experience. You can manage cookie preferences through your browser settings.
        </p>

        <h2 className="text-xl font-semibold">Third-Party Services</h2>
        <p>We may use third-party tools for analytics and advertising, which may collect and process your browsing information.</p>

        <h2 className="text-xl font-semibold">User Consent</h2>
        <p>
          By using our website, you consent to our privacy policy and agree to the collection and processing of your data as outlined in this policy.
        </p>

        <h2 className="text-xl font-semibold">Your Rights</h2>
        <p>You have the right to request access, correction, or deletion of your personal data. Contact us for more information.</p>
      </div>
    </motion.div>
  );
};

export default PrivacyPolicy;
