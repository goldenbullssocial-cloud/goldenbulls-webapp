"use client";
import React from "react";
import CalculatorDetailsBanner from "./calculatorDetailsBanner";
import ClassroominYourPocket from "../home/classroominYourPocket";
import FaqSection from "../home/faqSection";
import PipValueCalculator from "../calculator/pipValueCalculator";
import PositionSizeCalculator from "../calculator/positionSizeCalculator";
import CurrencyCorrelation from "../calculator/currencyCorrelation";
import RiskOnOffCalculator from "../calculator/riskOnOffCalculator";

const calculatorConfig = {
  "currency-correlation": {
    title: "Currency Correlation",
    highlightWord: "Correlation",
    description:
      "Analyze how different currency pairs move in relation to each other.",
    component: CurrencyCorrelation,
  },
  "forex-market-hours": {
    title: "Forex Market Hours",
    highlightWord: "Market Hours",
    description:
      "Convert global forex market sessions to your local time zone easily.",
    component: null, // No component available yet
  },
  "risk-meter": {
    title: "Risk-on/Risk-off",
    highlightWord: "Risk-off",
    description:
      "Gauge overall market sentiment to understand risk appetite across assets.",
    component: RiskOnOffCalculator,
  },
  "pip-value": {
    title: "Pip Value",
    highlightWord: "Value",
    description:
      "Calculate the monetary value of each pip for any trade setup.",
    component: PipValueCalculator,
  },
  "position-size": {
    title: "Position Size",
    highlightWord: "Size",
    description:
      "Determine the correct trade size based on risk and account balance.",
    component: PositionSizeCalculator,
  },
};

export default function CalculatorDetails({ calculatorId }) {
  const config =
    calculatorConfig[calculatorId] || calculatorConfig["pip-value"];
  const CalculatorComponent = config.component;

  return (
    <div>
      <CalculatorDetailsBanner
        title={config.title}
        highlightWord={config.highlightWord}
        description={config.description}
      />
      {CalculatorComponent && <CalculatorComponent />}
      <ClassroominYourPocket />
      <FaqSection />
    </div>
  );
}
