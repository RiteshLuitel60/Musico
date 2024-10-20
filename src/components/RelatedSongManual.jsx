import React from 'react';
import TopPlayM from './TopPlaysOnly';

const RelatedSongsManual = ({ //used for manually getting random songs coz api is not working as intended 
  songData
}) => {
  return (
    <div className="flex flex-col">
      <h1 className="font-bold text-3xl text-white">
        More Related Songs
      </h1>

      <div className="mt-6 w-full flex flex-col">
        <TopPlayM songData={songData} />
      </div>

      <div className="mt-8">
      </div>
    </div>
  );
};

export default RelatedSongsManual;
