import React from 'react';

const AuthLayout = ({ children }) => {
  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{
        background: "linear-gradient(to right, #282828 0%, #282828 100%)",
      }}
    >
        {children}
    </div>
  );
};

export default AuthLayout;
