import MarketView from "../components/MarketView";
import CryptoMarketTable from "./Cryptosec";
import FeaturesSection from "./featuressect";
import Hero from "./Hero";
import ProfitLossAnalysis from "./Processloss";

const Home = () => {
  return (
    <>
      <Hero />
      <CryptoMarketTable />
      <MarketView />
      <FeaturesSection />
      <ProfitLossAnalysis />
    </>
  );
};

export default Home;
