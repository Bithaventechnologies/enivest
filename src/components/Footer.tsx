// import {
//   FaTwitter,
//   FaInstagram,
//   FaTelegram,
//   FaDiscord,
//   FaReddit,
//   FaFacebook,
//   FaLinkedin,
//   FaYoutube,
//   FaTiktok,
//   FaEnvelope,
// } from "react-icons/fa";
// import Appstore from "../assets/darkAppStore.svg";
// import Googlestore from "../assets/darkGooglePlay.svg";
// import MacAppstore from "../assets/darkMacAppStore.svg";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-gradient-to-b from-black to-gray-900 text-gray-300 pt-20 pb-8 px-6 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-3xl -top-48 -left-24" />
        <div className="absolute w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-3xl -bottom-32 -right-16" />
      </div>

      <div className="max-w-7xl mx-auto relative">
        {/* Social Media Section */}
        {/* <div className="flex flex-col items-center space-y-6 mb-16">
          <h3 className="text-xl font-semibold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Stay Connected
          </h3>
          <div className="flex flex-wrap justify-center gap-6 text-2xl">
            {[
              { icon: FaTwitter, color: "hover:text-blue-400" },
              { icon: FaInstagram, color: "hover:text-pink-500" },
              { icon: FaTelegram, color: "hover:text-blue-500" },
              { icon: FaDiscord, color: "hover:text-indigo-400" },
              { icon: FaReddit, color: "hover:text-orange-500" },
              { icon: FaFacebook, color: "hover:text-blue-600" },
              { icon: FaLinkedin, color: "hover:text-blue-700" },
              { icon: FaYoutube, color: "hover:text-red-500" },
              { icon: FaTiktok, color: "hover:text-pink-400" },
              { icon: FaEnvelope, color: "hover:text-green-400" },
            ].map((item, index) => (
              <button
                key={index}
                className={`p-3 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 hover:border-purple-500/50 transform hover:-translate-y-1 transition-all duration-300 ${item.color}`}
              >
                <item.icon />
              </button>
            ))}
          </div>
        </div> */}

        {/* App Download Section */}
        {/* <div className="flex flex-col items-center space-y-6 mb-16">
          <h3 className="text-xl font-semibold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Download Our App
          </h3>
          <div className="flex flex-wrap justify-center gap-4">
            {[
              { src: Appstore, alt: "App Store" },
              { src: MacAppstore, alt: "Mac App Store" },
              { src: Googlestore, alt: "Google Play" },
            ].map((store, index) => (
              <button
                key={index}
                className="transform hover:scale-105 transition-transform duration-300"
              >
                <img src={store.src} alt={store.alt} className="h-12" />
              </button>
            ))}
          </div>
        </div> */}

        {/* Links Section */}
        {/* <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 mb-16">
          {footerLinks.map((section, index) => (
            <div key={index} className="space-y-4">
              <h4 className="text-lg font-semibold bg-gradient-to-r from-gray-200 to-gray-400 bg-clip-text text-transparent">
                {section.title}
              </h4>
              <ul className="space-y-2">
                {section.links.map((link, idx) => (
                  <li key={idx}>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-white transition-colors duration-300 block py-1"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div> */}

        {/* Bottom Section */}
        <div className="pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">
            <p>
              © {currentYear} EntriVest Cryptography Ledger System. All rights
              reserved.
            </p>
            <div className="flex gap-6">
              <a
                href="/termsprivacy"
                className="hover:text-white transition-colors"
              >
                Terms
              </a>
              <a
                href="/termsprivacy"
                className="hover:text-white transition-colors"
              >
                Privacy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

// const footerLinks = [
//   {
//     title: "Explore",
//     links: ["Crypto Portfolio Tracker", "Swap", "Earn", "Blog"],
//   },
//   {
//     title: "Company",
//     links: ["Product Updates", "Pricing", "Press Kit", "Careers"],
//   },
//   {
//     title: "Useful Tools",
//     links: [
//       "Crypto Profit Calculator",
//       "Profit Return Calculator",
//       "Uniswap V3 Liquidity Analytics",
//     ],
//   },
//   {
//     title: "Additional Products",
//     links: ["MacOS Widget", "Mozilla Extension", "Apple TV"],
//   },
//   {
//     title: "Policies",
//     links: [
//       "Disclaimer",
//       "Terms of Use",
//       "Privacy Policy",
//       "Cookie Policy",
//       "Refund Policy",
//     ],
//   },
//   {
//     title: "Support",
//     links: [
//       "Help Center",
//       "How to Connect Exchanges and Wallets",
//       "How to Track Your DeFi Assets",
//     ],
//   },
// ];

export default Footer;
