import { motion } from "framer-motion";

const Disclaimer = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="p-6 max-w-3xl mx-auto bg-gray-100 dark:bg-gray-900 mt-6 mb-6 rounded-lg shadow-lg"
    >
      <h1 className="text-3xl font-bold text-center text-gray-800 animate-pulse dark:text-white">Disclaimer</h1>
      <p className="mt-4 text-gray-600 dark:text-gray-300">
        The information provided on this website is for general informational purposes only. While we strive to keep the
        information up-to-date and accurate, we make no representations or warranties of any kind, express or implied,
        about the completeness, accuracy, reliability, suitability, or availability with respect to the website or the
        information contained on the website for any purpose.
      </p>
      <p className="mt-4 text-gray-600 dark:text-gray-300">
        Any reliance you place on such information is therefore strictly at your own risk. We are not liable for any loss
        or damage including without limitation, indirect or consequential loss or damage, or any loss or damage
        whatsoever arising from loss of data or profits arising out of, or in connection with, the use of this website.
      </p>
      <p className="mt-4 text-gray-600 dark:text-gray-300">
        Through this website, you may be able to link to other websites which are not under our control. We have no
        control over the nature, content, and availability of those sites. The inclusion of any links does not
        necessarily imply a recommendation or endorse the views expressed within them.
      </p>
    </motion.div>
  );
};

export default Disclaimer;