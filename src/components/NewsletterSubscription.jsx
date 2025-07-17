import React, { useEffect, useState } from "react";
import axios from "axios";

const NewsletterSubscription = () => {
  const [isSubscribed, setIsSubscribed] = useState(
    JSON.parse(localStorage.getItem("isSubscribed")) || false
  );
  const [subscriptionData, setSubscriptionData] = useState({
    name: "",
    email: "",
    preferences: "",
  });
  const [subscriptionMessage, setSubscriptionMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  // Fetch Subscription Status
  useEffect(() => {
    const fetchSubscriptionStatus = async () => {
      try {
        const savedEmail = localStorage.getItem("subscribedEmail");
        if (!savedEmail) return;

        const response = await axios.get(
          `http://localhost:8087/api/subscribers/status?email=${savedEmail}`
        );

        setIsSubscribed(response.data.isSubscribed);
        localStorage.setItem(
          "isSubscribed",
          JSON.stringify(response.data.isSubscribed)
        );
      } catch (error) {
        console.error(
          "Error fetching subscription status:",
          error.response?.data || error.message
        );
      }
    };

    fetchSubscriptionStatus();
  }, []);

  // Handle Subscribe
  const handleSubscribe = async (data) => {
    try {
      setLoading(true);
      const response = await axios.post(
        `http://localhost:8087/api/subscribers/subscribe`,
        data
      );
  
      if (response.status === 200) {
        localStorage.setItem("isSubscribed", "true");
        localStorage.setItem("subscribedEmail", data.email);
        setIsSubscribed(true);
        setSubscriptionData(data);
        setSubscriptionMessage("Thank you for subscribing!");
      }
    } catch (error) {
      console.error("Subscription failed:", error);
      if (
        error.response &&
        error.response.data.message === "Email is already subscribed."
      ) {
        setSubscriptionMessage("This email is already subscribed.");
      } else {
        setSubscriptionMessage("Subscription failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };
  

  // Handle Unsubscribe
  const handleUnsubscribe = async () => {
    try {
      setLoading(true);
      const savedEmail = localStorage.getItem("subscribedEmail");
      if (!savedEmail) {
        setSubscriptionMessage("No subscribed email found.");
        return;
      }

      await axios.delete(
        `http://localhost:8087/api/subscribers/unsubscribe?email=${savedEmail}`
      );

      localStorage.removeItem("isSubscribed");
      localStorage.removeItem("subscribedEmail");

      setIsSubscribed(false);
      setSubscriptionData({ name: "", email: "", preferences: "" });
      setSubscriptionMessage("You have successfully unsubscribed.");
    } catch (error) {
      console.error(
        "Unsubscription failed:",
        error.response ? error.response.data : error.message
      );
      setSubscriptionMessage("Unsubscription failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-sm mx-auto p-6 bg-white shadow-black dark:bg-black dark:shadow-white rounded-lg shadow-md md:max-w-md">
      <h3 className="text-xl font-bold text-center mb-4">📩 Stay Updated</h3>
      <p className="text-center text-gray-500 dark:text-gray-400 mb-6">
        Subscribe to our newsletter and never miss an update.
      </p>

      {!isSubscribed ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubscribe(subscriptionData);
          }}
          className="space-y-4"
        >
          <div>
            <label className="block text-sm font-medium">Name</label>
            <input
              type="text"
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-800 focus:outline-none text-black dark:text-white dark:bg-gray-700"
              value={subscriptionData.name}
              onChange={(e) =>
                setSubscriptionData({
                  ...subscriptionData,
                  name: e.target.value,
                })
              }
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-800 text-black dark:text-white focus:outline-none dark:bg-gray-700"
              value={subscriptionData.email}
              onChange={(e) =>
                setSubscriptionData({
                  ...subscriptionData,
                  email: e.target.value,
                })
              }
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Preferences</label>
            <input
              type="text"
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-800 focus:outline-none text-black dark:text-white dark:bg-gray-700"
              placeholder="E.g., Sports, Tech, Business"
              value={subscriptionData.preferences}
              onChange={(e) =>
                setSubscriptionData({
                  ...subscriptionData,
                  preferences: e.target.value,
                })
              }
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-800 text-white py-2 px-3 rounded-md hover:bg-blue-800 transition"
            disabled={loading}
          >
            {loading ? "Subscribing..." : "Subscribe"}
          </button>
        </form>
      ) : (
        <>
          <button
            onClick={() => setShowPopup(true)}
            className="w-full bg-red-500 text-white py-2 px-3 rounded-md hover:bg-red-600 transition"
            disabled={loading}
          >
            {loading ? "Unsubscribing..." : "Unsubscribe"}
          </button>

          {showPopup && (
            <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-sm w-full">
                <h3 className="text-lg font-bold mb-4 text-gray-800 dark:text-white">
                  Are you sure you want to unsubscribe?
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
                  By unsubscribing, you will no longer receive updates and
                  newsletters from us. Stay connected with the latest news by
                  staying subscribed!
                </p>
                <div className="flex justify-end gap-4">
                  <button
                    onClick={() => setShowPopup(false)}
                    className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      handleUnsubscribe();
                      setShowPopup(false);
                    }}
                    className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition"
                  >
                    OK
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {subscriptionMessage && (
        <p className="mt-4 text-center text-green-500">{subscriptionMessage}</p>
      )}
    </div>
  );
};

export default NewsletterSubscription;
