import { ArrowLeft, ArrowUpRight, WalletCards } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { portfolioProviders } from "./portfolio";

const ConnectPortfolio = () => {
  const navigate = useNavigate();
  const [connectingProvider, setConnectingProvider] = useState<string | null>(null);

  const connect = (name: string, path: string) => {
    setConnectingProvider(name);
    navigate(path);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black px-4 py-24 text-white sm:px-6">
      <section className="mx-auto max-w-6xl">
        <button type="button" onClick={() => navigate(-1)} className="mb-8 inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-300 transition hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-orange-400">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back
        </button>

        <div className="rounded-3xl border border-orange-500/25 bg-gradient-to-r from-orange-950/40 via-gray-900 to-pink-950/40 p-6 shadow-[0_0_30px_rgba(249,115,22,0.12)] sm:p-10">
          <div className="flex items-start gap-4">
            <div className="rounded-xl bg-gradient-to-r from-orange-500 to-pink-500 p-3"><WalletCards className="h-6 w-6" aria-hidden="true" /></div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-300">Portfolio connections</p>
              <h1 className="mt-2 text-3xl font-bold sm:text-4xl">Connect Your Portfolio</h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-300 sm:text-base">Choose an exchange or wallet to continue with its existing secure connection flow.</p>
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {portfolioProviders.map((provider) => {
            const isConnecting = connectingProvider === provider.name;
            return (
              <article key={provider.path} className="flex min-h-48 flex-col rounded-2xl border border-gray-700/70 bg-gray-800/50 p-5 backdrop-blur-sm transition hover:-translate-y-0.5 hover:border-orange-500/50 hover:bg-gray-800/80">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white/10 p-2"><img src={provider.img} alt="" className="h-full w-full object-contain" /></div>
                  <div><h2 className="font-semibold text-white">{provider.name}</h2><p className="mt-1 text-sm text-gray-400">Connect and sync your portfolio</p></div>
                </div>
                <button type="button" onClick={() => connect(provider.name, provider.path)} disabled={isConnecting} className="mt-auto inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-orange-500 to-pink-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:from-orange-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-orange-300 disabled:cursor-wait disabled:opacity-70">
                  {isConnecting ? "Opening..." : "Connect"}
                  {!isConnecting && <ArrowUpRight className="h-4 w-4" aria-hidden="true" />}
                </button>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
};

export default ConnectPortfolio;
