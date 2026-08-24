import { useState, useEffect } from "react";

function useSimulatedTrade(initialValue: number) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    const interval = setInterval(() => {
      setValue((prev) => Number((prev + (Math.random() * 10 - 5)).toFixed(2)));
    }, Math.random() * 2000 + 1000); // Random interval between 1s and 3s

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, [initialValue]); // Re-run if `initialValue` changes

  return value;
}

export default useSimulatedTrade;
