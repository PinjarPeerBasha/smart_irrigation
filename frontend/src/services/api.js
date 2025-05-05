import axios from 'axios';

//axios.defaults.baseURL = 'http://localhost:8090"';

const customAxios = axios.create({
  baseURL: 'http://localhost:8090',
});

const API_BASE_URL = '/api';

const apiService = {
  // Farm endpoints
  getFarms: async () => {
    try {

      console.info('calling getForms....newwwwww Alla');

      const response = await customAxios.get(`${API_BASE_URL}/farms`);
      return response.data;
    } catch (error) {
      console.error('Error fetching farms:', error);
      throw error;
    }
  },
  
  getFarmById: async (id) => {
    try {

      console.info('getFarmById', id )
      const response = await customAxios.get(`${API_BASE_URL}/farms/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching farm ${id}:`, error);
      throw error;
    }
  },
  
  createFarm: async (farm) => {
    try {

      console.info('calling createForm....Alla');
      const response = await customAxios.post(`${API_BASE_URL}/farms`, farm);
      return response.data;
    } catch (error) {
      console.error('Error creating farm:', error);
      throw error;
    }
  },
  
  updateFarm: async (id, farm) => {
    try {
      const response = await customAxios.put(`${API_BASE_URL}/farms/${id}`, farm);
      return response.data;
    } catch (error) {
      console.error(`Error updating farm ${id}:`, error);
      throw error;
    }
  },
  
  deleteFarm: async (id) => {
    try {
      await customAxios.delete(`${API_BASE_URL}/farms/${id}`);
    } catch (error) {
      console.error(`Error deleting farm ${id}:`, error);
      throw error;
    }
  },
  
  // Zone endpoints
  getZones: async (farmId) => {
    try {

      console.info ('getZones input parameters ' , farmId);

      const url = farmId ? `${API_BASE_URL}/zones?farmId=${farmId.farmId}` : `${API_BASE_URL}/zones`;
      console.info ('getZones ' , url);
      const response = await customAxios.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching zones:', error);
      throw error;
    }
  },
  
  getZoneById: async (id) => {
    try {
      const response = await customAxios.get(`${API_BASE_URL}/zones/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching zone ${id}:`, error);
      throw error;
    }
  },
  
  createZone: async (zone) => {
    try {
      const response = await customAxios.post(`${API_BASE_URL}/zones`, zone);
      return response.data;
    } catch (error) {
      console.error('Error creating zone:', error);
      throw error;
    }
  },
  
  updateZone: async (id, zone) => {
    try {
      const response = await customAxios.put(`${API_BASE_URL}/zones/${id}`, zone);
      return response.data;
    } catch (error) {
      console.error(`Error updating zone ${id}:`, error);
      throw error;
    }
  },
  
  deleteZone: async (id) => {
    try {
      await customAxios.delete(`${API_BASE_URL}/zones/${id}`);
    } catch (error) {
      console.error(`Error deleting zone ${id}:`, error);
      throw error;
    }
  },
  
  // Device endpoints
  getDevices: async (params) => {
    try {
      const queryParams = params ? new URLSearchParams(params).toString() : '';
      const url = queryParams ? `${API_BASE_URL}/devices?${queryParams}` : `${API_BASE_URL}/devices`;
      const response = await customAxios.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching devices:', error);
      throw error;
    }
  },
  
  getDeviceById: async (id) => {
    try {
      const response = await customAxios.get(`${API_BASE_URL}/devices/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching device ${id}:`, error);
      throw error;
    }
  },
  
  createDevice: async (device) => {
    try {
      const response = await customAxios.post(`${API_BASE_URL}/devices`, device);
      return response.data;
    } catch (error) {
      console.error('Error creating device:', error);
      throw error;
    }
  },
  
  updateDevice: async (id, device) => {
    try {
      const response = await customAxios.put(`${API_BASE_URL}/devices/${id}`, device);
      return response.data;
    } catch (error) {
      console.error(`Error updating device ${id}:`, error);
      throw error;
    }
  },
  
  deleteDevice: async (id) => {
    try {
      await customAxios.delete(`${API_BASE_URL}/devices/${id}`);
    } catch (error) {
      console.error(`Error deleting device ${id}:`, error);
      throw error;
    }
  },
  
  controlDevice: async (id, action) => {
    try {
      const response = await customAxios.post(`${API_BASE_URL}/devices/${id}/control`, { action });
      return response.data;
    } catch (error) {
      console.error(`Error controlling device ${id}:`, error);
      throw error;
    }
  },
  
  // Schedule endpoints
  getSchedules: async (params) => {
    try {
      const queryParams = params ? new URLSearchParams(params).toString() : '';
      const url = queryParams ? `${API_BASE_URL}/schedules?${queryParams}` : `${API_BASE_URL}/schedules`;
      const response = await customAxios.get(url);

      const rawSchedules =  response.data;

      return rawSchedules.map((s) => {
        const start = new Date(s.scheduledStartTime);
        const end = new Date(start.getTime() + s.durationMinutes * 60 * 1000);

        return {
          id: s.id,
          name: s.name,
          startTime: start.toISOString().slice(0, 16),
          endTime: end.toISOString().slice(0, 16),
          status: s.status,
          recurrence: s.isRecurring ? s.recurringDays || 'daily' : 'once',
          zone: s.zone || { id: s.zoneId, name: 'Unknown' },
          zoneId: s.zoneId,
        };
      });


    } catch (error) {
      console.error('Error fetching schedules:', error);
      throw error;
    }
  },
  
  getScheduleById: async (id) => {
    try {
      const response = await customAxios.get(`${API_BASE_URL}/schedules/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching schedule ${id}:`, error);
      throw error;
    }
  },
  
  getUpcomingSchedules: async () => {
    try {
      const response = await customAxios.get(`${API_BASE_URL}/schedules/upcoming`);
      return response.data;
    } catch (error) {
      console.error('Error fetching upcoming schedules:', error);
      throw error;
    }
  },
  
  createSchedule: async (schedule) => {
    try {
      const response = await customAxios.post(`${API_BASE_URL}/schedules`, schedule);
      return response.data;
    } catch (error) {
      console.error('Error creating schedule:', error);
      throw error;
    }
  },
  
  updateSchedule: async (id, schedule) => {
    try {
      const response = await customAxios.put(`${API_BASE_URL}/schedules/${id}`, schedule);
      return response.data;
    } catch (error) {
      console.error(`Error updating schedule ${id}:`, error);
      throw error;
    }
  },
  
  deleteSchedule: async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/schedules/${id}`);
    } catch (error) {
      console.error(`Error deleting schedule ${id}:`, error);
      throw error;
    }
  },
  
  executeSchedule: async (id) => {
    try {
      const response = await customAxios.post(`${API_BASE_URL}/schedules/${id}/execute`);
      return response.data;
    } catch (error) {
      console.error(`Error executing schedule ${id}:`, error);
      throw error;
    }
  },
  
  cancelSchedule: async (id) => {
    try {
      const response = await customAxios.post(`${API_BASE_URL}/schedules/${id}/cancel`);
      return response.data;
    } catch (error) {
      console.error(`Error canceling schedule ${id}:`, error);
      throw error;
    }
  },
  
  // Sensor data endpoints
  getSensorData: async (params) => {
    try {
      const queryParams = params ? new URLSearchParams(params).toString() : '';
      const url = queryParams ? `${API_BASE_URL}/sensor-data?${queryParams}` : `${API_BASE_URL}/sensor-data`;
      const response = await customAxios.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching sensor data:', error);
      throw error;
    }
  },
  
  getLatestSensorData: async (zoneId) => {
    try {
      const url = zoneId 
        ? `${API_BASE_URL}/sensor-data/latest?zoneId=${zoneId}` 
        : `${API_BASE_URL}/sensor-data/latest`;
      const response = await customAxios.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching latest sensor data:', error);
      throw error;
    }
  },
  
  createSensorData: async (sensorData) => {
    try {
      const response = await customAxios.post(`${API_BASE_URL}/sensor-data`, sensorData);
      return response.data;
    } catch (error) {
      console.error('Error creating sensor data:', error);
      throw error;
    }
  },
  
  // Alert endpoints
  getAlerts: async (params) => {
    try {
      const queryParams = params ? new URLSearchParams(params).toString() : '';
      const url = queryParams ? `${API_BASE_URL}/alerts?${queryParams}` : `${API_BASE_URL}/alerts`;
      const response = await customAxios.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching alerts:', error);
      throw error;
    }
  },
  
  getUnreadAlerts: async () => {
    try {
      const response = await customAxios.get(`${API_BASE_URL}/alerts/unread`);
      return response.data;
    } catch (error) {
      console.error('Error fetching unread alerts:', error);
      throw error;
    }
  },
  
  createAlert: async (alert) => {
    try {
      const response = await customAxios.post(`${API_BASE_URL}/alerts`, alert);
      return response.data;
    } catch (error) {
      console.error('Error creating alert:', error);
      throw error;
    }
  },
  
  markAlertAsRead: async (id) => {
    try {
      const response = await customAxios.put(`${API_BASE_URL}/alerts/${id}/read`);
      return response.data;
    } catch (error) {
      console.error(`Error marking alert ${id} as read:`, error);
      throw error;
    }
  },
  
  markAlertAsResolved: async (id, resolvedBy) => {
    try {
      const response = await customAxios.put(`${API_BASE_URL}/alerts/${id}/resolve`, { resolvedBy });
      return response.data;
    } catch (error) {
      console.error(`Error marking alert ${id} as resolved:`, error);
      throw error;
    }
  },
  getDashboardStats: async () => {
    try {
      console.log ("getDashboardStats " , API_BASE_URL);

      const response = await customAxios.get(`${API_BASE_URL}/stats/dashboard`);

      console.log(response.data)
      return response.data;
    } catch (error) {
      console.error('Error fetching stats :', error);
      throw error;
    }
  }
};

export default apiService; 