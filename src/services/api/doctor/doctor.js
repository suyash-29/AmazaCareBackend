// /src/api/doctor/doctor.js
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

export const getTests = async () => {
  try {
    const response = await axiosInstance.get(`/Doctor/GetAllTests`);
    return response.data;
  } catch (error) {
    console.error('Error fetching tests:', error);
    throw error;
  }
};

export const getMedications = async () => {
  try {
    const response = await axiosInstance.get(`/Doctor/GetAllMedications`);
    return response.data;
  } catch (error) {
    console.error('Error fetching medications:', error);
    throw error;
  }
};


export const conductConsultation = async (appointmentId, consultationFee, recordDto) => {
    try {
      const response = await axiosInstance.post(
        `/Doctor/appointments/${appointmentId}/consult`,
        recordDto,
        {
          params: { consultationFee },
        }
      );
      console.log(response.data)
      return response.data;
    } catch (error) {
      console.error('Error conducting consultation:', error);
      throw error;
    }
  };

  export const getPatientMedicalRecords = async (patientId) => {
    try {
      const response = await axiosInstance.get(`/Doctor/GetPatientMedicalRecords/${patientId}/medical-records`);
      return response.data;
    } catch (error) {
      console.error('Error in getPatientMedicalRecords:', error);
      throw error;
    }
  };

  export const updateMedicalRecord = async (recordId, patientId, updateDto) => {
    console.log('API Call - Update Medical Record:', {
      endpoint: `/Doctor/UpdateMedicalRecord/${recordId}/${patientId}`,
      payload: updateDto,
    });
  
    try {
      const response = await axiosInstance.put(`/Doctor/UpdateMedicalRecord/${recordId}/${patientId}`, updateDto);
      console.log('Response - Update Medical Record:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error - Update Medical Record:', error);
      throw error;
    }
  };

export const updateBillingStatus = async (billingId) => {
  console.log('API Call - Update Billing Status:', {
    endpoint: `/Doctor/billing/${billingId}/pay`,
  });

  try {
    const response = await axiosInstance.put(`/Doctor/billing/${billingId}/pay`);
    console.log('Response - Update Billing Status:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error - Update Billing Status:', error);
    throw error;
  }
};


export const getALLSchedules = async () => {
  const response = await axiosInstance.get('/Doctor/GetALLSchedules');
  return response.data;
};

export const createSchedule = async (scheduleData) => {
  const response = await axiosInstance.post('/Doctor/CreateSchedule', scheduleData);
  return response.data;
};


export const updateSchedule = async (scheduleId, updatedData) => {
  const response = await axiosInstance.put(`/Doctor/UpdateSchedule/${scheduleId}`, updatedData);
  return response.data;
};

export const cancelSchedule = async (scheduleId) => {
  const response = await axiosInstance.put(`/Doctor/CancelSchedule/${scheduleId}`);
  return response.data;
};

export const markScheduleComplete = async (scheduleId) => {
  return axiosInstance.put(`/Doctor/CompleteSchedules/${scheduleId}`);
};

export const getDoctorBills = async () => {
  try {
    const response = await axiosInstance.get(`/Doctor/GetBills`);
    return response.data;
  } catch (error) {
    console.error('Error fetching bills:', error);
    throw error;
  }
};
export const markBillAsPaid = async (billingId) => {
  try {
    const response = await axiosInstance.put(`/Doctor/billing/${billingId}/pay`);
    return response.data;
  } catch (error) {
    console.error('Error marking bill as paid:', error);
    throw error;
  }
};
