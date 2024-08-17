import React from 'react';

const Error = ({ errorMessage }) => {
  return (
    <div className="w-full flex justify-center items-center">
      <div className=" text-white p-4 rounded-md">
        <h1 className="font-bold text-xl">Oops! Something went wrong.</h1>
        {errorMessage && <p className="text-sm">{errorMessage}</p>}
      </div>
    </div>
  );
};

export default Error;