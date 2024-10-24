import musicoLogo from '../assets/musicologo.png';
import { Link } from 'react-router-dom';

const Logo = () => {
  let Alt = <p className="text-white text-2xl font-bold">Musico</p>;
  return (
    <Link to="/">
      <img src={musicoLogo} alt={Alt} className="w-full" />
    </Link>
  );
};

export default Logo;