import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getMyProfile,
  login,
} from "../../../config/redux/action/authAction/index";
import { useNavigate } from "react-router-dom";
import styles from "./Style.module.css";
import Loader from "../../../components/Loader";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (authState.isSuccess) {
      dispatch(getMyProfile(userId));
      setEmail("");
      setPassword("");
      navigate("/dashboard");
    }
  }, [authState.isSuccess, authState.token, dispatch, navigate]);

  const handleLogin = (e) => {
    e.preventDefault();
    dispatch(login({ email, password }));
  };

  return (
    <div className={styles.login_container}>
      <div className={styles.login_card}>
        <h2>Login</h2>
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

        <form onSubmit={handleLogin} className={styles.login_form}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={styles.login_input}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className={styles.login_input}
          />
          <b
            onClick={() => {
              navigate("/auth/forgot-password");
            }}
          >
            <span>Forgot Password?</span>
          </b>
          <button className={styles.login_btn} type="submit">
            {authState.isLoading ? <Loader /> : "Login"}
          </button>
        </form>
        <p className={styles.login_toggle}>
          Don't have an account?&nbsp;&nbsp;
          <b
            onClick={() => {
              navigate("/auth/register");
            }}
          >
            Sign Up
          </b>{" "}
        </p>
      </div>
    </div>
  );
};

export default Login;
