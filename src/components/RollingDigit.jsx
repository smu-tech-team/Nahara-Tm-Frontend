import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';


const digitVariants = {
  initial: { y: "0%" },
  animate: (digit) => ({
    y: `${-digit * 100}%`, // Moves each digit smoothly
    transition: { duration: 1.2, ease: "easeOut" },
  }),
};

const RollingDigit = ({ digit, prefix = "" }) => {
  return (
    <div className="relative w-[0.85em] h-[1.2em] overflow-hidden inline-block">
      <motion.div
        key={digit} 
        custom={digit}
        initial="initial"
        animate="animate"
        variants={digitVariants}
      >
        {[...Array(10)].map((_, i) => (
          <div key={i} className="text-3xl font-bold text-gray-900 dark:text-white leading-none">
            {prefix && i === 0 ? prefix : i}
          </div>
        ))}
      </motion.div>
    </div>
  );
};


const RollingCounter = ({ value, prefix = "", inView }) => {
  const [digits, setDigits] = useState([]);

  useEffect(() => {
    if (inView) {
      const formattedValue = value.toString().split(""); // No unnecessary padding
      setDigits(formattedValue);
    }
  }, [value, inView]);

  return (
    <div className="inline-flex gap-[0.05em]">
      {digits.map((digit, i) => (
        /\d/.test(digit) ? (
          <RollingDigit key={`${digit}-${i}`} digit={parseInt(digit)} prefix={prefix} />
        ) : (
          <span key={`${digit}-${i}`} className="text-3xl font-bold">{digit}</span>
        )
      ))}
    </div>
  );
};

export default RollingCounter;
