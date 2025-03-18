import React, { useState } from "react";
import "./RequestResetPassword.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function RequestResetPassword() {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Validate email format
  const validateEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    let newErrors = {};

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(email)) {
      newErrors.email = "Enter a valid email address";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try{
      const response = await axios.post(`http://localhost:8080/check_Email`, {
        email: email
      });

      console.log(response.data);

      if(response.data === false){
        newErrors.email = "Email does not exist";
        setErrors(newErrors);
        return;
      }
    }catch(error){
      console.log("Error checking email",error);
      alert("Error checking email, email might not be signed up");
      return;
    }

    // Reset errors and show loading state
    setErrors({});
    setLoading(true);

    try{
      const response = await axios.post(`http://localhost:8080/forgotPassword/${email}`);
      console.log(response.data);
    } catch (error) {
      console.error("Error sending email: ", error);
      setErrors({ email: "Failed to send email." });
      setLoading(false);
      return;
    }

    // Simulate an API request delay (1.5 seconds)
    setTimeout(() => {
      setLoading(false);
      navigate("/SuccessfulRequestResetPassword");
    }, 900);
  };

  return (
    <div className="requestresetpassword-container">
      <div className="requestresetpassword-box">
        <div className="logo6">
          <img src="/images/DURIANDEV.png" alt="Durian Dev Logo" />
        </div>

        <form className="requestresetpassword-form" onSubmit={handleSubmit}>
          <h2 className="requestresetpassword-title">Enter your email to reset password</h2>

          <div className="input-requestresetpassword-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={errors.email ? "input-requestresetpassword-error" : ""}
              disabled={loading}
            />
            {errors.email && (
              <p className="requestresetpassword-error" aria-live="polite">{errors.email}</p>
            )}
          </div>

          <button type="submit" className="requestresetpassword-btn" disabled={loading}>
            {loading ? "Processing..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default RequestResetPassword;
