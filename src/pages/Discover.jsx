import {Error, Loader, SongCard } from '../components';
import {genres} from '../assets/constants';

const Discover = () => {
  console.log(genres);
  return(
    <div className="flex flex-col"><div className="w-full flex justify-between items-center sm:flex-row flex-col mt-4 mb-10  ">
      
      <h2 className=""> Discover</h2>
      <select />
      </div >
    </div>
  )
};

export default Discover;
