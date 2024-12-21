import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  getGoogleAuthUrl,
  login,
  loginGoogle,
  sendOTP,
} from "../../services/api/authService"; // Import các hàm từ service
import styles from "./Login.module.scss"; // Import SCSS
import Breadcrumb from "../../components/Breadcrumb";
import { notification } from "antd";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState(""); // Email cho quên mật khẩu
  const navigate = useNavigate();
  const [passwordError, setPasswordError] = useState("");

  const breadcrumbItems = [
    { label: "Trang chủ", path: "/" },
    { label: "Đăng nhập" },
  ];

  const handleLogin = async (e) => {
    e.preventDefault();
    if (password.length < 8) {
      setPasswordError("Mật khẩu phải có ít nhất 8 ký tự.");
      return;
    } else {
      setPasswordError("");
    }
    try {
      const { userEmail, accessToken, decodedToken, userId, verifyUrl } =
        await login(email, password);

      if (verifyUrl) {
        const urlParams = new URLSearchParams(verifyUrl.split("?")[1]);
        const q = urlParams.get("q");
        notification.warning({
          message: "Tài khoản của bạn chưa được xác thực",
          description: "OTP đã được gửi, vui lòng kiểm tra email",
        });
        navigate("/otp", { state: { q } });
        return;
      }

      if (accessToken) {
        console.log("Đăng nhập thành công:", accessToken);
        notification.success({
          message: "Đăng nhập thành công",
          description: "Bạn đã đăng nhập thành công",
        });
        setEmail(userEmail);
        localStorage.setItem("userEmail", userEmail);
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("decodedToken", decodedToken);
        localStorage.setItem("userId", userId);

        if (decodedToken === "user") {
          navigate("/account", { state: { email: userEmail } });
        } else if (decodedToken === "admin") {
          navigate("/admin");
        } else {
          navigate("/login");
        }
      } else {
        notification.error({
          message: "Đăng nhập thất bại",
          description: "Thông tin đăng nhập không đúng",
        });
      }
    } catch (error) {
      console.error("Lỗi đăng nhập:", error);
      if (error.response && error.response.data) {
        notification.error({
          message: "Đăng nhập thất bại",
          description:
            error.response.data.message || "Bạn đã nhập sai mật khẩu",
        });
      } else {
        notification.error({
          message: "Đăng nhập thất bại",
          description: "Có lỗi xảy ra, vui lòng thử lại.",
        });
      }
    }
  };

  // const loginGg = async () => {
  //   try {
  //     const authUrl = await getGoogleAuthUrl();
  //     if (authUrl) {
  //       window.location.href = authUrl;
  //     }
  //   } catch (error) {
  //     notification.error({
  //       message: "Yêu cầu xác thực thất bại",
  //       description: error.message,
  //     });
  //   }
  // };

  const loginGg = async () => {
    try {
      const authUrl = await loginGoogle();
      console.log("Chuyển hướng tới Google để xác thực", authUrl);
      window.location.href = authUrl;
    } catch (error) {
      notification.error({
        message: "Yêu cầu xác thực thất bại",
        description: error.message,
      });
    }
  };

  const handleResetPassword = async () => {
    try {
      const otpData = await sendOTP(forgotEmail);
      console.log("Yêu cầu OTP thành công:", otpData);
      navigate("/reset-password");
    } catch (error) {
      notification.error({
        message: "Yêu cầu OTP thất bại",
        description: error.message,
      });
    }
  };

  return (
    <>
      <Breadcrumb items={breadcrumbItems} />
      <div className={styles.loginContainer}>
        <div>
          <h1>ĐĂNG NHẬP</h1>
          <form className={styles.loginForm} onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Mật khẩu"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {passwordError && (
              <p style={{ marginTop: "-10px", color: "red" }}>
                {passwordError}
              </p>
            )}
            <button type="submit" className={styles.loginButton}>
              ĐĂNG NHẬP
            </button>
          </form>
          <div className={styles.forgotPasswordRegister}>
            <a
              href="#"
              className={styles.forgotPassword}
              onClick={() => setShowForgotPassword(!showForgotPassword)}
            >
              Quên mật khẩu?
            </a>
            <Link to="/register" className={styles.registerLink}>
              Đăng ký tại đây
            </Link>
          </div>
          {showForgotPassword && (
            <div className={styles.forgotPasswordForm}>
              <input
                type="email"
                placeholder="Nhập email để lấy lại mật khẩu"
                required
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
              />
              <button
                className={styles.resetPasswordButton}
                onClick={handleResetPassword}
              >
                Lấy lại mật khẩu
              </button>
            </div>
          )}
          <div className={styles.socialLogin}>
            <p>hoặc đăng nhập qua</p>
            <div className={styles.socialButtons}>
              <button onClick={() => loginGg()} className={styles.googleButton}>
                <i className="fab fa-google"></i> Google
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
