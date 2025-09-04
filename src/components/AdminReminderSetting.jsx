import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FaClock,
  FaCommentDots,
  FaSave,
  FaTrashAlt,
  FaEdit,
  FaStopwatch,
} from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import Alerm from "/notification-9-158194.mp3";
import VibrateButton from "./VibrateButton"
import { FaBell } from "react-icons/fa";


const ReminderSettings = () => {
  const [reminders, setReminders] = useState([]);
  const [newReminderTime, setNewReminderTime] = useState(new Date());
  const [newReminderMessage, setNewReminderMessage] = useState("");
  const [editingReminderId, setEditingReminderId] = useState(null);
  const [nextReminderCountdown, setNextReminderCountdown] = useState(null);
  const [currentAlarm, setCurrentAlarm] = useState(null);
  const [alarmInterval, setAlarmInterval] = useState(null);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [audio, setAudio] = useState(null);
  const customClick = () => {
    console.log("Button clicked with vibration!");
  };


  const API_BASE = "https://nahara-production.up.railway.app"; // change if needed

  const showNotification = (message) => {
    if (Notification.permission === "granted") {
      new Notification("Reminder Alert", { body: message });
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          new Notification("Reminder Alert", { body: message });
        }
      });
    }
  };

  const playAlarmSound = () => {
    const alarmAudio = new Audio(Alerm);
    alarmAudio.loop = true;
    alarmAudio.play();
    setAudio(alarmAudio);
  };
  
  const stopAlarmSound = () => {
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
      setAudio(null);
    }
    if (alarmInterval) {
      clearInterval(alarmInterval);
      setAlarmInterval(null);
    }
    setCurrentAlarm(null);
  };

  const fetchReminders = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/reminders/get-reminders`);
      const remindersWithTriggered = res.data.map((r) => ({ ...r, triggered: false }));
      setReminders(remindersWithTriggered);
    } catch (err) {
      console.error("Error fetching reminders:", err);
    }
  };

  useEffect(() => {
    fetchReminders();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();

      setReminders((prevReminders) => {
        return prevReminders.map((reminder) => {
          const reminderTime = new Date(reminder.time);
          const timeDiff = reminderTime - now;

          if (timeDiff <= 0 && !reminder.triggered) {
            showNotification(reminder.message);
            playAlarmSound();
            setCurrentAlarm(reminder);
            return { ...reminder, triggered: true };
          }
          return reminder;
        });
      });

      const upcoming = reminders
        .filter((r) => !r.triggered && new Date(r.time) > now)
        .sort((a, b) => new Date(a.time) - new Date(b.time));

      if (upcoming.length > 0) {
        const diff = new Date(upcoming[0].time) - now;
        setNextReminderCountdown({
          hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((diff / (1000 * 60)) % 60),
          seconds: Math.floor((diff / 1000) % 60),
        });
      } else {
        setNextReminderCountdown(null);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [reminders]);

  const handleSaveReminder = async () => {
    try {
      const newReminder = { time: newReminderTime, message: newReminderMessage };
      const res = await axios.post(`${API_BASE}/api/reminders/set-reminder`, newReminder);
      setReminders((prev) => [...prev, { ...res.data, triggered: false }]);
      setNewReminderMessage("");
      setNewReminderTime(new Date());
    } catch (err) {
      console.error("Failed to save reminder:", err);
    }
  };

  const handleEditReminder = (reminder) => {
    setNewReminderTime(new Date(reminder.time));
    setNewReminderMessage(reminder.message);
    setEditingReminderId(reminder.id);
    setShowEditPopup(true);
  };

  const handleUpdateReminder = async () => {
    try {
      const updatedReminder = { time: newReminderTime, message: newReminderMessage };
      const res = await axios.put(
        `${API_BASE}/api/reminders/update-reminder/${editingReminderId}`,
        updatedReminder
      );
      setReminders((prev) =>
        prev.map((r) => (r.id === editingReminderId ? { ...res.data, triggered: false } : r))
      );
      setEditingReminderId(null);
      setShowEditPopup(false);
      setNewReminderTime(new Date());
      setNewReminderMessage("");
    } catch (err) {
      console.error("Failed to update reminder:", err);
    }
  };

  const handleClearReminder = async (id) => {
    try {
      await axios.delete(`${API_BASE}/api/reminders/delete-reminder/${id}`);
      setReminders((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      console.error("Failed to delete reminder:", err);
    }
  };

  return (
    <div className="p-5 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Reminder Settings
      </h1>

      <div className="bg-white p-6 rounded-lg shadow-lg">
        <p className="text-sm text-gray-500 border-l-4 border-blue-500 pl-4 mb-4">
          <strong>Note:</strong> Notifications work only with permission and when your browser is open.
        </p>

        <div className="mb-4">
          <label className="block text-lg font-semibold text-gray-700 mb-2">
            <FaClock className="inline mr-2 text-blue-500" /> Reminder Time
          </label>
          <DatePicker
            selected={newReminderTime}
            onChange={(date) => setNewReminderTime(date)}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={15}
            dateFormat="MMMM d, yyyy h:mm aa"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-500 focus:ring focus:ring-blue-300 focus:border-blue-500"
            minDate={new Date()}
            minTime={
              newReminderTime.toDateString() === new Date().toDateString()
                ? new Date()
                : new Date().setHours(0, 0)
            }
            maxTime={new Date().setHours(23, 59)}
          />

        </div>

        <div className="mb-4">
          <label className="block text-lg font-semibold text-gray-700 mb-2">
            <FaCommentDots className="inline mr-2 text-green-500" /> Reminder Message
          </label>
          <input
            type="text"
            value={newReminderMessage}
            onChange={(e) => setNewReminderMessage(e.target.value)}
            placeholder="Type your reminder message..."
            className="w-full px-4 py-2 border border-gray-300 text-gray-500 rounded-lg focus:ring focus:ring-blue-700 focus:border-blue-800"
          />
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between w-full gap-4">
        <VibrateButton
          onClick={customClick}
          className="flex items-center justify-center gap-2 px-5 py-3 bg-blue-800 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-transform w-full sm:w-auto"
        >
          <FaBell className="text-lg" />
          Vibrate
        </VibrateButton>

        <motion.button
          onClick={editingReminderId ? handleUpdateReminder : handleSaveReminder}
          whileHover={{ scale: 1.1 }}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-800 text-white font-bold rounded-lg shadow-lg hover:bg-blue-700 transition-transform w-full sm:w-auto"
        >
          <FaSave className="text-lg" />
          {editingReminderId ? "Save Changes" : "Save Reminder"}
        </motion.button>
      </div>

      </div>

      {nextReminderCountdown && (
        <div className="mt-6 text-center">
          <p className="text-lg font-semibold text-gray-800">
            <FaStopwatch className="inline mr-2 text-red-500" />
            Next Reminder in {nextReminderCountdown.hours}h {nextReminderCountdown.minutes}m {nextReminderCountdown.seconds}s
          </p>
        </div>
      )}

      <div className="mt-8">
        {reminders.map((reminder) => (
          <div key={reminder.id} className="mb-4 bg-gray-100 p-4 rounded-lg shadow-lg">
            <p className="text-lg text-gray-700">
              <span className="font-semibold">Time:</span> {new Date(reminder.time).toLocaleString()}
            </p>
            <p className="text-lg text-gray-700">
              <span className="font-semibold">Message:</span> {reminder.message}
            </p>

            <div className="flex gap-4 mt-2">
              <button
                onClick={() => handleEditReminder(reminder)}
                className="flex items-center gap-2 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded transition"
              >
                <FaEdit /> Edit
              </button>

              <button
                onClick={() => handleClearReminder(reminder.id)}
                className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white font-semibold rounded hover:bg-red-600 transition"
              >
                <FaTrashAlt /> Delete
              </button>
            </div>
          </div>
        ))}

        {showEditPopup && (
          <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
              <h2 className="text-xl font-semibold mb-4 text-gray-700">Edit Reminder</h2>
              <DatePicker
                selected={newReminderTime}
                onChange={(date) => setNewReminderTime(date)}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                dateFormat="MMMM d, yyyy h:mm aa"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-500 mb-4"
              />
              <input
                type="text"
                value={newReminderMessage}
                onChange={(e) => setNewReminderMessage(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-500 mb-4"
                placeholder="Edit your reminder message..."
              />
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setShowEditPopup(false)}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateReminder}
                  className="px-4 py-2 bg-blue-800 text-white rounded hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}
        {currentAlarm && (
      <div className="fixed bottom-5 right-5 z-50 bg-red-600 text-white px-6 py-3 rounded-lg shadow-lg">
        <p className="mb-2 font-semibold">Alarm: {currentAlarm.message}</p>
        <button
          onClick={stopAlarmSound}
          className="bg-white text-red-600 px-4 py-2 rounded shadow hover:bg-gray-100"
        >
          Stop Alarm
        </button>
      </div>
    )}

      </div>
    </div>
  );
};

export default ReminderSettings;
