import React, { useEffect } from "react";
import "./SuccessfulRequestResetPassword.css";
import { useNavigate } from "react-router-dom";

function SuccessfulRequestResetPassword() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/login"); // Redirects to login page after a few seconds
    }, 6000); // 8 seconds delay
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="successfulrequestresetpassword-container">
      <div className="successfulrequestresetpassword-box">
        <div className="logo7">
          <img src="/images/DURIANDEV.png" alt="Durian Dev Logo" />
        </div>

        <div className="successfulrequestresetpassword-content">
          <h2 className="successfulrequestresetpassword-title1">
            Your Reset Password Request is Successful
          </h2>
          
          <p className="successfulrequestresetpassword-messages">
            If an account exists for the email you provided, you will receive an email with instructions on resetting your password. If it doesn't arrive, be sure to check your spam folder.
          </p>
        </div>
      </div>
    </div>
  );
}

export default SuccessfulRequestResetPassword;