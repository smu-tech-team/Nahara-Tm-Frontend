import React, { useState } from "react";

const EmailSubscription = () => {
  const [email, setEmail] = useState("");
  const [frequency, setFrequency] = useState("daily");

  const handleSubscribe = async () => {
    try {
      const response = await fetch("http://localhost:8087/api/subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, frequency }),
      });
  
      const data = await response.text();
      alert(data);
    } catch (err) {
      alert("Subscription failed. Try again.");
      console.error(err);
    }
  };
  

  return (
    <div className="mt-10 bg-white dark:bg-gray-800 rounded-xl p-6 shadow text-center">
      <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">Stay Updated</h3>
      <p className="text-sm mb-4 text-gray-600 dark:text-gray-400">Get daily or weekly market updates via email from N-Market.</p>
      <input
        type="email"
        placeholder="Your email"
        className="border rounded p-2 w-full mb-2"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <select
        value={frequency}
        onChange={(e) => setFrequency(e.target.value)}
        className="border rounded p-2 w-full mb-2"
      >
        <option value="daily">Daily</option>
        <option value="weekly">Weekly</option>
      </select>
      <button onClick={handleSubscribe} className="bg-blue-600 text-white px-4 py-2 rounded">
        Subscribe
      </button>
    </div>
  );
};

export default EmailSubscription;
