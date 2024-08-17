
import React from 'react';
import TopPlayM from './RelatedSongsM';

const RelatedSongsManual = ({ //used for manually getting random songs coz api is not working as intended 
  data, 
  artistId, 
  isPlaying, 
  activeSong, 
  handlePauseClick, 
  handlePlayClick, 
  songid 
}) => {
  return (
    <div className="flex flex-col">
      <h1 className="font-bold text-3xl text-white">
        More Related Songs
      </h1>

      <div className="mt-6 w-full flex flex-col">
        <TopPlayM />
      </div>

      <div className="mt-8">
      </div>
    </div>
  );
};

export default RelatedSongsManual;
