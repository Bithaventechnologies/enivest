import React from "react";
import logo from "../assets/Bitcoin.svg";
import { MdOutlineClear, MdOutlineDashboard } from "react-icons/md";
import { GiPayMoney } from "react-icons/gi";
// import { RiExchangeFundsFill, RiBarChartFill } from "react-icons/ri";
// import { FaLayerGroup } from "react-icons/fa";
// import { BiTransfer } from "react-icons/bi";
// import { IoDiamondOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

interface MenuItem {
  name: string;
  icon: React.ReactElement;
  path: string;
}

interface SidebarProps {
  active: boolean;
  setActive: (active: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ active, setActive }) => {
  const navigate = useNavigate();
  const [selectedMenu, setSelectedMenu] = React.useState<number | null>(null);

  // ✅ New Web3 Menu Items
  const menuItems: MenuItem[] = [
    { name: "Dashboard", icon: <MdOutlineDashboard />, path: "/user/overview" },
    { name: "Assets", icon: <GiPayMoney />, path: "/user/assets" },
    // { name: "DeFi", icon: <RiExchangeFundsFill />, path: "/defi" },
    // { name: "Analytics", icon: <RiBarChartFill />, path: "/analytics" },
    // { name: "NFTs", icon: <IoDiamondOutline />, path: "/nfts" },
    // { name: "Transactions", icon: <BiTransfer />, path: "/transactions" },
  ];

  const handleMenuClick = (path: string, index: number) => {
    setSelectedMenu(index);
    navigate(path);
    setActive(false);
  };

  return (
    <aside className={`sidebar z-30 ${active ? "active" : ""}`}>
      {/* ✅ Close Sidebar */}
      <div className="close_icon" onClick={() => setActive(!active)}>
        <MdOutlineClear />
      </div>

      {/* ✅ Sidebar Content */}
      <div className="sidebar_inner">
        {/* Logo */}
        <div className="logo">
          <img src={logo} alt="Web3 Dashboard Logo" />
          <span className="text-slate-200"></span>
        </div>

        {/* ✅ Sidebar Menu */}
        <div className="sidebar_items w-[90%]">
          <ul className="sidebar_items_inner text-slate-400">
            {menuItems.map((item, index) => (
              <li
                key={index}
                className={selectedMenu === index ? "active" : ""}
                onClick={() => handleMenuClick(item.path, index)}
              >
                <span className="menu_icon">{item.icon}</span>
                <a href="#">{item.name}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
