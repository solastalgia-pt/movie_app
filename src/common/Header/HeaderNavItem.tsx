import { NavLink } from "react-router-dom";
import { useWatchlist } from "@/context/watchlistContext";
import { textColor } from "../../styles";
import { cn } from "../../utils/helper";

interface HeaderProps {
  link: { title: string; path: string };
  isNotFoundPage: boolean;
  showBg: boolean;
}

const HeaderNavItem = ({ link, showBg, isNotFoundPage }: HeaderProps) => {
  const { watchlist } = useWatchlist();
  const count = link.path === "/watchlist" ? watchlist.length : 0;

  return (
    <li>
      <NavLink
        to={link.path}
        className={({ isActive }) => {
          return cn(
            "nav-link",
            isActive
              ? ` active ${showBg ? textColor : `text-secColor`}`
              : ` ${
                  isNotFoundPage || showBg
                    ? "text-[#444] dark:text-gray-300 dark:hover:text-secColor hover:text-black"
                    : "text-gray-300 hover:text-secColor"
                }`
          );
        }}
        end
      >
        {link.title}
        {count > 0 && (
          <span className="ml-1 text-[11px] font-bold bg-[#ff0000] text-white rounded-full px-[6px] py-[1px]">
            {count}
          </span>
        )}
      </NavLink>
    </li>
  );
};

export default HeaderNavItem;
