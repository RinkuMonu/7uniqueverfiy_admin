'use client';
import { useContext, useState } from "react";
import { FaEnvelope, FaLock, FaKey, FaUser, FaUserShield } from "react-icons/fa";
import { MainContext } from "../context/context";
import { login } from "../redux/reducer/AdminSlice";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import axiosInstance from "@/components/service/axiosInstance";
import { FaRegEyeSlash } from "react-icons/fa";

import './LoginPage.css'; // import the CSS file

const LoginPage = () => {
  const { tostymsg } = useContext(MainContext);
  const admin = useSelector((state) => state.admin.token);
  const dispatch = useDispatch();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [step, setStep] = useState(0); // 0: login, 1: forgot, 2: otp
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showLogin, setShowLogin] = useState(true);

  const [form, setForm] = useState({
    role: 'user',
    name: '',
    email: '',
    password: ''
  });

  const loginHandle = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.post('/auth/login', { email, password });
      tostymsg(res.data.message, res.status);
      if (res.status === 200) {
        dispatch(login({ token: res.data.token }));
        router.push('/');
      }
    } catch (err) {
      tostymsg(err.response?.data?.message || "Login failed", 0);
    }
  };

  const RegisterHandle = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.post('/auth/register', form);
      tostymsg(res.data.message, res.status);
      if (res.status === 201) setShowLogin(true);
    } catch (err) {
      tostymsg(err.response?.data?.message || "Register failed", 0);
    }
  };

  const otpSend = async () => {
    try {
      const res = await axiosInstance.post('/auth/request-reset', { email });
      tostymsg(res.data.message, res.status);
      setStep(2);
    } catch (err) {
      tostymsg(err.response?.data?.message || "OTP Send Failed", 0);
    }
  };

  const otpVerify = async () => {
    try {
      const res = await axiosInstance.post('/auth/reset-password', { email, otp, newPassword });
      tostymsg(res.data.message, res.status);
      if (res.status === 201) setStep(0);
    } catch (err) {
      tostymsg(err.response?.data?.message || "Reset Failed", 0);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="login-container">
      <div className="login-right ">
        <div className="login-box">
          <h2 className="form-title" style={{ fontSize: "50px", fontWeight: 700 }}>

            <span className="welcome-text">
              {showLogin ? "Welcome" : "Register"}
            </span>
          </h2>

          {showLogin && step === 0 && (
            <form onSubmit={loginHandle} className="login-form">
              <div className="input-group">
                <FaEnvelope />
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="input-group">
                <FaLock />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button className="btn-submit">Login</button>
              <div className="bottom-links">
                <span onClick={() => setStep(1)}>Forgot Password?</span>
                <span onClick={() => setShowLogin(false)}>Register</span>
              </div>
            </form>
          )}

          {showLogin && step === 1 && (
            <div className="login-form">
              <button onClick={() => setStep(0)} className="back-btn">← Back to login</button>
              <div className="input-group">
                <FaEnvelope />
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <button onClick={otpSend} className="btn-submit">Send OTP</button>
            </div>
          )}

          {showLogin && step === 2 && (
            <div className="login-form">
              <div className="input-group">
                <FaKey />
                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                />
              </div>
              <div className="input-group">
                <FaRegEyeSlash />
                <input
                  type="password"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
              <button onClick={otpVerify} className="btn-submit">Reset Password</button>
            </div>
          )}

          {!showLogin && (
            <form onSubmit={RegisterHandle} className="login-form">

              <div className="input-group">
                <FaUser />
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="input-group">
                <FaEnvelope />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="input-group">
                <FaRegEyeSlash />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
              </div>
              <button type="submit" className="btn-submit">Register</button>
              <p className="bottom-links">
                Already have an account? <span onClick={() => setShowLogin(true)}>Login</span>
              </p>
            </form>
          )}
        </div>
      </div>
      <div className="login-left">
        <div className="left-img">
          <img src="/image (41).jpg" alt="Login Visual" />
        </div>
      </div>     
    </div>          
  );
};

export default LoginPage;
 