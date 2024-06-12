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
];

const HomePage = () => {
  const navigate = useNavigate();

  const handleButtonClick = async () => {
    await startSession();
    navigate('/chat');
  };
  return (
    <div className="home-page">
      <header className="home-header">
        <h1>{config.siteName}</h1> {/* Use the site name from config */}
        <p>{config.slogon}</p>
      </header>
      <div className="question-section">
        <button className="ask-button" onClick={handleButtonClick}>
          咨询 GPT-4o
        </button>
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
