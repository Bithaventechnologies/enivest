/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Plus, Minus } from "lucide-react";

const faqs = [
  {
    question:
      "How can I connect my exchange account to EntriVest Cryptography Ledger System?",
    answer:
      "There is a step-by-step guide that details the connection process, highlighting any specific requirements such as API keys, secrets, permissions, two-factor authentication procedures. If the instructions are missing or not helping, you can contact support to help with the connection.",
  },
  {
    question:
      "Can I execute trades directly from your platform once my exchange is integrated?",
    answer:
      "EntriVest Cryptography Ledger System doesn't support direct trading on its platform, so it's important to set up your account with read-only access using connections that can be synced. Rest assured, all your trades and transaction data will be automatically synced and processed from your exchange.",
  },
  {
    question:
      "Is my personal information and asset data secure with EntriVest Cryptography Ledger System integrations?",
    answer:
      "EntriVest Cryptography Ledger System prioritizes the security of your personal information and asset data. With advanced security measures in place, you can rest assured that your data is handled with the utmost care and protection during any integration process.",
  },
  {
    question:
      "Are my assets safe when connecting my accounts to EntriVest Cryptography Ledger System?",
    answer:
      "Yes, your assets are safe when connecting your accounts to EntriVest Cryptography Ledger System. We ensure the safety of your funds by obtaining read-only access, which allows us to display your balances and transactions without having the authority to conduct any transactions or make changes to your account. We employ advanced and up-to-date security measures to protect your data and maintain the highest level of safety. Your trust in our service is invaluable, and we are dedicated to upholding the safety and confidentiality of your information at all times.",
  },
];

const Connect = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFaq = (index: any) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="w-full h-auto bg-black flex justify-center flex-col items-center py-10">
      <Outlet />
      <div className="max-w-4xl w-full px-6 text-white">
        <h2 className="text-3xl font-bold text-center mb-6">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="p-4 border-b border-gray-800  cursor-pointer"
              onClick={() => toggleFaq(index)}
            >
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-400">
                  {faq.question}
                </h3>
                {openIndex === index ? (
                  <Minus className="text-gray-400" />
                ) : (
                  <Plus className="text-gray-400" />
                )}
              </div>
              {openIndex === index && (
                <p className="text-gray-300 mt-2">{faq.answer}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Connect;
