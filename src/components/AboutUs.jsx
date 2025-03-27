import { motion } from "framer-motion";

const About = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="p-6 max-w-3xl mx-auto bg-gray-100 dark:bg-gray-900 mt-6  mb-6 rounded-lg shadow-lg"
    >
      <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-white">About Smart Media Update (SMU Sport News)</h1>
      <p className="mt-4 text-gray-600 dark:text-gray-300 text-center">
        Welcome to Smart Media Update, your go-to platform for the latest news updates from around the world. 
        Whether it's sports, politics, entertainment, or global affairs, we bring you timely and accurate information.
      </p>
      <div className="mt-6 space-y-4 text-gray-700 dark:text-gray-300">
        <h2 className="text-xl font-semibold">Our Mission</h2>
        <p>
          Our mission is to provide fast, reliable, and insightful news to our audience. We believe in the power of 
          information and aim to keep you informed on the latest happenings globally.
        </p>
        <h2 className="text-xl font-semibold">Why Choose Us?</h2>
        <ul className="list-disc list-inside">
          <li>Real-time news updates</li>
          <li>Comprehensive coverage on sports and global events</li>
          <li>Reliable and fact-checked information</li>
          <li>User-friendly and engaging content</li>
        </ul>
      </div>
      <p className="mt-6 text-gray-600 dark:text-gray-300 text-center">
        Stay connected with us and never miss an important update from around the world!
      </p>
    </motion.div>
  );
};

export default About;
