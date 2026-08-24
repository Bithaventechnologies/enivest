/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef, memo } from "react";

function TradingViewWidget() {
  const container: any = useRef();
  const scriptAdded = useRef(false);

  useEffect(() => {
    if (!container.current || scriptAdded.current) return;

    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-market-quotes.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = `
        {
          "colorTheme": "dark",
          "locale": "en",
          "isTransparent": false,
          "showSymbolLogo": true,
          "backgroundColor": "#0F0F0F",
          "support_host": "https://www.tradingview.com",
          "symbolsGroups": [
            {
              "name": "Indices",
              "symbols": [
                { "name": "FOREXCOM:NSXUSD", "displayName": "US 100 Cash CFD" },
                { "name": "CRYPTOCAP:SOL", "displayName": "SOLANA" },
                { "name": "CRYPTO:BTCUSD", "displayName": "BTC" },
                { "name": "CRYPTO:ETHUSD", "displayName": "ETHEREUM" },
                { "name": "CRYPTOCAP:BNB", "displayName": "BNB" },
                { "name": "CRYPTOCAP:USDT", "displayName": "USDT" }
                { "name": "CRYPTOCAP:USDC", "displayName": "USDC" }
              ]
            },
            {
              "name": "Futures",
              "symbols": [
                { "name": "BMFBOVESPA:ISP1!", "displayName": "S&P 500" },
                { "name": "BMFBOVESPA:EUR1!", "displayName": "Euro" },
                { "name": "CMCMARKETS:GOLD", "displayName": "Gold" },
                { "name": "PYTH:WTI3!", "displayName": "WTI Crude Oil" },
                { "name": "BMFBOVESPA:CCM1!", "displayName": "Corn" }
              ]
            },
            {
              "name": "Bonds",
              "symbols": [
                { "name": "EUREX:FGBL1!", "displayName": "Euro Bund" },
                { "name": "EUREX:FBTP1!", "displayName": "Euro BTP" },
                { "name": "EUREX:FGBM1!", "displayName": "Euro BOBL" }
              ]
            },
            {
              "name": "Forex",
              "symbols": [
                { "name": "FX:EURUSD", "displayName": "EUR to USD" },
                { "name": "FX:GBPUSD", "displayName": "GBP to USD" },
                { "name": "FX:USDJPY", "displayName": "USD to JPY" },
                { "name": "FX:USDCHF", "displayName": "USD to CHF" },
                { "name": "FX:AUDUSD", "displayName": "AUD to USD" },
                { "name": "FX:USDCAD", "displayName": "USD to CAD" }
              ]
            }
          ]
        }`;

    container.current.appendChild(script);
    scriptAdded.current = true;

    // Cleanup function to prevent duplicate scripts
    return () => {
      if (container.current) {
        container.current.innerHTML =
          '<div class="tradingview-widget-container__widget"></div>';
      }
      scriptAdded.current = false;
    };
  }, []);
  return (
    <div
      className="w-full md:w-[700px] h-[600px] mx-auto p-4 bg-[#0F0F0F] border border-gray-700 rounded-lg"
      style={{ width: "100%", height: "30rem" }}
    >
      <div className="tradingview-widget-container" ref={container}>
        <div className="tradingview-widget-container__widget" />
      </div>
    </div>
  );
}

export default memo(TradingViewWidget);
