import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { register } from "../../../config/redux/action/authAction/index";
import { useNavigate } from "react-router-dom";
import { reset } from "../../../config/redux/reducer/authReducer/index";
import styles from "./Style.module.css";
import Loader from "../../../components/Loader";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });

  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    if (authState.isSuccess) {
      dispatch(reset());
      navigate("/auth/verify-otp");
    }
  }, [authState.isSuccess, navigate, dispatch]);

  const handleSignup = (e) => {
    e.preventDefault();
    dispatch(register(formData));
  };

  return (
    <div className={styles.signup_container}>
      <div className={styles.signup_card}>
        <h2>Signup</h2>

        <div style={{ textAlign: "center" }}>
          {authState.isError && (
            <p style={{ color: "red" }}>
              {authState.user?.message || authState.message}
            </p>
          )}
          {authState.isSuccess && (
            <p style={{ color: "green" }}>
              {authState.user?.message || authState.message}
            </p>
          )}
        </div>

        <form onSubmit={handleSignup} className={styles.signup_form}>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
            className={styles.signup_input}
          />
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
            className={styles.signup_input}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className={styles.signup_input}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className={styles.signup_input}
          />
          <button
            type="submit"
            className={styles.signup_btn}
            disabled={authState.isLoading}
          >
            {authState.isLoading ? <Loader /> : "Signup"}
          </button>
        </form>

        <p className={styles.signup_toggle}>
          Already have an account?&nbsp;&nbsp;
          <b onClick={() => navigate("/auth/login")}>Login</b>
        </p>
      </div>
    </div>
  );
};

export default Signup;
