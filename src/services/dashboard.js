import api from "@/utils/axiosInstance";

export const getCourseByType = async () => {
  try {
    const res = await api.get(`/course/getCoueseByType`);
    const data = await res.data;
    return data;
  } catch (error) {
    console.error("Error fetching courses by type", error);
    throw error;
  }
};

export const getCourseById = async (data) => {
  const params = new URLSearchParams();
  if (data.id) {
    params.append("id", data.id);
  }
  if (data.courseType) {
    params.append("courseType", data.courseType);
  }
  try {
    const response = await api.get(
      `/course/getAllCourseDashboard?${params.toString()}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching course by id:", error);
    throw error;
  }
};

export const getCourseSyllabus = async (id) => {
  try {
    const response = await api.get(`/syllabus/getAllSyllabus?courseId=${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching course syllabus:", error);
    throw error;
  }
};

export const getBots = async () => {
  try {
    const res = await api.get(`/strategies?page=1&limit=3`);
    const data = await res.data;
    return data;
  } catch (error) {
    console.error("Error fetching bots", error);
    throw error;
  }
};

export const createNewsLetter = async (formData) => {
  try {
    const response = await api.post(`/newsletter/createNewsLetter`, formData);
    const responseData = await response.data;
    return responseData;
  } catch (error) {
    console.error("Error creating newsletter:", error);
    throw error;
  }
};