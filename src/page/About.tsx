import React from "react";
import { motion } from "framer-motion";
import team1 from "../assets/team_1.jpeg";
import team2 from "../assets/team_2.jpeg";
import team3 from "../assets/team_3.jpeg";

interface TeamMember {
  name: string;
  role: string;
  image: string;
}

const team: TeamMember[] = [
  {
    name: "John Vazquez (Coach JV)",
    role: "Founder / CEO",
    image: team2,
  },
  {
    name: "Jeremy Quintanilla",
    role: "Chief Financial Officer",
    image: team1,
  },
  {
    name: "Mae Warner",
    role: "Chief Operating Officer",
    image: team3,
  },
];

const About: React.FC = () => {
  return (
    <section className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black px-6 py-24">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-white to-orange-400 bg-clip-text text-transparent mb-6">
            About The System
          </h1>
          <p className="text-gray-400 text-lg max-w-3xl mx-auto leading-relaxed">
            The global banking system is changing in real time. The EntriVest
            Cryptography Ledger System was built as a response — not to chase
            trends, but to establish structure, protection, and disciplined
            execution for long-term wealth positioning.
          </p>
        </motion.div>

        {/* Philosophy */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-b from-gray-800 to-gray-900 border border-gray-800 rounded-2xl p-10 mb-24"
        >
          <h2 className="text-3xl font-semibold text-orange-400 mb-4">
            Our Philosophy
          </h2>
          <p className="text-gray-300 leading-relaxed">
            This system prioritizes protection first, consistency second, and
            long-term positioning always. Assets are placed within a structured,
            cryptography-based framework designed to emphasize security,
            control, and disciplined execution — allowing wealth to work without
            sacrificing the foundation.
            <br />
            <br />
            This is not financial advice. This is simply the system used to
            build generational wealth.
          </p>
        </motion.div>

        {/* Team Section */}
        <div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-white to-orange-400 bg-clip-text text-transparent"
          >
            The Team Behind The Framework
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-gradient-to-b from-gray-800 to-gray-900 border border-gray-800 rounded-2xl p-8 text-center hover:border-orange-500/40 transition-all"
              >
                <div className="w-24 h-24 mx-auto mb-6 rounded-full overflow-hidden border border-gray-700">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-lg font-semibold text-white">
                  {member.name}
                </h3>
                <p className="text-sm text-gray-400 mt-2">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
