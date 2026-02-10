"use client";
import React, { useState } from "react";
import styles from "./riskOnOffCalculator.module.scss";

export default function RiskOnOffCalculator() {
  const [indicators] = useState([
    { name: "AUD/JPY", flag: "🇦🇺🇯🇵", position: 8, color: "#E91E63" },
    {
      name: "BTC/USD",
      icon: "₿",
      flag: "🇺🇸",
      position: 15,
      color: "#FF9800",
    },
    { name: "Copper", icon: "🔶", position: 82, color: "#9E9E9E" },
    {
      name: "JPN225",
      flag: "🇯🇵",
      position: 68,
      color: "#BC0000",
      textColor: "#4CAF50",
    },
    {
      name: "NAS100",
      flag: "🇺🇸",
      position: 62,
      color: "#1565C0",
      textColor: "#4CAF50",
    },
    {
      name: "SPX500",
      flag: "🇺🇸",
      position: 57,
      color: "#1565C0",
      textColor: "#4CAF50",
    },
    {
      name: "USD",
      flag: "🇺🇸",
      position: 48,
      color: "#1565C0",
      textColor: "#4CAF50",
    },
    {
      name: "VOLX",
      icon: "📊",
      position: 42,
      color: "#616161",
      textColor: "#4CAF50",
    },
    {
      name: "XAU/USD",
      icon: "🥇",
      flag: "🇺🇸",
      position: 88,
      color: "#C0C0C0",
    },
  ]);

  return (
    <div className={styles.riskOnOffCalculator}>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <h1 className={styles.title}>Risk-On / Risk-Off Indicators</h1>
        </div>

        <div className={styles.mainCard}>
          <div className={styles.contentWrapper}>
            {/* Asset List */}
            <div className={styles.assetList}>
              {indicators.map((item, index) => (
                <div key={index} className={styles.assetItem}>
                  <div className={styles.assetIcons}>
                    {item.flag && <span>{item.flag}</span>}
                    {item.icon && <span>{item.icon}</span>}
                  </div>
                  <span
                    className={styles.assetName}
                    style={{ color: item.textColor || item.color }}
                  >
                    {item.name}
                  </span>
                </div>
              ))}
            </div>

            {/* Chart Area */}
            <div className={styles.chartArea}>
              {/* Left Scale Slider (0-35) */}
              <div className={`${styles.scaleSlider} ${styles.leftSlider}`}>
                <div className={styles.scaleSliderBar}></div>
                <div className={`${styles.scaleLabel} ${styles.scaleTop}`}>
                  0
                </div>
                <div className={`${styles.scaleLabel} ${styles.scaleBottom}`}>
                  35
                </div>
              </div>

              {/* Risk Column */}
              <div className={styles.columnWrapper}>
                <div className={styles.columnLabel}>RISK</div>
                <div className={styles.riskColumn}>
                  {/* Diagonal stripes pattern */}
                  <div className={styles.stripesPattern}></div>

                  {/* Scale markers */}
                  <div className={`${styles.scaleMarker} ${styles.topLeft}`}>
                    0
                  </div>
                  <div
                    className={`${styles.scaleMarker} ${styles.bottomLeft}`}
                  >
                    35
                  </div>
                  <div className={`${styles.scaleMarker} ${styles.topRight}`}>
                    0
                  </div>
                  <div
                    className={`${styles.scaleMarker} ${styles.bottomRight}`}
                  >
                    35
                  </div>

                  {/* Indicator dots */}
                  {indicators
                    .filter((item) => item.position < 50)
                    .map((item, index) => (
                      <div
                        key={index}
                        className={styles.indicatorDot}
                        style={{ top: `${item.position}%` }}
                      ></div>
                    ))}
                </div>
              </div>

              {/* Right Scale Slider for Risk (0-35) */}
              <div className={`${styles.scaleSlider} ${styles.leftSlider}`}>
                <div className={styles.scaleSliderBar}></div>
                <div className={`${styles.scaleLabel} ${styles.scaleTop}`}>
                  0
                </div>
                <div className={`${styles.scaleLabel} ${styles.scaleBottom}`}>
                  35
                </div>
              </div>

              {/* Center slider */}
              <div className={styles.centerSlider}>
                <div className={styles.sliderLine}></div>
                <div className={styles.sliderHandle}></div>
                <div className={`${styles.sliderLabel} ${styles.top}`}>0</div>
                <div className={`${styles.sliderLabel} ${styles.middle}`}>
                  50
                </div>
                <div className={`${styles.sliderLabel} ${styles.bottom}`}>
                  100
                </div>
              </div>

              {/* Left Scale Slider for Risk-On (65-100) */}
              <div className={`${styles.scaleSlider} ${styles.rightSlider}`}>
                <div className={styles.scaleSliderBar}></div>
                <div className={`${styles.scaleLabel} ${styles.scaleTop}`}>
                  65
                </div>
                <div className={`${styles.scaleLabel} ${styles.scaleBottom}`}>
                  100
                </div>
              </div>

              {/* Risk-On Column */}
              <div className={styles.columnWrapper}>
                <div className={styles.columnLabel}>RISK-ON</div>
                <div className={styles.riskOnColumn}>
                  {/* Diagonal stripes pattern */}
                  <div className={styles.stripesPatternReverse}></div>

                  {/* Scale markers */}
                  <div className={`${styles.scaleMarker} ${styles.topLeft}`}>
                    65
                  </div>
                  <div
                    className={`${styles.scaleMarker} ${styles.bottomLeft}`}
                  >
                    100
                  </div>
                  <div className={`${styles.scaleMarker} ${styles.topRight}`}>
                    65
                  </div>
                  <div
                    className={`${styles.scaleMarker} ${styles.bottomRight}`}
                  >
                    100
                  </div>

                  {/* Indicator dots */}
                  {indicators
                    .filter((item) => item.position >= 50)
                    .map((item, index) => (
                      <div
                        key={index}
                        className={styles.indicatorDot}
                        style={{ top: `${item.position}%` }}
                      ></div>
                    ))}
                </div>
              </div>

              {/* Right Scale Slider for Risk-On (65-100) */}
              <div className={`${styles.scaleSlider} ${styles.rightSlider}`}>
                <div className={styles.scaleSliderBar}></div>
                <div className={`${styles.scaleLabel} ${styles.scaleTop}`}>
                  65
                </div>
                <div className={`${styles.scaleLabel} ${styles.scaleBottom}`}>
                  100
                </div>
              </div>
            </div>
          </div>

          {/* Timestamp */}
          <div className={styles.timestamp}>
            As of February 10 2026, at 3:18 PM
          </div>
        </div>
      </div>
    </div>
  );
}
