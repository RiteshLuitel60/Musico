import { Link } from "react-router-dom";

const DetailsHeader = ({ artistId, artistData, songData }) => {
  // Helper function to get song details
  const getSongDetails = (key) =>
    songData?.resources?.['shazam-songs']?.[songData?.data[0]?.id]?.attributes?.[key];

  // Helper function to get genre name
  const getGenreName = () => {
    if (artistId) {
      return artistData?.attributes?.genreNames?.[0] || 'Unknown';
    } else {
      return getSongDetails('genres')?.primary || 'Unknown';
    }
  };

  // Helper function to get image URL
  const getImageURL = () => {
    if (artistId) {
      return artistData?.attributes?.artwork?.url?.replace('{w}', '500').replace('{h}', '500');
    } else {
      return getSongDetails('artwork')?.url;
    }
  };

  return (
    <div className="relative w-full flex flex-col">
      {/* Gradient background with content */}
      <div className="w-full sm:h-48 h-28 bg-gradient-to-l from-transparent to-black">
        <div className="absolute inset-0 flex items-center">
          {/* Artist/Song artwork */}
          <img
            alt={artistId ? artistData?.attributes?.name : getSongDetails('title')}
            src={getImageURL() || '/fallback-image.jpg'} // Replace with your fallback image
            className="sm:w-48 w-28 sm:h-48 h-28 rounded-full object-cover border-2 shadow-xl shadow-black ml-4"
          />

          {/* Artist/Song details */}
          <div className="ml-5">
            {/* Artist name or Song title */}
            <p className="font-bold sm:text-3xl text-xl text-white">
              {artistId ? (
                artistData?.attributes?.name || 'Unknown Artist'
              ) : (
                <Link to={`/artists/${getSongDetails('artist')?.adamid}`} className="hover:underline">
                  {getSongDetails('title') || 'Unknown Song'}
                </Link>
              )}
            </p>
            {/* Song artist (only shown for songs, not for artist pages) */}
            {!artistId && (
              <p className="text-base text-gray-400 mt-2">
                <Link to={`/artists/${getSongDetails('artist')?.adamid}`} className="hover:underline">
                  {getSongDetails('artist') || 'Unknown Artist'}
                </Link>
              </p>
            )}
            {/* Genre name */}
            <p className="text-xs text-gray-400 mt-2">
              {'Genre: ' + getGenreName()}
            </p>
          </div>
        </div>
      </div>

      {/* Gap after details */}
      <div className="w-full sm:h-44 h-24" />
    </div>
  );
};

export default DetailsHeader;