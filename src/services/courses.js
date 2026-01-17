import api from "@/utils/axiosInstance";

export const getCourses = async ({
  page = 1,
  limit = 10,
  searchQuery = "",
  courseType = "",
  id = "",
  instructorId = "",
}) => {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (searchQuery) {
      params.append("search", searchQuery);
    }
    if (courseType) {
      params.append("courseType", courseType);
    }
    if (id) {
      params.append("id", id);
    }
    if (instructorId) {
      params.append("instructorId", instructorId);
    }

    const response = await api.get(`/course/getAllCourse?${params.toString()}`);

    return response.data;
  } catch (error) {
    console.error("Error fetching courses", error);
    throw error;
  }
};

export const submitReview = async (data) => {
  console.log("data", data);
  try {
    const response = await api.post("/courseRating/addCourseRating", data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getCourseRating = async (id) => {
  try {
    const response = await api.get(`/courseRating/getCourseRating?courseId=${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching course rating:', error);
    throw error;
  }
};