import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';
import { Users, UserCheck, DollarSign } from 'lucide-react';
import RollingCounter from './RollingDigit'; // assuming this works like AnimatedCount

const stats = [
 {
    title: "Creators Joined",
    icon: <UserCheck size={32} className="text-blue-600" />,
    value: 1023,
  },
  {
    title: "Active Users",
    icon: <Users size={32} className="text-green-600" />,
    value: 8640,
  },
  {
    title: 'Total Payouts',
    icon: <DollarSign size={32} className="text-yellow-500" />,
    value: 76450,
    prefix: '$',
  },
];

export default function GrowthStats() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.3 });

  return (
    <section ref={ref} className="py-16 sm:py-24 bg-gray-100 dark:bg-gray-900 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center mb-12 px-2">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">
          Nahara by the Numbers
        </h2>
        <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 mt-3 max-w-xl mx-auto">
          A snapshot of how creators and users thrive on our platform.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-5xl mx-auto px-2">
        {stats.map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: idx * 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg flex flex-col items-center"
          >
            <div className="mb-4 flex justify-center">{stat.icon}</div>
            <RollingCounter
              value={stat.value}
              prefix={stat.prefix || ''}
              inView={inView}
              className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white"
            />
            <p className="text-gray-700 dark:text-gray-300 mt-2 text-sm sm:text-base text-center">
              {stat.title}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
