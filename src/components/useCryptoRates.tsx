import { useState, useEffect } from "react";

const DEFAULT_RATES = {
  ethToUsdt: 2600,
  solToUsdt: 150,
  btcToUsdt: 64000,
  usdcToUsdt: 1,
  xrpToUsdt: 0.85,
};

export function useCryptoRates() {
  const [rates, setRates] = useState(DEFAULT_RATES);

  const usdtToUsdt = 1;

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const symbols = [
          "ETHUSDT",
          "SOLUSDT",
          "BTCUSDT",
          "USDCUSDT",
          "XRPUSDT",
        ];

        const response = await fetch(
          `https://api.binance.com/api/v3/ticker/price?symbols=${encodeURIComponent(
            JSON.stringify(symbols),
          )}`,
        );

        if (!response.ok) {
          throw new Error("Crypto API unavailable");
        }

        const data = await response.json();

        const prices: Record<string, number> = {};

        for (const item of data) {
          prices[item.symbol] = Number(item.price);
        }

        const newRates = {
          ethToUsdt: prices.ETHUSDT || 0,
          solToUsdt: prices.SOLUSDT || 0,
          btcToUsdt: prices.BTCUSDT || 0,
          usdcToUsdt: prices.USDCUSDT || 0,
          xrpToUsdt: prices.XRPUSDT || 0,
        };

        // If ANY required rate is unavailable,
        // use defaults instead.
        const invalid =
          !newRates.ethToUsdt ||
          !newRates.solToUsdt ||
          !newRates.btcToUsdt ||
          !newRates.usdcToUsdt ||
          !newRates.xrpToUsdt;

        if (invalid) {
          console.warn("Some crypto rates unavailable. Using defaults.");
          setRates(DEFAULT_RATES);
          return;
        }

        // API worked
        setRates(newRates);

        // Cache successful rates
        localStorage.setItem("cryptoRates", JSON.stringify(newRates));

        localStorage.setItem("cryptoRatesTimestamp", Date.now().toString());
      } catch (error) {
        console.warn("Crypto API unavailable. Using default rates.", error);

        // API unavailable → defaults
        setRates(DEFAULT_RATES);
      }
    };

    fetchRates();
  }, []);

  return {
    ...rates,
    usdtToUsdt,
  };
}
