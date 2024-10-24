import React from 'react';
import TopPlayM from './TopPlaysOnly';

// Component for displaying related songs manually (show songs related ot same genre )
const RelatedSongsManual = ({ 
  songData // Data for related songs
}) => {
  return (
    <div className="flex flex-col">
      {/* Title for the related songs section */}
      <h1 className="font-bold text-3xl text-white">
        You Might Also Like
      </h1>

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
