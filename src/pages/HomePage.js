import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { startSession } from '../api';
import config from '../config'; // Import the config
import './HomePage.css';

const hotTopics = [
  '如何合理填报志愿',
  '2024热门专业',
  '2024年热门专业的就业前景分析',
  '2024年计算机专业全国院校排行',
  '2024年人工智能专业院校排行',
  '张雪峰老师热门推荐专业'
  // '最新高校排名发布',
  // '如何科学合理地填报志愿',
  // 其他话题...
];

const HomePage = () => {
  const [question, setQuestion] = useState('');
  const [hotLinks, setHotLinks] = useState([]);
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

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="home-page">
      <header className="home-header">
        <h1>{config.siteName}</h1> {/* Use the site name from config */}
        <p>Get expert advice on your college applications</p>
      </header>
      <div className="question-section">
        <input
          type="text"
          value={question}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder="Enter your question"
        />
        <button onClick={handleSubmit}>Ask</button>
      </div>
      <div className="hot-links">
        <div className="hot-links-grid">
          {hotTopics.map((topic) => (
            <div key={topic} className="hot-link-card">
              {/* <h2> */}
                <Link to={`/hot-topic/${encodeURIComponent(topic)}`}>{topic}</Link>
              {/* </h2> */}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
