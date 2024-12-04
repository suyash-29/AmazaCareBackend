// src/api/admin/adminAPI.js

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
    console.log('Request:', config);
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => {
    console.log('Response:', response);
    return response;
  },
  (error) => {
    console.error('Error Response:', error.response);
    return Promise.reject(error);
  }
);

export const checkUsernameAvailability = async (username) => {
  const response = await axiosInstance.get(`/Admin/CheckUsername?username=${username}`);
  return response.data;
};

export const getAllSpecializations = async () => {
  const response = await axiosInstance.get('/Admin/specializations');
  return response.data;
};

export const registerDoctor = async (doctorData) => {
  const response = await axiosInstance.post('/Admin/RegisterDoctor', doctorData);
  return response.data;
};


export const getDoctorDetails = async (doctorId) => {
  const response = await axiosInstance.get(`Admin/GetDoctorDetails/${doctorId}`);
  return response.data;
};

export const updateDoctor = async (doctorId, doctorDto) => {
  const response = await axiosInstance.put(`Admin/UpdateDoctor/${doctorId}`, doctorDto);
  return response.data;
};

export const deleteDoctor = async (userId, doctorId) => {
  const response = await axiosInstance.delete(`Admin/DeleteDoctor/${userId}/${doctorId}`);
  return response.data;
};

export const getPatientDetails = async (patientId) => {
    try {
      const response = await axiosInstance.get(`/Admin/GetPatientDetails/${patientId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data || 'Error fetching patient details.');
    }
  };
  
  export const updatePatient = async (patientDto) => {
    try {
      const response = await axiosInstance.post('/Admin/UpdatePatient', patientDto);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data || 'Error updating patient.');
    }
  };
  
  export const deletePatient = async (userId, patientId) => {
    try {
      const response = await axiosInstance.delete(`/Admin/DeletePatient/${userId}/${patientId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data || 'Error deleting patient.');
    }
  };

export const registerAdmin = async (data) => {
  const response = await axiosInstance.post("/Admin/RegisterAdmin", data);
  return response.data;
};


// export const rescheduleAppointment = async (appointmentId, rescheduleData) => {
//   const response = await axiosInstance.put(
//     `/RescheduleAppointment/${appointmentId}`,
//     rescheduleData
//   );
//   return response.data;
// };
export const rescheduleAppointment = async (appointmentId, rescheduleData) => {
  console.log(`API Call: Rescheduling Appointment with ID ${appointmentId}`);
  console.log("Payload:", rescheduleData);
  return await axiosInstance.put(`/Admin/admin/RescheduleAppointment/${appointmentId}`, rescheduleData);
};

export const getAppointmentDetails = async (appointmentId) => {
  const response = await axiosInstance.get(`/Admin/ViewAppointmentDetails/${appointmentId}`);
  return response.data;
};


export const getDoctorSchedule = async (doctorId) => {
  const response = await axiosInstance.get(`/Admin/DoctorSchedule/GetAll/${doctorId}`);
  console.log("Fetched Schedules:", response.data);
  return response.data;
};

export const updateSchedule = async (scheduleId, updateData) => {
  const response = await axiosInstance.put(`/Admin/DoctorSchedule/Update/${scheduleId}`, updateData);
  console.log(response)
  return response.data;
};

export const cancelSchedule = async (scheduleId) => {
  const response = await axiosInstance.put(`/Admin/DoctorSchedule/${scheduleId}/cancel`);
  return response.data;
};

export const markScheduleCompleted = async (scheduleId) => {
  const response = await axiosInstance.put(`/Admin/DoctorSchedule/${scheduleId}/completed`);
  return response.data;
};


export const getBillingDetails = async () => {
  try {
    const response = await axiosInstance.get('/Admin/GetAllBilling');
    console.log('Billing details fetched:', response.data);
    return response;
  } catch (error) {
    console.error('Error fetching billing details:', error);
    throw error;
  }
};

export const markBillAsPaid = async (billingId) => {
  try {
    const response = await axiosInstance.put(`/Admin/Billing/${billingId}/pay`);
    console.log(`Marked bill ID ${billingId} as paid.`, response.data);
    return response;
  } catch (error) {
    console.error(`Error marking bill ID ${billingId} as paid:`, error);
    throw error;
  }
};


export const getAllMedications = async () => {
  return axiosInstance.get('/Admin/GetAllMedications');
};

export const addMedication = async (medication) => {
  return axiosInstance.post('/Admin/AddMedications', medication);
};

export const updateMedication = async (medicationId, medication) => {
  return axiosInstance.put(`/Admin/UpdateMedications/${medicationId}`, medication);
};

export const getAllTests = async () => {
  return axiosInstance.get('/Admin/GetAllTests');
};

export const addTest = async (test) => {
  return axiosInstance.post('/Admin/AddTests', test);
};

export const updateTest = async (testId, test) => {
  return axiosInstance.put(`/Admin/UpdateTests/${testId}`, test);
};
