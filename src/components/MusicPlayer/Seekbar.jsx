import React from "react";

// Seekbar component for controlling audio playback
const Seekbar = ({ value, min, max, onInput, setSeekTime, appTime }) => {
  // Function to convert time to format 0:00
  const getTime = (time) =>
    `${Math.floor(time / 60)}:${`0${Math.floor(time % 60)}`.slice(-2)}`;

  return (
    // Container for seekbar elements
    <div className="flex flex-row items-center justify-between w-full px-2 sm:px-4">
      {/* Button to rewind 5 seconds */}
      <button
        type="button"
        onClick={() => setSeekTime(appTime - 5)}
        className="mr-2 sm:mr-4 text-white text-xs sm:text-base"
      >
        -
      </button>
      {/* Display current time */}
      <p className="text-white text-xs sm:text-sm">
        {value === 0 ? "0:00" : getTime(value)}
      </p>
      {/* Seekbar input range */}
      <input
        type="range"
        step="any"
        value={value}
        min={min}
        max={max}
        onInput={onInput}
        className="w-20 sm:w-24 md:w-56 lg:w-72 2xl:w-96 h-1 mx-2 sm:mx-4 2xl:mx-6 rounded-lg"
      />
      {/* Display total duration */}
      <p className="text-white text-xs sm:text-sm">
        {max === 0 ? "0:00" : getTime(max)}
      </p>
      {/* Button to forward 5 seconds */}
      <button
        type="button"
        onClick={() => setSeekTime(appTime + 5)}
        className="ml-2 sm:ml-4 text-white text-xs sm:text-base"
      >
        +
      </button>
    </div>
  );
};

export default Seekbar;
