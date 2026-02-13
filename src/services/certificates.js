import api from "@/utils/axiosInstance";

export const getCertificateIssued = async (page = 1, limit = 8) => {
    try {
        const response = await api.get(`/payment/getCertificateIssued?page=${page}&limit=${limit}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching certificates:", error);
        throw error;
    }
};
