import axios from 'axios';
import { getUserRole } from './getUserRole';

const API_URL = process.env.REACT_APP_API_URL; 

export const login = async (username, password) => {
  try {
    const response = await axios.post(`${API_URL}/Auth/login`, {
      username,
      password,
    });
    const { token } = response.data;
    localStorage.setItem("authToken", token);
    const role = getUserRole(token);

    return { token, role }; 
  } catch (error) {
    console.error('Login error:', error);
    throw new Error(error.response?.data || 'Login failed');
  }
};
