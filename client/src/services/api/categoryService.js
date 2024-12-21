import axios from "axios";
import { jwtDecode } from "jwt-decode";
const API_URL = "http://localhost:3000/api"; 

export const getParentCategories = async () => {
    try {
        const response = await axios.get(`${API_URL}/categories/parents`);
      return response.data; // Trả về danh sách các danh mục cha
    } catch (error) {
      console.error("Error fetching parent categories:", error);
      throw error;
    }
  };
export const getChildrenCategories = async (parentId) => {
  try {
    const response = await axios.get(`${API_URL}/categories/${parentId}`);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy danh mục con:', error);
    throw error;
  }
};
  