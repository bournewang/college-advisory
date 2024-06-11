import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import HotTopicPage from './pages/HotTopicPage';
import ChatPage from './pages/ChatPage';
import './App.css';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/hot-topic/:topic" element={<HotTopicPage />} />
        <Route path="/chat" element={<ChatPage />} />
      </Routes>
    </Router>
  );
};

export default App;
