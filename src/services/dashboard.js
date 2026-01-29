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

export const getChapters = async (id) => {
  try {
    const res = await api.get(
      `/chapter/getChapterByCourse?courseId=${id}`
    );
    const data = await res.data;
    return data;
  } catch (error) {
    console.error("Error fetching chapters", error);
    throw error;
  }
};

export const getDashboardCourses = async ({ page = 1, limit = 10, searchQuery = "", courseType = "", id = "" }) => {
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

    const response = await api.get(`/course/getAllCourseDashboard?${params.toString()}`);

    return response.data;
  } catch (error) {
    console.error("Error fetching courses", error);
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

export const getPaymentUrl = async (data) => {
  try {
    const response = await api.post(`/payment/createPayment`, data);

    const responseData = await response.data;
    return responseData;
  } catch (error) {
    console.error("Error creating payment URL:", error);
    throw error;
  }
};

export const purchasedAllCourses = async ({ type, page, limit }) => {
  try {
    const params = new URLSearchParams({
      page,
      limit,
    });

    if (type) {
      params.append("type", type);
    }

    const response = await api.get(
      `/payment/getMyCourseHistory?${params.toString()}`
    );
    return response.data;
  } catch (error) {
    console.log("error", error);
    throw error;
  }
};

export const getBots = async (page = 1, limit = 10) => {
  try {
    const res = await api.get(`/strategies?page=${page}&limit=${limit}`);
    const data = await res.data;
    return data;
  } catch (error) {
    console.error("Error fetching bots", error);
    throw error;
  }
};

export const getAlgobot = async (id = '', searchQuery = '', page = 1, limit = 10) => {
  try {
    const params = new URLSearchParams({
      page,
      limit,
    });

    if (id) {
      params.append("categoryId", id);
    }

    if (searchQuery) {
      params.append("search", searchQuery);
    }

    const response = await api.get(`/strategyPlan/getStrategiesByCategory?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.log("error", error);
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

export const getProfile = async (id) => {
  try {
    const response = await api.get(`/user/get?id=${id}`)
    return response.data;
  } catch (error) {
    console.log("error", error)
    throw error;
  }
}

export const editProfile = async (userId, formData) => {
  try {
    const response = await api.put(
      `/user/update?id=${userId}`,
      formData,
      {
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const uploadImage = async (file) => {
  try {
    const formData = new FormData();
    formData.append('image', file, file.name || 'profile-image.jpg');

    const response = await api.post(`/user/upload-image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      transformRequest: [(data, headers) => {
        delete headers['Content-Type'];
        return data;
      }]
    });

    return response.data;
  } catch (error) {
    console.error('Error during image upload:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    throw error;
  }
};

export const getCouponByName = async (couponCode) => {
  try {
    const response = await api.get(`/coupon/get-coupon-name?couponCode=${couponCode}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching coupon by name:", error);
    throw error;
  }
};