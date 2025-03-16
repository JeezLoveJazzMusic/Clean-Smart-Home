import React, { useState } from 'react';
import './Signup.css';
import axios from "axios";

// signup component
function Signup() {
  // variable to store input 
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // validation error state
  const [errors, setErrors] = useState({});

  // validation for success
  const [success, setSuccess] = useState(false);

  // password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // password strength
  const validatePassword = (password) => {
    const specialCharacterRegex = /[!@#$%^&*_]/;
    return password.length >= 8 && specialCharacterRegex.test(password);
  };

  // handle the form submission
  const handleSignup = async (e) => {
    e.preventDefault();

    // check if empty
    let newErrors = {};
    if (!username) newErrors.username = "Username is required";
    if (!email) newErrors.email = "Email is required";
    if (!password) newErrors.password = "Password is required";
    if (!confirmPassword) newErrors.confirmPassword = "Confirm Password is required";

    // password validation
    if (password && !validatePassword(password)) {
      newErrors.password = "Password must be at least 8 characters & contain a special character (!@#$%^&*_)";
    }
    // check matching password
    if (password && confirmPassword && password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match!";
    }
    // if theres is error, user unable to submit the form
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // if no error, user able to submit the form
    try {
      const response = await axios.post('http://localhost:8080/signup', {
        username: username,
        email: email,
        password: password,
      });
      console.log(response.data);

      // no error pop out success message
      setErrors({});
      setSuccess(true);

      // clear input after submission
      setUsername("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error("Error during signup:", error);
      if(error.status === 409){
        setErrors({ email: "Email is already being used!" });
      }
    }

    // timer for success message
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
            Signup Successful! Redirecting To Dashboard
          </div>
        )}

        <form className="auth-form" onSubmit={handleSignup}>
          <h2>Create an Account</h2>

          <div className="input-group">
            <label>Username</label>
            <input
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={errors.username ? "input-error" : ""}
            />
            {errors.username && <p className="error">{errors.username}</p>}
          </div>

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

          <div className="input-group password-group">
            <label>Confirm Password</label>
            <div className="password-container">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={errors.confirmPassword ? "input-error" : ""}
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? "👁️" : "🔒"}
              </button>
            </div>
            {errors.confirmPassword && <p className="error">{errors.confirmPassword}</p>}
          </div>

          <button type="submit" className="auth-btn">Sign Up</button>

          <p className="auth-link">
            Already have an account? <a href="/login">Login here</a>
          </p>
        </form>
      </div>

      <div className="auth-image">
        <img src="/images/homeautomationbanner.jpg" alt="Smart Home" />
      </div>
    </div>
  );
}


export default Signup;