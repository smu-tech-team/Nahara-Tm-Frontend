// ChatRoom.jsx
import React, { useState, useEffect, useRef } from "react";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import axios from "axios";

import MessageList from "../components/MessageList";
import TypingIndicator from "../components/TypingIndicator";
import ReplyBox from "../components/ReplyBox";
import MessageInput from "../components/MessageInput";
import ChatRoomBannerAds from "../components/ChatRoomBannerAds";

const fetchFullUserProfile = async (userId, role) => {
  const endpointMap = {
    USER: `/api/user/getUser/${userId}`,
    CREATOR: `/api/user/creator/${userId}`,
    ADMIN: `/api/user/admin/${userId}`,
  };
  try {
    const res = await axios.get(endpointMap[role]);
    return res.data;
  } catch (err) {
    console.error("❌ Failed to fetch user profile:", err);
    return null;
  }
};

const ChatRoom = ({ postSlug, user: initialUser }) => {
  const [user, setUser] = useState(() => {
    if (!initialUser || typeof initialUser !== "object") {
      return { id: "guest", role: "GUEST", userName: "Guest" };
    }
    return initialUser;
  });

  const sessionId = postSlug;
  const [messages, setMessages] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [replyTo, setReplyTo] = useState(null);
  const [page, setPage] = useState(0);
  const [loadingOlder, setLoadingOlder] = useState(false);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const [inputValue, setInputValue] = useState("");

  const stompClientRef = useRef(null);
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    const enhanceUser = async () => {
      if (user?.id && user?.role && user.role !== "GUEST") {
        const fullUser = await fetchFullUserProfile(user.id, user.role);
        if (fullUser) {
          setUser((prev) => ({ ...prev, ...fullUser }));
        }
      }
    };
    enhanceUser();
  }, [user.id, user.role]);

  const fetchMessages = async (pageNum = 0) => {
    try {
      const res = await axios.get(
        `http://localhost:8087/api/v1/chats/history/${sessionId}?page=${pageNum}&size=20`
      );
      const data = res.data;
      const orderedMessages = data?.messages || [];
      const hasMore = data?.hasNext ?? false;
      return { messages: orderedMessages, hasMore };
    } catch (err) {
      console.error("Failed to fetch chat history:", err);
      return { messages: [], hasMore: false };
    }
  };
const groupMessagesWithReplies = (flatMessages) => {
  const messageMap = new Map();
  const childrenSet = new Set();
  const roots = [];

  // Build message map
  flatMessages.forEach((msg) => {
    messageMap.set(msg.id, { ...msg, replies: [] });
  });

  // Attach replies to parents
  flatMessages.forEach((msg) => {
    if (msg.repliedToMessageId && messageMap.has(msg.repliedToMessageId)) {
      const parent = messageMap.get(msg.repliedToMessageId);
      parent.replies.push(messageMap.get(msg.id));
      childrenSet.add(msg.id); // mark this as child
    }
  });

  // Only keep root messages
  flatMessages.forEach((msg) => {
    if (!childrenSet.has(msg.id)) {
      roots.push(messageMap.get(msg.id));
    }
  });

  return roots;
};

  useEffect(() => {
    if (!sessionId) return;

    const socket = new SockJS("http://localhost:8087/ws-chat");
    const stompClient = Stomp.over(socket);

    stompClient.connect({}, async () => {
      stompClientRef.current = stompClient;
      setIsConnected(true);

      const { messages: olderMessages, hasMore } = await fetchMessages(page);
      if (olderMessages.length === 0) {
        setHasMoreMessages(false);
      } else {
        setMessages((prev) => [...olderMessages, ...prev]);
        setPage((prev) => prev + 1);
        setHasMoreMessages(hasMore);
        setTimeout(() => {
          const container = scrollContainerRef.current;
          if (container) container.scrollTop = container.scrollHeight;
        }, 50);
      }

      stompClient.subscribe(`/topic/chat/${sessionId}`, (msg) => {
        const data = JSON.parse(msg.body);
        setMessages((prev) => {
          const exists = prev.some((m) => m.id === data.id);
          if (data.isEdit && exists) {
            return prev.map((m) => (m.id === data.id ? data : m));
          }
          if (exists && !data.isEdit) return prev;
          return [...prev, data];
        });

        setTimeout(() => {
          const container = scrollContainerRef.current;
          if (container) container.scrollTop = container.scrollHeight;
        }, 50);
      });

      stompClient.subscribe(`/topic/chat/${sessionId}/typing`, (msg) => {
        const { user: typingUser } = JSON.parse(msg.body);
        if (typingUser?.id !== user?.id) {
          setTypingUsers((prev) => {
            const newSet = new Set(prev);
            newSet.add(typingUser.userName);
            return Array.from(newSet);
          });
          setTimeout(() => {
            setTypingUsers((prev) =>
              prev.filter((u) => u !== typingUser.userName)
            );
          }, 3000);
        }
      });
    });

    return () => {
      if (stompClientRef.current) {
        stompClientRef.current.disconnect(() => setIsConnected(false));
      }
    };
  }, [sessionId, user.id]);

  const loadMore = async () => {
    if (loadingOlder || !hasMoreMessages) return;

    setLoadingOlder(true);
    const container = scrollContainerRef.current;
    const previousHeight = container?.scrollHeight || 0;

    const { messages: olderMessages, hasNext } = await fetchMessages(page + 1);

    if (olderMessages.length === 0) {
      setHasMoreMessages(false);
    } else {
      setMessages((prev) => [...olderMessages, ...prev]);
      setPage((prev) => prev + 1);
      setHasMoreMessages(hasNext);

      setTimeout(() => {
        if (container) {
          const newHeight = container.scrollHeight;
          container.scrollTop = newHeight - previousHeight;
        }
      }, 0);
    }

    setLoadingOlder(false);
  };

  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (!container || loadingOlder || !hasMoreMessages) return;
    if (container.scrollTop < 100) {
      loadMore();
    }
  };

  const sendMessage = (message) => {
    if (!stompClientRef.current || !isConnected) return;

    if (editingMessageId) {
      stompClientRef.current.send(
        `/app/chat/${sessionId}/edit`,
        {},
        JSON.stringify({ id: editingMessageId, content: message.content })
      );
      setEditingMessageId(null);
      setInputValue("");
    } else {
      stompClientRef.current.send(
        `/app/chat/${sessionId}`,
        {},
        JSON.stringify(message)
      );
      setInputValue("");
    }
  };

  const deleteMessage = (messageId) => {
    if (!stompClientRef.current || !isConnected) return;
    stompClientRef.current.send(
      `/app/chat/${sessionId}/delete`,
      {},
      JSON.stringify({ id: messageId })
    );
  };

  const notifyTyping = () => {
    if (!stompClientRef.current || !isConnected) return;
    stompClientRef.current.send(
      `/app/chat/${sessionId}/typing`,
      {},
      JSON.stringify({ user })
    );
  };

  return (
    <div className="flex flex-col h-screen sm:h-auto p-2 sm:p-4 w-full sm:max-w-5xl mx-auto">
      <ChatRoomBannerAds />
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 bg-white dark:bg-gray-800 rounded-xl shadow-md p-2 sm:p-4 overflow-y-auto relative break-words"
      >
        <MessageList
          messages={groupMessagesWithReplies(messages)}
          currentUserId={user.id}
          onReply={setReplyTo}
          onEdit={(msg) => {
            setInputValue(msg.content);
            setEditingMessageId(msg.id);
          }}
          onDelete={deleteMessage}
          currentUserName={user.userName || user.name || "You"}
        />
        <TypingIndicator typingUsers={typingUsers} />
      </div>
      <ReplyBox replyTo={replyTo} onCancel={() => setReplyTo(null)} />
      <MessageInput
        user={user}
        sessionId={sessionId}
        replyTo={replyTo}
        editingMessageId={editingMessageId}
        onCancelEdit={() => setEditingMessageId(null)}
        onSend={sendMessage}
        onTyping={notifyTyping}
        clearReply={() => setReplyTo(null)}
        inputValue={inputValue}
        setInputValue={setInputValue}
      />
    </div>
  );
};

export default ChatRoom;
