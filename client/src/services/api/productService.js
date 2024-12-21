// productService.js
const API_BASE_URL = "/api"; // Thay đổi URL cho đúng

export const fetchProducts = async (limit, page) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/products/all?limit=${limit}&page=${page}`
    );

    // Kiểm tra phản hồi từ API
    if (!response.ok) {
      throw new Error("Yêu cầu không hợp lệ");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return { error: error.message };
  }
};

export const searchProducts = async (keyword, limit, page) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/products/search?keyword=${encodeURIComponent(keyword)}&limit=${limit}&page=${page}`
    );

    if (!response.ok) {
      throw new Error("Yêu cầu không hợp lệ");
    }

    const data = await response.json();
    return data; // Trả về dữ liệu sản phẩm
  } catch (error) {
    console.error(error);
    return { error: error.message }; // Trả về thông báo lỗi
  }
};

export const getProductDetail = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/products/detail/${id}`);

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return { error: error.message };
  }
};

export const getSaleProducts = async (limit, page) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/products/sales?limit=${limit}&page=${page}`
    );

    // Kiểm tra phản hồi từ API
    if (!response.ok) {
      throw new Error("Yêu cầu không hợp lệ");
    }

    const data = await response.json();
    return data; // Trả về dữ liệu sản phẩm đang sale
  } catch (error) {
    console.error(error);
    return { error: error.message }; // Trả về thông báo lỗi
  }
};

export const getProductbyCategory = async (categoryId, limit, page) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/products/category/${categoryId}?limit=${limit}&page=${page}`
    );

    const data = await response.json();
    console.log(
      `${API_BASE_URL}/products/category/${categoryId}?limit=${limit}&page=${page}`
    );

    return data;
  } catch (error) {
    console.error(error);
    return { error: error.message };
  }
};

export const filterProducts = async (filters, page = 1, limit = 10) => {
  try {
    const params = new URLSearchParams();

    // Thêm các tham số phân trang
    params.append("Page", page);
    params.append("Limit", limit);

    // Thêm category ID nếu có
    if (filters.categoryId) {
      params.append("idcategory", filters.categoryId);
    }

    // Thêm các mảng lọc
    if (filters.priceRanges?.length > 0) {
      filters.priceRanges.forEach((price) =>
        params.append("priceRanges", price)
      );
    }

    if (filters.materials?.length > 0) {
      filters.materials.forEach((material) =>
        params.append("materials", material)
      );
    }

    if (filters.sizes?.length > 0) {
      filters.sizes.forEach((size) => params.append("sizes", size));
    }

    const response = await fetch(
      `${API_BASE_URL}/products/filter?${params.toString()}`
    );

    if (!response.ok) {
      throw new Error("Yêu cầu không hợp lệ");
    }

    const data = await response.json();
    console.log(data, "data");
    return data;
  } catch (error) {
    console.error("Lỗi khi lọc sản phẩm:", error);
    return { error: error.message };
  }
};
