"use client";
import React, { useState, useEffect } from "react";
import styles from "./riskOnOffCalculator.module.scss";
import axios from "axios";

export default function RiskOnOffCalculator() {
  const [indicators, setIndicators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timestamp, setTimestamp] = useState("");
  const [globalScore, setGlobalScore] = useState(50);
  const [globalZone, setGlobalZone] = useState("NEUTRAL");

  // Symbol display mapping
  const symbolConfig = {
    "AUD/USD": { name: "AUD/USD", flag: "🇦🇺🇺🇸" },
    "BTC/USD": { name: "BTC/USD", icon: "", flag: "🇺🇸" },
    "EUR/USD": { name: "EUR/USD", flag: "🇪🇺🇺🇸" },
    "GBP/USD": { name: "GBP/USD", flag: "��🇺🇸" },
    "NZD/USD": { name: "NZD/USD", flag: "🇳🇿🇺🇸" },
    "USD/CAD": { name: "USD/CAD", flag: "🇺🇸🇨🇦" },
    "USD/CHF": { name: "USD/CHF", flag: "🇺🇸🇨🇭" },
    "USD/JPY": { name: "USD/JPY", flag: "🇺🇸🇯🇵" },
    "XAU/USD": { name: "XAU/USD", icon: "", flag: "🇺🇸" },
  };

  // Get color based on zone
  const getColorByZone = (zone) => {
    return { color: "#ecececff", textColor: "#968d8dff" };
  };

  useEffect(() => {
    const fetchRiskMeterData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_CALCULATOR_API_URL}/riskmeter`,
        );

        if (response.data?.success && response.data?.data) {
          const apiData = response.data.data;

          // Calculate global score as average of all normalizedRisk values
          const totalScore = apiData.reduce(
            (sum, item) => sum + item.normalizedRisk,
            0,
          );
          const avgScore = Math.round(totalScore / apiData.length);

          // Determine global zone based on average score
          let zone = "NEUTRAL";
          if (avgScore >= 0 && avgScore < 25) {
            zone = "STRONG RISK-OFF";
          } else if (avgScore >= 25 && avgScore < 50) {
            zone = "WEAK RISK-OFF";
          } else if (avgScore >= 50 && avgScore < 75) {
            zone = "WEAK RISK-ON";
          } else if (avgScore >= 75) {
            zone = "STRONG RISK-ON";
          }

          setGlobalScore(avgScore);
          setGlobalZone(zone);

          // Transform API data to indicator format
          const transformedIndicators = apiData.map((item) => {
            const config = symbolConfig[item.symbol] || {
              name: item.symbol,
              flag: "🌐",
            };
            const colors = getColorByZone(item.zone);

            return {
              name: config.name,
              flag: config.flag,
              icon: config.icon,
              position: item.normalizedRisk,
              color: colors.color,
              textColor: colors.textColor,
              zone: item.zone,
              percentChange: item.percentChange,
            };
          });

          setIndicators(transformedIndicators);

          // Set timestamp
          if (apiData.length > 0) {
            const date = new Date(apiData[0].datetime);
            setTimestamp(
              `As of ${date.toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}, at ${new Date().toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
              })}`,
            );
          }
        } else {
          throw new Error("Invalid response format");
        }
      } catch (err) {
        console.error("Failed to fetch risk meter data:", err);
        setError(err.message || "Failed to load risk meter data");
      } finally {
        setLoading(false);
      }
    };

    fetchRiskMeterData();
  }, []);

  if (loading) {
    return (
      <div className={styles.riskOnOffCalculator}>
        <div className={styles.container}>
          <div className={styles.mainCard}>
            <div className={styles.loadingState}>
              Loading risk meter data...
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.riskOnOffCalculator}>
        <div className={styles.container}>
          <div className={styles.mainCard}>
            <div className={styles.errorState}>
              <p>⚠️ {error}</p>
              <button onClick={() => window.location.reload()}>Retry</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.riskOnOffCalculator}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Risk-On / Risk-Off Indicators</h1>
        </div>

        {/* Global Score Display */}
        <div className={styles.globalScoreDisplay}>
          <div className={styles.scoreNumber}>{globalScore}</div>
          <div className={styles.scoreLabel}>{globalZone}</div>
        </div>

        <div className={styles.mainCard}>
          <div className={styles.contentWrapper}>
            <div className={styles.assetList}>
              {indicators.map((item, index) => (
                <div key={index} className={styles.assetItem}>
                  <div className={styles.assetIcons}>
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

            <div className={styles.chartArea}>
              {/* Render all dots with absolute positioning relative to entire chart */}
              {indicators.map((item, index) => {
                // Position based on 0-100 scale across entire chart area
                const leftPosition = item.position;

                return (
                  <div
                    key={index}
                    className={styles.indicatorDot}
                    style={{
                      top: `${index * 4 + 1.5}rem`, // Align with center of each row (index * 4rem + 1.5rem offset)
                      left: `${leftPosition}%`,
                      backgroundColor: item.color,
                    }}
                  ></div>
                );
              })}

              <div className={`${styles.scaleSlider} ${styles.leftSlider}`}>
                <div className={styles.scaleSliderBar}></div>
                <div className={`${styles.scaleLabel} ${styles.scaleTop}`}>
                  0
                </div>
                <div className={`${styles.scaleLabel} ${styles.scaleBottom}`}>
                  0
                </div>
              </div>

              <div className={styles.columnWrapper}>
                <div className={styles.columnLabel}>RISK</div>
                <div className={styles.riskColumn}>
                  <div className={styles.stripesPattern}></div>
                </div>
              </div>

              <div className={`${styles.scaleSlider} ${styles.leftSlider}`}>
                <div className={styles.scaleSliderBar}></div>
                <div className={`${styles.scaleLabel} ${styles.scaleTop}`}>
                  35
                </div>
                <div className={`${styles.scaleLabel} ${styles.scaleBottom}`}>
                  35
                </div>
              </div>

              <div className={styles.centerSlider}>
                <div className={styles.sliderLine}></div>
                <div className={`${styles.sliderLabel} ${styles.top}`}>50</div>
                <div className={`${styles.sliderLabel} ${styles.bottom}`}>
                  50
                </div>
              </div>

              <div className={`${styles.scaleSlider} ${styles.rightSlider}`}>
                <div className={styles.scaleSliderBar}></div>
                <div className={`${styles.scaleLabel} ${styles.scaleTop}`}>
                  65
                </div>
                <div className={`${styles.scaleLabel} ${styles.scaleBottom}`}>
                  65
                </div>
              </div>

              <div className={styles.columnWrapper}>
                <div className={styles.columnLabel}>RISK-ON</div>
                <div className={styles.riskOnColumn}>
                  <div className={styles.stripesPatternReverse}></div>
                </div>
              </div>

              <div className={`${styles.scaleSlider} ${styles.rightSlider}`}>
                <div className={styles.scaleSliderBar}></div>
                <div className={`${styles.scaleLabel} ${styles.scaleTop}`}>
                  100
                </div>
                <div className={`${styles.scaleLabel} ${styles.scaleBottom}`}>
                  100
                </div>
              </div>

              {/* Alternating row backgrounds */}
              {indicators.map((item, index) => (
                <div
                  key={`row-${index}`}
                  className={styles.alternatingRow}
                  style={{
                    top: `${index * 4}rem`, // 3rem height + 1rem gap = 4rem total
                  }}
                />
              ))}
            </div>
          </div>

          <div className={styles.timestamp}>{timestamp}</div>
        </div>
      </div>
    </div>
  );
}
