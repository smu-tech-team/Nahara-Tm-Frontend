import React, { useEffect, useState } from "react";
import { fetchSuspensionData } from "../components/fetchSuspensionData";
import {
  ShieldExclamationIcon,
  ClockIcon,
  BookOpenIcon,
  MicrophoneIcon,
  NewspaperIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon
} from "@heroicons/react/24/outline";
import { useParams } from "react-router-dom";

const SuspensionNotice = () => {
  const [suspensionData, setSuspensionData] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    if (!id) return;
    fetchSuspensionData(id, setSuspensionData);
  }, [id]);

  useEffect(() => {
    if (!suspensionData) return;

    const updateCountdown = () => {
      const now = new Date();
      const end = new Date(suspensionData.suspensionEndDate);
      const diff = end - now;

      if (diff <= 0) return null;

      return {
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / 1000 / 60) % 60),
        seconds: Math.floor((diff / 1000) % 60)
      };
    };

    setTimeLeft(updateCountdown());

    const interval = setInterval(() => {
      const countdown = updateCountdown();
      if (!countdown) {
        clearInterval(interval);
        return;
      }
      setTimeLeft(countdown);
    }, 1000);

    return () => clearInterval(interval);
  }, [suspensionData]);

  if (!suspensionData || !timeLeft) {
    return (
      <section className="flex justify-center items-center min-h-[40vh] mt-12 text-gray-600">
        <InformationCircleIcon className="w-7 h-7 mr-2 animate-pulse" />
        <span className="text-lg font-medium">Loading suspension notice...</span>
      </section>
    );
  }

  const { suspensionEndDate, reason } = suspensionData;

  return (
    <main className="bg-yellow-50 border border-yellow-300 shadow-lg rounded-3xl p-8 max-w-5xl mx-auto mt-12 mb-12
      flex flex-col gap-8
      sm:p-12
      ">
      <header className="flex flex-col items-center gap-4">
        <ShieldExclamationIcon className="w-14 h-14 text-yellow-600 animate-pulse" />
        <h1 className="text-4xl font-extrabold text-yellow-900 text-center leading-tight drop-shadow-md">
          Your Account is Suspended
        </h1>
        <p className="max-w-xl text-center text-gray-700 text-lg font-medium leading-relaxed">
          This suspension is temporary. You&apos;re allowed to access limited features until the suspension is lifted.
        </p>
      </header>
      <section
        aria-label="Suspension Illustration"
        className="bg-white border border-yellow-200 rounded-xl p-6 flex justify-center shadow-sm"
      >
        <img
          src="/Copilot.png"
          alt="Suspension Illustration"
          className="w-48 h-48 object-contain"
          loading="lazy"
        />
      </section>
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
        <div className="bg-white border border-yellow-200 rounded-xl p-6 shadow-inner flex flex-col items-center justify-center">
          <p className="text-yellow-700 font-semibold text-lg mb-1">📅 Suspension Ends</p>
          <time
            dateTime={new Date(suspensionEndDate).toISOString()}
            className="text-yellow-900 font-bold text-xl"
          >
            {new Date(suspensionEndDate).toLocaleString()}
          </time>
        </div>
        <div
          className="bg-yellow-100 border-l-8 border-yellow-500 rounded-xl p-6 shadow-inner flex flex-col items-center justify-center"
          role="timer"
          aria-live="polite"
        >
          <ClockIcon className="w-8 h-8 text-yellow-600 mb-2 animate-pulse" />
          <p className="text-yellow-900 font-semibold text-xl">
            Time Remaining
          </p>
          <p className="mt-1 text-yellow-800 font-mono text-2xl tracking-widest select-none">
            {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
          </p>
        </div>

        {/* Allowed Actions While Suspended */}
        <div className="bg-white border border-yellow-200 rounded-xl p-6 shadow-inner">
          <p className="text-yellow-900 font-semibold text-lg mb-3">While Suspended, You Can Still:</p>
          <ul className="flex flex-col gap-4 justify-center items-center">
            <li className="flex items-center gap-3 text-gray-700 hover:text-yellow-600 transition-colors">
              <NewspaperIcon className="w-7 h-7" />
              <span className="font-medium text-lg">Read News</span>
            </li>
            <li className="flex items-center gap-3 text-gray-700 hover:text-yellow-600 transition-colors">
              <MicrophoneIcon className="w-7 h-7" />
              <span className="font-medium text-lg">Listen to Podcasts</span>
            </li>
            <li className="flex items-center gap-3 text-gray-700 hover:text-yellow-600 transition-colors">
              <BookOpenIcon className="w-7 h-7" />
              <span className="font-medium text-lg">Read Ebooks</span>
            </li>
          </ul>
        </div>
      </section>

      {/* Suspension Reason */}
      {reason && (
        <section
          className="bg-white border border-gray-300 rounded-xl p-6 shadow-md max-w-4xl mx-auto"
          aria-label="Suspension Reason"
        >
          <h2 className="text-gray-900 font-bold text-2xl mb-3 text-center">Suspension Reason</h2>
          <p className="text-gray-700 text-center text-lg leading-relaxed">{reason}</p>
        </section>
      )}

      {/* Final Warning */}
      <section
        className="bg-red-50 border border-red-300 rounded-xl p-6 shadow-md max-w-4xl mx-auto flex flex-col items-center gap-4"
        aria-live="assertive"
      >
        <ExclamationTriangleIcon className="w-10 h-10 text-red-600 animate-pulse" />
        <p className="text-red-800 font-semibold text-lg text-center leading-snug max-w-xl">
          Warning: If you violate the community guidelines again, your account may be permanently banned.
        </p>
      </section>

      {/* Footer Note */}
      <footer className="max-w-3xl mx-auto text-center text-gray-600 italic text-md leading-relaxed">
        This measure helps protect our community and maintain a safe and respectful environment for everyone.
      </footer>
    </main>
  );
};

export default SuspensionNotice;
