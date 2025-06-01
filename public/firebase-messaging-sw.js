// public/firebase-messaging-sw.js

importScripts("https://www.gstatic.com/firebasejs/10.11.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.11.0/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyBw3_0IuNz7VQY_MwN0LEUfQnlI5mxCfOw",
  authDomain: "smart-media-update.firebaseapp.com",
  projectId: "smart-media-update",
  storageBucket: "smart-media-update.firebasestorage.app",
  messagingSenderId: "292419065010",
  appId: "1:292419065010:web:5bdcd62f0430106349e5ab",
  measurementId: "G-BDXNPDTJ2B"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log('Received background message ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/firebase-logo.png',
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});