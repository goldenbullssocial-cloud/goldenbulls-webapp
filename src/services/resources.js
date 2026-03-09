import axios from "axios";

const BaseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export const getAuthToken = () => {
    if (typeof window !== "undefined") {
        return localStorage.getItem("userToken");
    }
    return null;
};

const getHeaders = () => {
    const token = getAuthToken();
    const headers = {
        "Content-Type": "application/json",
    };
    if (token) headers["x-auth-token"] = token;
    return headers;
};

export const getAllResources = async ({ page = 1, limit = 10, search = "" } = {}) => {
    try {
        const params = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString(),
            ...(search && { search }),
        });
        const res = await axios.get(`${BaseUrl}/resource/getResources?${params.toString()}`, {
            headers: getHeaders(),
        });
        return res.data;
    } catch (error) {
        console.error("Error fetching resources", error);
        throw error;
    }
};
