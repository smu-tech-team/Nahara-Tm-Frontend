import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const chartData = [
  { name: 'Week 1', followers: 120, earnings: 50, posts: 2 },
  { name: 'Week 2', followers: 300, earnings: 120, posts: 5 },
  { name: 'Week 3', followers: 550, earnings: 220, posts: 7 },
  { name: 'Week 4', followers: 800, earnings: 400, posts: 10 },
];

export default function CreatorGrowthChart() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-950">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Your Growth, Visualized
        </h2>
        <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto">
          See how Nahara helps you grow in real numbers — content reach, audience engagement, and revenue.
        </p>

        <div className="w-full h-[300px] sm:h-[350px] md:h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
              barCategoryGap="15%"
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
              <XAxis dataKey="name" stroke="#8884d8" fontSize={12} />
              <YAxis stroke="#8884d8" fontSize={12} />
              <Tooltip />
              <Bar dataKey="followers" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="earnings" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="posts" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}
