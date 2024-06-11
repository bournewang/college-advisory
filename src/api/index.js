import axios from 'axios';

const API_URL = 'http://127.0.0.1:5000/api';

export const startSession = async () => {
  try {
    const response = await axios.post(`${API_URL}/start_session`);
    if (response.data && response.data.session_id) {
      sessionStorage.setItem('session_id', response.data.session_id);
    }
    return response.data;
  } catch (error) {
    console.error('Error starting session:', error);
  }
};

export const sendMessage = async (message) => {
  try {
    // const session_id = sessionStorage.getItem('session_id');
    const response = await axios.post(`${API_URL}/send_message`, { message }, {
      headers: {
        // 'Session-Id': session_id,
      }
    });
    return response.data.messages;
  } catch (error) {
    console.error('Error sending message:', error);
  }
};
