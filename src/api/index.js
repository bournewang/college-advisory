import axios from 'axios';
import config from "../config";

// const config.apiUrl = 'http://127.0.0.1:5000/api';
// const config.apiUrl = "https://college-advisory.dt.r.appspot.com/api";

export const startSession = async () => {
  try {
    const token = sessionStorage.getItem('token');
    const response = await axios.post(`${config.apiUrl}/start_session`, {}, {
      headers: {
        'Token': token,
      }
    });
    if (response.data && response.data.token && response.data.token !== token) {
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
    const response = await axios.post(`${config.apiUrl}/send_message`, { message }, {
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
    const response = await axios.get(`${config.apiUrl}/fetch_messages`, {
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