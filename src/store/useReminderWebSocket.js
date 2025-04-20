import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { useEffect } from 'react';

const useReminderWebSocket = (onNewReminder) => {
  useEffect(() => {
    const socket = new SockJS('http://localhost:8087/ws-reminder'); // replace 8080 with your backend port
    const stompClient = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      onConnect: () => {
        console.log("Connected to WebSocket");

        stompClient.subscribe('/topic/reminders', (message) => {
          const reminder = JSON.parse(message.body);
          onNewReminder(reminder); 
        });
      }
    });

    stompClient.activate();

    return () => {
      stompClient.deactivate();
    };
  }, []);
};

export default useReminderWebSocket;
