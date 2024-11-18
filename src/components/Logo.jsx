// Import the logo image from assets
import musicoLogo from '../assets/musicoLogo.png';
// Import Link component from react-router-dom for navigation
import { Link } from 'react-router-dom';

// Define the Logo component
const Logo = () => {
  // Define the alternative text for the logo
  let Alt = <p className="text-white text-2xl font-bold">Musico</p>;
  return (
    // Link to the home page
    <Link to="/">
      {/* Render the logo image with responsive sizes and transition effects */}
      <img 
        src={musicoLogo} 
        alt={Alt} 
        className="w-32 sm:w-40 md:w-48 lg:w-56 xl:w-64 transition-all duration-300"
      />
    </Link>
  );
};

// Export the Logo component for use in other parts of the application
export default Logo;