import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  resendOTP,
  updatePassword,
} from "../../../config/redux/action/authAction/index";
import { useNavigate } from "react-router-dom";
import { reset } from "../../../config/redux/reducer/authReducer/index";
import styles from "./Style.module.css";
import Loader from "../../../components/Loader";

const UpdatePassword = () => {
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);

  const navigate = useNavigate();

  useEffect(() => {
    if (authState.isSuccess) {
      setTimeout(() => {
        dispatch(reset());
        navigate("/auth/login");
      }, 1000);
    }
  }, [authState.isSuccess, navigate, dispatch]);
  const handleSubmit = (e) => {
    e.preventDefault();

    dispatch(updatePassword({ otp, newPassword }));
  };

  const handleResendOTP = () => {
    dispatch(resendOTP());
  };

  return (
    <div className={styles.update_password_container}>
      <div className={styles.update_password_card}>
        <h2>Update Password</h2>
         
        {authState.isError && (
          <p style={{ color: "red" }}>{authState.message}</p>
        )}
        {authState.isSuccess && (
          <p style={{ color: "green" }}>{authState.message}</p>
        )}
        {authState.otpResent && (
          <p style={{ color: "blue" }}>OTP Resent Successfully!</p>
        )}

        <form onSubmit={handleSubmit} className={styles.update_password_form}>
          <input
            type="text"
            name="otp"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
            className={styles.update_password_input}
          />
          <input
            type="password"
            name="newPassword"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            className={styles.update_password_input}
          />
          <button type="submit" className={styles.update_password_btn}>
            {authState.isLoading ? <Loader /> : "Update Password"}
          </button>
        </form>

        <p className={styles.update_password_resend_otp}>
          Didn't recieve an otp?&nbsp;&nbsp;
          <b onClick={handleResendOTP}>Resend OTP</b>{" "}
        </p>
      </div>
    </div>
  );
};

export default UpdatePassword;
