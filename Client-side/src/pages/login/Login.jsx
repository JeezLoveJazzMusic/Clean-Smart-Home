import React, { useState } from 'react';
import './login.css';
import axios from "axios";

// log in component
function Login() {
  // variable input values
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // error handling
  const [errors, setErrors] = useState({});
  // success handling
  const [success, setSuccess] = useState(false);
  // password visibility
  const [showPassword, setShowPassword] = useState(false); 

  // validate password strength
  const validatePassword = (password) => {
    const specialCharacterRegex = /[!@#$%^&*_]/;
    return password.length >= 8 && specialCharacterRegex.test(password);
  };

  // handle form submission
  const handleLogin = async (e) => {
    e.preventDefault();
    // check if empty
    let newErrors = {};
    if (!email) newErrors.email = "Email is required";
    if (!password) newErrors.password = "Password is required";
    // password validation
    if (password && !validatePassword(password)) {
      newErrors.password = "Password must be at least 8 characters & contain a special character (!@#$%^&*_)";
    }
    
    // check if there is error
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const response = await axios.post('http://localhost:8080/login', {
        email: email,
        password: password,
      });
      console.log(response.data);

      // no error pop out success message
      setErrors({});
      setSuccess(true);

      // clear input after submission
      setEmail("");
      setPassword("");
    } catch (error) {
      console.error("Error during signup:", error);
      if(error.status === 400){
        setErrors({ email: "Email is required", password: "Password is required" });
      }else if(error.status === 401){
        setErrors({ email: "Invalid email or password", password: "Invalid email or password" });
      }else{
        alert("An error occurred during login");
      }
    }
    // succes message timer
    setTimeout(() => setSuccess(false), 10000);
  };
  

  return (
    <div className="auth-container">
      <div className="auth-box">
        <div className="logo">
          <img src="/images/DURIANDEV.png" alt="Durian Dev Logo" />
        </div>

        {success && (
          <div className="success-message">
            Login Successful! Redirecting To Dashboard
          </div>
        )}

        <form className="auth-form" onSubmit={handleLogin}>
          <h2>Welcome Back!</h2>

          <div className="input-group">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={errors.email ? "input-error" : ""}
            />
            {errors.email && <p className="error">{errors.email}</p>}
          </div>

          <div className="input-group password-group">
            <label>Password</label>
            <div className="password-container">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={errors.password ? "input-error" : ""}
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "👁️" : "🔒"}
              </button>
            </div>
            {errors.password && <p className="error">{errors.password}</p>}
          </div>

          <div className="form-options">
            <a href="#">Forgot Password?</a>
          </div>

          <button type="submit" className="auth-btn">Login</button>

          <p className="auth-link">
            Don't have an account? <a href="/signup">Sign up here</a>
          </p>
        </form>
      </div>

      <div className="auth-image">
        <img src="/images/blog.png" alt="Smart Home" />
      </div>
    </div>
  );
}

export default Login;