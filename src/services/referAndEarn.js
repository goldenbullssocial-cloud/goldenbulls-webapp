import api from "@/utils/axiosInstance";

export const getUserWithdrawalDash = async () => {
  try {
    const response = await api.get(`/withdrawal/getUserWithdrawalDash`);
    return response.data;
  } catch (error) {
    console.error("Error fetching withdrawal dashboard data:", error);
    throw error;
  }
};

export const getWithdrawalHistory = async (type, page, limit) => {
  try {
    const response = await api.get(
      `/withdrawal/getWithdrawalHistory?type=${type}&page=${page}&limit=${limit}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching withdrawal history:", error);
    throw error;
  }
};

export const createWithdrawalRequest = async (data) => {
  try {
    const response = await api.post(`/withdrawal/createWithdrawal`, data);
    return response.data;
  } catch (error) {
    console.error("Error creating withdrawal request:", error);
    throw error;
  }
};