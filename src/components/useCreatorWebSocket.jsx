import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { useEffect, useRef } from "react";

const useCreatorWebSocket = (creatorId, onNewMessage) => {
  const stompClientRef = useRef(null); // Use ref to retain the stompClient instance

  useEffect(() => {
    const socket = new SockJS("https://nahara-production.up.railway.app/ws-reminder");
    const stompClient = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      onConnect: () => {
        console.log("WebSocket connected");

        // Subscribe to creator-specific queue
        stompClient.subscribe(`/queue/creator/${creatorId}`, (message) => {
          const data = JSON.parse(message.body);
          onNewMessage(data); // Handle incoming message
        });
      }
    });

    stompClient.activate();
    stompClientRef.current = stompClient;

    return () => {
      stompClient.deactivate();
      stompClientRef.current = null; // Clear the reference
    };
  }, [creatorId, onNewMessage]);

  const sendMessage = (message) => {
    if (stompClientRef.current?.connected) {
      stompClientRef.current.publish({
        destination: `/api/creator/`, // Adjust this to match your backend mapping
        body: JSON.stringify(message),
      });
    } else {
      console.error("WebSocket is not connected. Unable to send message.");
    }
  };

  return sendMessage; // Return the sendMessage function
};

export default useCreatorWebSocket;
