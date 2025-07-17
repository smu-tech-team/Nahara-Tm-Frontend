import { useParams } from "react-router-dom";
import ChatRoom from "../podcast/LiveChatRoom";
import useAuthStore from "../store/authStore";

const LiveChatRoomWrapper = () => {
  const { sessionId, type } = useParams(); 
  const { user } = useAuthStore();

  if (!sessionId || !type) return <div>Invalid chat session</div>;

  return (
    <ChatRoom
      postSlug={sessionId} 
      user={user || { id: "guest", role: "GUEST", userName: "Guest" }}
      type={type}           
    />
  );
};

export default LiveChatRoomWrapper;
