import React from 'react'

const SuccessToast = ({ message }) => {
  return (
      <div className="toast toast-bottom toast-center z-50">
          <div className="alert alert-success">
          <span>{message}</span>
          </div>
      </div>
  );
};

export default SuccessToast