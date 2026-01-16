import api from "@/utils/axiosInstance";

export const getpaymentHistory = async ( type, queryData) => {
    try {
        const response = await api.get(`/payment/getPaymentHistory?page=${queryData.page}&limit=${queryData.limit}${type ? `&isType=${type}` : ''}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching payment history:', error);
        throw error;
    }
};