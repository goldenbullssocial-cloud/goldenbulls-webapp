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

export const updateVideoProgress = async (
  id,
  chapterId,
  courseId,
  percentage
) => {
  try {
    const res = await api.put(
      `/chapter/updateChapterTracking?id=${id}&chapterId=${chapterId}&courseId=${courseId}`,
      { percentage: percentage.toString() }
    );
    const data = await res.data;
    return data;
  } catch (error) {
    console.error("Error fetching dashboard data", error);
    throw error;
  }
};

export const getBatches = async (data) => {
  try {
    const params = new URLSearchParams();
    params.append('courseId', data.courseId);

    if (data.isMatchBatch !== undefined) {
      params.append('isMatchBatch', data.isMatchBatch);
    }

    const response = await api.get(
      `/batch/getBatchByCourse?${params.toString()}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching batches:", error);
    throw error;
  }
};

export const downloadCourseCertificate = async (courseId) => {
  try {
    const response = await api.post(`/payment/courseCertificate?courseId=${courseId}`);
    return response.data;
  } catch (error) {
    console.error('Error downloading certificate:', error);
    throw error;
  }
};

export const downloadStudentID = async (id, batchId) => {
  try {
    const response = await api.post(`/payment/createStudentId?courseId=${id}&batchId=${batchId}`);
    return response.data;
  } catch (error) {
    console.error('Error downloading student ID:', error);
    throw error;
  }
};
