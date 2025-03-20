import React, { useEffect, useState } from 'react';
import './ResetPassword.css';
import { useNavigate , useLocation} from "react-router-dom";
import axios from 'axios';

function ResetPassword() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const email = queryParams.get("email");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  
  const validatePassword = (password) => {
    const specialCharacterRegex = /[!@#$%^&*_]/;
    return password.length >= 8 && specialCharacterRegex.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let newErrors = {};
    
    if (!password) newErrors.password = "New Password is required";
    if (!confirmPassword) newErrors.confirmPassword = "Confirm Password is required";
    if (password && !validatePassword(password)) {
      newErrors.password = "Password must be at least 8 characters & contain a special character (!@#$%^&*_).";
    }
    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try{
      const response = await axios.put(`http://localhost:8080/resetPassword/email/${email}/password/${password}`);
      console.log(response);
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    }catch(error){
      console.log("Error resetting password",error);
      alert("Error resetting password");
    }

  };

  return (
    <div className="reset-password-container">
      <div className="reset-password-box">
        <div className="logo1">
          <img src="/images/DURIANDEV.png" alt="Durian Dev Logo" />
        </div>

        {success && (
          <div className="success-reset-password-message">
            Password Reset Successful!
          </div>
        )}

        <form className="reset-password-form" onSubmit={handleSubmit}>
          <h3>Reset Your Password</h3>
          
          <div className="input-reset-password-group">
            <label>New Password</label>
            <div className="password-group">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={errors.password ? "input-reset-password-error" : ""}
              />
              <button
                type="button"
                className="toggle-reset-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "👁️" : "🔒"}
              </button>
            </div>
            {errors.password && <p className="error1">{errors.password}</p>}
          </div>

          <div className="input-reset-password-group">
            <label>Confirm Password</label>
            <div className="password-group">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Confirm your new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={errors.confirmPassword ? "input-reset-password-error" : ""}
              />
              <button
                type="button"
                className="toggle-reset-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "👁️" : "🔒"}
              </button>
            </div>
            {errors.confirmPassword && <p className="error1">{errors.confirmPassword}</p>}
          </div>

          <button type="submit" className="reset-password-btn">Reset Password</button>

          <p className="reset-password-link">
            
            Click here to <a href="/login">Login </a>
          </p>
        </form>
      </div>

      <div className="reset-password-image">
        <img src="/images/blog.png" alt="Smart Home" />
      </div>
    </div>
  );
}

export default ResetPassword;