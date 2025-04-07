import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { forgotPassword } from "../../../config/redux/action/authAction/index";
import { useNavigate } from "react-router-dom";
import { reset } from "../../../config/redux/reducer/authReducer";
import styles from "./Style.module.css";
import Loader from "../../../components/Loader";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (authState.isSuccess) {
      navigate("/auth/update-password");
      dispatch(reset());
    }
  }, [authState.isSuccess, dispatch, navigate]);

  const handleSendOTP = (e) => {
    e.preventDefault();
    dispatch(forgotPassword({ email }));
  };

  return (
    <div className={styles.forgot_container}>
      <div className={styles.forgot_card}>
        <h2>Forgot Password</h2>
        
        {authState.isError && (
          <p style={{ color: "red" }}>
            {authState.message?.message || authState.message}
          </p>
        )}
        {authState.isSuccess && (
          <p style={{ color: "green" }}>
            {authState.message?.message || authState.message}
          </p>
        )}

        <form onSubmit={handleSendOTP} className={styles.forgot_form}>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={styles.forgot_input}
          />
          <button className={styles.forgot_btn} type="submit">
          {authState.isLoading ? <Loader /> : "Send OTP"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
