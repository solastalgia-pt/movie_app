import { Link } from "react-router-dom";
import { BsBookmark } from "react-icons/bs";

import { MovieCard } from "@/common";
import { useWatchlist } from "@/context/watchlistContext";
import { smallMaxWidth } from "@/styles";

const Watchlist = () => {
  const { watchlist } = useWatchlist();

  return (
    <section className={`${smallMaxWidth} lg:pt-36 md:pt-32 sm:pt-28 pt-24 lg:pb-14 md:pb-10 pb-8 min-h-screen`}>
      <h1 className="sm:text-3xl xs:text-2xl text-[22px] font-extrabold dark:text-gray-50 text-gray-800 mb-8">
        My Watchlist
      </h1>

      {watchlist.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 mt-20 dark:text-gray-400 text-gray-500">
          <BsBookmark className="w-14 h-14 opacity-40" />
          <p className="sm:text-lg text-base font-medium">Your watchlist is empty.</p>
          <Link
            to="/"
            className="sm:py-2 py-[6px] sm:px-5 px-4 bg-[#ff0000] text-gray-50 rounded-full text-sm font-medium shadow-md hover:-translate-y-1 transition-all duration-300"
          >
            Browse movies
          </Link>
        </div>
      ) : (
        <div className="flex flex-wrap xs:gap-4 gap-[14px] justify-center">
          {watchlist.map((item) => (
            <div
              key={item.id}
              className="flex flex-col xs:gap-4 gap-2 xs:max-w-[170px] max-w-[124px] rounded-lg lg:mb-6 md:mb-5 sm:mb-4 mb-[10px]"
            >
              <MovieCard movie={item} category={item.category} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default Watchlist;
