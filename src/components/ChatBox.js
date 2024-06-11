import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import { sendMessage, fetchMessages } from '../api';
import "./ChatBox.css";

const ChatBox = (props) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const initSession = async () => {
      // const session = await startSession();
      // if (session && session.session_id) {
      const fetchedMessages = await fetchMessages();
      setMessages(fetchedMessages);
      // }
    };
    initSession();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
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

  const handleSend = async () => {
    if (input.trim() === '') return;
    
    const userMessage = { role: 'user', content: input };
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInput('');
    setLoading(true);
    console.log("set loading true");

    // sendMessageToAPI(input);
    // setInput('');
    // console.log("send message end, set loading false")
    // setLoading(false);

    try {
      const messages = await sendMessage(input);
      // if (response && response.messages) {
      setMessages(messages);
      // }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setLoading(false);
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
          <div key={index} className={`message-container ${message.role}`}>
            {message.role === 'user' ? (
              <>
                <div className="message user">{message.content}</div>
                <div className="user-icon">👧</div>
              </>
            ) : (
              <>
                <div className="bot-icon">👨‍🏫</div>
                <div className="message bot">
                  <ReactMarkdown 
                    children={message.content} 
                    remarkPlugins={[remarkGfm]} 
                    rehypePlugins={[rehypeRaw]} 
                  />
                  {/* {message.text} */}
                  </div>
              </>
            )}
          </div>
        ))}
        {loading && <div className="loading-spinner">💭 正在思考。。。</div>}
        <div ref={messagesEndRef} />
      </div>
      <div className="input-area">
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder="输入您的问题..."
        />
        <button onClick={handleSend}>发送</button>
      </div>
    </div>
  );
};

export default ChatBox;
