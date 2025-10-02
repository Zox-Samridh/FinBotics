import React from 'react';

const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen px-5 py-8 bg-gradient-to-r from-[#282828] to-[#282828] text-white">
      <div className="container mx-auto my-32">
        {children}
      </div>
    </div>
  );
};

export default MainLayout;
