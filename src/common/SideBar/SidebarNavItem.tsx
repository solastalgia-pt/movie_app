import { NavLink } from "react-router-dom";
import { INavLink } from "@/types";
import { useWatchlist } from "@/context/watchlistContext";
import { listItem, activeListItem } from "@/styles";
import { cn } from "@/utils/helper";

interface SidebarNavItemProps {
  link: INavLink;
  closeSideBar: () => void;
}

const SidebarNavItem = ({ link, closeSideBar }: SidebarNavItemProps) => {
  const { watchlist } = useWatchlist();
  const count = link.path === "/watchlist" ? watchlist.length : 0;

  return (
    <li>
      <NavLink
        to={link.path}
        className={({ isActive }) => {
          return cn(listItem, isActive && activeListItem);
        }}
        onClick={closeSideBar}
      >
        {<link.icon className="text-[18px]" />}
        <span>{link.title}</span>
        {count > 0 && (
          <span className="ml-1 text-[11px] font-bold bg-[#ff0000] text-white rounded-full px-[6px] py-[1px]">
            {count}
          </span>
        )}
      </NavLink>
    </li>
  );
};

export default SidebarNavItem;
