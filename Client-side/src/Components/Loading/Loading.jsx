import React from 'react';

const Loading = ({ size = 120, color = '#3498db' }) => {
  // Container takes full width and height of its parent – use 100vh if needed.
  const containerStyle = {
    backgroundColor: "#ffffff",
    borderRadius: "40px",
    padding: "20px",
    width: "100%",
    height: "100%",
    boxShadow: "0 5px 10px rgba(0, 0, 0, 0.1)",
    overflow: "visible",
    marginTop: "0px",
    itemAlign: "center"
  };

  // Calculate border width relative to the spinner size (default is similar to your original: 16px when size is 120px)
  const borderWidth = size * 0.1333;
  const spinnerStyle = {
    border: `${borderWidth}px solid #f3f3f3`,
    borderTop: `${borderWidth}px solid ${color}`,
    borderRadius: '50%',
    width: size,
    height: size,
    animation: 'spin 2s linear infinite'
  };

  return (
    <>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
      <div style={containerStyle}>
        <div style={spinnerStyle}></div>
      </div>
    </>
  );
};

export default Loading;