import React from 'react'

const ErrorToast = ({ message }) => {
  return (
      <div className="toast toast-bottom toast-center z-50">
          <div className="alert alert-error">
          <span>{message}</span>
          </div>
      </div>
  );
};

export default ErrorToast