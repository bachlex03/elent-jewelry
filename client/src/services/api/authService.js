import axios from "axios";
import { jwtDecode } from "jwt-decode";
const API_URL = "http://localhost:3000/api"; // Đặt URL của API BE tại đây

export const verifyOTP = async (otpCode, q) => {
  try {
    const response = await axios.post(
      `${API_URL}/auth/verify-otp?q=${encodeURIComponent(q)}`,
      {
        otp: otpCode,
      },
    );
    return response.data;
  } catch (error) {
    console.log("123", error);
    throw new Error(error.response?.data?.message || "Xác minh OTP thất bại");
  }
};

export const register = async (data) => {
  try {
    console.log("123");
    const response = await axios.post(`${API_URL}/auth/register`, data);
    console.log("123");
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Đăng ký thất bại");
  }
};

export const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, {
      email,
      password,
    });

    if (response.data.verifyUrl) {
      const verifyUrl = response.data.verifyUrl || null;
      const accessToken = response.data.token;
      const decodedToken = jwtDecode(accessToken).role;
      return { accessToken, decodedToken, verifyUrl };
    } else {
      const accessToken = response.data.accessToken;
      const decodedToken = jwtDecode(accessToken).role;
      const userEmail = jwtDecode(accessToken).email;
      const userId = jwtDecode(accessToken).userid;
      return { accessToken, userEmail, decodedToken, userId };
    }
  } catch (error) {
    const errorMessage =
      error.response?.data || "Có lỗi xảy ra, vui lòng thử lại!";
    console.error("Error:", errorMessage);
    throw new Error(errorMessage.error);
  }
};

export const requestOTP = async (email) => {
  try {
    const response = await axios.post(`${API_URL}/auth/request-otp`, { email });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Yêu cầu OTP thất bại");
  }
};

export const sendOTP = async (email) => {
  try {
    console.log("email", email);
    const response = await axios.post(`${API_URL}/auth/send-otp`, { email });
    console.log(response);

    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Yêu cầu OTP thất bại");
  }
};

export const forgotPassword = async (
  { otp, newPassword, confirmPassword },
  q,
) => {
  console.log(otp, newPassword, confirmPassword, q);

  // const token = jwt.sign({ email }, 94vFo1lmQQ, { expiresIn: '5m' });
  try {
    const response = await axios.put(
      `${API_URL}/auth/reset-password?q=${encodeURIComponent(q)}`,
      {
        otp,
        newPassword,
        confirmPassword,
      },
    );

    return response.data; // Return the success message
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Đặt lại mật khẩu thất bại",
    );
  }
};

// export const loginGoogle = async () => {
//   console.log(123);

//   try {
//     console.log(456);

//     const response = await axios.get(`${API_URL}/auth/google`);
//     console.log("response", response);

//     console.log(789);

//     return response.data;
//   } catch (error) {
//     console.error("Error details:", error); // Thêm dòng này để ghi lại thông tin lỗi
//     throw new Error(error.response?.data?.message || "Đăng nhập thất bại");
//   }
// };
export const loginGoogle = async () => {
  console.log(123);

  try {
    console.log(456);

    const response = await axios.get(`${API_URL}/auth/google`, {
      withCredentials: true,
      maxRedirects: 0, // Chặn tự động điều hướng để kiểm soát
    });

    if (response.status === 302) {
      const authUrl = response.headers.location;
      window.location.href = authUrl; // Điều hướng thủ công
    } else {
      console.log("response", response);
      return response.data;
    }

    console.log(789);
  } catch (error) {
    if (error.response && error.response.status === 302) {
      const authUrl = error.response.headers.location;
      window.location.href = authUrl; // Điều hướng thủ công
    } else {
      console.error("Error details:", error);
      throw new Error(error.response?.data?.message || "Đăng nhập thất bại");
    }
  }
};
