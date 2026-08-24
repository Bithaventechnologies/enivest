// import React, { useState } from "react";
// import DepositTokenModal from "../components/DepositTokenModal";
// import SwapTokenModal from "../components/SwapTokenModal";

// const tokensList = [
//   {
//     symbol: "BTC",
//     depositAddress: "bc1qexamplebtcaddress",
//     balance: 1.23,
//     price: 67000,
//   },
//   {
//     symbol: "ETH",
//     depositAddress: "0xexampleethaddress",
//     balance: 12.5,
//     price: 3500,
//   },
//   {
//     symbol: "USDT",
//     depositAddress: "Texampleusdtaddress",
//     balance: 5000,
//     price: 1,
//   },
// ];

// export default function WalletPage() {
//   const [showDeposit, setShowDeposit] = useState(false);
//   const [showSwap, setShowSwap] = useState(false);

//   // Deposit modal states
//   const [isGenerating, setIsGenerating] = useState(false);
//   const [isSelectedToken, setIsSelectedToken] = useState(null);

//   // Swap modal states
//   const [isSwapping, setIsSwapping] = useState(false);
//   const [fromToken, setFromToken] = useState(null);
//   const [toToken, setToToken] = useState(null);
//   const [fromAmount, setFromAmount] = useState("");
//   const [toAmount, setToAmount] = useState("");

//   const handleSelectToken = (symbol: string) => {
//     const token = tokensList.find((t) => t.symbol === symbol) || null;
//     setIsSelectedToken(token);
//   };

//   const handleSelectFromToken = (symbol: string) => {
//     const token = tokensList.find((t) => t.symbol === symbol) || null;
//     setFromToken(token);
//     // Auto calculate toAmount if toToken selected
//     if (token && toToken) {
//       setToAmount(
//         (((parseFloat(fromAmount) || 0) * token.price) / toToken.price).toFixed(
//           4
//         )
//       );
//     }
//   };

//   const handleSelectToToken = (symbol: string) => {
//     const token = tokensList.find((t) => t.symbol === symbol) || null;
//     setToToken(token);
//     // Auto calculate toAmount if fromToken selected
//     if (token && fromToken) {
//       setToAmount(
//         (
//           ((parseFloat(fromAmount) || 0) * fromToken.price) /
//           token.price
//         ).toFixed(4)
//       );
//     }
//   };

//   const handleSwap = () => {
//     if (!fromToken || !toToken) return;
//     setIsSwapping(true);
//     setTimeout(() => {
//       console.log(
//         `Swapped ${fromAmount} ${fromToken.symbol} to ${toAmount} ${toToken.symbol}`
//       );
//       setIsSwapping(false);
//       setShowSwap(false);
//     }, 1500);
//   };

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl text-white mb-4">Wallet</h1>

//       <div className="flex gap-4">
//         <button
//           onClick={() => setShowDeposit(true)}
//           className="bg-blue-600 px-4 py-2 rounded text-white"
//         >
//           Deposit
//         </button>
//         <button
//           onClick={() => setShowSwap(true)}
//           className="bg-green-600 px-4 py-2 rounded text-white"
//         >
//           Swap
//         </button>
//       </div>

//       {/* Deposit Token Modal */}
//       <DepositTokenModal
//         show={showDeposit}
//         isGenerating={isGenerating}
//         isSelectedToken={isSelectedToken}
//         availableTokens={tokensList}
//         onSelectToken={handleSelectToken}
//         onClose={() => setShowDeposit(false)}
//       />

//       {/* Swap Token Modal */}
//       <SwapTokenModal
//         show={showSwap}
//         isSwapping={isSwapping}
//         fromToken={fromToken}
//         toToken={toToken}
//         availableTokens={tokensList}
//         fromAmount={fromAmount}
//         toAmount={toAmount}
//         onSelectFromToken={handleSelectFromToken}
//         onSelectToToken={handleSelectToToken}
//         setFromAmount={(val) => {
//           setFromAmount(val);
//           if (fromToken && toToken) {
//             setToAmount(
//               (
//                 ((parseFloat(val) || 0) * fromToken.price) /
//                 toToken.price
//               ).toFixed(4)
//             );
//           }
//         }}
//         onSwap={handleSwap}
//         onClose={() => setShowSwap(false)}
//       />
//     </div>
//   );
// }

import React from "react";

const Test = () => {
  return <div>Test</div>;
};

export default Test;
