import React from 'react';
import { useLocation } from 'react-router-dom';
import ChatBox from '../components/ChatBox';

const ChatPage = () => {
  const location = useLocation();
  const initialQuestion = location.state?.question || '';

  return (
    <div className="chat-page">
      <ChatBox initialQuestion={initialQuestion} />
    </div>
  );
};

export default ChatPage;
