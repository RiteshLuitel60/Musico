import React, { useState } from "react";
import axios from "axios";
import { GoogleLogin } from "react-google-login";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("https://your-backend-api.com/login", {
        email,
        password,
      });
      console.log("Login successful:", response.data);
      // Handle successful login (e.g., store token, redirect to another page)
    } catch (err) {
      console.error("Login error:", err);
      setError("Invalid email or password");
    }
  };

  const handleGoogleLoginSuccess = async (response) => {
    try {
      const { tokenId } = response;
      const res = await axios.post(
        "https://your-backend-api.com/google-login",
        { tokenId },
      );
      console.log("Google login successful:", res.data);
      // Handle successful Google login (e.g., store token, redirect to another page)
    } catch (err) {
      console.error("Google login error:", err);
      setError("Google login failed");
    }
  };

  const handleGoogleLoginFailure = (response) => {
    console.error("Google login failed:", response);
    setError("Google login failed");
  };

  return (
    <div className="login-page">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="error">{error}</p>}
        <button type="submit">Login</button>
      </form>
      <GoogleLogin
        clientId="YOUR_GOOGLE_CLIENT_ID"
        buttonText="Login with Google"
        onSuccess={handleGoogleLoginSuccess}
        onFailure={handleGoogleLoginFailure}
        cookiePolicy={"single_host_origin"}
      />
    </div>
  );
};

const RegistrationPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    try {
      const response = await axios.post(
        "https://your-backend-api.com/register",
        { email, password },
      );
      console.log("Registration successful:", response.data);
      // Handle successful registration (e.g., redirect to login page)
    } catch (err) {
      console.error("Registration error:", err);
      setError("Registration failed");
    }
  };

  const handleGoogleLoginSuccess = async (response) => {
    try {
      const { tokenId } = response;
      const res = await axios.post(
        "https://your-backend-api.com/google-login",
        { tokenId },
      );
      console.log("Google login successful:", res.data);
      // Handle successful Google login (e.g., store token, redirect to another page)
    } catch (err) {
      console.error("Google login error:", err);
      setError("Google login failed");
    }
  };

  const handleGoogleLoginFailure = (response) => {
    console.error("Google login failed:", response);
    setError("Google login failed");
  };

  return (
    <div className="registration-page">
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Confirm Password:</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="error">{error}</p>}
        <button type="submit">Register</button>
      </form>
      <GoogleLogin
        clientId="YOUR_GOOGLE_CLIENT_ID"
        buttonText="Register with Google"
        onSuccess={handleGoogleLoginSuccess}
        onFailure={handleGoogleLoginFailure}
        cookiePolicy={"single_host_origin"}
      />
    </div>
  );
};

export { LoginPage, RegistrationPage };
