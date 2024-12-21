import axios from "axios";

const API_BASE_URL = "/api";

export const fetchDiscounts = async ({ totalPrice }) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/discounts/validate-total?totalPrice=${totalPrice}`
    );
    return response.data;
  } catch (error) {
    console.error(error);
    return { error: error.message };
  }
};
