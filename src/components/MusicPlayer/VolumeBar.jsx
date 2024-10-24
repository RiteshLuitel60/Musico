import React from 'react';
import { BsFillVolumeUpFill, BsVolumeDownFill, BsFillVolumeMuteFill } from 'react-icons/bs';

// VolumeBar component for controlling audio volume
const VolumeBar = ({ value, min, max, onChange, setVolume }) => (
  <div className="hidden lg:flex flex-1 items-center justify-end">
    {/* Display volume up icon for volume > 50% */}
    {value <= 1 && value > 0.5 && <BsFillVolumeUpFill size={25} color="#FFF" onClick={() => setVolume(0)} />}
    {/* Display volume down icon for volume <= 50% and > 0% */}
    {value <= 0.5 && value > 0 && <BsVolumeDownFill size={25} color="#FFF" onClick={() => setVolume(0)} />}
    {/* Display mute icon when volume is 0 */}
    {value === 0 && <BsFillVolumeMuteFill size={25} color="#FFF" onClick={() => setVolume(1)} />}
    {/* Volume slider input */}
    <input
      type="range"
      step="any"
      value={value}
      min={min}
      max={max}
      onChange={onChange}
      className="2xl:w-40 lg:w-32 md:w-32 h-1 ml-2"
    />
  </div>
);

export default VolumeBar;
