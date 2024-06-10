import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { startSession } from '../api';

const HomePage = () => {
  const [question, setQuestion] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setQuestion(e.target.value);
  };

  const handleSubmit = async () => {
    if (question.trim()) {
      try {
        const sessionId = await startSession();
        navigate('/chat', { state: { question, sessionId } });
      } catch (error) {
        console.error('Error starting session:', error);
      }
    }
  };

  return (
    <div className="home-page">
      <h2>Welcome to College Advisory</h2>
      <input
        type="text"
        value={question}
        onChange={handleInputChange}
        placeholder="Enter your question"
      />
      <button onClick={handleSubmit}>Ask</button>
    </div>
  );
};

export default HomePage;
