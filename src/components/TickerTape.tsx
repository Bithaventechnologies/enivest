import { useEffect, useRef } from "react";

function TickerTapeWidget() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;

    if (!container) return;

    // Remove anything TradingView previously injected
    container.innerHTML = "";

    const script = document.createElement("script");

    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js";

    script.type = "text/javascript";
    script.async = true;

    script.innerHTML = `
      {
        "symbols": [
          {
            "proName": "FX_IDC:EURUSD",
            "title": "EUR to USD"
          },
          {
            "proName": "BITSTAMP:BTCUSD",
            "title": "Bitcoin"
          },
          {
            "proName": "BITSTAMP:ETHUSD",
            "title": "Ethereum"
          },
          {
            "proName": "CRYPTOCAP:SOL",
            "title": "SOLANA"
          },
          {
            "proName": "CRYPTOCAP:USDT",
            "title": "USDT"
          },
          {
            "proName": "CRYPTOCAP:USDC",
            "title": "USDC"
          },
          {
            "proName": "CRYPTOCAP:BNB",
            "title": "BNB"
          },
          {
            "proName": "CRYPTOCAP:XRP",
            "title": "XRP"
          }
        ],
        "colorTheme": "dark",
        "locale": "en",
        "largeChartUrl": "",
        "isTransparent": false,
        "showSymbolLogo": true,
        "displayMode": "adaptive"
      }
    `;

    container.appendChild(script);

    return () => {
      container.innerHTML = "";
    };
  }, []);

  return (
    <div
      className="tradingview-widget-container mt-[4rem] lg:mt-[4.5rem]"
      ref={containerRef}
    />
  );
}

export default TickerTapeWidget;