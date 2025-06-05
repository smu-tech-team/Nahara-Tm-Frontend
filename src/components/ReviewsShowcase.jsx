import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const reviews = [
  {
    name: 'Sarah O.',
    title: 'Content Creator',
    image: '/myphoto2.jpg',
    feedback: 'Nahara has completely changed how I publish content. It’s easy, elegant, and powerful!',
    rating: 5,
  },
  {
    name: 'James A.',
    title: 'Podcast Host',
    image: '/myphoto2.jpg',
    feedback: 'I’ve grown my community 4x faster with Nahara’s tools. Highly recommended.',
    rating: 5,
  },
  {
    name: 'Lilian R.',
    title: 'Author & Educator',
    image: '/myphoto2.jpg',
    feedback: 'The ebook creation tools are smooth and the audience insights are top-notch.',
    rating: 4,
  },
];

export default function ReviewsShowcase() {
  return (
    <section className="bg-gray-50 dark:bg-gray-950 py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white">
            What Creators Are Saying
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mt-4 max-w-2xl mx-auto">
            Hear from top creators using Nahara to grow, inspire, and earn more.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          {reviews.map((review, index) => (
            <motion.div
              key={review.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-gray-800 shadow-xl rounded-3xl p-6 border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center space-x-4 mb-4">
                <img
                  src={review.image}
                  alt={review.name}
                  className="w-14 h-14 rounded-full object-cover border-2 border-blue-500"
                />
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white">{review.name}</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{review.title}</p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm">{review.feedback}</p>
              <div className="flex space-x-1">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} size={16} className="text-yellow-400 fill-yellow-400" />
                ))}
              </div>
            </motion.div>
          ))}
        </div>
        <div className="mt-20 relative">
          <div className="w-full max-w-5xl mx-auto relative h-[300px]">
            <motion.img
              src="/istockphoto.jpg"
              alt="Preview"
              className="rounded-xl w-full h-full object-cover shadow-2xl"
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
            />
            <motion.img
              src="/istockphoto.jpg"
              alt="Overlay Graphic"
              className="absolute top-4 left-4 w-28 opacity-80"
              initial={{ x: -20, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              viewport={{ once: true }}
            />
            <motion.img
              src="/istockphoto.jpg"
              alt="Zoomed"
              className="absolute bottom-4 right-4 w-32 rounded-xl shadow-lg"
              initial={{ x: 20, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              viewport={{ once: true }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
