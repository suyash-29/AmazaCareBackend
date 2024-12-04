import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const getAppointmentsByStatus = async (status) => {
  try {
    const response = await axiosInstance.get(`/Doctor/GetAppointmentsByStatus`, {
      params: { status },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching appointments by status:', error);
    return []; 
  }
};

export const cancelAppointment = async (appointmentId) => {
  try {
    await axiosInstance.put(`/Doctor/CancelAppointment/${appointmentId}/cancel`);
    
  } catch (error) {
    console.error('Error canceling appointment:', error);
    throw error;
  }
};

export const approveAppointment = async (appointmentId) => {
  try {
    await axiosInstance.put(`/Doctor/ApproveAppointment/${appointmentId}/approve`);
  } catch (error) {
    console.error("Error approving appointment:", error);
    throw error; 
  }
};



export const rescheduleAppointment = async (appointmentId, rescheduleData) => {
    try {
      const response = await axiosInstance.put(
        `/Doctor/RescheduleAppointment/${appointmentId}`,
        rescheduleData
      );
      
      return response;
    } catch (error) {
      console.error('Error rescheduling appointment:', error);
      throw error;
    }
  };

  export const getMedications = async () => {
    try {
      const response = await axios.get(`${API_URL}/Doctor/GetAllMedications`);
      return response.data;
    } catch (error) {
      console.error('Error fetching medications:', error);
      throw error;
    }
  };
  
  export const getTests = async () => {
    try {
      const response = await axios.get(`${API_URL}/Doctor/GetAllTests`);
      return response.data;
    } catch (error) {
      console.error('Error fetching tests:', error);
      throw error;
    }
  };
  
  export const conductConsultation = async (appointmentId, recordDto, consultationFee) => {
    try {
      const response = await axios.post(`${API_URL}/Doctor/appointments/${appointmentId}/consult`, recordDto, {
        params: { consultationFee },
      });
      return response.data;
    } catch (error) {
      console.error('Error conducting consultation:', error);
      throw error;
    }
  };
  