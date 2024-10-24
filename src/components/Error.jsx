import React from 'react';

// Error component to display error messages
const Error = ({ message }) => (
  // Container for centering the error message
  <div className='w-full flex justify-center items-center'>
    {/* Error message display */}
    <h1 className='font-bold text-2xl text-white mt-2'>{message || 'Something went wrong. Please try again.'}</h1>
  </div>
);

export default Error;