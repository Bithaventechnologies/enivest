export type StoredUsdBalances = {
  btcBalance?: number | string | null;
  ethBalance?: number | string | null;
  solBalance?: number | string | null;
  usdtBalance?: number | string | null;
  usdcBalance?: number | string | null;
  xrpBalance?: number | string | null;
};

const toUsdAmount = (value: number | string | null | undefined) => {
  const amount = Number(value ?? 0);
  return Number.isFinite(amount) ? amount : 0;
};

export const getUsdPortfolioTotal = (balances: StoredUsdBalances) =>
  toUsdAmount(balances.ethBalance) +
  toUsdAmount(balances.usdtBalance) +
  toUsdAmount(balances.usdcBalance) +
  toUsdAmount(balances.solBalance) +
  toUsdAmount(balances.btcBalance) +
  toUsdAmount(balances.xrpBalance);

export { toUsdAmount };
