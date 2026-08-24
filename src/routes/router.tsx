import { createBrowserRouter } from "react-router-dom";

import Homelayout from "../layouts/Homelayout.tsx";
import Home from "../page/Home.tsx";
import Portfolio from "../page/portfolio.tsx";
import Userlay from "../layouts/Userlayouts.tsx";
import Dashboard from "../client/dashboard.tsx";
import Assets from "../client/assets.tsx";
import Connect from "../page/Connect/index.tsx";
import Binance from "../page/Connect/Binance.tsx";
import Coinbase from "../page/Connect/Coinbase.tsx";
import MyPortfolio from "../page/MyPortfolio.tsx";
import Swap from "../page/Swap.tsx";
import CryptoMarketOverview from "../page/Cryptocurrent.tsx";
import Adminlayout from "../layouts/Adminlayout.tsx";
import Adminauth from "../layouts/Adminauth.tsx";
import Adminlogin from "../Admin/Auth/login.tsx";
import AdminOverview from "../Admin/admin.tsx";
import Users from "../Admin/Users.tsx";
import Allwallets from "../Admin/Allwallets.tsx";
import DepositUser from "../Admin/depositUser.tsx";
import Bybit from "../page/Connect/Bybit.tsx";
import Bitgit from "../page/Connect/Bitgit.tsx";
import Phatom from "../page/Connect/Phatom.tsx";
import Kucoin from "../page/Connect/Kucoin.tsx";
import Blofin from "../page/Connect/Blofin.tsx";
import Okwallet from "../page/Connect/Okwallet.tsx";
import Mexc from "../page/Connect/Mexc.tsx";
import TrustWalletConnector from "../page/Connect/TrustWallet.tsx";
import ExodusConnector from "../page/Connect/Exodus.tsx";
import BingXConnector from "../page/Connect/BingXConnector.tsx";
import PhemexConnector from "../page/Connect/PhemexConnector.tsx";
import KrakenConnector from "../page/Connect/KrakenConnector.tsx";
import GateConnector from "../page/Connect/GateConnector.tsx";
import BitrueConnector from "../page/Connect/BitrueConnector.tsx";
import BitunixConnector from "../page/Connect/BitunixConnector.tsx";
import PendingWithdrawals from "../Admin/PendingWithdraw.tsx";
import Settings from "../Admin/Setting.tsx";
import PendingKyc from "../Admin/PendingKyc.tsx";
import About from "../page/About.tsx";
import TermsPrivacy from "../page/TermsPrivacy.tsx";
import Xrp from "../page/Connect/Xrp.tsx";
import SecuredSlots from "../Admin/SecuredSlots.tsx";

export const router = createBrowserRouter([
  {
    path: "",
    element: <Homelayout />,
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "portfolio",
        element: <Portfolio />,
      },
      {
        path: "swap",
        element: <Swap />,
      },
      {
        path: "allcurrency",
        element: <CryptoMarketOverview />,
      },
      {
        path: "myportfolio",
        element: <MyPortfolio />,
      },
      {
        path: "termsprivacy",
        element: <TermsPrivacy />,
      },
      {
        path: "about",
        element: <About />,
      },
      {
        path: "connect",
        element: <Connect />,
        children: [
          {
            path: "binance",
            element: <Binance />,
          },
          {
            path: "coinbase",
            element: <Coinbase />,
          },

          {
            path: "bybit",
            element: <Bybit />,
          },
          {
            path: "bitgit",
            element: <Bitgit />,
          },
          {
            path: "phatom",
            element: <Phatom />,
          },
          {
            path: "kucoin",
            element: <Kucoin />,
          },
          {
            path: "blofin",
            element: <Blofin />,
          },
          {
            path: "okwallet",
            element: <Okwallet />,
          },
          {
            path: "mexc",
            element: <Mexc />,
          },
          {
            path: "trustWallet",
            element: <TrustWalletConnector />,
          },
          {
            path: "exodus",
            element: <ExodusConnector />,
          },
          {
            path: "bingx",
            element: <BingXConnector />,
          },
          {
            path: "phemex",
            element: <PhemexConnector />,
          },
          {
            path: "kraken",
            element: <KrakenConnector />,
          },
          {
            path: "gate",
            element: <GateConnector />,
          },
          {
            path: "bitrue",
            element: <BitrueConnector />,
          },
          {
            path: "bitunix",
            element: <BitunixConnector />,
          },
          {
            path: "xrp",
            element: <Xrp />,
          },
        ],
      },
    ],
  },
  {
    path: "user",
    element: <Userlay />,
    children: [
      {
        path: "overview",
        element: <Dashboard />,
      },
      {
        path: "assets",
        element: <Assets />,
      },
    ],
  },
  {
    path: "admin",
    element: <Adminlayout />,
    children: [
      {
        path: "admin-overview",
        element: <AdminOverview />,
      },
      {
        path: "all-users",
        element: <Users />,
      },
      {
        path: "all-wallets",
        element: <Allwallets />,
      },
      {
        path: "deposit-user",
        element: <DepositUser />,
      },
      {
        path: "pending-withdraw",
        element: <PendingWithdrawals />,
      },
      {
        path: "pending-kycs",
        element: <PendingKyc />,
      },
      {
        path: "admin-settings",
        element: <Settings />,
      },
      {
        path: "secured-slots",
        element: <SecuredSlots />,
      },
    ],
  },
  {
    path: "admin-auth",
    element: <Adminauth />,
    children: [
      {
        path: "adminlogin",
        element: <Adminlogin />,
      },
    ],
  },
]);
