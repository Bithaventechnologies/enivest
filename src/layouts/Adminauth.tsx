import { Outlet } from "react-router-dom";
import logo from "../assets/coinstat_logo.png";

const AdminAuthlayout = () => {
  return (
    <div className="w-full min-h-[100dvh] bg-gradient-to-br from-gray-900 via-teal-900 to-gray-900 flex justify-center items-center flex-col ">
      <div className="w-[10%] h-[10%]  flex justify-center items-center max-md:w-[90%]">
        <img src={logo} alt="" className="w-full" />
      </div>
      <Outlet />
      {/* <p className="text-center text-[#c5c5c5c5] text-[1rem] my-2">
        Copyright © 2024 BLOCKCRYPTO. All Rights Reserved.
      </p> */}
    </div>
  );
};

export default AdminAuthlayout;
