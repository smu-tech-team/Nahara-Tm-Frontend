function Newsletters() {
    const newsletters = [
        { name: "All Posts" },
        { name: "Sports News" },
        { name: "Celebrity News"},
        { name: "Politics" },
        { name: "Betting Tips" },
        { name: "Hot Gist" },
        { name: "Football News" },
        { name: "Basketball News"},
        { name: "Tennis News" },
    ];
  
    return (
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-4">Past Newsletters</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {newsletters.map((newsletter) => (
            <div key={newsletter.id} className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4">
              <h2 className="text-xl font-bold mb-2">{newsletter.title}</h2>
              <p className="text-sm text-gray-500 mb-4">{newsletter.date}</p>
              <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
                Read More
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  export default Newsletters;
  