import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import './HotTopicPage.css';

const HotTopicPage = () => {
  const { topic } = useParams();
  const [content, setContent] = useState('');

  useEffect(() => {
    const fetchTopicContent = async () => {
      try {
        const response = await axios.get(`${process.env.PUBLIC_URL}/topics/${decodeURIComponent(topic)}.md`);
        setContent(response.data);
      } catch (error) {
        console.error('Error fetching topic content:', error);
      }
    };

    fetchTopicContent();
  }, [topic]);

  return (
    <div className="hot-topic-page">
      {/* <h1>{decodeURIComponent(topic)}</h1> */}
      <ReactMarkdown 
        children={content} 
        remarkPlugins={[remarkGfm]} 
        rehypePlugins={[rehypeRaw]} 
      />
    </div>
  );
};

export default HotTopicPage;
