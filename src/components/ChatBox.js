import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import { sendMessage } from '../api';

const ChatBox = (props) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  useEffect(() => {
  }, []);

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const sendMessageToAPI = async (message) => {
    try {
      const newMessages = await sendMessage(message);
      setMessages(newMessages);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleSend = () => {
    if (input.trim()) {
      sendMessageToAPI(input);
      setInput('');
    }
  };
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
        handleSend();
    }
  };
  return (
    <div className="chat-box">
      <div className="messages">
        {messages.map((message, index) => (
          <div key={index} className={`message-container ${message.sender}`}>
            {message.sender === 'user' ? (
              <>
                <div className="message user">{message.text}</div>
                <div className="user-icon">👧</div>
              </>
            ) : (
              <>
                <div className="bot-icon">👨‍🏫</div>
                <div className="message bot">
                  <ReactMarkdown 
                    children={message.text} 
                    remarkPlugins={[remarkGfm]} 
                    rehypePlugins={[rehypeRaw]} 
                  />
                  {/* {message.text} */}
                  </div>
              </>
            )}
          </div>
        ))}
      </div>
      <div className="input-area">
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder="Type your message"
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};

export default ChatBox;
