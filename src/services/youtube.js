import api from "@/utils/axiosInstance";

export const getAllYoutube = async (params) => {
    try {
        const queryString = new URLSearchParams();
        if (params?.page) queryString.append("page", params.page);
        if (params?.limit) queryString.append("limit", params.limit);
        if (params?.search) queryString.append("search", params.search);

        const url = queryString.toString()
            ? `/youtube/getAllYoutube?${queryString.toString()}`
            : `/youtube/getAllYoutube`;

        const response = await api.get(url);
        return response.data;
    } catch (error) {
        console.error("Error fetching youtube videos:", error);
        throw error;
    }
};
