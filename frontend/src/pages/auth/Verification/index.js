import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { verifyOTP, resendOTP } from "../../../config/redux/action/authAction";
import { useNavigate } from "react-router-dom";
import { reset } from "../../../config/redux/reducer/authReducer/index";
import styles from "./Style.module.css";
import Loader from "../../../components/Loader";

const VerifyOTP = () => {
  const [otp, setOtp] = useState("");
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

  const handleChange = (e) => {
    setOtp(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(verifyOTP({ otp }));
  };

  const handleResendOTP = () => {
    dispatch(resendOTP());
  };

  return (
    <div className={styles.verify_otp_container}>
      <div className={styles.verify_otp_card}>
        <h2>Verify OTP</h2>

        {authState.isError && (
          <p style={{ color: "red" }}>
            {typeof authState.message === "object"
              ? authState.message.message
              : authState.message}
          </p>
        )}

        {authState.isSuccess && (
          <p style={{ color: "green" }}>
            {typeof authState.message === "object"
              ? authState.message.message
              : authState.message}
          </p>
        )}
        {authState.otpResent && (
          <p style={{ color: "blue" }}>OTP Resent Successfully!</p>
        )}

        <form onSubmit={handleSubmit} className={styles.verify_otp_form}>
          <input
            type="text"
            name="otp"
            placeholder="Enter OTP"
            value={otp}
            onChange={handleChange}
            required
            className={styles.verify_otp_input}
          />
          <button type="submit" className={styles.verify_otp_btn}>
            {authState.isLoading ? <Loader /> : "Verify OTP"}
          </button>
        </form>

        <p className={styles.verify_otp_resend_otp}>
          Didn't recieve an otp?&nbsp;&nbsp;
          <b onClick={handleResendOTP}>Resend OTP</b>{" "}
        </p>
      </div>
    </div>
  );
};

export default VerifyOTP;
