"use client";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import styles from "./currencyCorrelation.module.scss";
import axios from "axios";

// Correlation Bar Component
const CorrelationBar = ({ pair, correlation }) => {
  const getBarColor = (corr) => {
    if (corr > 0.7) return "#22c55e";
    if (corr > 0.3) return "#84cc16";
    if (corr > -0.3) return "#94a3b8";
    if (corr > -0.7) return "#f97316";
    return "#ef4444";
  };

  const barColor = getBarColor(correlation);
  const barWidth = Math.abs(correlation) * 100;
  
  const isPositive = correlation >= 0;

  return (
    <div className={styles.correlationBarWrapper}>
      <div className={styles.pairLabel}>{pair}</div>

      <div className={styles.barContainer}>
        <div className={styles.barLeft}>
          {!isPositive && (
            <div
              className={styles.barFill}
              style={{
                width: `${barWidth}%`,
                background: barColor,
              }}
            />
          )}
        </div>

        <div className={styles.barRight}>
          {isPositive && (
            <div
              className={styles.barFill}
              style={{
                width: `${barWidth}%`,
                background: barColor,
              }}
            />
          )}
        </div>
      </div>

      <div className={styles.correlationValue} style={{ color: barColor }}>
        {correlation.toFixed(2)}
      </div>
    </div>
  );
};

export default function CurrencyCorrelation() {
  const currencyOptions = useMemo(
    () => [
      "AUD/USD",
      "BTC/USD",
      "EUR/USD",
      "GBP/USD",
      "NZD/USD",
      "USD/CAD",
      "USD/CHF",
      "USD/JPY",
      "XAU/USD",
    ],
    [],
  );

  const timeRangeOptions = useMemo(
    () => [
      { value: "5D", label: "5 Days" },
      { value: "10D", label: "10 Days" },
      { value: "30D", label: "30 Days" },
      { value: "60D", label: "60 Days" },
      { value: "90D", label: "90 Days" },
      { value: "180D", label: "180 Days" },
    ],
    [],
  );

  const [selectedPair, setSelectedPair] = useState("AUD/USD");
  const [timeRange, setTimeRange] = useState("5min");
  const [correlationData, setCorrelationData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Calculate Pearson correlation coefficient between two price series
   */
  const calculateCorrelation = useCallback((series1, series2) => {
    const n = Math.min(series1.length, series2.length);
    if (n === 0) return 0;

    const mean1 = series1.slice(0, n).reduce((a, b) => a + b, 0) / n;
    const mean2 = series2.slice(0, n).reduce((a, b) => a + b, 0) / n;

    let numerator = 0;
    let sum1 = 0;
    let sum2 = 0;

    for (let i = 0; i < n; i++) {
      const diff1 = series1[i] - mean1;
      const diff2 = series2[i] - mean2;
      numerator += diff1 * diff2;
      sum1 += diff1 * diff1;
      sum2 += diff2 * diff2;
    }

    const denominator = Math.sqrt(sum1 * sum2);
    return denominator === 0 ? 0 : numerator / denominator;
  }, []);

  /**
   * Fetch all currency data from backend and calculate correlations
   */
  const fetchCorrelationData = useCallback(
    async (basePair, timeRange) => {
      try {
        setError(null);

        console.log(`🔄 Fetching correlation data for ${basePair}...`);

        // Fetch all currency data from your backend - ONE API CALL ONLY
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_CALCULATOR_API_URL}/getData`,
          {
            params: {
              days: timeRange,
            },
          },
        );

        if (!response.data?.success || !response.data?.data) {
          throw new Error("Invalid response from backend");
        }

        const allCurrencyData = response.data.data;

        // Find base pair data
        const baseData = allCurrencyData.find(
          (item) => item.meta.symbol === basePair,
        );

        if (!baseData || !baseData.values || baseData.values.length === 0) {
          throw new Error(`No data available for ${basePair}`);
        }

        // Extract close prices from base pair
        const basePrices = baseData.values.map((v) => parseFloat(v.close));

        // Calculate correlations with all other pairs
        const correlations = {};
        const validPairs = [
          "AUD/USD",
          "BTC/USD",
          "EUR/USD",
          "GBP/USD",
          "NZD/USD",
          "USD/CAD",
          "USD/CHF",
          "USD/JPY",
          "XAU/USD",
        ];

        allCurrencyData.forEach((currencyData) => {
          const targetPair = currencyData.meta.symbol;

          if (targetPair === basePair) return;
          if (!validPairs.includes(targetPair)) return;

          if (currencyData.values && currencyData.values.length > 0) {
            const targetPrices = currencyData.values.map((v) =>
              parseFloat(v.close),
            );
            const correlation = calculateCorrelation(basePrices, targetPrices);
            correlations[targetPair] = correlation;
          } else {
            correlations[targetPair] = 0;
          }
        });

        console.log(
          `✅ Calculated correlations for ${basePair}:`,
          correlations,
        );
        return correlations;
      } catch (err) {
        console.error("Failed to fetch correlation data:", err);
        throw err;
      }
    },
    [calculateCorrelation],
  );

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const corrData = await fetchCorrelationData(selectedPair, timeRange);
        setCorrelationData(corrData);
      } catch (err) {
        console.error("Failed to fetch correlation data:", err);
        setError(err.message || "Failed to load correlation data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedPair, timeRange, fetchCorrelationData]);

  return (
    <div className={styles.currencyCorrelation}>
      <div className={styles.controlsSection}>
        <div className={styles.formGroup}>
          <label>Base Currency Pair</label>
          <select
            value={selectedPair}
            onChange={(e) => setSelectedPair(e.target.value)}
            className={styles.select}
          >
            {currencyOptions.map((pair) => (
              <option key={pair} value={pair}>
                {pair}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.formGroup}>
          <label>Time Range</label>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className={styles.select}
          >
            {timeRangeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className={styles.correlationSection}>
        {loading ? (
          <div className={styles.loadingState}>Loading correlation data...</div>
        ) : error ? (
          <div className={styles.errorState}>
            <p>⚠️ {error}</p>
            <button onClick={() => window.location.reload()}>Retry</button>
          </div>
        ) : (
          <>
            <div className={styles.correlationHeader}>
              <h3>Correlation with {selectedPair}</h3>
            </div>

            <div className={styles.axisLabels}>
              <span>-1.0</span>
              <span>-0.5</span>
              <span>0.0</span>
              <span>0.5</span>
              <span>1.0</span>
            </div>

            <div className={styles.correlationBars}>
              {currencyOptions.map((pair) => {
                if (pair === selectedPair) return null;
                const pairCorr = correlationData[pair] || 0;
               
                return (
                  <CorrelationBar
                    key={pair}
                    pair={pair}
                    correlation={pairCorr}
                  />
                );
              })}
            </div>

          </>
        )}
      </div>
    </div>
  );
}
