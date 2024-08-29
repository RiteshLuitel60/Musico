import React from "react";

const Seekbar = ({ value, min, max, onInput, setSeekTime, appTime }) => {
  // Converts the time to format 0:00
  const getTime = (time) =>
    `${Math.floor(time / 60)}:${`0${Math.floor(time % 60)}`.slice(-2)}`;

  return (
    <div className="flex flex-row items-center justify-between w-full px-2 sm:px-4">
      <button
        type="button"
        onClick={() => setSeekTime(appTime - 5)}
        className="mr-2 sm:mr-4 text-white text-xs sm:text-base"
      >
        -
      </button>
      <p className="text-white text-xs sm:text-sm">
        {value === 0 ? "0:00" : getTime(value)}
      </p>
      <input
        type="range"
        step="any"
        value={value}
        min={min}
        max={max}
        onInput={onInput}
        className="w-20 sm:w-24 md:w-56 lg:w-72 2xl:w-96 h-1 mx-2 sm:mx-4 2xl:mx-6 rounded-lg"
      />
      <p className="text-white text-xs sm:text-sm">
        {max === 0 ? "0:00" : getTime(max)}
      </p>
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
