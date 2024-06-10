import axios from 'axios';

const API_URL = 'http://127.0.0.1:5000/api';

export const startSession = async () => {
  try {
    const response = await axios.post(`${API_URL}/start_session`);
    return response.data.session_id;
  } catch (error) {
    console.error('Error starting session:', error);
    throw error;
  }
};

export const sendMessage = async (sessionId, message) => {
  try {
    const response = await axios.post(`${API_URL}/send_message`, {
      session_id: sessionId,
      message,
    });
    return response.data.messages;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};
