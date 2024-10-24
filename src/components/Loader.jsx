// Import the loader image from assets
import { loader } from "../assets";

// Loader component that displays a loading animation and optional title
const Loader = ({title}) => (
  <div className="w-full flex justify-center items-center flex-col">
    {/* Display the loader image */}
    <img src={loader} alt="Loader" className="w-32 h-32 object-contain" />
    {/* Display the title or 'Loading' if no title is provided */}
    <h1 className="font-bold text-2xl text-white mt-2">{title || 'Loading'}</h1>
  </div>
);

// Export the Loader component as the default export
export default Loader;
