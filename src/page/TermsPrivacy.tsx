import React from "react";
import { motion } from "framer-motion";

const TermsPrivacy: React.FC = () => {
  return (
    <section className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black px-6 py-24 text-white">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold bg-gradient-to-r from-white to-orange-400 bg-clip-text text-transparent mb-4">
            Terms & Privacy
          </h1>
          <p className="text-gray-400">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </motion.div>

        {/* TERMS OF SERVICE */}
        <Section title="Terms of Service">
          <p>
            The EntriVest Cryptography Ledger System (“the Platform”) is
            provided for informational and organizational purposes only. By
            accessing or using this platform, you agree to these Terms of
            Service.
          </p>

          <h3>Not Financial Advice</h3>
          <p>
            Nothing on this platform constitutes financial, investment, legal,
            or tax advice. All information is provided for educational and
            informational purposes only. You are solely responsible for your
            financial decisions.
          </p>

          <h3>User Responsibility</h3>
          <p>
            You acknowledge that digital assets involve risk, including the
            potential loss of capital. You assume full responsibility for
            safeguarding your wallets, private keys, and credentials.
          </p>

          <h3>No Guarantees</h3>
          <p>
            We make no guarantees regarding performance, outcomes,
            profitability, or protection against loss. Past performance does not
            indicate future results.
          </p>

          <h3>Third-Party Services</h3>
          <p>
            The platform may integrate or link to third-party services (such as
            exchanges, wallets, or APIs). We are not responsible for the
            availability, accuracy, or security of these third parties.
          </p>

          <h3>Limitation of Liability</h3>
          <p>
            To the fullest extent permitted by law, we shall not be liable for
            any direct, indirect, incidental, or consequential damages arising
            from your use of the platform.
          </p>

          <h3>Changes to Terms</h3>
          <p>
            We reserve the right to modify these terms at any time. Continued
            use of the platform constitutes acceptance of the updated terms.
          </p>
        </Section>

        {/* PRIVACY POLICY */}
        <Section title="Privacy Policy">
          <h3>Information We Collect</h3>
          <p>
            We may collect limited technical information such as browser type,
            device information, and anonymous usage analytics to improve system
            performance.
          </p>

          <h3>Wallet & Financial Data</h3>
          <p>
            We do not store private keys, seed phrases, or sensitive wallet
            credentials. Wallet connections are handled directly through
            third-party providers.
          </p>

          <h3>Cookies & Local Storage</h3>
          <p>
            The platform may use cookies or local storage to improve user
            experience, such as caching market data or saving preferences.
          </p>

          <h3>Data Sharing</h3>
          <p>
            We do not sell or rent personal data. Data may be shared only when
            required by law or to operate essential platform services.
          </p>

          <h3>Security</h3>
          <p>
            While we implement reasonable security measures, no system is
            completely secure. You acknowledge and accept this risk.
          </p>

          <h3>Your Consent</h3>
          <p>By using the platform, you consent to this Privacy Policy.</p>
        </Section>

        {/* FOOTER NOTE */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-20 text-center text-gray-500 text-sm"
        >
          This platform is built for discipline, structure, and long-term
          positioning — not speculation.
        </motion.div>
      </div>
    </section>
  );
};

export default TermsPrivacy;

/* Helper Component */
const Section: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => (
  <div className="mb-16">
    <h2 className="text-3xl font-semibold text-orange-400 mb-6">{title}</h2>
    <div className="space-y-4 text-gray-300 leading-relaxed">{children}</div>
  </div>
);
