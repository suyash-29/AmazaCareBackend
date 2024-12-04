// /src/api/patient/patientAPI.js

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

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);
//------------------------------------------------------------------------------------//
export const getPersonalInfo = async () => {
  try {
    const response = await axiosInstance.get('/Patient/GetPersonalInfo');
    return response.data;
  } catch (error) {
    throw error.response?.data || 'Error fetching personal info';
  }
};

export const updatePersonalInfo = async (updateDto) => {
  try {
    const response = await axiosInstance.put('/Patient/UpdatePersonalInfo', updateDto);
    return response.data;
  } catch (error) {
    throw error.response?.data || 'Error updating personal info';
  }
};

export const checkUsernameAvailability = async (username) => {
  try {
    const response = await axiosInstance.get(`/Patient/check-username?username=${username}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || 'Error checking username availability';
  }
};


export const getDoctorsBySpecialization = async (specialization = null) => {
    try {
      const response = await axiosInstance.get(
        `/Patient/SearchDoctors${specialization ? `?specialization=${specialization}` : ''}`
      );
      return response.data;
    } catch (error) {
      console.error('API Error:', error);
      throw error.response?.data || 'Error fetching doctors';
    }
  };

//   export const getMedicalHistory = async () => {
//     const response = await axiosInstance.get('/GetMedicalHistory');
//     return response.data;
// };

export const getMedicalHistory = async () => {
    try {
      const response = await axiosInstance.get('/Patient/GetMedicalHistory');
      console.log('API Call: GET /GetMedicalHistory');
      console.log('API Response:', response.data); 
      return response.data;
    } catch (error) {
      console.error('Error fetching medical history:', error);
      throw error.response?.data || 'Error fetching medical history';
    }
  };
  

  // Appointment APIs
// export const scheduleAppointment = async (bookingDto) => {
//   try {
//     console.log('API Call: POST /ScheduleAppointment');
//     console.log('Payload:', bookingDto);
//     const response = await axiosInstance.post('/ScheduleAppointment', bookingDto);
//     console.log('API Response:', response.data);
//     return response.data;
//   } catch (error) {
//     console.error('Error scheduling appointment:', error);
//     throw error.response?.data || 'Error scheduling appointment';
//   }
// };

export const scheduleAppointment = async (appointmentData) => {
  const response = await axiosInstance.post('/Patient/ScheduleAppointment', appointmentData);
  return response.data;
};

export const getAppointments = async () => {
  try {
    console.log('API Call: GET /Patient/GetAppointments');
    const response = await axiosInstance.get('/Patient/GetAppointments');
    console.log('API Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching appointments:', error);
    throw error.response?.data || 'Error fetching appointments';
  }
};

export const cancelAppointment = async (appointmentId) => {
  try {
    console.log(`API Call: POST /Patient/CancelAppointment/${appointmentId}`);
    const response = await axiosInstance.post(`/Patient/CancelAppointment/${appointmentId}`);
    console.log('API Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error canceling appointment:', error);
    throw error.response?.data || 'Error canceling appointment';
  }
};

export const rescheduleAppointment = async (appointmentId, rescheduleDto) => {
  try {
    console.log(`API Call: PUT /RescheduleAppointment/${appointmentId}`);
    console.log('Payload:', rescheduleDto);
    const response = await axiosInstance.put(`/Patient/RescheduleAppointment/${appointmentId}`, rescheduleDto);
    console.log('API Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error rescheduling appointment:', error);
    throw error.response?.data || 'Error rescheduling appointment';
  }
};
  


export const getDoctorSchedule = async (doctorId) => {
  console.log(`API Call URL: /DoctorSchedule/${doctorId}`);
  const response = await axiosInstance.get(`/Patient/DoctorSchedule/${doctorId}`);
  return response.data;
};


export const getPatientBills = async () => {
  try {
    const response = await axiosInstance.get(`/Patient/PatientBills`);
    return response.data;
  } catch (error) {
    console.error('Error fetching patient bills:', error);
    throw error;
  }
};


