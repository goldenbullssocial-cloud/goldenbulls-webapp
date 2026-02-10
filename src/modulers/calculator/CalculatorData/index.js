"use client";
import React, { useState } from "react";
import styles from "./calculatorData.module.scss";
import classNames from "classnames";
import PipValueCalculator from "../pipValueCalculator";
import PositionSizeCalculator from "../positionSizeCalculator";
import CurrencyCorrelation from "../currencyCorrelation";
import RiskOnOffCalculator from "../riskOnOffCalculator";

export default function CalculatorData() {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = ["Pip Value", "Position Size", "Currency Correlation", "Risk On/Off"];

  const renderActiveComponent = () => {
    switch (activeTab) {
      case 0:
        return <PipValueCalculator />;
      case 1:
        return <PositionSizeCalculator />;
      case 2:
        return <CurrencyCorrelation />;
      case 3:
        return <RiskOnOffCalculator />;
      default:
        return null;
    }
  };

  return (
    <div className={styles.calculatorData}>
      <div className="container-md">
        <div className={styles.tabAlignment}>
          {tabs.map((tab, index) => (
            <div
              key={index}
              className={classNames(styles.buttonUi, {
                [styles.active]: activeTab === index,
              })}
              onClick={() => setActiveTab(index)}
            >
              <span>{tab}</span>
            </div>
          ))}
        </div>
        <div className={styles.boxCenter}>
          <div className={styles.box}>{renderActiveComponent()}</div>
        </div>
      </div>
    </div>
  );
}
