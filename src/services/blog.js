import api from "@/utils/axiosInstance";

export const getAllBlogCategories = async () => {
    try {
        const response = await api.get('/blogCategory/getAllBlogCategory');
        return response.data;
    } catch (error) {
        console.error('Error fetching blog categories:', error);
        throw error;
    }
};

export const getAllBlogs = async (categoryId = null) => {
    try {
        const url = categoryId
            ? `/blog/getAllBlog?categoryId=${categoryId}`
            : '/blog/getAllBlog';
        const response = await api.get(url);
        return response.data;
    } catch (error) {
        console.error('Error fetching blogs:', error);
        throw error;
    }
};

export const getSingleBlog = async (id) => {
    try {
        const response = await api.get(`/blog/getSingleBlog?id=${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching single blog:', error);
        throw error;
    }
};
