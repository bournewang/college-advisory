import axios from 'axios';

const API_URL = 'http://127.0.0.1:5000/api';

export const startSession = async () => {
  try {
    const token = sessionStorage.getItem('token');
    if (token) 
      return
    const response = await axios.post(`${API_URL}/start_session`);
    if (response.data && response.data.token) {
      sessionStorage.setItem('token', response.data.token);
    }
    return response.data;
  } catch (error) {
    console.error('Error starting session:', error);
  }
};

export const sendMessage = async (message) => {
  try {
    const token = sessionStorage.getItem('token');
    const response = await axios.post(`${API_URL}/send_message`, { message }, {
      headers: {
        'Token': token,
      }
    });
    return response.data.messages;
  } catch (error) {
    console.error('Error sending message:', error);
  }
};

export const fetchMessages = async () => {
  try {
    const token = sessionStorage.getItem('token');
    const response = await axios.get(`${API_URL}/fetch_messages`, {
      headers: {
        'Token': token,
      },
    });
    return response.data.messages;
  } catch (error) {
    console.error('Error fetching messages:', error);
    return [];
  }
};