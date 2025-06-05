import { motion } from 'framer-motion';
import {
  BookOpen,
  Mic,
  Newspaper,
  Video,
  PenLine,
  Music,
} from 'lucide-react';

const features = [
  {
    title: 'Write Ebooks',
    icon: <BookOpen size={32} className="text-blue-600" />,
    description: 'Create and sell digital ebooks to your audience directly.',
  },
  {
    title: 'Start a Podcast',
    icon: <Mic size={32} className="text-purple-600" />,
    description: 'Host audio episodes and engage your community through voice.',
  },
  {
    title: 'Publish News',
    icon: <Newspaper size={32} className="text-green-600" />,
    description: 'Keep your followers informed with up-to-date content.',
  },
  {
    title: 'Make Videos',
    icon: <Video size={32} className="text-red-600" />,
    description: 'Produce short clips, documentaries, or tutorials.',
  },
  {
    title: 'Write Articles',
    icon: <PenLine size={32} className="text-yellow-600" />,
    description: 'Share deep insights, how-tos, or personal thoughts.',
  },
  {
    title: 'Stream Music',
    icon: <Music size={32} className="text-pink-600" />,
    description: 'Upload original songs, instrumentals, or audio stories.',
  },
];

export default function CreatorFeatures() {
  return (
    <section className="bg-white dark:bg-gray-900 py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-6">
          What You Can Create on <span className="text-blue-600">Nahara</span>
        </h2>
        <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-14">
          Choose your path. Nahara gives you the tools to publish, connect, and grow — your way.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 sm:gap-10">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg p-6 hover:shadow-xl transition-all border border-gray-200 dark:border-gray-700 flex flex-col"
            >
              <div className="flex items-center space-x-4 mb-4">
                <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-full">
                  {feature.icon}
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-white">
                  {feature.title}
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
