import React from 'react';
import TopPlayM from './TopPlayM';
import { Link } from 'react-router-dom';

// Component for displaying related songs manually (show songs related ot same genre )
const RelatedSongsManual = ({ 
  songData // Data for related songs
}) => {
  return (
    <div className="flex flex-col">
      {/* Title for the related songs section */}
      <div className="flex flex-row justify-between items-center">
        <h1 className="font-bold text-2xl text-white">
          You Might Also Like
      </h1>
      <p>
      <Link to="/top-charts">
            <p className=" text-gray-300 text-lg cursor-pointer hover:text-white">See more</p> 
          </Link>
      </p> 
      </div>
      {/* Container for the TopPlayM component */}
      <div className="mt-6 w-full flex flex-col">
        <TopPlayM songData={songData} />
      </div>

      {/* Additional space below the TopPlayM component */}
      <div className="mt-8">
      </div>
    </div>
  );
};

export default RelatedSongsManual;
