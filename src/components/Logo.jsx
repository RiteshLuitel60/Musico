import musicoLogo from '../assets/musicologo.png';
import { Link } from 'react-router-dom';

const Logo = () => {
  let Alt = <p className="text-white text-2xl font-bold">Musico</p>;
  return (
    <Link to="/">
      <img 
        src={musicoLogo} 
        alt={Alt} 
        className="w-32 sm:w-40 md:w-48 lg:w-56 xl:w-64 transition-all duration-300"
      />
    </Link>
  );
};

export default Logo;