"use client";

import React from "react";
import { motion } from "framer-motion";
import styles from "./whatWeOffer.module.scss";

const ComputerIcon = "/assets/icons/computer.png";
const GroupComputerIcon = "/assets/icons/group-computer.png";
const PersonIcon = "/assets/icons/Person.png";
const LineImage = "/assets/images/line.png";

const offerData = [
  {
    title: "1.0 Basic to Advance Price Action Course",
    description:
      "Real time market breakdowns and actionable insights to improve your decision making.",
    icon: ComputerIcon,
    backContent: {
      title: "Basic to Advance Price Action Course",
      features: [
        "Introduction of forex",
        "Introduction of Mt5 & Tradingview",
        "What is Forex Analysis",
        "What is Candlestick Patterns",
        "What is Chart Patterns",
        "All about Trendline Support & Resistance",
        "Indicators - Moving Average,Relative Strength Index",
        "Stochastic Indicator",
        "Volume Study",
        "How to use Combination of Multiple Indicator",
        "What is Price Action Trading",
        "Demand & Supply Price Action Strategy",
        "Strategy Backtesting & Putting it all Together",
        "Psychology session",
        "live market analysis session and VIP telegram",
      ],
      duration: "6 Weeks",
      level: "Beginner to Advanced",
      price: "Free To Join",
    },
  },
  {
    title: "2.0 SMC + ICT Advance Course",
    description:
      "Participate in dynamic, scheduled live online sessions led by an expert instructor.",
    icon: GroupComputerIcon,
    backContent: {
      title: "SMC + ICT Advance Course",
      features: [
        "Concepts of Fibonacci (Extensions and Retracement)",
        "Structure Advance Structure Mapping With Logic",
        "BOS (Break of structure) CHOCH (Change of character)",
        "How to Identify Valid & Invalid BOS and CHOCH",
        "Supply Demand Valid & Invalid Identification and Theory Behind it",
        "Advanced Liquidity Concepts and Mitigation",
        "Identifying Valid Imbalancement zone (IMB, Void,FVG)",
        "Smart Money Traps (Deep Down Identification)",
        "What is POI (Point of interest) Order Flow (oF)",
        "Order Block (OB)",
        "Strategy Explanation and Backtesting sessions",
        "Entry and Exit Trading strategies",
        "Psychology Sessions",
        "live market analysis session and VIP telegram",
      ],
      duration: "8 Weeks",
      level: "Advanced",
      price: "1UU$",
    },
  },
  {
    title: "3.0 Personal Mentorship Program",
    description:
      "Engage in face to face learning conducted in a dedicated physical training environment.",
    icon: PersonIcon,
    backContent: {
      title: "Personal Mentorship Program",
      features: [
        "45 DAYS PROGRAM",
        "DAILY 2 HOUR CLASSES",
        "SUPER ADVANCE C+ NEW THEORIES",
        "DAILY LIVE TRADING - LONDON & NEW YORK SESSION",
        "1 TO 1 Q&A SESSION",
        "EXCLUSIVE GROUP ACCESS",
        "DIRECT ACCES TO MENTORS",
        "GUARANTEED ACCOUNT GROWTH",
        "PROP FIRM PREPARATION",
        "FUND MANAGEMENT TRAINING",
        "10+ NEW STRATEGIES REVEALING & BACKTESTING",
        "EMERGENCY STRATEGY CALLS",
        "FUNDAMENTAL TRADING STRATEGIES",
        "OTHER INCOME OPPORTUNITIES",
        "SPECIAL PSHYCHOLOGY SESSIONS",
        "MONEY & RISK MANAGEMENT TRAINING",
        "24*7 PERSONAL SUPPORT & MANY MORE",
      ],
      duration: "45 Days",
      level: "All Levels",
      price: "3UU$",
    },
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 40,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

export default function WhatWeOffer() {
  return (
    <section className={styles.whatWeOffer}>
      <div className="container-md">
        {/* Title animation */}
        <motion.div
          className={styles.title}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2>what we offer</h2>
        </motion.div>

        {/* Grid */}
        <motion.div
          className={styles.grid}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {offerData.map((item, index) => (
            <motion.div
              key={index}
              className={styles.flipCard}
              variants={itemVariants}
            >
              <div className={styles.cardInner}>
                <div className={styles.cardFront}>
                  <div className={styles.griditems}>
                    {/* Rotating line */}
                    <motion.div className={styles.lineImage}>
                      <img src={LineImage} alt="Line" />
                    </motion.div>

                    {/* Icon pop */}
                    <motion.div
                      className={styles.iconCemter}
                      initial={{ scale: 0.8, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2, duration: 0.4 }}
                    >
                      <img src={item.icon} alt={item.title} />
                    </motion.div>

                    {/* Text */}
                    <div className={styles.details}>
                      <h3>{item.title}</h3>
                      <p>{item.description}</p>
                    </div>
                  </div>
                </div>

                <div className={styles.cardBack}>
                  <motion.div className={styles.lineImage}>
                    <img src={LineImage} alt="Line" />
                  </motion.div>

                  <div className={styles.backContent}>
                    <h3>{item.backContent.title}</h3>
                    {/* <hr className={styles.headingDivider} /> */}
                    <div className={styles.features}>
                      {item.backContent.features.map((feature, idx) => {
                        const isHeading = [
                          "Introduction of forex",
                          "Demand & Supply Price Action Strategy",
                          "Concepts of Fibonacci (Extensions and Retracement)",
                          "45 DAYS PROGRAM",
                          "OTHER INCOME OPPORTUNITIES",
                        ].includes(feature);

                        return (
                          <React.Fragment key={idx}>
                            <div className={styles.featureItem}>
                              {!isHeading && (
                                <span className={styles.checkIcon}>✓</span>
                              )}
                              <span>{feature}</span>
                            </div>
                            {/* {isHeading && (
                              <hr className={styles.headingDivider} />
                            )} */}
                          </React.Fragment>
                        );
                      })}
                    </div>
                    <hr className={styles.priceDivider} />
                    <div className={styles.priceItem}>
                      <span className={styles.priceLabel}>Price</span>
                      <span className={styles.priceValue}>
                        {item.backContent.price}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
