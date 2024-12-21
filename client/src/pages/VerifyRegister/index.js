import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { verifyOTP } from "../../services/api/authService";
import styles from './VerifyOTP.module.scss';
import { Form } from 'antd';
import InputOtpField from '../../components/form/InputOtpField';
import OTP from '../../assets/icon/OTP.png'
import { notification } from 'antd';

export default function VerifyOTP() {
  const location = useLocation();
  const navigate = useNavigate();
  const { q } = location.state || {};
  const [form] = Form.useForm();

  const handleSubmit = async (values) => {
    const otpCode = values.otp;
    try {
      const response = await verifyOTP(otpCode, q);
      console.log('Xác minh thành công:', response);
      notification.success({
        message: 'Xác minh thành công',
        description: 'Xác minh mã OTP thành công!',
      });
      navigate('/login');
    } catch (error) {
      alert(error);
    }
  };

  return (
    <div className={styles.otp}> 
      <div className={styles.otpContainer}>
        <img src={OTP} alt="OTP" style={{ width: '120px', height: '120px', objectFit: 'contain', background: 'white' }}/>
        <h4>Xác Minh OTP</h4>
        <Form form={form} onFinish={handleSubmit} className={styles.otpForm}>
          <InputOtpField
            name="otp"
            required
            inputCount={6}
            className={styles.inputField}
          />
          <button type="submit" className={styles.active}>
            Xác Minh
          </button>
        </Form>
      </div>
    </div>
  );
}
