

export const initializeOneSignal = () => {
  if (window.OneSignal) {
      window.OneSignalDeferred = window.OneSignalDeferred || [];
      window.OneSignalDeferred.push(async function (OneSignal) {
          console.log("Initializing OneSignal...");
          await OneSignal.init({
              appId: "ef870620-92b6-44b0-969b-0463f0d05995", // Your App ID
              safari_web_id: "web.onesignal.auto.2465995d-af39-44d0-9727-0f4afeb298e1", // Safari Web ID
              notifyButton: {
                  enable: true, // Enable the notification prompt button
              },
          });
          console.log("OneSignal initialized successfully!");
      });
  } else {
      console.error("OneSignal is not available.");
  }
};
