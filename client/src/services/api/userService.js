import axios from "axios";
import { jwtDecode } from "jwt-decode";
const API_URL = "http://localhost:3000/api";

export const getUserProfile = async (email) => {
  try {
    const response = await axios.get(`${API_URL}/users/profiles/${email}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const changePassword = async (
  email,
  oldPassword,
  newPassword,
  confirmNewPassword,
) => {
  try {
    console.log(email);
    console.log(oldPassword);
    console.log(newPassword);
    console.log(confirmNewPassword);
    const response = await axios.put(
      `${API_URL}/users/change-password/${email}`,
      {
        oldPassword,
        newPassword,
        confirmNewPassword,
      },
    );

    console.log("Thông báo:", response.data.message);
    return response.data.message;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại!";
    console.error("Lỗi:", errorMessage);
    throw new Error(errorMessage);
  }
};

export const getAddresses = async (email) => {
  try {
    const response = await axios.get(`${API_URL}/users/addresses/${email}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const addAddresses = async (email, address) => {
  try {
    const response = await axios.post(`${API_URL}/users/addresses/${email}`, {
      ...address,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const editAddresses = async (id, address) => {
  try {
    console.log(address);
    const response = await axios.put(`${API_URL}/users/addresses/${id}`, {
      ...address,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteAddresses = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/users/addresses/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAllInvoices = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/invoices/getAll`, {
      params: { userId },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getInvoiceDetail = async (invoiceId) => {
  try {
    const response = await axios.get(`${API_URL}/invoices/getInvoiceDetail`, {
      params: { invoiceId },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
