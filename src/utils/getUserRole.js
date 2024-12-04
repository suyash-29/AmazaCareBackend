import {jwtDecode} from 'jwt-decode'; 

export const getUserRole = (token) => {
  try {
    const decoded = jwtDecode(token);
    const roleKey = process.env.REACT_APP_ROLE_CLAIM;

    const userRole = decoded[roleKey];
    console.log(`User role: ${userRole}`);
    return userRole;
  } catch (error) {
    console.error('Failed to decode token:', error);
    throw new Error('Invalid token');
  }
};

