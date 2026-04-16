import React, { useCallback, useContext, useEffect, useState } from "react";
import { IWatchlistItem } from "@/types";

const STORAGE_KEY = "watchlist";

const context = React.createContext({
  watchlist: [] as IWatchlistItem[],
  addToWatchlist: (_item: IWatchlistItem) => {},
  removeFromWatchlist: (_id: string) => {},
  isInWatchlist: (_id: string) => false as boolean,
});

interface Props {
  children: React.ReactNode;
}

const WatchlistProvider = ({ children }: Props) => {
  const [watchlist, setWatchlist] = useState<IWatchlistItem[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(watchlist));
  }, [watchlist]);

  const addToWatchlist = useCallback((item: IWatchlistItem) => {
    setWatchlist((prev) => {
      if (prev.some((i) => String(i.id) === String(item.id))) return prev;
      return [...prev, { ...item, id: String(item.id) }];
    });
  }, []);

  const removeFromWatchlist = useCallback((id: string) => {
    setWatchlist((prev) => prev.filter((i) => String(i.id) !== String(id)));
  }, []);

  const isInWatchlist = useCallback(
    (id: string) => watchlist.some((i) => String(i.id) === String(id)),
    [watchlist]
  );

  return (
    <context.Provider
      value={{ watchlist, addToWatchlist, removeFromWatchlist, isInWatchlist }}
    >
      {children}
    </context.Provider>
  );
};

export default WatchlistProvider;

export const useWatchlist = () => useContext(context);
